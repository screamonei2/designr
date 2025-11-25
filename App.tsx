import React, { useState } from 'react';
import { generateDesignSystem } from './services/geminiService';
import { DesignSystem } from './types';
import CanvasBoard from './components/CanvasBoard';
import DocsBoard from './components/DocsBoard';
import { Wand2, LayoutGrid, FileText, Loader2, ArrowRight, Code, Globe, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [view, setView] = useState<'canvas' | 'docs'>('canvas');
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUrl = async () => {
    if (!input.startsWith('http')) return;
    setLoading(true);
    setLoadingStatus('Fetching website source code via proxy...');
    setError(null);
    try {
      // Use a CORS proxy to bypass browser restrictions
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(input)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const text = await response.text();
      if (!text || text.length < 100) throw new Error("Fetched content seems empty or invalid.");

      setInput(text);
      setError("Successfully fetched URL content! The AI will now inspect this code.");
    } catch (e: any) {
      console.error(e);
      setError(`Failed to fetch URL: ${e.message}. Some websites block proxies. Please copy the page source (Ctrl+U) and paste it here manually.`);
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      // If the input looks like a URL and hasn't been fetched yet (doesn't have HTML tags), try to fetch it first
      if (input.startsWith('http') && !input.includes('<html')) {
         setLoadingStatus('Fetching website source code...');
         const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(input)}`;
         const response = await fetch(proxyUrl);
         if (response.ok) {
            const text = await response.text();
            if (text.length > 100) {
               // Proceed with the fetched text
               setLoadingStatus('Inspecting code & generating system...');
               const data = await generateDesignSystem(text);
               setDesignSystem(data);
               return;
            }
         }
         // If fetch failed or wasn't ok, throw/fall through to use the input as is (maybe user typed a description?)
         // But for this app, we really want code.
      }

      setLoadingStatus('Inspecting code & extracting design tokens...');
      const data = await generateDesignSystem(input);
      setDesignSystem(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate design system. Please check your input and try again.");
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  if (!designSystem) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 font-sans text-gray-900">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* Left Panel */}
          <div className="w-full md:w-1/3 bg-gray-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
             <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                   <Wand2 className="text-white w-6 h-6" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                  Design System<br/>AI Inspector
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Enter a URL or paste source code. The AI will deep-inspect the HTML/CSS to reverse-engineer a complete Figma-like Design System.
                </p>
             </div>
             <div className="relative z-10 space-y-4 mt-12">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                   <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs border border-gray-700">1</div>
                   <span>Enter URL or Paste Code</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                   <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs border border-gray-700">2</div>
                   <span>AI Inspects Source</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                   <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs border border-gray-700">3</div>
                   <span>Interactive Design System</span>
                </div>
             </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-10 flex flex-col">
            <div className="mb-6">
               <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 block">Website URL or Source Code</label>
               <div className="relative group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="https://example.com  OR  <html>...</html>"
                    className="w-full h-64 p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 resize-none text-xs font-mono text-gray-600 transition-colors bg-gray-50 focus:bg-white"
                  />
                  {/* URL helper tools */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                     {input.startsWith('http') && !input.includes('<') && (
                        <button 
                           onClick={fetchUrl} 
                           className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-md font-medium hover:bg-blue-200 transition flex items-center gap-2"
                           disabled={loading}
                        >
                           {loading ? <Loader2 className="animate-spin" size={12}/> : <Globe size={12} />}
                           Fetch Source
                        </button>
                     )}
                     <div className="bg-white/80 backdrop-blur px-2 py-1 rounded text-xs text-gray-400 border border-gray-200">
                        {input.length > 0 ? `${(input.length / 1000).toFixed(1)}k chars` : 'Empty'}
                     </div>
                  </div>
               </div>
            </div>

            {error && (
              <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 ${error.includes('Successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {error.includes('Successfully') ? <Globe size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                <div className="flex-1">{error}</div>
              </div>
            )}

            <div className="mt-auto">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !input.trim()}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]
                    ${loading || !input.trim() 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800 shadow-xl'
                    }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> {loadingStatus || 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} /> Inspect & Generate
                    </>
                  )}
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white font-sans">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Wand2 className="text-white w-4 h-4" />
          </div>
          <div>
             <h1 className="font-bold text-gray-900 text-sm">{designSystem.metadata.projectName}</h1>
             <p className="text-[10px] text-gray-500 font-mono">LIVE PREVIEW MODE</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('canvas')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${
              view === 'canvas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid size={14} /> Canvas
          </button>
          <button
            onClick={() => setView('docs')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${
              view === 'docs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={14} /> Docs
          </button>
        </div>

        <button 
           onClick={() => setDesignSystem(null)}
           className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
           Close Project
        </button>
      </header>

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {view === 'canvas' ? (
          <CanvasBoard data={designSystem} />
        ) : (
          <DocsBoard data={designSystem} />
        )}
      </main>
    </div>
  );
};

export default App;