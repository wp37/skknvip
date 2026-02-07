import React, { useState } from 'react';
import { X, Lock, AlertTriangle, Loader2 } from 'lucide-react';
import { validateAdminCredentials, loginAdmin } from '../utils/authUtils';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (validateAdminCredentials(username, password)) {
      loginAdmin();
      onLoginSuccess();
      // Reset form
      setUsername('');
      setPassword('');
    } else {
      setError('Ten dang nhap hoac mat khau khong dung');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-amber-500/20">
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
              <Lock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dang nhap Quan tri</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Nhap thong tin dang nhap cua ban</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="text-neutral-500 hover:text-white hover:bg-neutral-800 p-1.5 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="text-sm font-semibold text-amber-300 mb-2 block">
              Ten dang nhap
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Nhap ten dang nhap..." 
              className="w-full border border-neutral-600 bg-neutral-800 rounded-xl p-3.5 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-white text-sm placeholder:text-neutral-500" 
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-semibold text-amber-300 mb-2 block">
              Mat khau
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Nhap mat khau..." 
              className="w-full border border-neutral-600 bg-neutral-800 rounded-xl p-3.5 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-white text-sm placeholder:text-neutral-500" 
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-xl transition-colors"
              disabled={isLoading}
            >
              Huy
            </button>
            <button 
              type="submit"
              disabled={isLoading || !username || !password}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-900 text-sm font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dang xu ly...
                </>
              ) : (
                'Dang nhap'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
