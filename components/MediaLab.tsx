import React, { useState, useRef } from 'react';
import { Image, Film, Edit, Download, Upload, Loader2, Sparkles, MonitorPlay } from 'lucide-react';
import { generateImage, editImage, generateVideo } from '../services/geminiService';
import { MediaType } from '../types';

const MediaLab = () => {
  const [activeTab, setActiveTab] = useState<MediaType>(MediaType.IMAGE);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // Image Config
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [imgRatio, setImgRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  
  // Edit Config
  const [editFile, setEditFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Video Config
  const [vidRatio, setVidRatio] = useState<'16:9' | '9:16'>('16:9');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);

    try {
      if (activeTab === MediaType.IMAGE) {
        const url = await generateImage({
          prompt,
          size: imgSize,
          aspectRatio: imgRatio as any // Simplified for this demo
        });
        setResult(url);
      } else if (activeTab === MediaType.EDIT) {
        if (!editFile) throw new Error("Please upload an image first");
        const base64 = await fileToBase64(editFile);
        const url = await editImage(base64, prompt);
        setResult(url);
      } else if (activeTab === MediaType.VIDEO) {
        const url = await generateVideo({
            prompt,
            aspectRatio: vidRatio,
            resolution: '1080p'
        });
        setResult(url);
      }
    } catch (error) {
      console.error(error);
      alert("Generation failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Media Lab</h2>
        <p className="text-slate-400">Generative assets powered by Nano Banana & Veo</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-8">
        {[
          { id: MediaType.IMAGE, icon: Image, label: 'Generate Image' },
          { id: MediaType.EDIT, icon: Edit, label: 'Edit Image' },
          { id: MediaType.VIDEO, icon: Film, label: 'Generate Video' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200
              ${activeTab === tab.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            
            {/* Aspect Ratio / Size Controls */}
            {activeTab === MediaType.IMAGE && (
              <>
                 <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1K', '2K', '4K'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setImgSize(s as any)}
                        className={`py-1.5 text-xs rounded border ${imgSize === s ? 'bg-blue-900/50 border-blue-500 text-blue-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1:1', '16:9', '9:16'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setImgRatio(r as any)}
                        className={`py-1.5 text-xs rounded border ${imgRatio === r ? 'bg-blue-900/50 border-blue-500 text-blue-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === MediaType.VIDEO && (
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Video Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['16:9', '9:16'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setVidRatio(r as any)}
                        className={`py-1.5 text-xs rounded border ${vidRatio === r ? 'bg-blue-900/50 border-blue-500 text-blue-400' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                   <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded text-xs text-blue-200">
                    <MonitorPlay className="w-3 h-3 inline mr-1" />
                    Generates 1080p via Veo 3.1
                   </div>
                </div>
            )}

            {activeTab === MediaType.EDIT && (
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Source Image</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-lg p-4 text-slate-500 hover:text-slate-300 transition-colors flex flex-col items-center gap-2"
                  >
                    {previewUrl ? (
                         <img src={previewUrl} alt="Preview" className="h-20 w-auto object-cover rounded" />
                    ) : (
                        <>
                            <Upload className="w-6 h-6" />
                            <span className="text-xs">Upload PNG/JPG</span>
                        </>
                    )}
                  </button>
                </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeTab === MediaType.EDIT ? "Describe the changes (e.g., 'Add a retro filter')..." : "Describe the scene..."}
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !prompt || (activeTab === MediaType.EDIT && !editFile)}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>

          </div>
        </div>

        {/* Preview Column */}
        <div className="md:col-span-2">
            <div className="h-full min-h-[400px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden relative group">
                {loading && (
                    <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center text-blue-400 gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="animate-pulse">Reasoning with Gemini...</p>
                    </div>
                )}

                {result ? (
                   activeTab === MediaType.VIDEO ? (
                        <video controls autoPlay loop className="max-w-full max-h-full rounded shadow-2xl">
                            <source src={result} type="video/mp4" />
                            Your browser does not support video.
                        </video>
                   ) : (
                       <img src={result} alt="Generated" className="max-w-full max-h-full object-contain rounded shadow-2xl" />
                   )
                ) : (
                    <div className="text-center text-slate-600">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Output will appear here</p>
                    </div>
                )}

                {result && !loading && (
                    <a 
                        href={result} 
                        download={`generated-${activeTab.toLowerCase()}.${activeTab === MediaType.VIDEO ? 'mp4' : 'png'}`}
                        className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full backdrop-blur-sm border border-slate-700 transition-opacity opacity-0 group-hover:opacity-100"
                    >
                        <Download className="w-5 h-5" />
                    </a>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLab;
