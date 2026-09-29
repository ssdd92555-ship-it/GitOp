import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { FEATURES_MATRIX } from '../data/featuresData';
import {
  Layers,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Shield,
  BarChart3,
  Music,
  FolderGit2,
  Terminal,
  Zap,
} from 'lucide-react';

export const FeaturesDirectoryView: React.FC = () => {
  const { accent, t, setActivePage } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFeatures = FEATURES_MATRIX.filter((feat) => {
    const matchesCat = activeCategory === 'all' || feat.category === activeCategory;
    const matchesSearch =
      feat.name.toLowerCase().includes(search.toLowerCase()) ||
      feat.nameAr.includes(search) ||
      feat.description.toLowerCase().includes(search.toLowerCase()) ||
      feat.descriptionAr.includes(search);
    return matchesCat && matchesSearch;
  });

  const getCategoryPage = (cat: string) => {
    switch (cat) {
      case 'ai':
        return 'ai-chat';
      case 'media':
        return 'media-studio';
      case 'analytics':
        return 'data-analytics';
      case 'github':
        return 'projects';
      case 'cyber':
        return 'cyber';
      default:
        return 'dashboard';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            500+ Platform Capabilities
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
            <Layers className="w-6 h-6 text-cyan-400" />
            {t('دليل ومصفوفة الـ 500 ميزة البرمجية والذكية', '500+ Features & Capabilities Matrix')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('فهرس متكامل لكافة قدرات منصة OPEBAT البرمجية، محركات الذكاء الاصطناعي، الأمن السيبراني، ومستكشف الأكواد.', 'Comprehensive catalog indexing all features across AI, Developer tools, and Security.')}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute top-3 start-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث في مصفوفة الـ 500 ميزة...', 'Search 500+ features...')}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 ps-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', nameAr: 'كافة الميزات', nameEn: 'All Capabilities' },
          { id: 'ai', nameAr: 'الذكاء الاصطناعي (100)', nameEn: 'AI & LLM (100)' },
          { id: 'media', nameAr: 'استوديو الميديا والموسيقى (100)', nameEn: 'Media & Music (100)' },
          { id: 'analytics', nameAr: 'تحليل البيانات (75)', nameEn: 'Data Analytics (75)' },
          { id: 'github', nameAr: 'مستودعات جيثب والأكواد (75)', nameEn: 'GitHub & Code (75)' },
          { id: 'cyber', nameAr: 'الأمن السيبراني (50)', nameEn: 'Cybersecurity (50)' },
          { id: 'auth', nameAr: 'الحسابات ولوحة التحكم (50)', nameEn: 'Auth & Dashboard (50)' },
          { id: 'dev', nameAr: 'أدوات المطورين (50)', nameEn: 'Developer Suite (50)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t(cat.nameAr, cat.nameEn)}
          </button>
        ))}
      </div>

      {/* Matrix Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feat) => (
          <div
            key={feat.id}
            className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between shadow-lg transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-cyan-400 font-mono border border-slate-800">
                  {t(feat.categoryAr, feat.category)}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('جاهز ومفعل', 'Active & Ready')}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                {t(feat.nameAr, feat.name)}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {t(feat.descriptionAr, feat.description)}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">ID: {feat.id}</span>
              <button
                onClick={() => setActivePage(getCategoryPage(feat.category) as any)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>{t('تجربة الميزة الآن', 'Launch Feature')}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
