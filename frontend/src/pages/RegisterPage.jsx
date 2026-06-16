import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Brain, UserPlus, Mail, ArrowLeft } from 'lucide-react';

const schema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const { signupRequestOTP, signupVerifyOTP } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('form'); // 'form' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signupRequestOTP(data.email, data.password);
      setEmail(data.email);
      setPhase('otp');
    } catch (err) {
      setError('root', { message: err.message || 'Registration failed' });
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

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
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
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length > 0) {
      const focusIdx = Math.min(pasted.length, 5);
      otpRefs.current[focusIdx]?.focus();
    }
  };

  const [otpError, setOtpError] = useState('');

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setOtpError('');
    try {
      await signupVerifyOTP(email, otpCode);
      navigate('/');
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP');
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

      {phase === 'form' ? (
        <>
          <h2 className="text-2xl font-bold text-dark dark:text-surface-light mb-1">Create account</h2>
          <p className="text-dark/50 dark:text-surface-light/50 text-sm mb-8">
            Get started with Catalyst for free
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {errors.root && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm animate-slide-down">
                {errors.root.message}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-dark/50 dark:text-surface-light/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <>
          <button
            onClick={() => setPhase('form')}
            className="flex items-center gap-2 text-sm text-dark/50 dark:text-surface-light/50 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-surface-light">Verify your email</h2>
              <p className="text-dark/50 dark:text-surface-light/50 text-sm">
                We sent a 6-digit OTP to <span className="font-medium text-dark dark:text-surface-light">{email}</span>
              </p>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-dark/70 dark:text-surface-light/70 mb-3">
              Enter OTP
            </label>
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
                    ${digit
                      ? 'border-primary shadow-md shadow-primary/10'
                      : 'border-black/10 dark:border-white/10'
                    }
                    focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
                />
              ))}
            </div>

            {otpError && (
              <div className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center animate-slide-down">
                {otpError}
              </div>
            )}

            <Button
              onClick={handleVerifyOTP}
              loading={loading}
              className="w-full mt-6"
              disabled={otp.join('').length !== 6}
            >
              Verify & Create Account
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
