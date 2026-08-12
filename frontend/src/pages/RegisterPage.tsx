import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { parseApiError } from '@/services/api';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { Loader2, Eye, EyeOff, Check } from 'lucide-react';
import Logo from '@/components/common/Logo';

/** Password requirement definition */
interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (A–Z)', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a–z)', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number (0–9)', test: (pw) => /[0-9]/.test(pw) },
];

/**
 * PasswordStrengthHint — Live checklist showing which password requirements
 * are currently satisfied. Only renders when the password field has been touched.
 */
const PasswordStrengthHint: React.FC<{ password: string; touched: boolean }> = ({
  password,
  touched,
}) => {
  if (!touched || !password) return null;

  return (
    <ul className="mt-2 space-y-1 pl-0.5" aria-label="Password requirements">
      {PASSWORD_REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <li
            key={req.label}
            className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-150 ${
              met ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
            }`}
          >
            <span
              className={`flex-shrink-0 flex items-center justify-center w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                met
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-muted-foreground/40'
              }`}
              aria-hidden="true"
            >
              {met && <Check className="w-2 h-2" strokeWidth={3} />}
            </span>
            {req.label}
          </li>
        );
      })}
    </ul>
  );
};

/**
 * PasswordMatchHint — Shows whether confirm password matches the main password.
 */
const PasswordMatchHint: React.FC<{
  password: string;
  confirmPassword: string;
  touched: boolean;
}> = ({ password, confirmPassword, touched }) => {
  if (!touched || !confirmPassword) return null;
  const matches = password === confirmPassword;
  return (
    <p
      className={`mt-1 text-[11px] font-semibold flex items-center gap-1 transition-colors duration-150 ${
        matches ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
      }`}
    >
      <span
        className={`flex-shrink-0 flex items-center justify-center w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
          matches
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-destructive/60'
        }`}
        aria-hidden="true"
      >
        {matches && <Check className="w-2 h-2" strokeWidth={3} />}
      </span>
      {matches ? 'Passwords match' : 'Passwords do not match'}
    </p>
  );
};

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedPassword = watch('password', '');
  const watchedConfirm = watch('confirmPassword', '');

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    try {
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success('Your TrackWise account has been created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setErrorMessage(msg);
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
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Start tracking your expenses with TrackWise
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
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="reg-fullname" className="block text-xs font-semibold text-foreground">
              Full Name
            </label>
            <input
              id="reg-fullname"
              type="text"
              autoComplete="name"
              disabled={isSubmitting}
              {...register('fullName')}
              placeholder="John Doe"
              className={`${inputClass} ${errors.fullName ? 'border-destructive/60 ring-destructive/30' : ''}`}
            />
            {errors.fullName && (
              <p className="text-[11px] font-semibold text-destructive" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="reg-email" className="block text-xs font-semibold text-foreground">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              {...register('email')}
              placeholder="you@example.com"
              className={`${inputClass} ${errors.email ? 'border-destructive/60 ring-destructive/30' : ''}`}
            />
            {errors.email && (
              <p className="text-[11px] font-semibold text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="reg-password" className="block text-xs font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register('password')}
                placeholder="Create a strong password"
                className={`${inputClass} pr-10 ${errors.password && touchedFields.password ? 'border-destructive/60' : ''}`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* Live password requirements checklist */}
            <PasswordStrengthHint
              password={watchedPassword}
              touched={!!touchedFields.password}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="reg-confirm" className="block text-xs font-semibold text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="reg-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register('confirmPassword')}
                placeholder="Repeat your password"
                className={`${inputClass} pr-10 ${errors.confirmPassword && touchedFields.confirmPassword ? 'border-destructive/60' : ''}`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* Password match indicator */}
            <PasswordMatchHint
              password={watchedPassword}
              confirmPassword={watchedConfirm}
              touched={!!touchedFields.confirmPassword}
            />
            {errors.confirmPassword && !touchedFields.confirmPassword && (
              <p className="text-[11px] font-semibold text-destructive" role="alert">
                {errors.confirmPassword.message}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
