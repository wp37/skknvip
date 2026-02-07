import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, Upload, FileText, X, Zap, PenTool, Phone, Facebook, Award, BookOpen, Target, Lightbulb, History, Settings, Users, LogOut, Shield, Check, Trash2, Lock, ShieldCheck, AlertTriangle, Wrench } from 'lucide-react';
import { generateContent, getSelectedModelId } from './services/geminiService';
import {
  SYSTEM_API_KEY,
  EVALUATOR_SYSTEM_INSTRUCTION,
  EVALUATION_PROMPT,
  PLAGIARISM_CHECK_PROMPT,
  SYSTEM_INSTRUCTION,
  OUTLINE_PROMPT,
  PART_1_PROMPT,
  PART_2_3_PROMPT
} from './constants';
import {
  validateAdminCredentials,
  isAdmin,
  loginAdmin,
  logoutAdmin,
  getPendingRegistrations,
  getActivatedRegistrations,
  activateUser,
  deactivateUser,
  registerUser,
  canAccessFeature,
  getCurrentUserPhone,
  getCurrentUserName,
  isUserActivated,
  isPhonePending,
  BANK_INFO,
  UserRegistration
} from './utils/authUtils';
import { FormData, Settings as SettingsType, GenerationStep, UploadedFile, AppMode } from './types';
import * as mammoth from 'mammoth';

// Import components
import GeneratorForm from './components/GeneratorForm';
import EvaluatorForm from './components/EvaluatorForm';
import ResultView from './components/ResultView';

const GRADE_LEVELS = ['Tiểu học', 'THCS', 'THPT', 'Mầm non', 'Đại học/Cao đẳng'];
const AWARD_GOALS = ['Cấp Trường', 'Cấp Huyện / Quận', 'Cấp Tỉnh / Thành phố', 'Cấp Quốc gia'];
const QUICK_SUGGESTIONS = [
  'XU HƯỚNG 2025',
  'Chuyển đổi số',
  'Tư duy phản biện',
  'Bản đồ tư duy (Mindmap)',
  'Trí tuệ nhân tạo (AI)',
];

const APP_VERSION = 'v2.0';

