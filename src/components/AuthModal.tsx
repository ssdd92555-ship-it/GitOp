import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    isLoading,
  } = useAuth();
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Full Stack & AI Engineer');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg(t('يرجى ملء جميع الحقول الإلزامية', 'Please fill in all required fields'));
      return;
    }

    if (authMode === 'login') {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMsg(result.error || t('فشل تسجيل الدخول، تحقق من البيانات', 'Login failed, check your credentials'));
      }
    } else {
      const result = await register(email, password, name, role);
      if (!result.success) {
        setErrorMsg(result.error || t('فشل إنشاء الحساب، يرجى المحاولة لاحقاً', 'Registration failed, please try again'));
      }
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('rluciefe@gmail.com');
    setPassword('dev_secure_pass_123');
    setAuthMode('login');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0b0f19] border border-slate-700/80 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${currentTheme.badgeBg} flex items-center justify-center`}>
              <Shield className={`w-5 h-5 ${currentTheme.textAccent}`} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {authMode === 'login' ? t('تسجيل الدخول بالبريد', 'Email Sign In') : t('إنشاء حساب مطور جديد', 'Create Developer Account')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('منصة OPEBAT لهندسة الذكاء الاصطناعي', 'OPEBAT AI Developer Workstation')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Pro Login Badge */}
        <div className="mx-6 mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between">
          <div className="text-xs text-cyan-200">
            <span className="font-semibold block">{t('حساب المطور المعتمد:', 'Authorized Developer:')}</span>
            <span className="text-slate-300 font-mono text-[11px]">rluciefe@gmail.com</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold border border-cyan-500/40 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('تعبئة سريعة', 'Auto Fill')}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('اسم المطور / العرض', 'Developer Display Name')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute top-3 start-3 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Luciefe"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 ps-9 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('المسمى الوظيفي والخبرة', 'Specialization & Role')}
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior AI Architect"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('البريد الإلكتروني', 'Email Address')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute top-3 start-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 ps-9 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('كلمة المرور', 'Password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute top-3 start-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 ps-9 pe-9 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 end-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : authMode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                {t('دخول فوري للمنصة', 'Sign In to OPEBAT')}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                {t('تأكيد وتسجيل الحساب', 'Create Account')}
              </>
            )}
          </button>

          {/* Toggle login / register */}
          <div className="text-center pt-2">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-400">
                {t('ليس لديك حساب بعد؟', "Don't have an account?")}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                  }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  {t('إنشاء حساب جديد', 'Register here')}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                  }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  {t('تسجيل الدخول', 'Log in')}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
