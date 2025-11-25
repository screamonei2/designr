
import React, { useState } from 'react';
import { DesignSystem } from '../types';
import { Search, Code, Smartphone, Monitor, Zap, Palette, Type, Layout, Box, Layers, Image as ImageIcon, Grid, Tablet, Accessibility, MousePointer } from 'lucide-react';

interface DocsBoardProps {
  data: DesignSystem;
}

const DocsBoard: React.FC<DocsBoardProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  // Filter items
  const filteredComponents = data.components?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.variants.some(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const navigation = [
    { name: 'Overview', icon: Layout },
    { name: 'Colors', icon: Palette },
    { name: 'Typography', icon: Type },
    { name: 'Layout & Grid', icon: Grid },
    { name: 'Tokens', icon: Layers },
    { name: 'Assets', icon: ImageIcon },
    { name: 'Motion', icon: Zap },
    { name: 'Components', icon: Box },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Layout size={300} />
              </div>
              <h1 className="text-6xl font-black mb-6 tracking-tighter">{data.metadata?.projectName}</h1>
              <div className="space-y-2 text-gray-300 font-light text-lg">
                <p>Source: <a href={data.metadata?.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{data.metadata?.sourceUrl}</a></p>
                <p>Analyzed: {new Date().toLocaleDateString()}</p>
                {data.metadata?.technologiesDetected && (
                   <div className="flex gap-2 mt-4">
                      {data.metadata.technologiesDetected.map(t => (
                         <span key={t} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/20">{t}</span>
                      ))}
                   </div>
                )}
              </div>
              
              <div className="mt-12 grid grid-cols-4 gap-4 text-center">
                 <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold">{data.components?.reduce((acc, c) => acc + (c.variants?.length || 0), 0) || 0}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Components</div>
                 </div>
                 <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold">{(data.colors?.primary?.length || 0) + (data.colors?.secondary?.length || 0) + (data.colors?.neutral?.length || 0)}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Colors</div>
                 </div>
                 <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold">{data.icons?.icons?.length || 0}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Icons</div>
                 </div>
                 <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold">{data.typography?.scales?.length || 0}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Type Styles</div>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-800 mb-4">Color System</h3>
                   <div className="flex flex-wrap gap-2">
                      {data.colors?.primary?.map((c,i) => <div key={i} className="w-10 h-10 rounded-full border border-gray-100" style={{ background: c.value }} title={c.name}></div>)}
                      {data.colors?.secondary?.map((c,i) => <div key={i} className="w-10 h-10 rounded-full border border-gray-100" style={{ background: c.value }} title={c.name}></div>)}
                   </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-800 mb-4">Typography</h3>
                   <div className="space-y-2">
                      {data.typography?.fontFamilies?.map((f, i) => (
                         <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                            <span className="font-bold">{f.name}</span>
                            <span className="font-mono text-xs text-gray-500">{f.family}</span>
                         </div>
                      ))}
                   </div>
                </div>
            </div>
          </div>
        );
      case 'Colors':
        return (
          <div className="space-y-12 animate-fadeIn">
            {data.colors && Object.entries(data.colors).map(([category, colors]) => (
              category !== 'gradients' && Array.isArray(colors) && (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 capitalize mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-blue-500`}></div>
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(colors as any[]).map((color: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex hover:shadow-md transition-shadow group">
                      <div className="w-24 h-auto relative" style={{ backgroundColor: color.value }}>
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4 flex-1">
                        <h4 className="font-bold text-gray-900">{color.name}</h4>
                        <div className="text-sm text-gray-500 font-mono mt-1 select-all bg-gray-50 inline-block px-1 rounded">{color.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )))}
          </div>
        );
      case 'Typography':
        return (
          <div className="space-y-12 animate-fadeIn">
             <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
                <h3 className="text-lg font-bold mb-4">Font Families</h3>
                <div className="grid grid-cols-2 gap-4">
                   {data.typography?.fontFamilies?.map((f, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                         <div className="font-bold text-lg mb-1">{f.name}</div>
                         <code className="text-sm text-blue-600 block mb-2">{f.family}</code>
                      </div>
                   ))}
                </div>
             </div>
          
             <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                         <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Style Name</th>
                         <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Preview</th>
                         <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Specs</th>
                      </tr>
                   </thead>
                   <tbody>
                      {data.typography?.scales?.map((font, idx) => (
                         <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-6 px-6 font-mono text-sm text-purple-600 font-medium">{font.name}</td>
                            <td className="py-6 px-6">
                               <p style={{
                                  fontFamily: font.fontFamily,
                                  fontSize: font.fontSize,
                                  fontWeight: font.fontWeight,
                                  lineHeight: font.lineHeight,
                                  letterSpacing: font.letterSpacing,
                               }} className="text-gray-900 truncate max-w-md">
                                  {font.sampleText || "The quick brown fox jumps over the lazy dog."}
                               </p>
                            </td>
                            <td className="py-6 px-6 text-sm text-gray-500 space-y-1 font-mono text-xs">
                               <div>size: {font.fontSize}</div>
                               <div>weight: {font.fontWeight}</div>
                               <div>line-height: {font.lineHeight}</div>
                               {font.letterSpacing && <div>letter-spacing: {font.letterSpacing}</div>}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );
      case 'Layout & Grid':
         return (
            <div className="space-y-8 animate-fadeIn">
               {data.spacing?.grid && (
                  <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                     <h2 className="text-xl font-bold mb-6">Grid System</h2>
                     <div className="flex gap-4 h-40 bg-gray-50 p-4 rounded border border-gray-100 mb-6">
                        {Array.from({ length: Math.min(12, data.spacing.grid.columns || 4) }).map((_, i) => (
                           <div key={i} className="flex-1 bg-red-100 border border-red-200 rounded h-full flex items-center justify-center text-red-300 text-xs">Col</div>
                        ))}
                     </div>
                     <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded">
                           <div className="text-gray-500 mb-1">Columns</div>
                           <div className="font-bold">{data.spacing.grid.columns}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                           <div className="text-gray-500 mb-1">Gutter</div>
                           <div className="font-bold">{data.spacing.grid.gutterWidth}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                           <div className="text-gray-500 mb-1">Max Width</div>
                           <div className="font-bold">{data.spacing.grid.maxWidth}</div>
                        </div>
                     </div>
                  </div>
               )}
               
               <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                   <h2 className="text-xl font-bold mb-6">Breakpoints</h2>
                   <div className="space-y-0">
                      {data.breakpoints?.map((bp, i) => (
                         <div key={i} className="flex items-center gap-6 py-4 border-b border-gray-100 last:border-0">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                {bp.name.includes('mobile') ? <Smartphone size={16}/> : bp.name.includes('tab') ? <Tablet size={16}/> : <Monitor size={16}/>}
                             </div>
                             <div className="w-32 font-bold text-gray-900">{bp.name}</div>
                             <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">{bp.value}</div>
                             <div className="text-gray-500 text-sm flex-1">{bp.description}</div>
                         </div>
                      ))}
                   </div>
               </div>
               
               <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                   <h2 className="text-xl font-bold mb-6">Spacing Scale</h2>
                   <div className="flex flex-wrap gap-4">
                      {data.spacing?.scale?.map((s, i) => (
                         <div key={i} className="bg-gray-50 border border-gray-200 rounded p-3 w-24 text-center">
                            <div className="h-8 bg-blue-200 mx-auto mb-2" style={{ width: s.value }}></div>
                            <div className="font-bold text-sm">{s.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{s.value}</div>
                         </div>
                      ))}
                   </div>
               </div>
            </div>
         );
      case 'Tokens':
          return (
            <div className="space-y-12 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">Border Radius</h2>
                        <div className="space-y-4">
                            {data.borderRadius?.map((r, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300" style={{ borderRadius: r.value }}></div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{r.name}</div>
                                        <div className="text-xs font-mono text-gray-500">{r.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">Shadows</h2>
                        <div className="space-y-4">
                            {data.shadows?.map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded border border-gray-100" style={{ boxShadow: s.value }}></div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{s.name}</div>
                                        <div className="text-xs font-mono text-gray-500 truncate w-48" title={s.value}>{s.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {data.zIndex && (
                       <div className="bg-white p-6 rounded-xl border border-gray-200">
                           <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">Z-Index Layers</h2>
                           <div className="space-y-2">
                               {data.zIndex.sort((a,b) => b.value - a.value).map((z, i) => (
                                  <div key={i} className="flex justify-between p-2 bg-gray-50 rounded">
                                     <span className="font-bold">{z.name}</span>
                                     <span className="font-mono text-blue-600">{z.value}</span>
                                  </div>
                               ))}
                           </div>
                       </div>
                    )}
                    {data.opacity && (
                       <div className="bg-white p-6 rounded-xl border border-gray-200">
                           <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">Opacity</h2>
                           <div className="space-y-2">
                               {data.opacity.map((o, i) => (
                                  <div key={i} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                                     <div className="w-8 h-8 bg-black rounded" style={{ opacity: o.value }}></div>
                                     <span className="font-bold">{o.name}</span>
                                     <span className="font-mono text-blue-600 ml-auto">{o.value}</span>
                                  </div>
                               ))}
                           </div>
                       </div>
                    )}
                </div>
            </div>
          );
      case 'Assets':
         return (
            <div className="space-y-8 animate-fadeIn">
               <h2 className="text-2xl font-bold mb-4">Icons</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {data.icons?.icons?.map((icon, i) => (
                     <div key={i} className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 mb-4 text-gray-700" dangerouslySetInnerHTML={{ __html: icon.svg || '' }}></div>
                        <span className="text-xs text-gray-500 text-center truncate w-full">{icon.name}</span>
                     </div>
                  ))}
               </div>
               
               <h2 className="text-2xl font-bold mb-4 mt-12">Logos & Images</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {data.images?.logos?.map((img, i) => (
                     <div key={i} className="bg-white border border-gray-200 p-6 rounded-lg">
                        <div className="h-32 flex items-center justify-center bg-gray-50 mb-4 rounded overflow-hidden">
                           <img src={img.url} className="max-h-full max-w-full" alt="asset" />
                        </div>
                        <div className="text-sm font-bold">{img.variant}</div>
                        <div className="text-xs text-gray-400 truncate">{img.url}</div>
                     </div>
                  ))}
               </div>
            </div>
         );
      case 'Motion':
         return (
             <div className="animate-fadeIn space-y-8">
                 <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Transitions</h3>
                    <div className="space-y-4">
                       {data.animations?.transitions?.map((t, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                             <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-sm hover:translate-x-2" style={{ transition: `${t.property} ${t.duration} ${t.timing}` }}></div>
                             <div className="flex-1">
                                <div className="font-bold">{t.name}</div>
                                <code className="text-xs text-blue-600 bg-blue-50 px-1 rounded">{t.property} {t.duration} {t.timing}</code>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-gray-900 rounded-xl p-8 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-6">Keyframes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {data.animations?.keyframes?.map((k, i) => (
                          <div key={i}>
                             <h4 className="font-bold text-green-400 mb-2">@{k.name}</h4>
                             <pre className="bg-black/50 p-4 rounded text-xs font-mono text-gray-300 overflow-x-auto">
                                {k.definition}
                             </pre>
                          </div>
                       ))}
                    </div>
                 </div>
             </div>
         );
      case 'Components':
        return (
          <div className="space-y-16 animate-fadeIn">
            {filteredComponents.length === 0 ? (
               <div className="text-center py-20 text-gray-400">
                  <p>No components found matching "{searchTerm}"</p>
               </div>
            ) : filteredComponents.map((cat, idx) => (
              <div key={idx} id={cat.name} className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                   <h2 className="text-3xl font-bold text-gray-900">{cat.name}</h2>
                   <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                
                <div className="grid grid-cols-1 gap-12">
                   {cat.variants?.map((variant, vIdx) => (
                      <div key={vIdx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                         <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h4 className="font-bold text-gray-800 text-lg">{variant.name}</h4>
                         </div>
                         
                         <div className="p-12 flex justify-center items-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-50 min-h-[300px]">
                            <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: variant.htmlSnippet }} />
                         </div>
                         
                         <div className="border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
                            <div className="p-4">
                               <h5 className="text-[10px] uppercase font-bold text-gray-400 mb-2">Props</h5>
                               <div className="space-y-1">
                                  {variant.properties?.map((p, pi) => (
                                     <div key={pi} className="text-xs flex justify-between">
                                        <span className="font-mono">{p}</span>
                                     </div>
                                  ))}
                               </div>
                            </div>
                            <div className="p-4">
                               <h5 className="text-[10px] uppercase font-bold text-gray-400 mb-2 flex items-center gap-1"><Accessibility size={12}/> Accessibility</h5>
                               <div className="text-xs text-gray-600 space-y-1">
                                  {variant.accessibility?.role && <div>Role: <span className="font-mono bg-green-100 text-green-800 px-1 rounded">{variant.accessibility.role}</span></div>}
                                  {variant.accessibility?.ariaLabel && <div className="italic">Label: "{variant.accessibility.ariaLabel}"</div>}
                                  {variant.accessibility?.keyboardSupport && <div className="text-gray-500">{variant.accessibility.keyboardSupport}</div>}
                               </div>
                            </div>
                            <div className="p-4">
                               <h5 className="text-[10px] uppercase font-bold text-gray-400 mb-2 flex items-center gap-1"><MousePointer size={12}/> Interactivity</h5>
                               <div className="text-xs text-gray-600 space-y-1">
                                  {variant.interactivity?.hoverStyle && <div>Hover: {variant.interactivity.hoverStyle}</div>}
                                  {variant.interactivity?.focusStyle && <div>Focus: {variant.interactivity.focusStyle}</div>}
                               </div>
                            </div>
                         </div>

                         <div className="bg-gray-900 p-6 relative group">
                            <div className="flex justify-between items-center mb-3">
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">HTML / Tailwind</span>
                               <button 
                                 onClick={() => navigator.clipboard.writeText(variant.htmlSnippet)}
                                 className="text-gray-400 hover:text-white transition-colors"
                                 title="Copy Code"
                               >
                                  <Code size={16}/>
                               </button>
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap leading-relaxed">
                                   <code>{variant.htmlSnippet}</code>
                                </pre>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-full w-full bg-white text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full flex-shrink-0 z-10">
         <div className="p-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
               <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold">DS</div>
               Docs
            </h2>
         </div>
         
         <div className="px-4 mb-6">
            <div className="relative">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            {navigation.map((item) => (
               <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                     activeTab === item.name 
                     ? 'bg-white text-black shadow-sm border border-gray-200' 
                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
               >
                  <item.icon size={18} className={activeTab === item.name ? 'text-black' : 'text-gray-400'} />
                  {item.name}
               </button>
            ))}
            
            <div className="pt-6 mt-6 border-t border-gray-200">
               <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Components</p>
               {data.components?.map(c => (
                  <button
                     key={c.name}
                     onClick={() => {
                        setActiveTab('Components');
                        setSearchTerm(c.name);
                     }}
                     className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate transition-colors"
                  >
                     {c.name}
                  </button>
               ))}
            </div>
         </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-full scroll-smooth bg-white">
         <div className="max-w-6xl mx-auto p-12">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};

export default DocsBoard;