const App: React.FC = () => {
  // === MODE STATE ===
  const [appMode, setAppMode] = useState<AppMode>('generator');

  // === ORIGINAL STATES (Thẩm định tên đề tài) ===
  const [title, setTitle] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Tiểu học');
  const [subject, setSubject] = useState('');
  const [awardGoal, setAwardGoal] = useState('Cấp Huyện / Quận');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedContent, setPastedContent] = useState('');

  // === GENERATOR STATES ===
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subject: 'Ngữ văn',
    bookSet: 'Kết nối tri thức với cuộc sống',
    grade: '',
    situation: '',
    solution: '',
    specificLessons: '',
  });
  const [generatorFiles, setGeneratorFiles] = useState<UploadedFile[]>([]);
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [progressMsg, setProgressMsg] = useState<string>('');

  // === EVALUATOR STATES ===
  const [evaluatorFiles, setEvaluatorFiles] = useState<UploadedFile[]>([]);

  // Modal states
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  // Admin states
  const [adminLoggedIn, setAdminLoggedIn] = useState(isAdmin());
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [pendingRegistrations, setPendingRegistrations] = useState<UserRegistration[]>([]);
  const [activatedRegistrations, setActivatedRegistrations] = useState<UserRegistration[]>([]);

  // User Registration states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [userActivated, setUserActivated] = useState(canAccessFeature());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<SettingsType>({
    model: 'gemini-2.5-flash-preview-09-2025',
    apiKey: SYSTEM_API_KEY || '',
    customModel: ''
  });

  // Load phone lists when admin panel opens
  useEffect(() => {
    if (showAdminPanel && adminLoggedIn) {
      setPendingRegistrations(getPendingRegistrations());
      setActivatedRegistrations(getActivatedRegistrations());
    }
  }, [showAdminPanel, adminLoggedIn]);

  // Check user activation status
  useEffect(() => {
    setUserActivated(canAccessFeature());
  }, [adminLoggedIn]);

  // Handle admin login
  const handleAdminLogin = () => {
    if (validateAdminCredentials(adminUsername, adminPassword)) {
      loginAdmin();
      setAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setShowAdminPanel(true);
      setAdminUsername('');
      setAdminPassword('');
      setAdminLoginError('');
    } else {
      setAdminLoginError('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminLoggedIn(false);
    setShowAdminPanel(false);
  };

  // Handle activate user
  const handleActivateUser = (phone: string) => {
    activateUser(phone);
    setPendingRegistrations(getPendingRegistrations());
    setActivatedRegistrations(getActivatedRegistrations());
  };

  // Handle deactivate user
  const handleDeactivateUser = (phone: string) => {
    deactivateUser(phone);
    setActivatedRegistrations(getActivatedRegistrations());
  };

  // Handle user registration with full name
  const handleRegisterUser = () => {
    const res = registerUser(phoneInput, fullNameInput);
    if (res.success) {
      setRegisterSuccess(true);
      setRegisterError('');
      setPhoneInput('');
      setFullNameInput('');
    } else {
      setRegisterError(res.error || 'Có lỗi xảy ra');
      setRegisterSuccess(false);
    }
  };

  // === FILE PROCESSING ===
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.includes(',') ? res.split(',')[1] : res);
      };
      reader.onerror = () => reject(new Error("Lỗi đọc file"));
      reader.readAsDataURL(file);
    });
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error("Lỗi đọc file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Lỗi đọc file"));
      reader.readAsText(file);
    });
  };

  const processFile = async (file: File): Promise<UploadedFile | null> => {
    const fileName = file.name.toLowerCase();
    if (file.size > 10 * 1024 * 1024) {
      alert(`File quá lớn (Max 10MB)`);
      return null;
    }
    try {
      if (fileName.endsWith('.pdf')) {
        const base64 = await readFileAsBase64(file);
        return { name: file.name, type: 'pdf', content: base64, mimeType: 'application/pdf' };
      } else if (fileName.endsWith('.docx')) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        let extractRawTextFn = mammoth.extractRawText;
        // @ts-ignore
        if (!extractRawTextFn && mammoth.default?.extractRawText) {
          // @ts-ignore
          extractRawTextFn = mammoth.default.extractRawText;
        }
        const res = await extractRawTextFn({ arrayBuffer });
        return { name: file.name, type: 'docx', content: res.value, mimeType: 'text/plain' };
      } else if (fileName.endsWith('.txt')) {
        const text = await readFileAsText(file);
        return { name: file.name, type: 'txt', content: text, mimeType: 'text/plain' };
      }
    } catch (e: any) {
      alert(`Lỗi đọc file: ${e.message}`);
    }
    return null;
  };

  const processFiles = async (fileList: FileList): Promise<UploadedFile[]> => {
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = await processFile(fileList[i]);
      if (file) newFiles.push(file);
    }
    return newFiles;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = await processFile(e.target.files[0]);
      if (file) setUploadedFile(file);
    }
  };

  const handleGeneratorFilesSelected = async (fileList: FileList) => {
    const files = await processFiles(fileList);
    setGeneratorFiles(prev => [...prev, ...files]);
  };

  const handleEvaluatorFilesSelected = async (fileList: FileList) => {
    const files = await processFiles(fileList);
    if (files.length > 0) {
      setEvaluatorFiles([files[files.length - 1]]);
    }
  };

  // === ERROR HANDLER ===
  const handleError = (err: any) => {
    setStep(GenerationStep.ERROR);
    let finalErrorMsg = err.message || "Có lỗi xảy ra.";
    const activeKey = settings.apiKey || SYSTEM_API_KEY;
    if (SYSTEM_API_KEY && activeKey === SYSTEM_API_KEY) {
      finalErrorMsg = `⚠️ Key hệ thống gặp sự cố. Vui lòng nhập API KEY CÁ NHÂN.\n(Chi tiết: ${err.message})`;
    }
    setError(finalErrorMsg);
  };

  // === GENERATOR LOGIC ===
  const handleGenerate = useCallback(async () => {
    if (!formData.title) return;
    const activeKey = settings.apiKey || SYSTEM_API_KEY;
    if (!activeKey) { setShowApiKeyModal(true); setError("Vui lòng nhập API Key."); return; }

    setStep(GenerationStep.GENERATING_OUTLINE);
    setError(null);
    setResult('');

    try {
      const modelId = getSelectedModelId(settings);

      // BƯỚC 1: LẬP DÀN Ý
      setProgressMsg('Đang lập dàn ý chi tiết...');
      const outlinePrompt = OUTLINE_PROMPT(formData);
      const outline = await generateContent(modelId, outlinePrompt, activeKey, SYSTEM_INSTRUCTION);
      setResult(`### DÀN Ý DỰ KIẾN...\n\n${outline}\n\n---\n\n`);

      // BƯỚC 2: VIẾT PHẦN 1 & 2
      setStep(GenerationStep.GENERATING_PART_1);
      setProgressMsg('Đang viết Phần I & II (Thực trạng)...');
      const part1Prompt = PART_1_PROMPT(outline);
      const part1 = await generateContent(modelId, part1Prompt, activeKey, SYSTEM_INSTRUCTION);
      const documentTitle = `# ${formData.title.toUpperCase()}\n\n`;
      setResult(documentTitle + part1 + "\n\n");

      // BƯỚC 3: VIẾT PHẦN 3 & KẾT LUẬN
      setStep(GenerationStep.GENERATING_PART_2_3);
      setProgressMsg(`Đang viết Giải pháp & Kết luận...`);

      let textFromFile = "";
      const pdfParts: any[] = [];
      generatorFiles.forEach(file => {
        if (file.type === 'pdf') {
          pdfParts.push({ inlineData: { mimeType: file.mimeType, data: file.content } });
        } else {
          textFromFile += `\n\n--- FILE: ${file.name} ---\n${file.content}\n`;
        }
      });

      const specificLessonsContext = formData.specificLessons + textFromFile;
      const part23PromptText = PART_2_3_PROMPT(outline, part1, specificLessonsContext);
      const finalParts = [{ text: part23PromptText }, ...pdfParts];
      const part23 = await generateContent(modelId, finalParts, activeKey, SYSTEM_INSTRUCTION);

      setResult((prev) => prev + `${part23}`);
      setStep(GenerationStep.COMPLETED);
      setProgressMsg('');

    } catch (err: any) {
      handleError(err);
    }
  }, [formData, settings, generatorFiles]);

  // === EVALUATOR LOGIC ===
  const handleEvaluate = useCallback(async () => {
    if (evaluatorFiles.length === 0) return;
    const activeKey = settings.apiKey || SYSTEM_API_KEY;
    if (!activeKey) { setShowApiKeyModal(true); setError("Vui lòng nhập API Key."); return; }

    setStep(GenerationStep.EVALUATING);
    setError(null);
    setResult('');
    setProgressMsg('Đang phân tích SKKN để chấm điểm...');

    try {
      const modelId = getSelectedModelId(settings);
      const file = evaluatorFiles[0];
      const contentParts: any[] = [];

      if (file.type === 'pdf') {
        contentParts.push({ inlineData: { mimeType: file.mimeType, data: file.content } });
        contentParts.push({ text: EVALUATION_PROMPT });
      } else {
        const promptWithContent = `NỘI DUNG SKKN CẦN CHẤM:\n"""\n${file.content}\n"""\n\n${EVALUATION_PROMPT}`;
        contentParts.push({ text: promptWithContent });
      }

      const evaluationResult = await generateContent(modelId, contentParts, activeKey, EVALUATOR_SYSTEM_INSTRUCTION);
      setResult(evaluationResult);
      setStep(GenerationStep.COMPLETED);
      setProgressMsg('');

    } catch (err: any) {
      handleError(err);
    }
  }, [evaluatorFiles, settings]);

  // === PLAGIARISM CHECK ===
  const handleCheckPlagiarism = useCallback(async () => {
    if (evaluatorFiles.length === 0) return;
    const activeKey = settings.apiKey || SYSTEM_API_KEY;
    if (!activeKey) { setShowApiKeyModal(true); setError("Vui lòng nhập API Key."); return; }

    setStep(GenerationStep.CHECKING_PLAGIARISM);
    setError(null);
    setResult('');
    setProgressMsg('AI đang phát hiện đạo văn & sao chép...');

    try {
      const modelId = getSelectedModelId(settings);
      const file = evaluatorFiles[0];
      const contentParts: any[] = [];

      if (file.type === 'pdf') {
        contentParts.push({ inlineData: { mimeType: file.mimeType, data: file.content } });
        contentParts.push({ text: PLAGIARISM_CHECK_PROMPT });
      } else {
        const promptWithContent = `NỘI DUNG SKKN KIỂM TRA:\n"""\n${file.content}\n"""\n\n${PLAGIARISM_CHECK_PROMPT}`;
        contentParts.push({ text: promptWithContent });
      }

      const checkResult = await generateContent(modelId, contentParts, activeKey, EVALUATOR_SYSTEM_INSTRUCTION);
      setResult(checkResult);
      setStep(GenerationStep.COMPLETED);
      setProgressMsg('');

    } catch (err: any) {
      handleError(err);
    }
  }, [evaluatorFiles, settings]);

  // === TITLE ANALYSIS (Original feature) ===
  const handleAnalyzeTitle = useCallback(async () => {
    if (!title.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult('');

    const prompt = `Phân tích tên đề tài SKKN sau và đưa ra đánh giá chi tiết:
    
TÊN ĐỀ TÀI: "${title}"
CẤP HỌC: ${gradeLevel}
MÔN HỌC: ${subject || 'Chưa xác định'}
MỤC TIÊU: ${awardGoal}

Hãy phân tích:
1. Điểm mạnh của tên đề tài
2. Điểm cần cải thiện  
3. Gợi ý tên đề tài thay thế (3-5 gợi ý)
4. Đánh giá khả năng đạt giải ${awardGoal}`;

    try {
      const modelId = getSelectedModelId(settings);
      const apiKey = settings.apiKey || SYSTEM_API_KEY;
      const response = await generateContent(modelId, prompt, apiKey, EVALUATOR_SYSTEM_INSTRUCTION);
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [title, gradeLevel, subject, awardGoal, settings]);

  const handleFullAppraisal = useCallback(async () => {
    if (!uploadedFile && !pastedContent.trim()) {
      alert('Vui lòng tải file hoặc nhập nội dung SKKN');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult('');

    try {
      const modelId = getSelectedModelId(settings);
      const apiKey = settings.apiKey || SYSTEM_API_KEY;
      const contentParts: any[] = [];

      if (uploadedFile) {
        if (uploadedFile.type === 'pdf') {
          contentParts.push({ inlineData: { mimeType: uploadedFile.mimeType, data: uploadedFile.content } });
          contentParts.push({ text: EVALUATION_PROMPT });
        } else {
          contentParts.push({ text: `NỘI DUNG SKKN:\n"""\n${uploadedFile.content}\n"""\n\n${EVALUATION_PROMPT}` });
        }
      } else {
        contentParts.push({ text: `NỘI DUNG SKKN:\n"""\n${pastedContent}\n"""\n\n${EVALUATION_PROMPT}` });
      }

      const response = await generateContent(modelId, contentParts, apiKey, EVALUATOR_SYSTEM_INSTRUCTION);
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedFile, pastedContent, settings]);

  // Reset states when changing mode
  const handleModeChange = (newMode: AppMode) => {
    setAppMode(newMode);
    setResult('');
    setError(null);
    setStep(GenerationStep.IDLE);
    setProgressMsg('');
  };

  const isProcessing = step !== GenerationStep.IDLE && step !== GenerationStep.COMPLETED && step !== GenerationStep.ERROR;

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white font-sans">
      {/* Navigation Bar */}
      <nav className="bg-[#0d0d1a] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-amber-400" />
            <span className="text-lg font-bold text-white hidden md:inline">SKKN AI Pro</span>
          </div>

          {/* Right: Navigation Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <History size={16} />
              <span className="hidden sm:inline">Lịch sử</span>
            </button>

            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a2e] hover:bg-[#2a2a3e] border border-gray-700 rounded-lg text-gray-300 transition-colors text-sm"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Nhập API Key</span>
            </button>

            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">
              {APP_VERSION}
            </span>

            {/* Admin Button */}
            <button
              onClick={() => adminLoggedIn ? setShowAdminPanel(true) : setShowAdminLoginModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors text-sm ${adminLoggedIn ? 'text-amber-400 bg-amber-500/10 rounded-lg' : 'text-gray-400 hover:text-amber-400'}`}
            >
              {adminLoggedIn ? <Shield size={16} /> : <Users size={16} />}
              <span className="hidden sm:inline">{adminLoggedIn ? 'Admin' : 'Quản lý'}</span>
            </button>

            {adminLoggedIn && (
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Header Title */}
      <header className="py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-white">Hệ Thống Thẩm Định SKKN </span>
          <span className="text-amber-400">AI Pro</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Trợ lý ảo phân tích, soạn thảo và chấm điểm SKKN chuẩn Bộ GD&ĐT
        </p>
      </header>

      {/* Mode Switcher Tabs */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="p-1 bg-[#1a1a2e] rounded-xl flex shadow-inner border border-gray-800">
          <button
            onClick={() => handleModeChange('generator')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${appMode === 'generator' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <PenTool size={16} /> Soạn thảo SKKN
          </button>
          <button
            onClick={() => handleModeChange('evaluator')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${appMode === 'evaluator' ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <ShieldCheck size={16} /> Chấm điểm AI
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings size={24} className="text-amber-400" />
                Thiết lập Model & API Key
              </h3>
              <button onClick={() => setShowApiKeyModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Chọn Model AI</label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, model: 'gemini-2.0-flash-exp' }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${settings.model === 'gemini-2.0-flash-exp' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-500 bg-[#0d0d1a]'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-amber-400" />
                        <span className="font-bold text-white">Flash Mode</span>
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Mặc định</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">gemini-2.0-flash-exp • Nhanh, tiết kiệm quota</p>
                    </div>
                    {settings.model === 'gemini-2.0-flash-exp' && <Check size={20} className="text-amber-400" />}
                  </div>
                </button>

                <button
                  onClick={() => setSettings(prev => ({ ...prev, model: 'gemini-1.5-pro' }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${settings.model === 'gemini-1.5-pro' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-gray-500 bg-[#0d0d1a]'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-purple-400" />
                        <span className="font-bold text-white">Pro Mode</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">Chất lượng cao</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">gemini-1.5-pro • Phân tích sâu, chính xác hơn</p>
                    </div>
                    {settings.model === 'gemini-1.5-pro' && <Check size={20} className="text-purple-400" />}
                  </div>
                </button>
              </div>
            </div>

            {/* API Key Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="Nhập API Key của bạn..."
                className="w-full px-4 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
              />
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <Sparkles size={14} />
                Lấy API key miễn phí để sử dụng app →
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (customApiKey) {
                    setSettings(prev => ({ ...prev, apiKey: customApiKey }));
                  }
                  setShowApiKeyModal(false);
                  if (!canAccessFeature()) {
                    setShowRegisterModal(true);
                    setRegisterSuccess(false);
                    setRegisterError('');
                  }
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-bold transition-colors"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History size={20} className="text-amber-400" />
                Lịch sử thẩm định
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="text-center text-gray-500 py-8">
              <History size={48} className="mx-auto mb-3 opacity-50" />
              <p>Chưa có lịch sử thẩm định</p>
              <p className="text-xs mt-1">Các kết quả phân tích sẽ được lưu tại đây</p>
            </div>
          </div>
        </div>
      )}

      {/* User Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Đăng ký sử dụng</h3>
                  <p className="text-gray-500 text-sm">Nhập số điện thoại để kích hoạt tính năng</p>
                </div>
              </div>
              <button onClick={() => { setShowRegisterModal(false); setRegisterError(''); setRegisterSuccess(false); }} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-amber-900/30 border border-amber-500/30 rounded-xl">
              <p className="text-amber-200 text-sm">
                Tính năng <strong>"Soạn thảo SKKN"</strong> và <strong>"Chấm điểm AI"</strong> yêu cầu đăng ký. Quản trị viên sẽ kích hoạt sau khi xác nhận.
              </p>
            </div>

            {registerSuccess && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3">
                <Check size={20} />
                <div>
                  <p className="font-medium">Đăng ký thành công!</p>
                  <p className="text-sm text-green-400/80">Vui lòng chờ quản trị viên kích hoạt.</p>
                </div>
              </div>
            )}

            {registerError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {registerError}
              </div>
            )}

            {!registerSuccess && (
              <>
                <div className="mb-4">
                  <label className="block text-sm text-amber-400 mb-2">Số điện thoại <span className="text-red-400">*</span></label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="0xxx xxx xxx"
                    className="w-full px-4 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none font-mono text-lg"
                  />
                  <p className="text-gray-500 text-xs mt-2">Nhập số điện thoại Việt Nam (10-11 số, bắt đầu bằng 0)</p>
                </div>

                <div className="mb-4 p-4 bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl">
                  <p className="text-center text-white font-medium mb-3">Phí kích hoạt: <span className="text-amber-400 font-bold">100.000đ</span></p>

                  <div className="bg-white rounded-xl p-3 mb-3">
                    <img
                      src="https://img.vietqr.io/image/agribank-7110215003073-compact2.png?amount=100000&addInfo=SKKN%20AI%20Pro&accountName=VO%20NGOC%20TUNG"
                      alt="QR Thanh toán Agribank"
                      className="w-full max-w-[200px] mx-auto"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-red-400 font-bold text-sm">🏦 AGRIBANK</p>
                    <p className="text-white font-mono text-lg font-bold">7110215003073</p>
                    <p className="text-gray-300 font-medium">VÕ NGỌC TÙNG</p>
                    <p className="text-gray-500 text-xs mt-2">Nội dung CK: <span className="text-amber-400">SĐT đăng ký + SKKN</span></p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRegisterPhone}
                    disabled={!phoneInput.trim()}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Tôi đã chuyển tiền - Gửi yêu cầu
                  </button>
                  <button
                    onClick={() => { setShowRegisterModal(false); setRegisterError(''); }}
                    className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-gray-300 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </>
            )}

            {registerSuccess && (
              <button
                onClick={() => { setShowRegisterModal(false); setRegisterSuccess(false); }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-bold transition-colors"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-sm border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock size={20} className="text-amber-400" />
                Đăng nhập Admin
              </h3>
              <button onClick={() => { setShowAdminLoginModal(false); setAdminLoginError(''); }} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {adminLoginError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {adminLoginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tên đăng nhập</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="••••••"
                  className="w-full px-4 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAdminLogin}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-bold transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && adminLoggedIn && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl w-full max-w-2xl border border-gray-700 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Shield size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Quản lý Người dùng</h3>
                    <p className="text-gray-500 text-sm">Kích hoạt số điện thoại để người dùng sử dụng tính năng nâng cao</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
                    <History size={14} />
                    {pendingPhones.length} chờ duyệt
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                    <Users size={14} />
                    {activatedPhones.length} đã kích hoạt
                  </span>
                  <button onClick={() => setShowAdminPanel(false)} className="ml-2 text-gray-400 hover:text-white p-1">
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Pending Section */}
              <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 rounded-xl border border-amber-500/20 overflow-hidden">
                <div className="p-4 border-b border-amber-500/20">
                  <h4 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                    <History size={18} />
                    Yêu cầu chờ duyệt
                    <span className="ml-2 w-6 h-6 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {pendingRegistrations.length}
                    </span>
                  </h4>
                </div>
                <div className="p-4">
                  {pendingRegistrations.length === 0 ? (
                    <div className="text-center py-8">
                      <Users size={48} className="mx-auto mb-3 text-amber-500/30" />
                      <p className="text-gray-500">Không có yêu cầu nào đang chờ duyệt</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pendingRegistrations.map((reg, index) => (
                        <div key={reg.phone} className="flex items-center justify-between p-3 bg-[#0d0d1a]/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{index + 1}.</span>
                            <div>
                              <p className="text-white font-medium">{reg.fullName}</p>
                              <p className="text-amber-400 font-mono text-sm">{reg.phone}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleActivateUser(reg.phone)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg transition-colors"
                          >
                            <Check size={16} />
                            Duyệt
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Activated Section */}
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-800/10 rounded-xl border border-green-500/20 overflow-hidden">
                <div className="p-4 border-b border-green-500/20">
                  <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                    <Users size={18} />
                    Người dùng đã kích hoạt
                    <span className="ml-2 w-6 h-6 bg-green-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {activatedRegistrations.length}
                    </span>
                  </h4>
                </div>
                <div className="p-4">
                  {activatedRegistrations.length === 0 ? (
                    <div className="text-center py-8">
                      <Users size={48} className="mx-auto mb-3 text-green-500/30" />
                      <p className="text-gray-500">Chưa có người dùng nào được kích hoạt</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activatedRegistrations.map((reg, index) => (
                        <div key={reg.phone} className="flex items-center justify-between p-3 bg-[#0d0d1a]/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{index + 1}.</span>
                            <div>
                              <p className="text-white font-medium">{reg.fullName}</p>
                              <p className="text-green-400 font-mono text-sm">{reg.phone}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 text-xs rounded-full flex items-center gap-1">
                              <Check size={12} />
                              Đã kích hoạt
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeactivateUser(reg.phone)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors"
                          >
                            <X size={16} />
                            Hủy
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 bg-[#0d0d1a]/50">
              <p className="text-center text-gray-500 text-sm">
                Dữ liệu lưu trữ tại trình duyệt (localStorage). Hãy sao lưu định kỳ.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* User Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1a1a2e] rounded-2xl w-full max-w-lg border border-gray-700 my-4">
            {/* Header */}
            <div className="p-5 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Lock size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Đăng ký sử dụng</h3>
                    <p className="text-gray-500 text-sm">Chuyển khoản để kích hoạt</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowRegisterModal(false); setRegisterError(''); setRegisterSuccess(false); setFullNameInput(''); setPhoneInput(''); }}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Success Message */}
              {registerSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-green-400 mb-2">Đăng ký thành công!</h4>
                  <p className="text-gray-400 mb-4">Yêu cầu của bạn đã được gửi đến quản trị viên.</p>
                  <p className="text-amber-400 text-sm">Vui lòng chờ duyệt trong vòng 24h.</p>
                  <button
                    onClick={() => { setShowRegisterModal(false); setRegisterSuccess(false); }}
                    className="mt-6 px-8 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-black font-bold transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  {/* Bank Info Section */}
                  <div className="mb-5 p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">₫</div>
                      <span className="text-red-400 font-bold">THÔNG TIN CHUYỂN KHOẢN</span>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-2 rounded-lg">
                        <img
                          src={BANK_INFO.qrUrl}
                          alt="QR Chuyển khoản Agribank"
                          className="w-40 h-40 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ngân hàng:</span>
                        <span className="text-white font-medium">{BANK_INFO.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Số tài khoản:</span>
                        <span className="text-amber-400 font-mono font-bold">{BANK_INFO.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Chủ tài khoản:</span>
                        <span className="text-white font-medium">{BANK_INFO.accountHolder}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-red-500/20">
                        <span className="text-gray-400">Số tiền:</span>
                        <span className="text-green-400 font-bold text-lg">{BANK_INFO.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nội dung CK:</span>
                        <span className="text-amber-400 font-mono">SKKN {phoneInput || '[SĐT của bạn]'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {registerError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                      <AlertTriangle size={16} />
                      {registerError}
                    </div>
                  )}

                  {/* Form Inputs */}
                  <div className="space-y-4 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Họ và tên <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullNameInput}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        placeholder="Nhập họ và tên đầy đủ"
                        className="w-full px-4 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Số điện thoại <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="0xxx xxx xxx"
                        className="w-full px-4 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none font-mono"
                      />
                      <p className="mt-1 text-gray-500 text-xs">
                        Nhập đúng SĐT đã dùng trong nội dung chuyển khoản
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleRegisterUser}
                    disabled={!phoneInput.trim() || !fullNameInput.trim()}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-black font-bold transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    <Check size={20} />
                    Tôi đã chuyển khoản
                  </button>

                  {/* Note */}
                  <p className="mt-4 text-center text-gray-500 text-xs">
                    Quản trị viên sẽ xác nhận và kích hoạt tài khoản trong vòng 24h làm việc.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-12">
        {/* AI Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm">
            <Sparkles size={16} className="animate-pulse" />
            {appMode === 'generator' ? 'AI viết SKKN tự động theo chuẩn Bộ GD&ĐT' : 'AI chấm điểm và phát hiện đạo văn'}
          </div>
        </div>

        {/* Dynamic Forms based on Mode */}
        {appMode === 'generator' && (
          <div className="transition-all duration-500">
            <GeneratorForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerate}
              isGenerating={isProcessing}
              onFilesSelected={handleGeneratorFilesSelected}
              attachedFiles={generatorFiles}
              onRemoveFile={(idx) => setGeneratorFiles(prev => prev.filter((_, i) => i !== idx))}
            />
          </div>
        )}

        {appMode === 'evaluator' && (
          <div className="transition-all duration-500">
            <EvaluatorForm
              onFilesSelected={handleEvaluatorFilesSelected}
              attachedFiles={evaluatorFiles}
              onRemoveFile={(idx) => setEvaluatorFiles(prev => prev.filter((_, i) => i !== idx))}
              onSubmit={handleEvaluate}
              onCheckPlagiarism={handleCheckPlagiarism}
              isEvaluating={step === GenerationStep.EVALUATING || step === GenerationStep.CHECKING_PLAGIARISM}
            />
          </div>
        )}

        {/* Progress Indicator */}
        {(step === GenerationStep.GENERATING_OUTLINE || step === GenerationStep.GENERATING_PART_1 || step === GenerationStep.GENERATING_PART_2_3 || step === GenerationStep.EVALUATING || step === GenerationStep.CHECKING_PLAGIARISM) && (
          <div className="mb-8 bg-[#1a1a2e] border border-blue-500/30 p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-blue-400 shadow-lg mt-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="w-6 h-6 text-blue-400 animate-pulse" /></div>
            </div>
            <span className="font-bold text-lg animate-pulse">{progressMsg}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 mt-6 bg-red-900/20 p-6 rounded-2xl text-red-400 text-center border border-red-500/30 flex flex-col items-center gap-4">
            <AlertTriangle size={32} className="text-red-500" />
            <p className="font-medium whitespace-pre-line">{error}</p>
            <button onClick={() => setShowApiKeyModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 shadow-md transition-all">
              <Wrench size={16} /> Kiểm tra Cấu hình
            </button>
          </div>
        )}

        {/* Result Display */}
        {result && step === GenerationStep.COMPLETED && (
          <div className="mt-8">
            <ResultView content={result} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 text-center">
        <p className="text-amber-400 font-bold">Võ Ngọc Tùng</p>
        <p className="text-gray-500 text-sm mt-1">THCS Nguyễn Văn Bảnh - Xã Nhuận Phú Tân, tỉnh Vĩnh Long</p>
        <div className="flex justify-center gap-4 mt-3 text-sm text-gray-500">
          <a href="tel:0814666040" className="hover:text-amber-400 flex items-center gap-1">
            <Phone size={14} />
            0814666040
          </a>
          <span>|</span>
          <a href="#" className="hover:text-amber-400 flex items-center gap-1">
            <Facebook size={14} />
            Facebook
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;