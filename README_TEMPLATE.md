# [Tên App] - Education AI Platform

> Template được tạo từ **SKKN Architect Pro** codebase

## 🎯 Mô tả

[Mô tả ngắn về ứng dụng của bạn]

## ✨ Tính năng chính

- [ ] Tính năng 1
- [ ] Tính năng 2
- [ ] Tính năng 3
- [ ] Hệ thống đăng ký + thanh toán
- [ ] Admin Dashboard quản lý user

## 🛠️ Tech Stack

| Công nghệ | Phiên bản |
|-----------|-----------|
| React | 18+ |
| TypeScript | 5+ |
| Vite | 6+ |
| Tailwind CSS | (inline) |
| Google Gemini API | 2.0 Flash |

## 🚀 Cài đặt

```bash
# Clone repo
git clone [url]
cd [folder]

# Install dependencies
npm install

# Run dev server
npm run dev

# Build production
npm run build
```

## 🔐 Cấu hình

### API Key

1. Lấy API key tại: <https://aistudio.google.com/apikey>
2. Nhập vào app qua nút "Nhập API Key"

### Admin

- Username: `admin`
- Password: (xem file `utils/authUtils.ts`)

### Thanh toán

Chỉnh sửa thông tin trong `utils/authUtils.ts`:

```typescript
export const BANK_INFO = {
  bankName: 'Tên Ngân Hàng',
  accountNumber: 'Số Tài Khoản',
  accountHolder: 'Tên Chủ TK',
  amount: 'Số tiền',
  qrUrl: 'URL VietQR',
};
```

## 📁 Cấu trúc Project

```
├── App.tsx              # Component chính
├── constants.ts         # AI Prompts, configs
├── types.ts             # TypeScript types
├── index.css            # Global styles
├── index.html           # HTML template
├── components/          # UI Components
│   ├── GeneratorForm.tsx
│   ├── EvaluatorForm.tsx
│   ├── ResultView.tsx
│   └── ...
├── services/
│   └── geminiService.ts # API calls to Gemini
├── utils/
│   └── authUtils.ts     # Auth, payment logic
└── .agent/
    └── workflows/       # Skill templates
```

## 🎨 Customization

Xem hướng dẫn chi tiết tại: `.agent/workflows/education-ai-template.md`

## 📜 License

[Chọn license phù hợp]

---
*Powered by Google Gemini AI*
