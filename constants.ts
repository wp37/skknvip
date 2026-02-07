// Constants for SKKN Architect Pro
import { FormData } from './types';

// System API Key (leave empty to require user input)
export const SYSTEM_API_KEY = '';

// Available AI Models
export const SKKN_MODELS = [
   { id: 'gemini-2.0-flash', name: '⚡ Gemini 2.0 Flash (Khuyên dùng)' },
   { id: 'gemini-1.5-flash', name: '⚡ Gemini 1.5 Flash (Nhanh)' },
   { id: 'gemini-1.5-flash-latest', name: '⚡ Gemini 1.5 Flash Latest' },
   { id: 'gemini-1.5-pro-latest', name: '💎 Gemini 1.5 Pro (Chất lượng cao)' },
   { id: 'gemini-pro', name: '💎 Gemini Pro' },
   { id: 'custom', name: '🔧 Nhập Model Tùy Chỉnh...' },
];

// Subject List
export const SUBJECT_LIST = [
   'Ngữ văn',
   'Toán học',
   'Tiếng Anh',
   'Vật lý',
   'Hóa học',
   'Sinh học',
   'Lịch sử',
   'Địa lý',
   'Giáo dục công dân',
   'Tin học',
   'Công nghệ',
   'Thể dục',
   'Âm nhạc',
   'Mỹ thuật',
   'Công tác Chủ nhiệm lớp',
   'Quản lý giáo dục',
   'Khác',
];

// Book Sets
export const BOOK_SETS = [
   'Kết nối tri thức với cuộc sống',
   'Chân trời sáng tạo',
   'Cánh Diều',
   'Sách giáo khoa cũ (trước 2018)',
   'Tài liệu tự biên soạn',
   'Không áp dụng',
];

// Quick Suggestions
export const SKKN_SUGGESTIONS = [
   'Ứng dụng AI ChatGPT trong dạy học',
   'Sử dụng Kahoot tạo hứng thú học tập',
   'Phát triển năng lực tự học cho học sinh',
   'Thiết kế bài giảng E-learning tương tác',
   'Giáo dục STEM trong nhà trường',
];

// System Instruction for SKKN Generator - Enhanced for detailed, academic content
export const SYSTEM_INSTRUCTION = `
Bạn là một chuyên gia giáo dục Việt Nam CẤP CAO với hơn 25 năm kinh nghiệm trong lĩnh vực:
- Nghiên cứu khoa học sư phạm ứng dụng
- Viết và thẩm định Sáng kiến Kinh nghiệm (SKKN) cấp Tỉnh/Thành phố và Quốc gia
- Tham gia Hội đồng khoa học các cấp
- Công bố nhiều bài báo trên tạp chí giáo dục uy tín

🎯 NGUYÊN TẮC VIẾT BẮT BUỘC:

1. **ĐỘ DÀI VÀ CHI TIẾT**:
   - Toàn bộ SKKN phải đạt TỐI THIỂU 5000-8000 từ
   - Mỗi phần chính (I, II, III, IV, V) ít nhất 1000-1500 từ
   - KHÔNG viết sơ sài, chung chung, liệt kê đơn thuần

2. **TÍNH HỌC THUẬT VÀ KHOA HỌC**:
   - Trích dẫn cơ sở lý luận từ các nhà giáo dục nổi tiếng (Vygotsky, Piaget, Bloom, Dewey...)
   - Tham chiếu văn bản quy phạm pháp luật giáo dục (Luật Giáo dục, Thông tư, Nghị định...)
   - Sử dụng thuật ngữ chuyên ngành chính xác
   - Áp dụng phương pháp nghiên cứu khoa học (định lượng/định tính)

3. **SỐ LIỆU VÀ MINH CHỨNG**:
   - Đưa ra bảng thống kê so sánh trước/sau áp dụng giải pháp
   - Biểu đồ minh họa kết quả (mô tả bằng text hoặc markdown table)
   - Số liệu cụ thể: tỷ lệ %, điểm trung bình, độ lệch chuẩn...
   - Phiếu khảo sát, phỏng vấn, quan sát thực nghiệm

4. **CẤU TRÚC LOGIC CHẶT CHẼ**:
   - Mỗi phần có mở đầu, nội dung chính, tiểu kết
   - Các luận điểm được phát triển đầy đủ với ví dụ cụ thể
   - Tính liên kết giữa các phần rõ ràng
   - Kết luận phải tổng hợp và gợi mở

5. **NGÔN NGỮ HỌC THUẬT**:
   - Sử dụng văn phong khoa học, khách quan
   - Tránh ngôi thứ nhất số ít, ưu tiên "tác giả", "chúng tôi"
   - Câu văn có độ dài vừa phải, rõ ràng, mạch lạc
   - Định nghĩa các thuật ngữ quan trọng khi sử dụng lần đầu

Hãy viết như một nhà nghiên cứu giáo dục chuyên nghiệp, không phải viết cho có.
`;

