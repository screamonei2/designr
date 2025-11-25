
export interface ColorToken {
  name: string;
  value: string;
  description?: string;
}

export interface GradientToken {
  name: string;
  value: string;
}

export interface TypographyScale {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  fontFamily: string;
  letterSpacing?: string;
  sampleText?: string;
}

export interface FontFamily {
  name: string;
  family: string;
}

export interface SpacingScale {
  name: string;
  value: string;
  pixels?: number;
}

export interface Breakpoint {
  name: string;
  value: string;
  description?: string;
}

export interface BorderRadius {
  name: string;
  value: string;
}

export interface BorderToken {
  name: string;
  fullValue: string;
}

export interface ShadowToken {
  name: string;
  value: string;
}

export interface OpacityToken {
  name: string;
  value: string;
}

export interface ZIndexToken {
  name: string;
  value: number;
}

export interface AnimationToken {
  transitions?: Array<{
    name: string;
    property: string;
    duration: string;
    timing: string;
  }>;
  keyframes?: Array<{
    name: string;
    definition: string;
  }>;
}

export interface IconToken {
  name: string;
  svg?: string;
}

export interface ImageAsset {
  variant?: string;
  url: string;
}

export interface ComponentVariant {
  name: string;
  description?: string;
  state?: string;
  htmlSnippet: string;
  properties?: string[]; // e.g. ["Size: Small", "Type: Primary"]
  
  // Restored deep nesting for deep analysis
  accessibility?: {
    role?: string;
    ariaLabel?: string;
    keyboardSupport?: string;
  };
  
  interactivity?: {
    hoverStyle?: string;
    focusStyle?: string;
    activeStyle?: string;
    transition?: string;
  };
}

export interface ComponentCategory {
  category: string;
  name: string;
  occurrences?: number;
  variants: ComponentVariant[];
}

export interface DesignSystem {
  metadata: {
    projectName: string;
    version?: string;
    sourceUrl: string;
    technologiesDetected?: string[];
  };
  colors: {
    primary?: ColorToken[];
    secondary?: ColorToken[];
    neutral?: ColorToken[];
    semantic?: ColorToken[];
    gradients?: GradientToken[];
  };
  typography: {
    fontFamilies?: FontFamily[];
    scales?: TypographyScale[];
  };
  spacing: {
    scale?: SpacingScale[];
    grid?: {
      columns?: number;
      gutterWidth?: string;
      maxWidth?: string;
    };
  };
  breakpoints?: Breakpoint[];
  borderRadius?: BorderRadius[];
  shadows?: ShadowToken[];
  opacity?: OpacityToken[];
  zIndex?: ZIndexToken[];
  animations?: AnimationToken;
  icons?: {
    icons: IconToken[];
  };
  images?: {
    logos?: ImageAsset[];
  };
  components?: ComponentCategory[];
}
