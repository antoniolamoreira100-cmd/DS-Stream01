import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

type AuthMode = 'login' | 'register' | 'forgot';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

const forgotSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ForgotForm = z.infer<typeof forgotSchema>;

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const loadUserProfiles = useAppStore((s) => s.loadUserProfiles);
  const setProfiles = useAppStore((s) => s.setProfiles);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const forgotForm = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    console.log('login authData:', authData, 'login error:', error);

    if (error) {
      toast.error(error.message || 'Erro ao entrar. Verifique suas credenciais.');
      setLoading(false);
      return;
    }

    const authUser = authData.user;
    if (!authUser) {
      toast.error('Não foi possível autenticar o usuário.');
      setLoading(false);
      return;
    }

    const user = {
      id: authUser.id,
      email: authUser.email ?? '',
      nome: (authUser.user_metadata as Record<string, unknown>)?.nome as string || authUser.email || 'Usuário',
    };

    login(user);
    await loadUserProfiles(user.id);
    toast.success('Bem-vindo ao DS Stream!');
    navigate('/select-profile');
    setLoading(false);
  };

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nome: data.name,
        },
      },
    });
    console.log('register authData:', authData, 'register error:', error);

    if (error) {
      toast.error(error.message || 'Erro ao criar conta.');
      setLoading(false);
      return;
    }

    const authUser = authData.user;
    if (!authUser) {
      toast.success('Cadastro iniciado. Verifique o e-mail para confirmar sua conta.');
      setLoading(false);
      return;
    }

    const user = {
      id: authUser.id,
      email: authUser.email ?? '',
      nome: data.name,
    };

    login(user);

    const profileInsert = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        nome: data.name,
        avatar_url: null,
        is_kids: false,
        pin: null,
        idioma_audio: 'pt-BR',
        idioma_legenda: 'pt-BR',
        qualidade: 'auto',
      } as any)
      .select('*')
      .single();

    console.log('profile insert authData:', profileInsert.data, 'profile error:', profileInsert.error);
    if (profileInsert.error) {
      toast.error('Conta criada, mas falha ao gerar perfil.');
      setLoading(false);
      return;
    }

    if ((profileInsert as any).data) {
      setProfiles([(profileInsert as any).data]);
    }

    toast.success('Conta criada! Verifique seu e-mail.');
    navigate('/select-profile');
    setLoading(false);
  };

  const handleForgot = async (data: ForgotForm) => {
    setLoading(true);
    const { data: resetData, error } = await supabase.auth.resetPasswordForEmail(data.email);
    console.log('forgot resetData:', resetData, 'forgot error:', error);

    if (error) {
      toast.error(error.message || 'Erro ao solicitar redefinição de senha.');
      setLoading(false);
      return;
    }

    toast.success('Link de redefinição enviado para seu e-mail!');
    setMode('login');
    setLoading(false);
  };

  const InputField = ({
    label, icon: Icon, type = 'text', error, placeholder, showToggle, onToggle, ...props
  }: {
    label: string;
    icon: React.ElementType;
    type?: string;
    error?: string;
    placeholder?: string;
    showToggle?: boolean;
    onToggle?: () => void;
    [key: string]: unknown;
  }) => (
    <div className="space-y-1.5">
      <label className="text-white/70 text-sm font-medium">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon size={16} className="text-white/40" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} 
                     rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/30 text-sm
                     focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all`}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
          >
            {type === 'password' ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/7991501/pexels-photo-7991501.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-red-800/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <span className="text-white font-black text-base">DS</span>
            </div>
            <span className="text-white font-black text-2xl">
              DS<span className="text-red-500">Stream</span>
            </span>
          </div>
          <p className="text-white/40 text-sm">Filmes, séries e originais exclusivos</p>
        </motion.div>

        {/* Card */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-6">
            {mode !== 'login' && (
              <button
                onClick={() => setMode('login')}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-4 transition-colors"
              >
                <ArrowLeft size={14} /> Voltar
              </button>
            )}
            <h2 className="text-white font-bold text-xl">
              {mode === 'login' && 'Entrar na conta'}
              {mode === 'register' && 'Criar conta'}
              {mode === 'forgot' && 'Redefinir senha'}
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {mode === 'login' && 'Bem-vindo de volta!'}
              {mode === 'register' && 'Crie sua conta gratuitamente'}
              {mode === 'forgot' && 'Enviaremos um link para seu e-mail'}
            </p>
          </div>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <InputField
                  label="E-mail"
                  icon={Mail}
                  type="email"
                  placeholder="seu@email.com"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />
                <InputField
                  label="Senha"
                  icon={Lock}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={loginForm.formState.errors.password?.message}
                  showToggle
                  onToggle={() => setShowPass(!showPass)}
                  {...loginForm.register('password')}
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Entrar'}
                </button>
                <p className="text-center text-white/40 text-sm">
                  Não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Cadastre-se
                  </button>
                </p>
              </motion.form>
            )}

            {mode === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                <InputField
                  label="Nome completo"
                  icon={User}
                  type="text"
                  placeholder="Seu nome"
                  error={registerForm.formState.errors.name?.message}
                  {...registerForm.register('name')}
                />
                <InputField
                  label="E-mail"
                  icon={Mail}
                  type="email"
                  placeholder="seu@email.com"
                  error={registerForm.formState.errors.email?.message}
                  {...registerForm.register('email')}
                />
                <InputField
                  label="Senha"
                  icon={Lock}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={registerForm.formState.errors.password?.message}
                  showToggle
                  onToggle={() => setShowPass(!showPass)}
                  {...registerForm.register('password')}
                />
                <InputField
                  label="Confirmar senha"
                  icon={Lock}
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={registerForm.formState.errors.confirmPassword?.message}
                  showToggle
                  onToggle={() => setShowConfirmPass(!showConfirmPass)}
                  {...registerForm.register('confirmPassword')}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all
                             disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Criar conta'}
                </button>
              </motion.form>
            )}

            {mode === 'forgot' && (
              <motion.form
                key="forgot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={forgotForm.handleSubmit(handleForgot)}
                className="space-y-4"
              >
                <InputField
                  label="E-mail cadastrado"
                  icon={Mail}
                  type="email"
                  placeholder="seu@email.com"
                  error={forgotForm.formState.errors.email?.message}
                  {...forgotForm.register('email')}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all
                             disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Enviar link'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