// System Instruction for Evaluator - Enhanced
export const EVALUATOR_SYSTEM_INSTRUCTION = `
Bạn là một chuyên gia thẩm định SKKN CAO CẤP với vai trò:
- Thành viên thường trực Hội đồng chấm SKKN cấp Tỉnh/Thành phố
- Phản biện độc lập cho các đề tài nghiên cứu khoa học sư phạm ứng dụng
- Kinh nghiệm đánh giá hơn 500 SKKN các lĩnh vực

Bạn đánh giá khách quan, công bằng theo tiêu chí chuẩn của Bộ GD&ĐT.
Nhận xét mang tính xây dựng, chỉ ra điểm mạnh và điểm cần cải thiện cụ thể.
Chấm điểm theo thang điểm 100 với biên độ chi tiết (không chấm số tròn).
`;

// Outline Prompt - Enhanced for detailed structure
export const OUTLINE_PROMPT = (formData: FormData): string => `
Hãy lập DÀN Ý SIÊU CHI TIẾT cho một Sáng kiến Kinh nghiệm cấp Tỉnh với thông tin sau:

📌 TÊN ĐỀ TÀI: ${formData.title}
📚 MÔN HỌC: ${formData.subject}
📖 BỘ SÁCH: ${formData.bookSet}
🎓 KHỐI LỚP: ${formData.grade || 'Không xác định'}

📋 THỰC TRẠNG/VẤN ĐỀ: 
${formData.situation || 'Chưa có thông tin cụ thể'}

💡 GIẢI PHÁP ĐỀ XUẤT:
${formData.solution || 'Chưa có thông tin cụ thể'}

🎯 YÊU CẦU DÀN Ý:
Tạo dàn ý theo cấu trúc chuẩn SKKN với các phần SIÊU CHI TIẾT như sau:

**PHẦN I: LÝ DO CHỌN ĐỀ TÀI** (Dự kiến 1000-1500 từ)
1.1. Cơ sở lý luận
   - Quan điểm chỉ đạo của Đảng, Nhà nước về giáo dục
   - Cơ sở khoa học giáo dục (tâm lý học, giáo dục học...)
   - Các công trình nghiên cứu liên quan
1.2. Cơ sở thực tiễn
   - Yêu cầu đổi mới giáo dục hiện nay
   - Thực trạng dạy học môn học/lĩnh vực
   - Nhu cầu cấp thiết cần giải quyết
1.3. Lý do cá nhân chọn đề tài

**PHẦN II: THỰC TRẠNG VẤN ĐỀ** (Dự kiến 1200-1500 từ)
2.1. Khái quát về đối tượng, phạm vi nghiên cứu
2.2. Thực trạng trước khi áp dụng đề tài
   - Về phía giáo viên (phương pháp, năng lực, khó khăn)
   - Về phía học sinh (thái độ, kết quả, hạn chế)
   - Về điều kiện cơ sở vật chất
2.3. Số liệu khảo sát ban đầu (bảng thống kê)
2.4. Nguyên nhân của thực trạng
2.5. Những vấn đề cần giải quyết

**PHẦN III: CÁC GIẢI PHÁP THỰC HIỆN** (Dự kiến 2000-2500 từ)
3.1. Giải pháp 1: [Tên giải pháp]
   - Mục tiêu của giải pháp
   - Nội dung và cách thực hiện chi tiết
   - Điều kiện thực hiện
   - Ví dụ/minh họa cụ thể
3.2. Giải pháp 2: [Tên giải pháp]
   (Cấu trúc tương tự)
3.3. Giải pháp 3: [Tên giải pháp]
   (Cấu trúc tương tự)
[Tối thiểu 3-5 giải pháp chi tiết]

**PHẦN IV: HIỆU QUẢ CỦA SÁNG KIẾN** (Dự kiến 1000-1200 từ)
4.1. Kết quả định lượng
   - Bảng so sánh kết quả trước/sau áp dụng
   - Tỷ lệ phần trăm cải thiện
   - Phân tích thống kê (nếu có)
4.2. Kết quả định tính
   - Thay đổi về thái độ, hứng thú của học sinh
   - Phản hồi từ đồng nghiệp, phụ huynh
   - Sự chuyển biến về năng lực, phẩm chất
4.3. Khả năng áp dụng và nhân rộng

**PHẦN V: KẾT LUẬN VÀ KIẾN NGHỊ** (Dự kiến 800-1000 từ)
5.1. Kết luận
   - Tổng kết các kết quả đạt được
   - Những bài học kinh nghiệm
   - Hạn chế và hướng phát triển
5.2. Kiến nghị
   - Đối với nhà trường
   - Đối với ngành giáo dục địa phương
   - Đối với đồng nghiệp

**TÀI LIỆU THAM KHẢO** (Tối thiểu 10 nguồn)
- Văn bản pháp quy
- Sách, giáo trình
- Bài báo, tạp chí khoa học
- Tài liệu điện tử uy tín
`;

