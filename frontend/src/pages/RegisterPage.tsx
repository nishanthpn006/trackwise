import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { parseApiError } from '@/services/api';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import Logo from '@/components/common/Logo';

// ── Password Requirements ──────────────────────────────────────────────────────
// These MUST match the backend @Pattern in RegisterRequest.java exactly.
interface PasswordRequirement {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: 'len',     label: 'At least 8 characters',        test: (pw) => pw.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)',    test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower',   label: 'One lowercase letter (a–z)',    test: (pw) => /[a-z]/.test(pw) },
  { id: 'number',  label: 'One number (0–9)',              test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'One special character (!@#$…)', test: (pw) => /[^a-zA-Z0-9]/.test(pw) },
];

/**
 * RequirementPill — Compact inline indicator for a single password requirement.
 * Uses a two-column grid on the requirements list so labels don't wrap excessively
 * on narrow viewports (375–480px).
 */
const RequirementPill: React.FC<{ label: string; met: boolean }> = ({ label, met }) => (
  <li
    className={`flex items-center gap-1.5 text-[11px] font-medium leading-snug transition-colors duration-150 ${
      met ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
    }`}
  >
    <span
      className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 ${
        met
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'border-muted-foreground/40 bg-transparent'
      }`}
      aria-hidden="true"
    >
      {met && <Check className="w-2 h-2" strokeWidth={3} />}
    </span>
    <span>{label}</span>
  </li>
);

/**
 * PasswordStrengthChecklist — Appears after the first keystroke in the password field.
 * Two-column layout ensures requirements stay readable at 375px without wrapping to 3+ lines.
 */
const PasswordStrengthChecklist: React.FC<{ password: string; visible: boolean }> = ({
  password,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="mt-2 p-2.5 rounded-xl bg-muted/50 border border-border/60">
      <ul
        className="grid grid-cols-2 gap-x-3 gap-y-1.5"
        aria-label="Password requirements"
        role="list"
      >
        {PASSWORD_REQUIREMENTS.map((req) => (
          <RequirementPill key={req.id} label={req.label} met={req.test(password)} />
        ))}
      </ul>
    </div>
  );
};

/**
 * PasswordMatchIndicator — Shown only after the user has typed in confirmPassword.
 */
const PasswordMatchIndicator: React.FC<{
  password: string;
  confirmPassword: string;
  visible: boolean;
}> = ({ password, confirmPassword, visible }) => {
  if (!visible || !confirmPassword) return null;
  const matches = password === confirmPassword;
  return (
    <p
      className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold leading-none transition-colors duration-150 ${
        matches ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
      }`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 ${
          matches ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-destructive/10 border-destructive/60'
        }`}
        aria-hidden="true"
      >
        {matches ? (
          <Check className="w-2 h-2" strokeWidth={3} />
        ) : (
          <X className="w-2 h-2 text-destructive" strokeWidth={3} />
        )}
      </span>
      {matches ? 'Passwords match' : 'Passwords do not match'}
    </p>
  );
};

// ── Shared input class ─────────────────────────────────────────────────────────
const inputBase =
  'w-full px-3 py-2.5 rounded-xl border bg-background text-foreground text-sm leading-tight placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed';

const inputNormal = `${inputBase} border-input hover:border-muted-foreground/50`;
const inputError  = `${inputBase} border-destructive/60 bg-destructive/5 focus:ring-destructive/30`;
const inputValid  = `${inputBase} border-emerald-500/60 focus:ring-emerald-500/30`;

// ── RegisterPage ───────────────────────────────────────────────────────────────
const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
  const watchedConfirm  = watch('confirmPassword', '');

  const onSubmit = async (data: RegisterFormData) => {
    if (submitted) return; // Prevent double-submit
    setSubmitted(true);
    setServerError(null);
    try {
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created! Welcome to TrackWise.');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setServerError(msg);
    } finally {
      setSubmitted(false);
    }
  };

  const getInputClass = (
    fieldName: keyof RegisterFormData,
    touched: boolean | undefined
  ) => {
    if (!touched) return inputNormal;
    if (errors[fieldName]) return inputError;
    return inputValid;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-[420px] space-y-5">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Logo variant="auth" size={60} subtitle="" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Start tracking your finances with TrackWise</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/70 rounded-2xl shadow-md p-5 sm:p-6 space-y-4">
          {/* Server error banner */}
          {serverError && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-2 p-3 rounded-xl bg-destructive/8 border border-destructive/25 text-destructive"
            >
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-snug">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
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
                placeholder="Jane Doe"
                {...register('fullName')}
                className={getInputClass('fullName', touchedFields.fullName)}
                aria-describedby={errors.fullName ? 'reg-fullname-err' : undefined}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && touchedFields.fullName && (
                <p id="reg-fullname-err" className="text-[11px] font-medium text-destructive" role="alert">
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
                placeholder="you@example.com"
                {...register('email')}
                className={getInputClass('email', touchedFields.email)}
                aria-describedby={errors.email ? 'reg-email-err' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && touchedFields.email && (
                <p id="reg-email-err" className="text-[11px] font-medium text-destructive" role="alert">
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
                  placeholder="Create a strong password"
                  {...register('password')}
                  className={`${getInputClass('password', touchedFields.password)} pr-10`}
                  aria-describedby="reg-pw-requirements"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Live password requirements checklist */}
              <div id="reg-pw-requirements">
                <PasswordStrengthChecklist
                  password={watchedPassword}
                  visible={!!touchedFields.password || watchedPassword.length > 0}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="reg-confirm" className="block text-xs font-semibold text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  placeholder="Repeat your password"
                  {...register('confirmPassword')}
                  className={`${getInputClass('confirmPassword', touchedFields.confirmPassword)} pr-10`}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5 rounded"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password match indicator */}
              <PasswordMatchIndicator
                password={watchedPassword}
                confirmPassword={watchedConfirm}
                visible={!!touchedFields.confirmPassword}
              />

              {/* Zod mismatch error (shown only when match indicator isn't showing it) */}
              {errors.confirmPassword && !touchedFields.confirmPassword && (
                <p className="text-[11px] font-medium text-destructive" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || submitted}
              aria-disabled={isSubmitting || submitted}
              className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] ${
                isSubmitting || submitted
                  ? 'bg-primary/70 text-primary-foreground/70 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
              }`}
            >
              {isSubmitting || submitted ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Creating account…</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
