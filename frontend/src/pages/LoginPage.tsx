import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { parseApiError } from '@/services/api';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/common/Logo';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login(data);
      toast.success('Welcome back to TrackWise!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 border border-input rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 selection:bg-primary/20">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 tw-animate-zoom-in">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo variant="auth" size={72} subtitle="Take control of your finances." />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to your TrackWise account
            </p>
          </div>
        </div>

        {/* Server-side error banner */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3 text-xs font-semibold rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center tw-animate-fade-in"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-xs font-semibold text-foreground">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              {...register('email')}
              placeholder="you@example.com"
              className={`${inputClass} ${errors.email ? 'border-destructive/60' : ''}`}
            />
            {errors.email && (
              <p className="text-[11px] font-semibold text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with show/hide toggle */}
          <div className="space-y-1">
            <label htmlFor="login-password" className="block text-xs font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={isSubmitting}
                {...register('password')}
                placeholder="••••••••"
                className={`${inputClass} pr-10 ${errors.password ? 'border-destructive/60' : ''}`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-semibold text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-xs hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline transition-colors">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