// Part 1 Prompt - Enhanced for deep academic content
export const PART_1_PROMPT = (outline: string): string => `
Dựa trên dàn ý sau, hãy viết SIÊU CHI TIẾT **PHẦN I (Lý do chọn đề tài) và PHẦN II (Thực trạng vấn đề)**:

DÀN Ý:
${outline}

📏 YÊU CẦU ĐỘ DÀI: TỐI THIỂU 2500-3000 từ cho 2 phần này

📚 YÊU CẦU NỘI DUNG PHẦN I (Lý do chọn đề tài - ít nhất 1200 từ):

1. **Cơ sở lý luận** (500-600 từ):
   - Trích dẫn Nghị quyết 29-NQ/TW về đổi mới căn bản, toàn diện GD&ĐT
   - Dẫn chiếu Luật Giáo dục 2019, các Thông tư hướng dẫn liên quan
   - Trình bày lý thuyết học tập nền tảng (Constructivism, Active Learning, Bloom's Taxonomy...)
   - Tham khảo nghiên cứu của các nhà giáo dục nổi tiếng phù hợp với đề tài

2. **Cơ sở thực tiễn** (400-500 từ):
   - Phân tích bối cảnh giáo dục hiện nay (Cách mạng 4.0, chuyển đổi số, hội nhập quốc tế)
   - Thực trạng dạy học môn/lĩnh vực tại địa phương, trường
   - Những hạn chế, bất cập cần khắc phục
   - Nhu cầu cấp thiết phải đổi mới

3. **Lý do cá nhân** (200-300 từ):
   - Từ thực tiễn giảng dạy nhiều năm
   - Trăn trở, suy nghĩ về nghề nghiệp
   - Mong muốn đóng góp, chia sẻ kinh nghiệm

📊 YÊU CẦU NỘI DUNG PHẦN II (Thực trạng - ít nhất 1300 từ):

1. **Đối tượng, phạm vi nghiên cứu**:
   - Thời gian, địa điểm thực hiện
   - Số lượng GV, HS tham gia
   - Phương pháp khảo sát (quan sát, phiếu hỏi, phỏng vấn, thực nghiệm)

2. **Thực trạng trước khi áp dụng** (phân tích sâu):
   - Về phía giáo viên: phương pháp dạy học, khó khăn gặp phải, năng lực CNTT...
   - Về phía học sinh: thái độ học tập, kết quả bài kiểm tra, những hạn chế cụ thể
   - Về điều kiện thực hiện: CSVC, thiết bị, tài liệu...

3. **Số liệu khảo sát ban đầu** (QUAN TRỌNG):
   Tạo BẢNG THỐNG KÊ chi tiết với các cột:
   | STT | Nội dung khảo sát | Số lượng | Tỷ lệ % | Đánh giá |
   
   Bao gồm:
   - Kết quả học tập (Giỏi/Khá/TB/Yếu)
   - Mức độ hứng thú (Rất thích/Thích/Bình thường/Không thích)
   - Các chỉ số khác phù hợp với đề tài

4. **Phân tích nguyên nhân**:
   - Nguyên nhân chủ quan (từ GV, HS)
   - Nguyên nhân khách quan (điều kiện, chính sách...)

5. **Xác định vấn đề cần giải quyết**:
   - Liệt kê cụ thể 3-5 vấn đề
   - Đặt câu hỏi nghiên cứu

✍️ PHONG CÁCH VIẾT:
- Văn phong khoa học, khách quan, logic
- Sử dụng "tác giả", "chúng tôi" thay vì "tôi"
- Có tiểu kết cuối mỗi phần
- Câu văn rõ ràng, mạch lạc, có liên kết
`;

