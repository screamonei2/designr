
import { GoogleGenAI } from "@google/genai";
import { DesignSystem } from "../types";
import * as cheerio from "cheerio";

// ==================== PARSERS TRADICIONAIS ====================

interface RawExtractedData {
  colors: Set<string>;
  fontFamilies: Set<string>;
  fontSizes: Set<string>;
  fontWeights: Set<string>;
  lineHeights: Set<string>;
  spacings: Set<string>;
  borderRadius: Set<string>;
  shadows: Set<string>;
  transitions: Set<string>;
  keyframes: Map<string, string>;
  breakpoints: Map<string, string>;
  zIndexes: Set<string>;
  opacity: Set<string>;
  components: Array<{
    html: string;
    classes: string[];
    tag: string;
    text: string;
  }>;
}

const extractColorsFromCSS = (css: string): Set<string> => {
  const colors = new Set<string>();
  const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
  const rgbRegex = /rgba?\([^)]+\)/g;
  const hslRegex = /hsla?\([^)]+\)/g;

  css.match(hexRegex)?.forEach(c => colors.add(c));
  css.match(rgbRegex)?.forEach(c => colors.add(c));
  css.match(hslRegex)?.forEach(c => colors.add(c));

  return colors;
};

const extractFontFamilies = (css: string): Set<string> => {
  const families = new Set<string>();
  const regex = /font-family:\s*([^;}]+)/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    families.add(match[1].trim());
  }

  return families;
};

const extractCSSProperty = (css: string, property: string): Set<string> => {
  const values = new Set<string>();
  const regex = new RegExp(`${property}:\\s*([^;}]+)`, 'g');
  let match;

  while ((match = regex.exec(css)) !== null) {
    values.add(match[1].trim());
  }

  return values;
};

const extractKeyframes = (css: string): Map<string, string> => {
  const keyframes = new Map<string, string>();
  const regex = /@keyframes\s+([^\s{]+)\s*{([^}]+)}/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    keyframes.set(match[1], match[2].trim());
  }

  return keyframes;
};

const extractBreakpoints = (css: string): Map<string, string> => {
  const breakpoints = new Map<string, string>();
  const regex = /@media[^{]*\((?:min|max)-width:\s*([^)]+)\)/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    breakpoints.set(match[1].trim(), match[0]);
  }

  return breakpoints;
};

const extractComponentsFromHTML = (html: string): Array<any> => {
  const $ = cheerio.load(html);
  const components: Array<any> = [];

  const selectors = [
    'nav', 'header', 'footer', 'aside',
    'button', 'a.btn', '.button',
    '.card', 'article',
    'form', 'input', 'select', 'textarea',
    '.modal', '.dropdown', '.tooltip',
    '.hero', '.banner', '.cta',
    '.accordion', '.tabs', '.carousel',
    '.navbar', '.sidebar', '.menu'
  ];

  selectors.forEach(selector => {
    $(selector).each((i, el) => {
      const $el = $(el);
      // Simplify extraction to reduce payload size if needed
      components.push({
        html: $.html($el).substring(0, 1000), // Limit size
        classes: ($el.attr('class') || '').split(' ').filter(Boolean),
        tag: (el as any).tagName,
        text: $el.text().trim().substring(0, 100)
      });
    });
  });

  return components;
};

const parseTraditional = (html: string, css: string): RawExtractedData => {
  return {
    colors: extractColorsFromCSS(css),
    fontFamilies: extractFontFamilies(css),
    fontSizes: extractCSSProperty(css, 'font-size'),
    fontWeights: extractCSSProperty(css, 'font-weight'),
    lineHeights: extractCSSProperty(css, 'line-height'),
    spacings: new Set([
      ...extractCSSProperty(css, 'margin'),
      ...extractCSSProperty(css, 'padding'),
      ...extractCSSProperty(css, 'gap')
    ]),
    borderRadius: extractCSSProperty(css, 'border-radius'),
    shadows: extractCSSProperty(css, 'box-shadow'),
    transitions: extractCSSProperty(css, 'transition'),
    keyframes: extractKeyframes(css),
    breakpoints: extractBreakpoints(css),
    zIndexes: extractCSSProperty(css, 'z-index'),
    opacity: extractCSSProperty(css, 'opacity'),
    components: extractComponentsFromHTML(html)
  };
};

// ==================== TYPE DEFINITIONS FOR PROMPT ====================
// We inject this text into the prompt so the model knows the structure 
// without needing a complex JSON schema that hits API limits.

