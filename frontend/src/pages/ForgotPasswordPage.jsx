import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Brain, KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('email'); // 'email' | 'otp' | 'done'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef([]);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const handleRequestOTP = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setPhase('otp');
    } catch (err) {
      emailForm.setError('root', { message: err.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    if (pasted.length > 0) otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleReset = async (data) => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setOtpError('');
    try {
      await resetPassword(email, otpCode, data.newPassword);
      setPhase('done');
    } catch (err) {
      setOtpError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold gradient-text">Catalyst</span>
      </div>

      {phase === 'email' && (
        <>
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-dark/50 dark:text-surface-light/50 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-surface-light">Forgot Password?</h2>
              <p className="text-dark/50 dark:text-surface-light/50 text-sm">
                We'll send a reset code to your email
              </p>
            </div>
          </div>

          <form onSubmit={emailForm.handleSubmit(handleRequestOTP)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register('email')}
            />

            {emailForm.formState.errors.root && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm animate-slide-down">
                {emailForm.formState.errors.root.message}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              <Mail className="w-4 h-4" />
              Send Reset Code
            </Button>
          </form>
        </>
      )}

      {phase === 'otp' && (
        <>
          <button
            onClick={() => setPhase('email')}
            className="flex items-center gap-2 text-sm text-dark/50 dark:text-surface-light/50 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-surface-light">Reset Password</h2>
              <p className="text-dark/50 dark:text-surface-light/50 text-sm">
                Enter the OTP sent to <span className="font-medium text-dark dark:text-surface-light">{email}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark/70 dark:text-surface-light/70 mb-3">Enter OTP</label>
              <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200
                      bg-white dark:bg-dark-card text-dark dark:text-surface-light
                      ${digit ? 'border-primary shadow-md shadow-primary/10' : 'border-black/10 dark:border-white/10'}
                      focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                placeholder="Min. 8 characters"
                error={resetForm.formState.errors.newPassword?.message}
                {...resetForm.register('newPassword')}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                error={resetForm.formState.errors.confirmPassword?.message}
                {...resetForm.register('confirmPassword')}
              />

              {otpError && (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center animate-slide-down">
                  {otpError}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full" disabled={otp.join('').length !== 6}>
                <KeyRound className="w-4 h-4" />
                Reset Password
              </Button>
            </form>
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="text-center space-y-4 py-8">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-dark dark:text-surface-light">Password Reset!</h2>
          <p className="text-dark/50 dark:text-surface-light/50 text-sm">
            Your password has been updated successfully.
          </p>
          <Button onClick={() => navigate('/login')} className="mx-auto">
            Back to Login
          </Button>
        </div>
      )}
    </div>
  );
}
