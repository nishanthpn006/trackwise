import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { parseApiError } from '@/services/api';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 selection:bg-primary/20">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome Back</h1>
          <p className="text-xs text-muted-foreground">Sign in to your TrackWise account</p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3 text-xs font-semibold rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-xs font-bold text-foreground">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              disabled={isSubmitting}
              {...register('email')}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-input rounded-xl bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50"
            />
            {errors.email && (
              <p className="text-[11px] font-semibold text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="login-password" className="block text-xs font-bold text-foreground">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              disabled={isSubmitting}
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-input rounded-xl bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50"
            />
            {errors.password && (
              <p className="text-[11px] font-semibold text-destructive">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
