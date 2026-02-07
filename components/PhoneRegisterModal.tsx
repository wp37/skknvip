import React, { useState } from 'react';
import { X, Phone, CheckCircle, AlertTriangle, Loader2, Clock } from 'lucide-react';
import { registerPhone, getCurrentUserPhone, isPhonePending, isPhoneActivated } from '../utils/authUtils';

interface PhoneRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (phone: string) => void;
}

const PhoneRegisterModal: React.FC<PhoneRegisterModalProps> = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user already has a pending registration
  const existingPhone = getCurrentUserPhone();
  const isPending = existingPhone ? isPhonePending(existingPhone) : false;
  const isActivated = existingPhone ? isPhoneActivated(existingPhone) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = registerPhone(phone.trim());
    
    if (result.success) {
      setIsSubmitted(true);
      onRegisterSuccess(phone.trim());
    } else {
      setError(result.error || 'Co loi xay ra');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setPhone('');
    setError(null);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  // Show waiting status if user already registered
  if (isPending && !isSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in font-sans">
        <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-amber-500/20">
          <div className="p-8 text-center">
            <div className="bg-amber-500/20 p-4 rounded-full inline-block mb-4 border border-amber-500/30">
              <Clock className="h-10 w-10 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Dang cho duyet</h2>
            <p className="text-neutral-400 mb-2">
              So dien thoai <span className="text-amber-400 font-bold">{existingPhone}</span> dang cho quan tri vien kich hoat.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Vui long lien he quan tri vien de duoc kich hoat nhanh hon.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30"
            >
              Da hieu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success screen after registration
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in font-sans">
        <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-emerald-500/30">
          <div className="p-8 text-center">
            <div className="bg-emerald-500/20 p-4 rounded-full inline-block mb-4 border border-emerald-500/30">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Dang ky thanh cong!</h2>
            <p className="text-neutral-400 mb-2">
              Yeu cau cua ban da duoc gui den quan tri vien.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              So dien thoai: <span className="text-emerald-400 font-bold">{phone}</span>
              <br />
              Vui long cho duyet de su dung tinh nang nang cao.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-neutral-900 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30"
            >
              Dong
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-amber-500/20">
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
              <Phone className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dang ky su dung</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Nhap so dien thoai de kich hoat tinh nang</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Box */}
          <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
            <p className="text-sm text-amber-200">
              Tinh nang <strong>"Phan tich ten de tai"</strong> va <strong>"Tham dinh toan bo"</strong> yeu cau dang ky. 
              Quan tri vien se kich hoat sau khi xac nhan.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Phone Input */}
          <div>
            <label className="text-sm font-semibold text-amber-300 mb-2 block">
              So dien thoai <span className="text-red-400">*</span>
            </label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="0xxx xxx xxx" 
              className="w-full border border-neutral-600 bg-neutral-800 rounded-xl p-3.5 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-white text-sm placeholder:text-neutral-500" 
              autoComplete="tel"
              disabled={isLoading}
            />
            <p className="text-xs text-neutral-500 mt-2">
              Nhap so dien thoai Viet Nam (10-11 so, bat dau bang 0)
            </p>
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
              disabled={isLoading || !phone.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-900 text-sm font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dang gui...
                </>
              ) : (
                'Gui yeu cau kich hoat'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneRegisterModal;
