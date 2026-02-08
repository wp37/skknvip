export interface ApiConfig {
  apiKey?: string;
  model?: string;
}

export interface MissionData {
  subject: string;
  gradeLevel: string;
  awardGoal: string;
  painPoint?: string;
  target?: string;
}

export interface Criterion {
  id?: string;
  name: string;
  label?: string;
  score: number;
  max: number;
  strengths?: string;
  weaknesses?: string;
  comment?: string;
  color?: string;
}

export interface DetectedIssue {
  type: string;
  message: string;
}

// Stricter Type Definitions for Production Grade
export interface TitleStructure {
  action: string;
  tool: string;
  subject: string;
  scope: string;
  goal: string;
}

export interface AlternativeTitle {
  title: string;
  reason: string;
  score: number;
  tags?: string[];
}

export interface TitleAnalysisResult {
  score: number;
  // Chi tiết 4 tiêu chí (tổng 100 điểm)
  criteria: {
    specificity: { score: number; max: 25; comment: string }; // Độ cụ thể
    novelty: { score: number; max: 30; comment: string }; // Tính mới - độc đáo
    feasibility: { score: number; max: 25; comment: string }; // Tính khả thi
    clarity: { score: number; max: 20; comment: string }; // Độ rõ ràng - súc tích
  };
  structure: TitleStructure;
  issues: string[]; // Mảng các lỗi phát hiện
  alternatives: AlternativeTitle[]; // 5 gợi ý tên đề tài
  related_topics: string[];
  layerAnalysis: {
    layer1_database: { duplicateLevel: 'low' | 'medium' | 'high'; similarTitles: string[] };
    layer2_online: { estimatedResults: number; popularityLevel: string };
    layer3_expert: { expertVerdict: string; recommendations: string[] };
  };
  conclusion: string;
  grade: 'excellent' | 'good' | 'average' | 'poor'; // Xanh / Vàng / Đỏ
}

export interface AnalysisResult {
  totalScore: number;
  criteria: Criterion[];
  warnings: {
    duplicate: { level: string; text: string };
    plagiarism: { level: string; text: string };
  };
  spellingErrors: Array<{ original: string; suggest: string; context: string }>;
  reviewParagraphs: Array<{ text: string; match: string }>;
  upgradePlan: {
    short: string[];
    medium: string[];
    long: string[];
  };
}

// Chat Assistant Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface SKKNContext {
  hasTitle: boolean;
  hasContent: boolean;
  titlePreview?: string;
  contentLength?: number;
}

// Authentication Types
export interface AuthState {
  isAdmin: boolean;
  userPhone: string | null;
  isActivated: boolean;
}

export interface PhoneRegistration {
  phone: string;
  timestamp: number;
  status: 'pending' | 'activated' | 'rejected';
}

// New Types for AI SKKN PRO v2
export interface FormData {
  title: string;
  subject: string;
  bookSet: string;
  grade: string;
  situation: string;
  solution: string;
  specificLessons: string;
}

export interface Settings {
  model: string;
  apiKey: string;
  customModel: string;
}

export enum GenerationStep {
  IDLE = 'IDLE',
  GENERATING_OUTLINE = 'GENERATING_OUTLINE',
  GENERATING_PART_1 = 'GENERATING_PART_1',
  GENERATING_PART_2_3 = 'GENERATING_PART_2_3',
  EVALUATING = 'EVALUATING',
  CHECKING_PLAGIARISM = 'CHECKING_PLAGIARISM',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface UploadedFile {
  name: string;
  type: 'pdf' | 'docx' | 'txt';
  content: string;
  mimeType: string;
}

export type AppMode = 'generator' | 'evaluator' | 'analyzer';