import { Outlet } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-surface-light dark:bg-dark transition-colors duration-300">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Catalyst</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4 leading-tight">
            Build. Train. Predict.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Your ML platform for effortless model training and deployment.
            Upload your data, choose your model, and let Catalyst handle the rest.
          </p>
          <div className="mt-12 flex gap-6">
            {['10+ Models', 'Auto Preprocessing', 'AI Recommendations'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
