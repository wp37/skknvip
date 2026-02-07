import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle, XCircle, Users, Clock, UserCheck, Trash2 } from 'lucide-react';
import { getPendingPhones, getActivatedPhones, activatePhone, deactivatePhone } from '../utils/authUtils';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void;
}

const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose, onDataChange }) => {
  const [pendingPhones, setPendingPhones] = useState<string[]>([]);
  const [activatedPhones, setActivatedPhones] = useState<string[]>([]);

  // Load data on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setPendingPhones(getPendingPhones());
    setActivatedPhones(getActivatedPhones());
  };

  const handleActivate = (phone: string) => {
    activatePhone(phone);
    refreshData();
    onDataChange();
  };

  const handleDeactivate = (phone: string) => {
    if (confirm(`Ban co chac muon huy kich hoat so ${phone}?`)) {
      deactivatePhone(phone);
      refreshData();
      onDataChange();
    }
  };

  const handleRemovePending = (phone: string) => {
    if (confirm(`Ban co chac muon xoa yeu cau tu so ${phone}?`)) {
      const pending = getPendingPhones().filter(p => p !== phone);
      localStorage.setItem('skkn_pending_phones', JSON.stringify(pending));
      refreshData();
      onDataChange();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-neutral-900 w-full max-w-4xl rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-amber-500/20 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-amber-500/20 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quan ly Nguoi dung</h2>
              <p className="text-sm text-neutral-400 mt-0.5">
                Kich hoat so dien thoai de nguoi dung su dung tinh nang nang cao
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-amber-900/30 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {pendingPhones.length} cho duyet
              </span>
              <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4" />
                {activatedPhones.length} da kich hoat
              </span>
            </div>
            <button 
              onClick={onClose} 
              className="text-neutral-500 hover:text-white hover:bg-neutral-800 p-1.5 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Pending Section */}
          <div className="bg-amber-900/10 rounded-xl border border-amber-500/20 overflow-hidden">
            <div className="bg-amber-900/20 px-4 py-3 border-b border-amber-500/20 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-amber-300">Yeu cau cho duyet</h3>
              <span className="bg-amber-500 text-neutral-900 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {pendingPhones.length}
              </span>
            </div>
            
            {pendingPhones.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500">Khong co yeu cau nao dang cho duyet</p>
              </div>
            ) : (
              <div className="divide-y divide-amber-500/10">
                {pendingPhones.map((phone, index) => (
                  <div key={phone} className="px-4 py-3 flex items-center justify-between hover:bg-amber-900/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-500 text-sm font-mono w-8">{index + 1}.</span>
                      <span className="text-white font-medium">{phone}</span>
                      <span className="text-xs text-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded">
                        Dang cho
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActivate(phone)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 text-sm font-bold rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Kich hoat
                      </button>
                      <button
                        onClick={() => handleRemovePending(phone)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium rounded-lg border border-red-500/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activated Section */}
          <div className="bg-emerald-900/10 rounded-xl border border-emerald-500/20 overflow-hidden">
            <div className="bg-emerald-900/20 px-4 py-3 border-b border-emerald-500/20 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-emerald-300">Nguoi dung da kich hoat</h3>
              <span className="bg-emerald-500 text-neutral-900 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {activatedPhones.length}
              </span>
            </div>
            
            {activatedPhones.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500">Chua co nguoi dung nao duoc kich hoat</p>
              </div>
            ) : (
              <div className="divide-y divide-emerald-500/10">
                {activatedPhones.map((phone, index) => (
                  <div key={phone} className="px-4 py-3 flex items-center justify-between hover:bg-emerald-900/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-neutral-500 text-sm font-mono w-8">{index + 1}.</span>
                      <span className="text-white font-medium">{phone}</span>
                      <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Da kich hoat
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeactivate(phone)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium rounded-lg border border-red-500/30 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      Huy kich hoat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-500/20 bg-neutral-800/50 flex-shrink-0">
          <p className="text-xs text-neutral-500 text-center">
            Du lieu luu tru tai trinh duyet (localStorage). Hay sao luu dinh ky.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardModal;
