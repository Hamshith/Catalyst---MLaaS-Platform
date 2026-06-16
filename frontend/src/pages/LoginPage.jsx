import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Brain, LogIn } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError('root', { message: err.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold gradient-text">Catalyst</span>
      </div>

      <h2 className="text-2xl font-bold text-dark dark:text-surface-light mb-1">Welcome back</h2>
      <p className="text-dark/50 dark:text-surface-light/50 text-sm mb-8">
        Sign in to your account to continue
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
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {errors.root && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm animate-slide-down">
            {errors.root.message}
          </div>
        )}

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-dark/50 dark:text-surface-light/50 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
