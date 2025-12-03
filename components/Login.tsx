import React from 'react';
import { Github, Mail } from 'lucide-react';
import { Button } from './Button';

export const Login: React.FC = () => {
  const handleLogin = (provider: 'github' | 'google') => {
    // In a real app, this would redirect to the backend auth endpoint
    // e.g., window.location.href = `${ApiService.getBaseUrl()}/auth/${provider}`;
    alert(`Initiating OAuth flow for ${provider}... (Mock)`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md text-center">
        <div className="mb-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to access your personalized chat history.</p>
        </div>

        <div className="space-y-4">
            <Button 
                variant="secondary" 
                className="w-full justify-center gap-3 py-3 !bg-white border border-slate-300 hover:!bg-slate-50"
                onClick={() => handleLogin('google')}
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Continue with Google
            </Button>

            <Button 
                variant="secondary" 
                className="w-full justify-center gap-3 py-3 !bg-[#24292F] !text-white hover:!bg-[#24292F]/90"
                onClick={() => handleLogin('github')}
            >
                <Github size={20} />
                Continue with GitHub
            </Button>
        </div>

        <p className="mt-8 text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};