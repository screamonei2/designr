
import React, { useState, useRef } from 'react';
import { DesignSystem, ColorToken } from '../types';
import { MousePointer2, Hand, ZoomIn, ZoomOut, Move, Copy, Layers, Zap, Grid, Image as ImageIcon, Box, Monitor, Smartphone, Tablet, Eye, MousePointerClick } from 'lucide-react';

interface CanvasBoardProps {
  data: DesignSystem;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({ data }) => {
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'hand'>('hand');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.1, scale - e.deltaY * zoomSensitivity), 4);
      setScale(newScale);
    } else {
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'hand' || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const SectionFrame = ({ title, children, x, y, width = 400, icon: Icon, color = "gray" }: any) => (
    <div 
      className="absolute bg-white shadow-xl border border-gray-200 rounded-sm overflow-hidden"
      style={{ 
        left: x, 
        top: y, 
        width: width,
        minHeight: 100
      }}
    >
      <div className={`bg-${color}-50 border-b border-${color}-100 px-4 py-3 font-bold text-gray-700 uppercase text-xs tracking-wider flex items-center gap-2`}>
        {Icon && <Icon size={14} className={`text-${color}-500`} />}
        {title}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const ColorSwatch = ({ color, showDetails = true }: { color: ColorToken, showDetails?: boolean }) => (
    <div className="flex items-center gap-3 mb-3 group cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
      <div 
        className="w-12 h-12 rounded-full shadow-inner border border-gray-100 flex-shrink-0 relative overflow-hidden"
        style={{ backgroundColor: color.value }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
           <p className="font-bold text-gray-900 truncate text-sm">{color.name}</p>
        </div>
        <p className="text-xs text-gray-500 font-mono flex items-center gap-1 group-hover:text-blue-600">
          {color.value} 
          <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-[#f3f4f6] overflow-hidden relative select-none font-sans" onWheel={handleWheel}>
      {/* Infinite Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          transform: `translate(${position.x % (20 * scale)}px, ${position.y % (20 * scale)}px)`
        }}
      />

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur text-white shadow-2xl rounded-full px-4 py-2 flex gap-4 z-50 items-center border border-gray-700">
        <button onClick={() => setTool('select')} className={`p-2 rounded-full transition ${tool === 'select' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}><MousePointer2 size={20} /></button>
        <button onClick={() => setTool('hand')} className={`p-2 rounded-full transition ${tool === 'hand' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}><Hand size={20} /></button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="p-2 hover:text-white text-gray-400"><ZoomOut size={20} /></button>
        <span className="text-xs font-mono text-gray-400 w-12 text-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(4, s + 0.1))} className="p-2 hover:text-white text-gray-400"><ZoomIn size={20} /></button>
      </div>

      <div 
        ref={canvasRef}
        className={`w-full h-full ${tool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          className="relative w-[10000px] h-[10000px]"
        >
          {/* HEADER AREA */}
          <div className="absolute top-40 left-40 mb-20">
             <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-9xl font-black text-gray-900 tracking-tighter">{data.metadata?.projectName || 'Project'}</h1>
                <span className="text-4xl text-gray-400 font-light">v{data.metadata?.version || '1.0'}</span>
             </div>
             <div className="flex gap-4 items-center text-xl text-gray-500">
               <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">GENERATED SYSTEM</span>
               <span>{data.metadata?.sourceUrl}</span>
               <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
               <span>{data.components?.reduce((acc, c) => acc + (c.variants?.length || 0), 0) || 0} Components Extracted</span>
             </div>
          </div>

          {/* COL 1: BRAND FOUNDATIONS (Colors, Logos, Gradients) */}
          <SectionFrame title="Brand Identity" x={100} y={400} width={400} icon={ImageIcon} color="blue">
             {data.images?.logos?.map((logo, i) => (
                <div key={i} className="mb-6 last:mb-0">
                   <div className="h-32 bg-gray-100 rounded flex items-center justify-center p-4 border border-gray-200 mb-2 relative overflow-hidden">
                      <div className="absolute inset-0 checkered-bg opacity-30"></div>
                      <img src={logo.url} alt="Logo" className="max-h-full max-w-full relative z-10" />
                   </div>
                   <div className="text-xs text-gray-500 font-mono">{logo.variant || 'Primary'} Logo</div>
                </div>
             ))}
             {data.colors?.gradients && data.colors.gradients.length > 0 && (
                <div className="mt-8">
                   <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Gradients</h4>
                   <div className="space-y-2">
                      {data.colors.gradients.map((g, i) => (
                         <div key={i} className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full shadow-sm" style={{ background: g.value }}></div>
                            <div className="text-xs">
                               <div className="font-bold">{g.name}</div>
                               <div className="text-gray-400 font-mono text-[10px]">{g.value.substring(0, 20)}...</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}
          </SectionFrame>

          <SectionFrame title="Primary Palette" x={100} y={850} width={400} color="blue">
            {data.colors?.primary?.map((c, i) => <ColorSwatch key={i} color={c} />)}
          </SectionFrame>

          <SectionFrame title="Secondary Palette" x={100} y={1300} width={400}>
            {data.colors?.secondary?.map((c, i) => <ColorSwatch key={i} color={c} />)}
          </SectionFrame>

          <SectionFrame title="Neutral & Semantic" x={100} y={1750} width={400}>
             <div className="mb-6">
                <h5 className="text-xs font-bold text-gray-400 mb-2">NEUTRALS</h5>
                {data.colors?.neutral?.map((c, i) => <ColorSwatch key={i} color={c} showDetails={false} />)}
             </div>
             <div>
                <h5 className="text-xs font-bold text-gray-400 mb-2">SEMANTIC</h5>
                <div className="grid grid-cols-2 gap-2">
                   {data.colors?.semantic?.map((c, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded border border-gray-100 flex flex-col">
                         <div className="h-6 w-full rounded mb-1" style={{ backgroundColor: c.value }}></div>
                         <span className="text-[10px] font-bold truncate">{c.name}</span>
                      </div>
                   ))}
                </div>
             </div>
          </SectionFrame>

          {/* COL 2: TYPOGRAPHY & SPACING */}
          <SectionFrame title="Typography Scale" x={550} y={400} width={600} icon={Layers}>
             <div className="space-y-8">
                {data.typography?.scales?.map((font, i) => (
                   <div key={i} className="border-b border-gray-100 pb-6 last:border-0 group">
                      <div className="flex justify-between items-baseline mb-2">
                         <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-mono uppercase">
                            {font.name}
                         </span>
                         <div className="text-[10px] text-gray-400 font-mono text-right">
                            <span className="block">{font.fontSize} / {font.lineHeight}</span>
                            <span className="block">{font.fontFamily}</span>
                         </div>
                      </div>
                      <p style={{ 
                        fontFamily: font.fontFamily, 
                        fontWeight: font.fontWeight, 
                        fontSize: font.fontSize,
                        lineHeight: font.lineHeight,
                        letterSpacing: font.letterSpacing,
                      }} className="text-gray-900 truncate">
                        {font.sampleText || "The quick brown fox jumps over the lazy dog."}
                      </p>
                   </div>
                ))}
             </div>
          </SectionFrame>

          <SectionFrame title="Spacing & Layout" x={550} y={1400} width={600} icon={Grid}>
             <div className="flex items-end gap-2 flex-wrap mb-8 border-b border-gray-100 pb-8">
                 {data.spacing?.scale?.map((s, i) => (
                     <div key={i} className="group relative hover:z-10 text-center">
                          <div className="bg-red-400/20 border border-red-400 w-8 mx-auto transition-all group-hover:bg-red-500 relative" style={{ height: s.value }}>
                             <span className="absolute inset-0 flex items-center justify-center text-[8px] text-red-800 opacity-0 group-hover:opacity-100 font-bold">{s.value}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-1">{s.name}</div>
                     </div>
                 ))}
             </div>
             
             <div className="grid grid-cols-2 gap-8">
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Grid System</h4>
                   {data.spacing?.grid ? (
                      <div className="bg-gray-50 p-4 rounded border border-gray-200">
                         <div className="flex gap-2 mb-2">
                            {Array.from({ length: Math.min(6, data.spacing.grid.columns || 4) }).map((_, i) => (
                               <div key={i} className="h-12 bg-blue-100 border border-blue-200 flex-1 rounded"></div>
                            ))}
                         </div>
                         <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between"><span>Columns:</span> <b>{data.spacing.grid.columns}</b></div>
                            <div className="flex justify-between"><span>Gutter:</span> <b>{data.spacing.grid.gutterWidth}</b></div>
                            <div className="flex justify-between"><span>Max Width:</span> <b>{data.spacing.grid.maxWidth}</b></div>
                         </div>
                      </div>
                   ) : <div className="text-gray-400 text-sm italic">No explicit grid detected.</div>}
                </div>
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Breakpoints</h4>
                   <div className="space-y-2">
                      {data.breakpoints?.map((bp, i) => (
                         <div key={i} className="flex items-center gap-3 text-sm">
                            {bp.name.includes('mobile') ? <Smartphone size={14}/> : bp.name.includes('tab') ? <Tablet size={14}/> : <Monitor size={14}/>}
                            <span className="font-bold text-gray-700 w-16">{bp.name}</span>
                            <span className="font-mono text-gray-500 bg-gray-100 px-1 rounded">{bp.value}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </SectionFrame>

          {/* COL 3: UI TOKENS (Radius, Shadows, Borders, Opacity, Icons) */}
          <SectionFrame title="Shape & Depth" x={1200} y={400} width={400} icon={Box}>
             <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase">Border Radius</h4>
                  <div className="flex flex-wrap gap-3">
                      {data.borderRadius?.map((r, i) => (
                          <div key={i} className="text-center group">
                              <div className="w-12 h-12 bg-white border-2 border-blue-500 shadow-sm mb-1 mx-auto transition-transform group-hover:scale-110" style={{ borderRadius: r.value }}></div>
                              <div className="text-[10px] font-bold text-gray-700">{r.name}</div>
                          </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase">Shadows</h4>
                  <div className="space-y-3">
                      {data.shadows?.map((s, i) => (
                          <div key={i} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded border border-gray-100" style={{ boxShadow: s.value }}></div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-700">{s.name}</div>
                                <div className="text-[9px] text-gray-400 font-mono truncate w-40">{s.value}</div>
                              </div>
                          </div>
                      ))}
                  </div>
                </div>
                {data.opacity && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase">Opacity</h4>
                    <div className="flex gap-2">
                        {data.opacity.map((o, i) => (
                           <div key={i} className="text-center">
                              <div className="w-8 h-8 bg-black rounded" style={{ opacity: o.value }}></div>
                              <span className="text-[10px] font-mono">{o.value}</span>
                           </div>
                        ))}
                    </div>
                  </div>
                )}
             </div>
          </SectionFrame>

          <SectionFrame title="Icons & Assets" x={1200} y={1100} width={400} icon={Zap}>
              <div className="grid grid-cols-6 gap-2">
                 {data.icons?.icons?.map((icon, i) => (
                    <div key={i} className="aspect-square bg-gray-50 rounded flex items-center justify-center border border-gray-100 p-2 hover:bg-white hover:shadow-md transition-all group relative" title={icon.name}>
                       {icon.svg ? (
                         <div className="w-full h-full text-gray-700" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                       ) : (
                         <div className="w-full h-full bg-gray-200 rounded-full"></div>
                       )}
                    </div>
                 ))}
              </div>
          </SectionFrame>
          
          <SectionFrame title="Motion" x={1200} y={1500} width={400} icon={Zap}>
              <div className="space-y-4">
                 {data.animations?.transitions?.map((t, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                       <span className="font-bold">{t.name}</span>
                       <code className="text-[10px] bg-blue-50 text-blue-600 px-1 rounded">{t.duration} {t.timing}</code>
                    </div>
                 ))}
                 {data.animations?.keyframes?.map((k, i) => (
                    <div key={i} className="bg-gray-900 text-green-400 p-3 rounded text-[10px] font-mono overflow-hidden">
                       <div className="font-bold text-white mb-1">@{k.name}</div>
                       {k.definition}
                    </div>
                 ))}
              </div>
          </SectionFrame>

          {/* COL 4+ : COMPONENTS */}
          {data.components?.map((cat, idx) => (
             <SectionFrame key={idx} title={cat.name} x={1700} y={400 + (idx * 600)} width={800} color="purple">
                <div className="grid grid-cols-1 gap-12">
                   {cat.variants?.map((v, vIdx) => (
                      <div key={vIdx} className="flex flex-col gap-3">
                         <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2">
                               <span className="font-bold text-gray-800 text-lg">{v.name}</span>
                               {v.state && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded uppercase font-bold">{v.state}</span>}
                            </div>
                         </div>
                         
                         {/* Live Preview */}
                         <div className="flex gap-8">
                             <div className="flex-1">
                                <div 
                                  className="p-12 border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-center relative overflow-hidden group min-h-[200px]"
                                >
                                  <div className="absolute inset-0 checkered-bg opacity-50 -z-10" />
                                  <div className="w-full flex justify-center transform group-hover:scale-[1.01] transition-transform duration-300" dangerouslySetInnerHTML={{ __html: v.htmlSnippet }} />
                                </div>
                             </div>
                             
                             {/* Component Metadata Side Panel */}
                             <div className="w-64 space-y-4">
                                {v.properties && v.properties.length > 0 && (
                                   <div>
                                      <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Properties</h6>
                                      <div className="space-y-1">
                                         {v.properties.map((p, pi) => (
                                            <div key={pi} className="flex justify-between text-xs border-b border-dashed border-gray-200 pb-1">
                                               <span className="font-mono text-purple-600">{p}</span>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                )}
                                
                                {v.interactivity && (
                                   <div>
                                      <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <MousePointerClick size={10} /> Interaction
                                      </h6>
                                      <div className="text-xs text-gray-600 space-y-1">
                                         {v.interactivity.hoverStyle && <div className="text-[10px]"><span className="text-gray-400">Hover:</span> {v.interactivity.hoverStyle}</div>}
                                         {v.interactivity.focusStyle && <div className="text-[10px]"><span className="text-gray-400">Focus:</span> {v.interactivity.focusStyle}</div>}
                                         {v.interactivity.transition && <div className="text-[10px]"><span className="text-gray-400">Trans:</span> {v.interactivity.transition}</div>}
                                      </div>
                                   </div>
                                )}
                                
                                {v.accessibility && (
                                   <div>
                                      <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Eye size={10} /> Accessibility
                                      </h6>
                                      <div className="text-xs text-gray-600 space-y-1">
                                        {v.accessibility.role && <div><span className="bg-green-100 text-green-800 px-1 rounded text-[10px]">role={v.accessibility.role}</span></div>}
                                        {v.accessibility.ariaLabel && <div className="italic text-gray-500">"{v.accessibility.ariaLabel}"</div>}
                                      </div>
                                   </div>
                                )}
                             </div>
                         </div>
                         
                         <div className="bg-slate-900 rounded p-4 relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="text-white hover:text-blue-300"><Copy size={14}/></button>
                            </div>
                            <pre className="text-[10px] text-blue-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                              {v.htmlSnippet}
                            </pre>
                         </div>
                      </div>
                   ))}
                </div>
             </SectionFrame>
          ))}

        </div>
      </div>
      
      {/* Mini Helper */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-200 text-xs text-gray-500 z-50">
        <div className="flex items-center gap-2 mb-1"><Move size={14}/> <span>Pan: Space / Middle Click</span></div>
        <div className="flex items-center gap-2"><ZoomIn size={14}/> <span>Zoom: Ctrl + Scroll</span></div>
      </div>
    </div>
  );
};

export default CanvasBoard;
