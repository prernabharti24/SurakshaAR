import React, { useState } from 'react';
import { CS_SCRIPTS } from '../data/unityData';
import { CSharpScript } from '../types';
import { Copy, Check, Download, FileCode, Layers, Info, CheckCircle2, Filter } from 'lucide-react';

export const ScriptViewer: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number | 'all'>(8); // Default to Step 8!
  const [selectedScriptId, setSelectedScriptId] = useState<string>(
    CS_SCRIPTS.find((s) => s.step === 8)?.id || CS_SCRIPTS[0].id
  );
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  const filteredScripts = CS_SCRIPTS.filter((s) => (selectedStep === 'all' ? true : s.step === selectedStep));
  const activeScript = CS_SCRIPTS.find((s) => s.id === selectedScriptId) || filteredScripts[0] || CS_SCRIPTS[0];

  const handleCopy = (script: CSharpScript) => {
    navigator.clipboard.writeText(script.code);
    setCopiedScriptId(script.id);
    setTimeout(() => {
      setCopiedScriptId(null);
    }, 2000);
  };

  const handleDownload = (script: CSharpScript) => {
    const blob = new Blob([script.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = script.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFiltered = () => {
    filteredScripts.forEach((script, idx) => {
      setTimeout(() => {
        handleDownload(script);
      }, idx * 150);
    });
  };

  return (
    <div className="flex flex-col gap-5 bg-slate-900 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-xl">
      {/* Header bar with Filter & Download */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            Complete C# Source Code Archive
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Production-quality, modular C# scripts under <code className="text-amber-300 font-mono text-xs">SIH26041.AR.*</code> namespaces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Step Filter Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setSelectedStep(8);
                const first = CS_SCRIPTS.find((s) => s.step === 8);
                if (first) setSelectedScriptId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                selectedStep === 8 ? 'bg-amber-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ⭐ Step 8: Integration &amp; Demo (5)
            </button>
            <button
              onClick={() => {
                setSelectedStep(7);
                const first = CS_SCRIPTS.find((s) => s.step === 7);
                if (first) setSelectedScriptId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                selectedStep === 7 ? 'bg-amber-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 7: Bilingual (4)
            </button>
            <button
              onClick={() => {
                setSelectedStep(6);
                const first = CS_SCRIPTS.find((s) => s.step === 6);
                if (first) setSelectedScriptId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                selectedStep === 6 ? 'bg-amber-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 6: Gamification (6)
            </button>
            <button
              onClick={() => {
                setSelectedStep(5);
                const first = CS_SCRIPTS.find((s) => s.step === 5);
                if (first) setSelectedScriptId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                selectedStep === 5 ? 'bg-amber-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 5: Scenarios (4)
            </button>
            <button
              onClick={() => {
                setSelectedStep(3);
                const first = CS_SCRIPTS.find((s) => s.step === 3);
                if (first) setSelectedScriptId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                selectedStep === 3 ? 'bg-amber-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 3: Gemini AI (6)
            </button>
            <button
              onClick={() => {
                setSelectedStep(2);
                const first = CS_SCRIPTS.find((s) => s.step === 2);
                if (first) setSelectedScriptId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                selectedStep === 2 ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 2: PPE (7)
            </button>
            <button
              onClick={() => {
                setSelectedStep(1);
                const first = CS_SCRIPTS.find((s) => s.step === 1);
                if (first) setSelectedScriptId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                selectedStep === 1 ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 1: AR (5)
            </button>
            <button
              onClick={() => setSelectedStep('all')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                selectedStep === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({CS_SCRIPTS.length})
            </button>
          </div>

          <button
            onClick={handleDownloadFiltered}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download {filteredScripts.length} Scripts (.cs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Selector List */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider px-1">
            Scripts in Active Filter ({filteredScripts.length})
          </span>
          <div className="flex flex-col gap-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredScripts.map((script) => {
              const isSelected = script.id === activeScript.id;
              return (
                <button
                  key={script.id}
                  onClick={() => setSelectedScriptId(script.id)}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                      {script.filename}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        script.step === 2
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      Step {script.step}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{script.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer & Inspector Inspector Details */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Script Details Card */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">{activeScript.filename}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                    {activeScript.namespace || 'SIH26041.AR'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{activeScript.summary}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeScript)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copiedScriptId === activeScript.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(activeScript)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .cs</span>
                </button>
              </div>
            </div>

            {/* Inspector Attach Target & Fields Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              <div>
                <span className="text-slate-400 block font-medium">Attach To GameObject:</span>
                <span className="text-amber-300 font-mono font-semibold">{activeScript.targetGameObject}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Required Components:</span>
                <span className="text-slate-300 font-mono">
                  {activeScript.requiredComponents.length > 0
                    ? activeScript.requiredComponents.join(', ')
                    : 'None (Standalone / ScriptableObject)'}
                </span>
              </div>
            </div>

            {/* Inspector Serialized Fields */}
            {activeScript.inspectorFields.length > 0 && (
              <div className="text-xs">
                <span className="text-slate-400 font-medium block mb-1.5">Inspector Configuration:</span>
                <div className="grid grid-cols-1 gap-1">
                  {activeScript.inspectorFields.map((field) => (
                    <div
                      key={field.name}
                      className="flex flex-wrap items-baseline gap-2 bg-slate-900/40 px-2.5 py-1.5 rounded border border-slate-800/40 font-mono"
                    >
                      <span className="text-emerald-400 font-semibold">{field.name}</span>
                      <span className="text-slate-500 text-[10px]">({field.type})</span>
                      <span className="text-slate-300 text-[11px] font-sans ml-auto">{field.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Syntax Highlighted Code Box */}
          <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-[#0d1117]">
            <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{activeScript.filename}</span>
              <span>C# (.NET Standard 2.1 / Unity 2022.3 LTS)</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[460px] leading-relaxed select-all">
              <code>{activeScript.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
