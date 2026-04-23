// lib/audioDSP.ts

// --- HELPER 1: BASIC EFFECTS ---
export const processBasicEffect = (
    originalBuffer: AudioBuffer, 
    effectType: 'reverse' | 'normalize' | 'invert' | 'fade_in' | 'fade_out' | 'gain',
    params?: any
  ): AudioBuffer => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const newBuffer = ctx.createBuffer(originalBuffer.numberOfChannels, originalBuffer.length, originalBuffer.sampleRate);
  
    for (let i = 0; i < originalBuffer.numberOfChannels; i++) {
      newBuffer.copyToChannel(originalBuffer.getChannelData(i), i);
    }
  
    switch (effectType) {
      case 'reverse':
        for (let i = 0; i < newBuffer.numberOfChannels; i++) Array.prototype.reverse.call(newBuffer.getChannelData(i));
        break;
      case 'invert':
        for (let i = 0; i < newBuffer.numberOfChannels; i++) {
          const data = newBuffer.getChannelData(i);
          for (let k = 0; k < data.length; k++) data[k] = -data[k];
        }
        break;
      case 'normalize':
        let max = 0;
        for (let i = 0; i < newBuffer.numberOfChannels; i++) {
          const data = newBuffer.getChannelData(i);
          for (let k = 0; k < data.length; k++) if (Math.abs(data[k]) > max) max = Math.abs(data[k]);
        }
        if (max > 0) {
          const amp = 0.98 / max;
          for (let i = 0; i < newBuffer.numberOfChannels; i++) {
            const data = newBuffer.getChannelData(i);
            for (let k = 0; k < data.length; k++) data[k] *= amp;
          }
        }
        break;
      case 'gain':
         const gainVal = params?.value || 1.0; // params.value dalam desimal (1.5 = 150%)
         for (let i = 0; i < newBuffer.numberOfChannels; i++) {
            const data = newBuffer.getChannelData(i);
            for (let k = 0; k < data.length; k++) data[k] *= gainVal;
         }
         break;
      case 'fade_in':
        const fadeInDuration = (params?.duration || 2) * newBuffer.sampleRate; 
        for (let i = 0; i < newBuffer.numberOfChannels; i++) {
          const data = newBuffer.getChannelData(i);
          for (let k = 0; k < fadeInDuration && k < data.length; k++) data[k] *= (k / fadeInDuration);
        }
        break;
      case 'fade_out':
          const fadeOutDuration = (params?.duration || 2) * newBuffer.sampleRate;
          const len = newBuffer.length;
          for (let i = 0; i < newBuffer.numberOfChannels; i++) {
              const data = newBuffer.getChannelData(i);
              for (let k = 0; k < fadeOutDuration; k++) {
                  const index = len - fadeOutDuration + k;
                  if(index >= 0 && index < len) data[index] *= (1 - (k / fadeOutDuration));
              }
          }
          break;
    }
    return newBuffer;
};

// --- HELPER 2: SPEED ---
export const changeAudioSpeed = async (originalBuffer: AudioBuffer, speed: number): Promise<AudioBuffer> => {
    const newDuration = originalBuffer.duration / speed;
    const offlineCtx = new OfflineAudioContext(originalBuffer.numberOfChannels, newDuration * originalBuffer.sampleRate, originalBuffer.sampleRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = originalBuffer;
    source.playbackRate.value = speed;
    source.connect(offlineCtx.destination);
    source.start(0);
    return await offlineCtx.startRendering();
}

// --- HELPER 3: IMPULSE RESPONSE ---
const createImpulseResponse = (sampleRate: number, duration: number, decay: number) => {
    const length = sampleRate * duration;
    const impulse = new AudioBuffer({ numberOfChannels: 2, length, sampleRate });
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
        const n = i / length;
        const val = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
        left[i] = val;
        right[i] = val;
    }
    return impulse;
};

