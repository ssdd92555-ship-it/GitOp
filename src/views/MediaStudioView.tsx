import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { musicEngine } from '../utils/audioSynth';
import {
  Image as ImageIcon,
  Music,
  Sparkles,
  Download,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Copy,
  Check,
  Disc3,
  Layers,
  Wand2,
  Volume2,
  Flame,
  Radio,
} from 'lucide-react';

const IMAGE_STYLES = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon', nameAr: 'سايبر بانك ونيون', promptExtra: 'cyberpunk style, glowing neon lights, holographic UI, ultra-detailed 8k octane render' },
  { id: 'anime', name: 'Anime Cinematic', nameAr: 'أنمي سينمائي', promptExtra: 'Makoto Shinkai anime style, beautiful lighting, painterly background, vibrant aesthetic' },
  { id: 'photoreal', name: 'Photorealistic 8K', nameAr: 'واقعي فائق الدقة 8K', promptExtra: 'photorealistic, shot on 35mm lens, f/1.8, highly detailed, master photography' },
  { id: '3d-render', name: '3D Octane Render', nameAr: 'ثلاثي الأبعاد ماستر', promptExtra: '3D render, octane render, smooth reflections, cinematic volumetric lighting, Behance trending' },
  { id: 'vector-logo', name: 'Minimalist Vector', nameAr: 'فيكتور وشعار حديث', promptExtra: 'minimalist vector flat design, modern tech logo, clean lines, SVG aesthetic' },
];

const MUSIC_GENRES = [
  { id: 'synthwave', name: 'Cyberpunk Synthwave', nameAr: 'سايبر بانك سينث ويف', defaultBpm: 125 },
  { id: 'lofi', name: 'Lofi Chill Hop', nameAr: 'لو فاي مريح وهادئ', defaultBpm: 85 },
  { id: 'arabic-trap', name: 'Arabic Oud & Trap Beats', nameAr: 'عود عربي مع إيقاعات تراب', defaultBpm: 130 },
  { id: 'cinematic', name: 'Epic Cinematic Orchestral', nameAr: 'أوركسترا ملحمي وسينمائي', defaultBpm: 110 },
  { id: 'chiptune', name: '8-Bit Retro Chiptune', nameAr: 'ألعاب ريترو 8-بت', defaultBpm: 140 },
];