const TYPESCRIPT_INTERFACE = `
export interface ColorToken { name: string; value: string; description?: string; }
export interface GradientToken { name: string; value: string; }
export interface TypographyScale { name: string; fontSize: string; lineHeight: string; fontWeight: string; fontFamily: string; letterSpacing?: string; sampleText?: string; }
export interface FontFamily { name: string; family: string; }
export interface SpacingScale { name: string; value: string; pixels?: number; }
export interface Breakpoint { name: string; value: string; description?: string; }
export interface BorderRadius { name: string; value: string; }
export interface ShadowToken { name: string; value: string; }
export interface OpacityToken { name: string; value: string; }
export interface ZIndexToken { name: string; value: number; }
export interface AnimationToken {
  transitions?: Array<{ name: string; property: string; duration: string; timing: string; }>;
  keyframes?: Array<{ name: string; definition: string; }>;
}
export interface IconToken { name: string; svg?: string; }
export interface ImageAsset { variant?: string; url: string; }
export interface ComponentVariant {
  name: string;
  description?: string;
  state?: string;
  htmlSnippet: string; // Self-contained HTML with Tailwind
  properties?: string[];
  accessibility?: { role?: string; ariaLabel?: string; keyboardSupport?: string; };
  interactivity?: { hoverStyle?: string; focusStyle?: string; activeStyle?: string; transition?: string; };
}
export interface ComponentCategory { category: string; name: string; occurrences?: number; variants: ComponentVariant[]; }
export interface DesignSystem {
  metadata: { projectName: string; version?: string; sourceUrl: string; technologiesDetected?: string[]; };
  colors: { primary?: ColorToken[]; secondary?: ColorToken[]; neutral?: ColorToken[]; semantic?: ColorToken[]; gradients?: GradientToken[]; };
  typography: { fontFamilies?: FontFamily[]; scales?: TypographyScale[]; };
  spacing: { scale?: SpacingScale[]; grid?: { columns?: number; gutterWidth?: string; maxWidth?: string; }; };
  breakpoints?: Breakpoint[];
  borderRadius?: BorderRadius[];
  shadows?: ShadowToken[];
  opacity?: OpacityToken[];
  zIndex?: ZIndexToken[];
  animations?: AnimationToken;
  icons?: { icons: IconToken[]; };
  images?: { logos?: ImageAsset[]; };
  components?: ComponentCategory[];
}
`;

// ==================== MAIN FUNCTION ====================

export const generateDesignSystem = async (input: string): Promise<DesignSystem> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const html = input;
  const cssRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let css = "";
  let match;

  while ((match = cssRegex.exec(input)) !== null) {
    css += match[1] + "\n";
  }

  const rawData = parseTraditional(html, css);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
You are a world-class Design Systems Architect.
I have extracted raw data (CSS/HTML) from a website.
Reverse engineer this into a structured Design System JSON.

Target Structure: JSON matching the TypeScript interface below.
${TYPESCRIPT_INTERFACE}

=== RAW DATA EXTRACTED ===
COLORS: ${Array.from(rawData.colors).slice(0, 50).join(", ")}
FONTS: ${Array.from(rawData.fontFamilies).join(", ")}
SPACINGS: ${Array.from(rawData.spacings).slice(0, 20).join(", ")}
RADIUS: ${Array.from(rawData.borderRadius).join(", ")}
SHADOWS: ${Array.from(rawData.shadows).join(", ")}
COMPONENTS DETECTED: ${rawData.components.length} (Sample: ${rawData.components.slice(0, 5).map(c => c.tag).join(", ")})

=== INSTRUCTIONS ===
1. Analyze the raw data and infer semantically meaningful tokens.
2. For Components:
   - Create CLEAN, self-contained HTML snippets using TAILWIND CSS classes.
   - Deeply analyze 'accessibility' (ARIA roles) and 'interactivity' (hover/focus effects) and populate the nested objects.
   - Do NOT just copy the input HTML. Refactor it into a reusable component structure.
3. Be robust. If data is missing, make reasonable professional design assumptions.
4. Output ONLY the JSON object. No markdown code fences.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // CRITICAL: We do NOT use responseSchema here to avoid the "Constraint is too tall" error.
      // The model is smart enough to follow the TypeScript interface in the prompt.
      temperature: 0.2
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    const result = JSON.parse(text) as DesignSystem;
    return result;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Failed to parse AI response.");
  }
};