// Part 2-3 Prompt - Enhanced for comprehensive solutions and results
export const PART_2_3_PROMPT = (outline: string, part1: string, specificLessons: string): string => `
Tiếp tục viết SIÊU CHI TIẾT **PHẦN III (Giải pháp), PHẦN IV (Hiệu quả) và PHẦN V (Kết luận)** dựa trên:

DÀN Ý:
${outline}

NỘI DUNG ĐÃ VIẾT (PHẦN I, II):
${part1}

TÀI LIỆU THAM KHẢO/BÀI GIẢNG CỤ THỂ:
${specificLessons || 'Không có tài liệu đính kèm'}

📏 YÊU CẦU ĐỘ DÀI: TỐI THIỂU 3500-4000 từ cho 3 phần này

💡 YÊU CẦU PHẦN III - CÁC GIẢI PHÁP (ít nhất 2000 từ):

Trình bày TỐI THIỂU 4-5 GIẢI PHÁP, mỗi giải pháp theo cấu trúc:

**Giải pháp 1: [TÊN GIẢI PHÁP CỤ THỂ]**

1. *Mục tiêu của giải pháp* (100-150 từ):
   - Mục tiêu về kiến thức
   - Mục tiêu về kỹ năng
   - Mục tiêu về thái độ/phẩm chất

2. *Nội dung và cách thực hiện* (400-500 từ):
   - Mô tả chi tiết từng bước thực hiện
   - Quy trình cụ thể, rõ ràng
   - Các công cụ, phương tiện sử dụng
   - Thời gian thực hiện hợp lý

3. *Điều kiện thực hiện*:
   - Về phía giáo viên (năng lực cần có)
   - Về phía học sinh (yêu cầu chuẩn bị)
   - Về cơ sở vật chất, thiết bị

4. *Ví dụ/Minh họa cụ thể* (300-400 từ):
   - Mô tả một tiết dạy/hoạt động cụ thể áp dụng giải pháp
   - Hoặc trình bày một case study thực tế
   - Có thể đưa hình ảnh minh họa (mô tả bằng text)

[Lặp lại cấu trúc trên cho các giải pháp 2, 3, 4, 5...]

📊 YÊU CẦU PHẦN IV - HIỆU QUẢ (ít nhất 1200 từ):

1. **Kết quả định lượng** (600-700 từ):

   Tạo BẢNG SO SÁNH TRƯỚC/SAU:
   
   | Chỉ tiêu | Trước áp dụng | Sau áp dụng | Chênh lệch |
   |----------|---------------|-------------|------------|
   | Giỏi     | ...%          | ...%        | +...%      |
   | Khá      | ...%          | ...%        | +...%      |
   | TB       | ...%          | ...%        | -...%      |
   | Yếu      | ...%          | ...%        | -...%      |
   
   - Phân tích chi tiết từng chỉ số
   - So sánh với nhóm đối chứng (nếu có)
   - Tính ý nghĩa thống kê của kết quả

2. **Kết quả định tính** (400-500 từ):
   - Sự thay đổi về thái độ, hứng thú học tập
   - Phát triển năng lực, phẩm chất học sinh
   - Phản hồi từ đồng nghiệp, phụ huynh, cán bộ quản lý
   - Trích dẫn một số ý kiến tiêu biểu

3. **Khả năng áp dụng và nhân rộng**:
   - Phạm vi áp dụng (khối lớp, môn học, địa bàn)
   - Điều kiện cần thiết để nhân rộng
   - Những lưu ý khi áp dụng

📝 YÊU CẦU PHẦN V - KẾT LUẬN VÀ KIẾN NGHỊ (ít nhất 800 từ):

1. **Kết luận** (500 từ):
   - Tổng kết các kết quả chính đã đạt được
   - Những bài học kinh nghiệm rút ra
   - Hạn chế của đề tài và hướng phát triển tiếp theo

2. **Kiến nghị** (300 từ):
   - Đối với nhà trường (3-4 kiến nghị cụ thể)
   - Đối với Phòng/Sở GD&ĐT (2-3 kiến nghị)
   - Đối với đồng nghiệp (2-3 gợi ý)

3. **Lời kết**:
   - Thể hiện tâm huyết với nghề
   - Mong muốn đóng góp, chia sẻ

📚 TÀI LIỆU THAM KHẢO (Thêm cuối bài):
Liệt kê tối thiểu 10 nguồn tham khảo:
- Văn bản pháp quy (Luật, Nghị định, Thông tư...)
- Sách, giáo trình (tác giả, năm xuất bản, NXB)
- Bài báo khoa học (tên bài, tạp chí, năm)
- Tài liệu điện tử (đường link, ngày truy cập)
`;