export const MediaStudioView: React.FC = () => {
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [activeTab, setActiveTab] = useState<'image' | 'song'>('song');

  // --- Image Generator State ---
  const [imagePrompt, setImagePrompt] = useState('Futuristic AI cyber bot coding on holographic screens with neon skyline');
  const [selectedStyle, setSelectedStyle] = useState(IMAGE_STYLES[0]);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  );
  const [imgHistory, setImgHistory] = useState<string[]>([
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80',
  ]);

  // --- Music Synthesizer & Lyrics State ---
  const [songTopic, setSongTopic] = useState('رحلة مبرمج عبقري يبني أذكى نظام ذكاء اصطناعي في قلب مدينة المستقبل');
  const [selectedGenre, setSelectedGenre] = useState(MUSIC_GENRES[0]);
  const [bpm, setBpm] = useState(selectedGenre.defaultBpm);
  const [isComposing, setIsComposing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [songData, setSongData] = useState<any>({
    title: 'لحن شفرات المستقبل (Digital Cyber Odyssey)',
    genre: 'Cyberpunk Synthwave',
    bpm: 125,
    key: 'C Minor',
    chords: ['Cm', 'Ab', 'Bb', 'Gm'],
    lyrics: `[المقدمة - Neon Synth Intro]\nفي عتمة الليل تلمع الشاشات...\nشفرات وأكواد ترسم الأمنيات...\n\n[المقطع الأول - Verse 1]\nنكتب المستقبل سطر ورا سطر\nلا مكان لليأس في عالم الفكر\nأصوات السيبر تعزف على الأوتار\nنخترق الصعاب ونشعل النار!\n\n[اللازمة - Chorus]\nOPEBAT ينادي في كل سحاب\nعقولٌ تبني وتفتح كل باب\nنحن صناع الغد برؤية وذكاء\nنرتقي بالمجد نحو الفضاء!\n\n[الخاتمة - Outro]\nألحان نيون تتلاشى في الأفق...`,
  });
  const [copiedLyrics, setCopiedLyrics] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderVisualizer = () => {
      const analyser = musicEngine.getAnalyser();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlayingAudio && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#06b6d4');
          gradient.addColorStop(0.5, '#3b82f6');
          gradient.addColorStop(1, '#ec4899');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      } else {
        // Idle ambient waves
        const time = Date.now() * 0.002;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height / 2 + Math.sin(x * 0.02 + time) * 8;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(renderVisualizer);
    };

    renderVisualizer();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlayingAudio]);

  const handleTogglePlayAudio = () => {
    musicEngine.setBpm(bpm);
    musicEngine.setGenre(selectedGenre.name);
    const playing = musicEngine.toggle();
    setIsPlayingAudio(playing);
  };

  const handleComposeSong = async () => {
    setIsComposing(true);
    try {
      const res = await fetch('/api/gemini/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: songTopic,
          genre: selectedGenre.name,
          mood: 'Energetic & Inspiring',
          tempo: bpm,
          language: 'ar',
        }),
      });

      const data = await res.json();
      setSongData(data);
    } catch {
      // Keep existing data
    } finally {
      setIsComposing(false);
    }
  };

  const handleGenerateImage = () => {
    setIsGeneratingImg(true);
    const dimensions = aspectRatio === '16:9' ? '1280x720' : aspectRatio === '9:16' ? '720x1280' : '1024x1024';
    const finalPrompt = `${imagePrompt}, ${selectedStyle.promptExtra}`;
    const encoded = encodeURIComponent(finalPrompt);
    const seed = Math.floor(Math.random() * 999999);
    const newUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${dimensions.split('x')[0]}&height=${dimensions.split('x')[1]}&seed=${seed}&nologo=true`;

    const img = new Image();
    img.src = newUrl;
    img.onload = () => {
      setGeneratedImgUrl(newUrl);
      setImgHistory((prev) => [newUrl, ...prev.slice(0, 5)]);
      setIsGeneratingImg(false);
    };
    img.onerror = () => {
      // Fallback
      setGeneratedImgUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
      setIsGeneratingImg(false);
    };
  };

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(songData.lyrics);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* View Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            Generative AI Studio
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            {t('استوديو توليد الصور والأغاني بالذكاء الاصطناعي', 'AI Image & Music Generation Studio')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('تأليف مقطوعات وأغانٍ مع عزف حي بالمتصفح، وتوليد صور إبداعية بدقة سينمائية فائقة.', 'Create songs with live Web Audio synth playback, and generate cinematic visual art.')}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('song');
              if (isPlayingAudio) musicEngine.stop();
              setIsPlayingAudio(false);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'song'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>{t('استوديو الأغاني والموسيقى', 'AI Music & Song')}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('image');
              if (isPlayingAudio) musicEngine.stop();
              setIsPlayingAudio(false);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t('استوديو الصور الفنية', 'AI Image Studio')}</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: AI SONG & MUSIC SYNTHESIZER --- */}
      {activeTab === 'song' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Synthesizer Live Player & Frequency Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Web Audio Synthesizer Control Deck */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0c1222] to-[#080d19] border border-violet-500/30 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
                    <Disc3 className={`w-4 h-4 ${isPlayingAudio ? 'animate-spin' : ''}`} />
                    <span>{songData.genre} • {songData.key}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{songData.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlayAudio}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs text-white shadow-lg flex items-center gap-2 transition-all ${
                      isPlayingAudio
                        ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30 animate-pulse'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 shadow-violet-500/30 active:scale-95'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>{t('إيقاف العزف الحي', 'Pause Live Synth')}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>{t('تشغيل العزف الحي (Live Play)', 'Play Live Synth')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time HTML5 Canvas Frequency Spectrum */}
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 mb-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Radio className="w-3.5 h-3.5" />
                    {t('محلل الطيف الصوتي (Web Audio API Analyser)', 'Live Frequency Spectrum')}
                  </span>
                  <span>{isPlayingAudio ? `${bpm} BPM ACTIVE` : 'IDLE'}</span>
                </div>
                <canvas ref={canvasRef} width={550} height={110} className="w-full h-24 rounded-lg bg-[#050811]" />
              </div>

              {/* BPM & Synth Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span>{t('سرعة الإيقاع (BPM):', 'Tempo (BPM):')}</span>
                    <strong className="text-violet-400">{bpm} BPM</strong>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="160"
                    value={bpm}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setBpm(val);
                      musicEngine.setBpm(val);
                    }}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span>{t('التتابعات والتوافقات الموسيقية:', 'Chord Progression:')}</span>
                    <strong className="text-cyan-400 font-mono">{(songData.chords || []).join(' - ')}</strong>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {(songData.chords || ['Cm', 'Ab', 'Bb', 'Gm']).map((ch: string, i: number) => (
                      <span key={i} className="flex-1 py-1 text-center rounded bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-bold">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Lyrics Card */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-violet-400" />
                  <h3 className="font-bold text-sm text-white">{t('كلمات الأغنية المقفاة (Lyrics)', 'Song Lyrics')}</h3>
                </div>
                <button
                  onClick={handleCopyLyrics}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
                >
                  {copiedLyrics ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLyrics ? t('تم النسخ!', 'Copied!') : t('نسخ الكلمات', 'Copy Lyrics')}</span>
                </button>
              </div>

              <div className="whitespace-pre-line text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                {songData.lyrics}
              </div>
            </div>
          </div>

          {/* Right Column: Song Prompt & Genre Selector */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-400" />
                {t('إعدادات اللحن والموضوع', 'Song Concept & Genre')}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('النمط الموسيقي (Genre):', 'Musical Genre:')}
                </label>
                <div className="space-y-2">
                  {MUSIC_GENRES.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => {
                        setSelectedGenre(genre);
                        setBpm(genre.defaultBpm);
                        musicEngine.setBpm(genre.defaultBpm);
                        musicEngine.setGenre(genre.name);
                      }}
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors text-start ${
                        selectedGenre.id === genre.id
                          ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/20'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{t(genre.nameAr, genre.name)}</span>
                      <span className="text-[10px] opacity-75 font-mono">{genre.defaultBpm} BPM</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('فكرة الأغنية أو القصة:', 'Song Theme / Story Prompt:')}
                </label>
                <textarea
                  rows={3}
                  value={songTopic}
                  onChange={(e) => setSongTopic(e.target.value)}
                  placeholder={t('صف موضوع الأغنية، المشاعر والكلمات...', 'Describe song theme...')}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
                />
              </div>

              <button
                onClick={handleComposeSong}
                disabled={isComposing}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isComposing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('جاري تلحين وتأليف الأغنية...', 'Composing Song...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('تأليف كلمات ونوتات جديدة', 'Generate Song Lyrics & Chords')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: AI IMAGE GENERATOR --- */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Image Canvas & Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl flex flex-col items-center justify-center relative min-h-[420px] overflow-hidden">
              {isGeneratingImg ? (
                <div className="flex flex-col items-center gap-3 text-cyan-400 py-20">
                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold text-sm text-white animate-pulse">
                    {t('جاري رسم وتوليد الصورة بالذكاء الاصطناعي...', 'Generating High-Res Image...')}
                  </p>
                  <span className="text-xs text-slate-400 font-mono">Applying 8K render & {selectedStyle.name}</span>
                </div>
              ) : generatedImgUrl ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="relative group max-w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
                    <img
                      src={generatedImgUrl}
                      alt={imagePrompt}
                      className="max-h-[460px] object-cover rounded-xl transition-transform group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
                      <p className="text-xs text-white line-clamp-2 max-w-[75%]">{imagePrompt}</p>
                      <a
                        href={generatedImgUrl}
                        target="_blank"
                        rel="noreferrer"
                        download="opebat-generated-art.jpg"
                        className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={generatedImgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t('تحميل الصورة بجودة كاملة', 'Download Full HD')}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('اكتب وصف الصورة واضغط توليد لبدء الرسم', 'Enter prompt and generate')}</p>
                </div>
              )}
            </div>

            {/* Generated Gallery History */}
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
                {t('سجل الأعمال المولدة حديثاً', 'Recent Creations Gallery')}
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imgHistory.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setGeneratedImgUrl(url)}
                    className="cursor-pointer rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/80 transition-all hover:scale-105 aspect-square"
                  >
                    <img src={url} alt={`History ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Prompt & Styles */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {t('أمر التصميم (Prompt)', 'Image Prompt')}
              </h3>

              <textarea
                rows={4}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder={t('صف الصورة التي ترغب بتوليدها بالتفصيل...', 'Describe your image prompt...')}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              />

              {/* Styles */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t('النمط الفني (Art Style):', 'Artistic Style:')}
                </label>
                <div className="space-y-2">
                  {IMAGE_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors text-start ${
                        selectedStyle.id === style.id
                          ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{t(style.nameAr, style.name)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t('نسبة العرض إلى الارتفاع:', 'Aspect Ratio:')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 rounded-xl text-xs font-semibold font-mono border transition-colors ${
                        aspectRatio === ratio
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImg || !imagePrompt.trim()}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isGeneratingImg ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('جاري التوليد...', 'Generating...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('توليد الصورة الآن (Generate)', 'Generate Image Now')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