// --- ADVANCED DSP (PARAMETERIZED) ---
export const applyAdvancedEffect = async (
    originalBuffer: AudioBuffer,
    effectType: 'reverb' | 'delay' | 'chorus' | 'distortion' | 'parametric_eq',
    params?: any
): Promise<AudioBuffer> => {
    
    const ctx = new OfflineAudioContext(originalBuffer.numberOfChannels, originalBuffer.length, originalBuffer.sampleRate);
    const source = ctx.createBufferSource();
    source.buffer = originalBuffer;

    // Master Makeup Gain (mengompensasi penurunan volume keseluruhan)
    const masterGain = ctx.createGain();
    masterGain.gain.value = 1.2; // Boost 20% secara default agar audio tidak terasa redup
    masterGain.connect(ctx.destination);

    // Dry Signal (Suara Asli)
    const dryGain = ctx.createGain();
    dryGain.gain.value = 1.0; 
    
    // Wet Signal (Suara Efek)
    const wetGain = ctx.createGain();
    wetGain.gain.value = 1.0; 

    source.connect(dryGain);
    dryGain.connect(masterGain);

    switch (effectType) {
        case 'parametric_eq':
            // EQ memproses Dry signal langsung (Insert Effect)
            dryGain.disconnect(); 
            
            const low = ctx.createBiquadFilter(); low.type = 'lowshelf'; low.frequency.value = params?.lowFreq || 320; low.gain.value = params?.lowGain || 0;
            const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = params?.midFreq || 1000; mid.Q.value = params?.midQ || 0.5; mid.gain.value = params?.midGain || 0;
            const high = ctx.createBiquadFilter(); high.type = 'highshelf'; high.frequency.value = params?.highFreq || 3200; high.gain.value = params?.highGain || 0;
            
            source.connect(low); low.connect(mid); mid.connect(high); high.connect(masterGain);
            break;

        case 'reverb':
            // Menggunakan Constant Power Crossfade (sin/cos) agar volume tidak drop saat mix
            const rMix = params?.mix ?? 0.5;
            wetGain.gain.value = Math.sin(rMix * Math.PI / 2);
            dryGain.gain.value = Math.cos(rMix * Math.PI / 2);

            const conv = ctx.createConvolver();
            conv.buffer = createImpulseResponse(originalBuffer.sampleRate, params?.seconds || 2.0, params?.decay || 2.0);
            
            source.connect(conv);
            conv.connect(wetGain);
            wetGain.connect(masterGain);
            
            // Reverb seringkali mengurangi power transient, kita boost sedikit
            masterGain.gain.value = 1.5; 
            break;

        case 'delay':
            const dTime = params?.time || 0.3;
            const dFeedback = params?.feedback || 0.4;
            const dMix = params?.mix ?? 0.5;

            wetGain.gain.value = Math.sin(dMix * Math.PI / 2);
            dryGain.gain.value = Math.cos(dMix * Math.PI / 2);

            const delay = ctx.createDelay(); delay.delayTime.value = dTime;
            const fb = ctx.createGain(); fb.gain.value = dFeedback;
            const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 2000;

            source.connect(delay);
            delay.connect(fb);
            fb.connect(delay);
            delay.connect(filter);
            filter.connect(wetGain);
            wetGain.connect(masterGain);
            break;

        case 'chorus':
            const cMix = params?.mix ?? 0.5;
            wetGain.gain.value = Math.sin(cMix * Math.PI / 2);
            dryGain.gain.value = Math.cos(cMix * Math.PI / 2);

            const cDelay = ctx.createDelay(); cDelay.delayTime.value = 0.03;
            const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = params?.rate || 1.5;
            const oscGain = ctx.createGain(); oscGain.gain.value = params?.depth || 0.002;
            
            osc.connect(oscGain); oscGain.connect(cDelay.delayTime); osc.start(0);
            source.connect(cDelay);
            cDelay.connect(wetGain);
            wetGain.connect(masterGain);
            break;

        case 'distortion':
             dryGain.disconnect();
             const distAmount = params?.amount || 50;
             const dist = ctx.createWaveShaper();
             const makeDist = (amount: number) => {
                const k = typeof amount === 'number' ? amount : 50;
                const n = 44100;
                const curve = new Float32Array(n);
                const deg = Math.PI / 180;
                for (let i = 0; i < n; ++i) {
                  const x = i * 2 / n - 1;
                  curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
                }
                return curve;
             };
             dist.curve = makeDist(distAmount); 
             dist.oversample = '4x';
             
             source.connect(dist);
             dist.connect(masterGain);
             
             // Distortion wave shaper curve ini cenderung menurunkan volume pada amount tinggi
             masterGain.gain.value = 1.0 + (distAmount / 200); 
             break;
    }

    source.start(0);
    return await ctx.startRendering();
};