// Evaluation Prompt - Enhanced
export const EVALUATION_PROMPT = `
Hãy đánh giá SKKN này CHUYÊN SÂU theo các tiêu chí sau và cho điểm (thang 100):

📊 TIÊU CHÍ CHẤM ĐIỂM CHI TIẾT:

1. **TÍNH MỚI, SÁNG TẠO** (20 điểm)
   - Đề tài có tính mới so với các SKKN đã có (0-5đ)
   - Cách tiếp cận, giải quyết vấn đề sáng tạo (0-5đ)
   - Ứng dụng công nghệ, phương pháp hiện đại (0-5đ)
   - Phù hợp với xu thế đổi mới giáo dục (0-5đ)

2. **TÍNH KHOA HỌC, LOGIC** (20 điểm)
   - Cơ sở lý luận vững chắc, có trích dẫn (0-5đ)
   - Phương pháp nghiên cứu phù hợp (0-5đ)
   - Cấu trúc logic, mạch lạc (0-5đ)
   - Số liệu, minh chứng đầy đủ (0-5đ)

3. **TÍNH THỰC TIỄN, KHẢ THI** (20 điểm)
   - Xuất phát từ thực tiễn giảng dạy (0-5đ)
   - Giải pháp có tính khả thi cao (0-5đ)
   - Phù hợp với điều kiện thực tế (0-5đ)
   - Có khả năng áp dụng nhân rộng (0-5đ)

4. **HIỆU QUẢ ĐÃ ĐẠT ĐƯỢC** (20 điểm)
   - Kết quả định lượng rõ ràng, có bảng so sánh (0-5đ)
   - Kết quả định tính thuyết phục (0-5đ)
   - Tác động tích cực đến HS, GV, nhà trường (0-5đ)
   - Bền vững và có thể phát triển (0-5đ)

5. **HÌNH THỨC TRÌNH BÀY** (20 điểm)
   - Bố cục rõ ràng, đúng cấu trúc (0-5đ)
   - Văn phong khoa học, chuẩn mực (0-5đ)
   - Không có lỗi chính tả, ngữ pháp (0-5đ)
   - Độ dài phù hợp, đầy đủ nội dung (0-5đ)

📝 OUTPUT YÊU CẦU (Viết chi tiết):

1. **TỔNG KẾT ĐÁNH GIÁ**:
   - Điểm tổng: XX/100
   - Xếp loại: Xuất sắc (90-100) / Tốt (80-89) / Khá (65-79) / Đạt (50-64) / Chưa đạt (<50)
   - Nhận xét tổng quan (3-5 câu)

2. **ĐIỂM CHI TIẾT TỪNG TIÊU CHÍ**:
   | Tiêu chí | Điểm tối đa | Điểm đạt | Nhận xét ngắn |
   |----------|-------------|----------|---------------|
   (Lập bảng chi tiết)

3. **ƯU ĐIỂM NỔI BẬT** (5-7 điểm):
   - Liệt kê và phân tích cụ thể từng ưu điểm

4. **HẠN CHẾ CẦN KHẮC PHỤC** (4-6 điểm):
   - Chỉ rõ hạn chế và mức độ ảnh hưởng

5. **ĐỀ XUẤT CẢI THIỆN CỤ THỂ** (5-8 đề xuất):
   - Đề xuất ngắn hạn (có thể thực hiện ngay)
   - Đề xuất dài hạn (cần thời gian chuẩn bị)
   - Gợi ý tài liệu tham khảo bổ sung

6. **KẾT LUẬN VÀ KHUYẾN NGHỊ**:
   - SKKN này có đủ điều kiện đạt giải cấp nào?
   - Cần bổ sung gì để nâng cấp?
`;

