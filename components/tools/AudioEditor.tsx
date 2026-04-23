"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap.esm.js";

import { formatTime, bufferToWav } from "@/lib/audioLogic";
import { processBasicEffect, changeAudioSpeed, applyAdvancedEffect } from "@/lib/audioDSP";
import { useHistory } from "@/hooks/useHistory";
import { saveProject, loadProject } from "@/lib/db";

type MenuType = "file" | "edit" | "select" | "transport" | "effect" | "view" | "tools" | null;
type ModalType = "speed" | "reverb" | "eq" | "delay" | "chorus" | "distortion" | null;

export default function AudioEditor() {
  // --- REFS ---
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const isLoopingRef = useRef(false);

  // --- STATE ---
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [wsRegions, setWsRegions] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  
  // Status
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(50);
  const [isLooping, setIsLooping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Drag & Drop Visual State
  const [isDragging, setIsDragging] = useState(false);

  // Modal Params
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [effectParams, setEffectParams] = useState<any>({});

  // History Hook
  const { state: currentUrl, pushState, undo, redo, canUndo, canRedo, resetHistory } = useHistory<string | null>(null);

  // --- 1. HANDLE CLICK OUTSIDE & LOOP REF ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);

  // --- 2. INITIALIZATION ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current || !timelineRef.current) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const accentColor = rootStyle.getPropertyValue('--accent').trim() || "#3b82f6";
    const textMuted = rootStyle.getPropertyValue('--text-muted').trim() || "#94a3b8";
    
    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 200,
      normalize: true,
      minPxPerSec: 50,
      fillParent: true,
      autoScroll: true,
      dragToSeek: false,
      splitChannels: [
        { waveColor: textMuted, progressColor: accentColor, cursorColor: "#fbbf24" },
        { waveColor: textMuted, progressColor: accentColor, cursorColor: "#fbbf24" }
      ],
    });

    ws.registerPlugin(TimelinePlugin.create({
        container: timelineRef.current,
        primaryLabelInterval: 5,
        secondaryLabelInterval: 1,
        style: { color: textMuted, fontSize: '10px' },
    }));

    ws.registerPlugin(MinimapPlugin.create({
        height: 30,
        waveColor: textMuted,
        progressColor: accentColor,
    }));

    const regions = ws.registerPlugin(RegionsPlugin.create());
    regions.enableDragSelection({ color: "rgba(59, 130, 246, 0.3)" });
    
    regions.on('region-created', (newRegion) => {
        regions.getRegions().forEach((region) => { 
            if (region.id !== newRegion.id) region.remove(); 
        });
    });

    setWsRegions(regions);

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(time));
    ws.on("decode", () => {
        setDuration(ws.getDuration());
        regions.clearRegions();
    });
    
    // Fix Loop Bug
    ws.on("finish", () => {
        if (isLoopingRef.current) {
            ws.seekTo(0);
            ws.play();
        } else {
            setIsPlaying(false);
        }
    });

    ws.on('zoom', (newZoom) => setZoom(newZoom));

    setWavesurfer(ws);
    
    if(editorWrapperRef.current) editorWrapperRef.current.focus();

    return () => ws.destroy();
  }, []);

  // --- LOGIC FUNCTIONS ---

  const loadAudioFile = (file: File) => {
      if (!wavesurfer) return;
      setFile(file);
      const url = URL.createObjectURL(file);
      wavesurfer.load(url);
      resetHistory(url);
  };

  const loadNewBuffer = (newBuffer: AudioBuffer) => {
    if (!wavesurfer) return;
    const wavBlob = bufferToWav(newBuffer);
    const newUrl = URL.createObjectURL(wavBlob);
    const currentProgress = wavesurfer.getCurrentTime() / wavesurfer.getDuration();
    
    wavesurfer.load(newUrl);
    pushState(newUrl);
    
    wavesurfer.once('decode', () => {
        if (currentProgress < 1 && !isNaN(currentProgress)) wavesurfer.seekTo(currentProgress);
    });
    setIsProcessing(false);
  };

  const applyZoom = (val: number) => {
      if (!wavesurfer || !wavesurfer.getDecodedData()) return;
      const safeZoom = Math.max(10, Math.min(val, 1000));
      wavesurfer.zoom(safeZoom);
      setActiveMenu(null);
  };

  // --- DRAG & DROP HANDLERS (FIXED) ---
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const droppedFile = e.dataTransfer.files[0];
          // Cek tipe file (Audio only)
          if (droppedFile.type.startsWith('audio/')) {
              loadAudioFile(droppedFile);
          } else {
              alert("Please drop a valid audio file.");
          }
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadAudioFile(f);
      setActiveMenu(null);
  };

  // --- EFFECT HANDLERS ---

  const openEffectModal = (type: ModalType) => {
      if (!file) return alert("Load audio first!");
      setActiveMenu(null);
      let defaults = {};
      switch(type) {
          case 'speed': defaults = { percent: 0 }; break;
          case 'reverb': defaults = { mix: 0.5, decay: 2.0, seconds: 2.0 }; break;
          case 'eq': defaults = { lowGain: 0, midGain: 0, highGain: 0, lowFreq: 320, midFreq: 1000, highFreq: 3200 }; break;
          case 'delay': defaults = { time: 0.3, feedback: 0.4, mix: 0.5 }; break;
          case 'chorus': defaults = { rate: 1.5, depth: 0.002, mix: 0.5 }; break;
          case 'distortion': defaults = { amount: 50 }; break;
      }
      setEffectParams(defaults);
      setActiveModal(type);
  };

  const applyEffectFromModal = async () => {
      if (!wavesurfer || !activeModal) return;
      const buffer = wavesurfer.getDecodedData();
      if (!buffer) return;

      setActiveModal(null);
      setIsProcessing(true);

      setTimeout(async () => {
        try {
            let newBuffer: AudioBuffer;
            if (activeModal === 'speed') {
                const rate = 1 + (effectParams.percent / 100);
                newBuffer = await changeAudioSpeed(buffer, rate);
            } else {
                newBuffer = await applyAdvancedEffect(buffer, activeModal as any, effectParams);
            }
            loadNewBuffer(newBuffer);
        } catch (e) {
            alert("Gagal memproses efek.");
            setIsProcessing(false);
        }
      }, 50);
  };

  const applyInstantEffect = (type: string, params?: any) => {
      if (!wavesurfer) return;
      const buffer = wavesurfer.getDecodedData();
      if (!buffer) return alert("Audio belum dimuat!");
      
      setIsProcessing(true);
      setActiveMenu(null);

      setTimeout(() => {
          try {
              const newBuffer = processBasicEffect(buffer, type as any, params);
              loadNewBuffer(newBuffer);
          } catch(e) {
              setIsProcessing(false);
          }
      }, 50);
  };

  // --- OTHER HANDLERS ---
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if(!wavesurfer || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.nativeEvent.clientX - rect.left;
      const p = x / rect.width;
      wavesurfer.seekTo(p);
  };

  const handleUndo = () => { const prev = undo(); if(prev && wavesurfer) wavesurfer.load(prev); setActiveMenu(null); };
  const handleRedo = () => { const next = redo(); if(next && wavesurfer) wavesurfer.load(next); setActiveMenu(null); };
  
  const handleSave = async () => {
      if(!wavesurfer || !file) return;
      const buffer = wavesurfer.getDecodedData();
      if(!buffer) return;
      const blob = bufferToWav(buffer);
      await saveProject({ id: "project-1", audioBlob: blob, regions: [], zoom, timestamp: Date.now() });
      alert("Project Saved to Browser!");
      setActiveMenu(null);
  };

  const handleLoad = async () => {
      const data = await loadProject("project-1");
      if(data) {
          const url = URL.createObjectURL(data.audioBlob);
          wavesurfer?.load(url);
          setFile(new File([data.audioBlob], "Loaded Project.wav"));
          applyZoom(data.zoom);
      } else alert("No saved project found.");
      setActiveMenu(null);
  };

  const handleDownload = () => {
    if(!wavesurfer) return;
    const buffer = wavesurfer.getDecodedData();
    const wavBlob = bufferToWav(buffer!);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.wav";
    a.click();
    setActiveMenu(null);
  };

  // --- SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (document.activeElement !== editorWrapperRef.current && !editorWrapperRef.current?.contains(document.activeElement)) return;
        if (!wavesurfer) return;

        if (['Space', 'ArrowLeft', 'ArrowRight'].includes(e.code) || 
           (e.ctrlKey && ['s', 'o', 'z', 'y', 'a'].includes(e.key.toLowerCase())) ||
           (e.altKey && ['1','2','3'].includes(e.key))) {
            e.preventDefault();
        }

        if (e.ctrlKey && e.key === 'o') fileInputRef.current?.click();
        if (e.ctrlKey && e.key === 's') handleSave();
        if (e.ctrlKey && e.key === 'z') handleUndo();
        if (e.ctrlKey && e.key === 'y') handleRedo();
        if (e.code === 'Space') { if(wavesurfer.isPlaying()) wavesurfer.pause(); else wavesurfer.play(); }
        if (e.altKey && e.key === '1') applyZoom(zoom + 20);
        if (e.altKey && e.key === '2') applyZoom(50);
        if (e.altKey && e.key === '3') applyZoom(zoom - 20);
        if (e.ctrlKey && e.key === 'a') {
            wsRegions?.clearRegions();
            wsRegions?.addRegion({ start: 0, end: wavesurfer.getDuration(), color: "rgba(59, 130, 246, 0.4)" });
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wavesurfer, wsRegions, canUndo, canRedo, currentUrl, zoom]);

  // --- RENDERERS ---
  const renderSlider = (label: string, key: string, min: number, max: number, step: number, suffix: string = "") => (
      <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>{label}</span>
              <span className="font-mono text-blue-400">{effectParams[key]} {suffix}</span>
          </div>
          <input 
            type="range" min={min} max={max} step={step}
            value={effectParams[key] || 0}
            onChange={(e) => setEffectParams({...effectParams, [key]: Number(e.target.value)})}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
      </div>
  );

  return (
    <div 
        ref={editorWrapperRef}
        tabIndex={0}
        // HANDLER DRAG & DROP UTAMA DI SINI
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="max-w-6xl mx-auto border rounded-lg shadow-2xl overflow-hidden min-h-[550px] select-none relative outline-none transition-all"
        style={{ 
            background: "var(--card-bg)", 
            borderColor: isDragging ? "var(--accent)" : "var(--card-border)",
            boxShadow: isDragging ? "0 0 0 2px var(--accent-subtle)" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
    >
      {/* VISUAL OVERLAY SAAT DRAG */}
      {isDragging && (
          <div className="absolute inset-0 z-[60] backdrop-blur-sm flex items-center justify-center border-4 border-dashed pointer-events-none" style={{ background: "var(--accent-subtle)", borderColor: "var(--accent)" }}>
              <div className="p-6 rounded-xl shadow-2xl text-center" style={{ background: "var(--card-bg)" }}>
                  <div className="text-4xl mb-2">📂</div>
                  <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Drop Audio File Here</h3>
              </div>
          </div>
      )}

      {isProcessing && (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm cursor-wait">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-white font-mono animate-pulse">Processing Audio...</span>
          </div>
      )}

      {/* 1. TOP MENU BAR */}
      <div ref={menuRef} className="flex px-2 py-1 border-b text-sm relative z-50" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}>
          
          <MenuDropdown label="File" active={activeMenu === 'file'} onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}>
              <MenuItem label="Open..." onClick={() => fileInputRef.current?.click()} shortcut="Ctrl+O" />
              <Divider />
              <MenuItem label="Save Project" onClick={handleSave} disabled={!file} shortcut="Ctrl+S" />
              <MenuItem label="Load Project" onClick={handleLoad} />
              <Divider />
              <MenuItem label="Export WAV" onClick={handleDownload} disabled={!file} />
          </MenuDropdown>

          <MenuDropdown label="Edit" active={activeMenu === 'edit'} onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}>
              <MenuItem label="Undo" onClick={handleUndo} disabled={!canUndo} shortcut="Ctrl+Z" />
              <MenuItem label="Redo" onClick={handleRedo} disabled={!canRedo} shortcut="Ctrl+Y" />
          </MenuDropdown>

          <MenuDropdown label="Select" active={activeMenu === 'select'} onClick={() => setActiveMenu(activeMenu === 'select' ? null : 'select')}>
              <MenuItem label="Select All" onClick={() => { wsRegions?.clearRegions(); wsRegions?.addRegion({ start: 0, end: wavesurfer?.getDuration() || 0, color: "rgba(59, 130, 246, 0.4)" }); setActiveMenu(null); }} shortcut="Ctrl+A" />
              <MenuItem label="Clear Selection" onClick={() => { wsRegions?.clearRegions(); setActiveMenu(null); }} />
          </MenuDropdown>

          <MenuDropdown label="Effect" active={activeMenu === 'effect'} onClick={() => setActiveMenu(activeMenu === 'effect' ? null : 'effect')}>
              <div className="px-4 py-1 text-[10px] uppercase font-bold" style={{ color: "var(--accent)" }}>Advanced</div>
              <MenuItem label="Change Speed / Tempo..." onClick={() => openEffectModal('speed')} disabled={!file} />
              <MenuItem label="Parametric EQ..." onClick={() => openEffectModal('eq')} disabled={!file} />
              <MenuItem label="Reverb..." onClick={() => openEffectModal('reverb')} disabled={!file} />
              <MenuItem label="Delay..." onClick={() => openEffectModal('delay')} disabled={!file} />
              <MenuItem label="Chorus..." onClick={() => openEffectModal('chorus')} disabled={!file} />
              <MenuItem label="Distortion..." onClick={() => openEffectModal('distortion')} disabled={!file} />
              <Divider />
              <div className="px-4 py-1 text-[10px] uppercase font-bold" style={{ color: "var(--accent)" }}>Instant</div>
              <MenuItem label="Normalize" onClick={() => applyInstantEffect('normalize')} disabled={!file} />
              <MenuItem label="Reverse" onClick={() => applyInstantEffect('reverse')} disabled={!file} />
              <MenuItem label="Invert" onClick={() => applyInstantEffect('invert')} disabled={!file} />
              <MenuItem label="Fade In" onClick={() => applyInstantEffect('fade_in')} disabled={!file} />
              <MenuItem label="Fade Out" onClick={() => applyInstantEffect('fade_out')} disabled={!file} />
          </MenuDropdown>

          <MenuDropdown label="View" active={activeMenu === 'view'} onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}>
              <MenuItem label="Zoom In" onClick={() => applyZoom(zoom + 20)} shortcut="Alt+1" />
              <MenuItem label="Zoom Normal" onClick={() => applyZoom(50)} shortcut="Alt+2" />
              <MenuItem label="Zoom Out" onClick={() => applyZoom(zoom - 20)} shortcut="Alt+3" />
          </MenuDropdown>
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileChange} />

      {/* 2. TOOLBAR */}
      <div className="flex items-center gap-2 p-2 border-b" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
          <div className="flex rounded p-1 gap-1" style={{ background: "var(--card-bg)" }}>
            <button onClick={() => {if(wavesurfer?.isPlaying()) wavesurfer.pause(); else wavesurfer?.play()}} className="p-1.5 rounded w-8 h-8 flex items-center justify-center transition-colors" style={{ color: isPlaying ? "var(--accent)" : "var(--text-secondary)" }} onMouseEnter={e => e.currentTarget.style.background = "var(--page-bg)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{isPlaying ? "⏸" : "▶"}</button>
            <button onClick={() => {wavesurfer?.stop(); wavesurfer?.seekTo(0)}} className="p-1.5 rounded w-8 h-8 flex items-center justify-center transition-colors text-red-400" onMouseEnter={e => e.currentTarget.style.background = "var(--page-bg)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>⏹</button>
            <button onClick={() => setIsLooping(!isLooping)} className="p-1.5 rounded w-8 h-8 flex items-center justify-center transition-colors" style={{ background: isLooping ? "var(--accent)" : "transparent", color: isLooping ? "var(--accent-text)" : "var(--text-secondary)" }} onMouseEnter={e => e.currentTarget.style.background = isLooping ? "var(--accent)" : "var(--page-bg)"} onMouseLeave={e => e.currentTarget.style.background = isLooping ? "var(--accent)" : "transparent"}>🔁</button>
          </div>
          <div className="w-[1px] h-6" style={{ background: "var(--card-border)" }}></div>
          <div className="flex rounded p-1 gap-1" style={{ background: "var(--card-bg)" }}>
             <button onClick={handleUndo} disabled={!canUndo} className="p-1.5 rounded disabled:opacity-30 transition-colors" style={{ color: "var(--text-secondary)" }} onMouseEnter={e => e.currentTarget.style.background = "var(--page-bg)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>↩️</button>
             <button onClick={handleRedo} disabled={!canRedo} className="p-1.5 rounded disabled:opacity-30 transition-colors" style={{ color: "var(--text-secondary)" }} onMouseEnter={e => e.currentTarget.style.background = "var(--page-bg)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>↪️</button>
          </div>
          <div className="w-[1px] h-6" style={{ background: "var(--card-border)" }}></div>
          <div className="flex items-center gap-2 px-2" style={{ color: "var(--text-secondary)" }}>
              <button onClick={() => applyZoom(zoom - 20)} className="transition-colors hover:text-[color:var(--accent)]">🔍-</button>
              <input type="range" min="10" max="1000" value={zoom} onChange={(e) => applyZoom(Number(e.target.value))} className="w-24 h-1 rounded-lg appearance-none cursor-pointer" style={{ background: "var(--card-border)", accentColor: "var(--accent)" }}/>
              <button onClick={() => applyZoom(zoom + 20)} className="transition-colors hover:text-[color:var(--accent)]">🔍+</button>
          </div>
          <div className="flex-1 text-right font-mono font-bold" style={{ color: "var(--accent)" }}>{formatTime(currentTime)}</div>
      </div>

      {/* 3. EDITOR AREA */}
      <div className="relative min-h-[300px] flex flex-col" style={{ background: "var(--page-bg)" }}>
           <div 
             ref={timelineRef} 
             onClick={handleTimelineClick}
             className="w-full h-8 border-b relative z-20 cursor-pointer overflow-visible"
             style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
           ></div>
           
           <div className="relative flex-1 py-4 group overflow-hidden cursor-text z-10">
               <div className="absolute top-1/2 left-0 w-full h-[1px] z-0" style={{ background: "var(--card-border)" }}></div>
               <div ref={containerRef} className="z-10 relative"></div>
           </div>

           {!file && <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ color: "var(--text-muted)" }}>Drop audio here</div>}
      </div>

      {/* 4. MODALS (EFFECT SETTINGS) */}
      {activeModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="border p-6 rounded-lg shadow-2xl w-80 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                  <h3 className="font-bold mb-4 capitalize" style={{ color: "var(--text-primary)" }}>{activeModal.replace('_', ' ')} Settings</h3>
                  
                  {activeModal === 'speed' && renderSlider("Speed %", "percent", -90, 100, 5, "%")}
                  
                  {activeModal === 'reverb' && (
                      <>
                        {renderSlider("Mix (Dry/Wet)", "mix", 0, 1, 0.05)}
                        {renderSlider("Decay", "decay", 0.1, 10, 0.1, "s")}
                        {renderSlider("Room Size", "seconds", 0.5, 5, 0.1, "s")}
                      </>
                  )}

                  {activeModal === 'eq' && (
                      <>
                        {renderSlider("Low Gain", "lowGain", -20, 20, 1, "dB")}
                        {renderSlider("Mid Gain", "midGain", -20, 20, 1, "dB")}
                        {renderSlider("High Gain", "highGain", -20, 20, 1, "dB")}
                      </>
                  )}

                  {activeModal === 'delay' && (
                      <>
                        {renderSlider("Time", "time", 0, 1, 0.05, "s")}
                        {renderSlider("Feedback", "feedback", 0, 0.9, 0.05)}
                        {renderSlider("Mix", "mix", 0, 1, 0.05)}
                      </>
                  )}

                  {activeModal === 'chorus' && (
                      <>
                        {renderSlider("Rate", "rate", 0.1, 10, 0.1, "Hz")}
                        {renderSlider("Depth", "depth", 0, 0.01, 0.0001)}
                        {renderSlider("Mix", "mix", 0, 1, 0.05)}
                      </>
                  )}

                  {activeModal === 'distortion' && renderSlider("Amount", "amount", 0, 400, 10)}

                  <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => setActiveModal(null)} className="px-3 py-1 rounded text-sm transition-colors" style={{ background: "var(--page-bg)", color: "var(--text-primary)" }} onMouseEnter={e => e.currentTarget.style.opacity="0.8"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>Cancel</button>
                      <button onClick={applyEffectFromModal} className="px-3 py-1 text-white rounded font-bold text-sm transition-colors" style={{ background: "var(--accent)" }} onMouseEnter={e => e.currentTarget.style.opacity="0.8"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>Apply</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
const MenuDropdown = ({ label, active, onClick, children }: any) => (
    <div className="relative">
        <button 
            className="px-3 py-1 rounded text-sm transition-colors" 
            style={{ 
                background: active ? "var(--accent)" : "transparent",
                color: active ? "var(--accent-text)" : "var(--text-primary)"
            }} 
            onMouseEnter={e => { if(!active) e.currentTarget.style.background = "var(--page-bg)" }}
            onMouseLeave={e => { if(!active) e.currentTarget.style.background = "transparent" }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
            {label}
        </button>
        {active && <div className="absolute top-full left-0 border shadow-xl min-w-[180px] z-50 py-1 rounded-b" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>{children}</div>}
    </div>
);

const MenuItem = ({ label, onClick, disabled, shortcut }: any) => (
    <button 
        className="w-full text-left px-4 py-1.5 text-xs flex justify-between transition-colors" 
        style={{ 
            color: disabled ? "var(--text-muted)" : "var(--text-primary)",
            cursor: disabled ? "not-allowed" : "pointer"
        }} 
        onMouseEnter={e => { if(!disabled) { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--accent-text)"; } }}
        onMouseLeave={e => { if(!disabled) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-primary)"; } }}
        onClick={onClick} 
        disabled={disabled}
    >
        <span>{label}</span>{shortcut && <span style={{ opacity: 0.7 }}>{shortcut}</span>}
    </button>
);

const Divider = () => <div className="h-[1px] my-1 mx-2" style={{ background: "var(--card-border)" }}></div>;