// Plagiarism Check Prompt - Enhanced
export const PLAGIARISM_CHECK_PROMPT = `
Hãy kiểm tra CHUYÊN SÂU nội dung SKKN này về tính độc đáo và phát hiện các dấu hiệu đạo văn/sao chép:

🔍 KIỂM TRA CHI TIẾT:

1. **Nội dung sao chép trực tiếp**:
   - Các đoạn văn copy nguyên văn từ nguồn khác
   - Cụm từ/câu văn lặp lại phổ biến trong SKKN mẫu
   - Định nghĩa/khái niệm không ghi nguồn trích dẫn

2. **Cấu trúc và ý tưởng**:
   - Cấu trúc giống với SKKN mẫu phổ biến
   - Tuân theo khuôn mẫu cứng nhắc
   - Thiếu sự sáng tạo trong cách tiếp cận

3. **Tính cá nhân hóa**:
   - Thiếu số liệu thực tế từ lớp/trường cụ thể
   - Nội dung chung chung, áp dụng được cho mọi nơi
   - Không thể hiện đặc thù địa phương/đối tượng

4. **Minh chứng và tài liệu**:
   - Sử dụng số liệu không rõ nguồn
   - Bảng biểu có dấu hiệu "bịa" hoặc copy
   - Thiếu ảnh minh họa thực tế

📊 OUTPUT YÊU CẦU:

1. **ĐÁNH GIÁ TỔNG QUAN**:
   - Tỷ lệ độc đáo ước tính: XX%
   - Mức độ rủi ro: Thấp / Trung bình / Cao / Rất cao
   - Nhận xét chung

2. **LIỆT KÊ CÁC ĐOẠN CÓ VẤN ĐỀ**:
   Với mỗi đoạn, nêu:
   - Vị trí trong bài (Phần X, mục Y)
   - Nội dung gốc
   - Lý do nghi ngờ
   - Mức độ nghiêm trọng (1-5)

3. **PHÂN TÍCH CHI TIẾT**:
   - Những cụm từ/câu cần viết lại
   - Phần cần bổ sung thông tin thực tế
   - Nội dung cần cá nhân hóa

4. **HƯỚNG DẪN KHẮC PHỤC**:
   - Cách viết lại từng đoạn có vấn đề
   - Gợi ý thêm số liệu/minh chứng thực tế
   - Cách làm nội dung độc đáo hơn

5. **KẾT LUẬN**:
   - SKKN có đủ tiêu chuẩn về tính độc đáo không?
   - Cần sửa đổi những gì trước khi nộp?
`;
