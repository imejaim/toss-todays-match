const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// ============================================
// CORS 설정
// ============================================

/**
 * 허용할 Origin 목록을 반환합니다.
 * - 프로덕션: 토스 앱 도메인
 * - 개발: localhost
 */
function getAllowedOrigins() {
    return [
        'https://todays-match.apps.tossmini.com',
        'https://todays-match.private-apps.tossmini.com',
        'http://localhost:5173',
        'http://localhost:8080'
    ];
}

app.use(cors({
    origin: getAllowedOrigins(),
    credentials: true,
}));
app.use(express.json());



app.post('/api/fortune', async (req, res) => {
    try {
        const { profile, fortune } = req.body;
        console.log(`[Request] ${profile?.name}님의 운세 요청`);

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('API Key is missing on Server');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
역할: 당신은 2030 세대에게 인기 있는 신통방통한 AI 연애 상담사입니다.
        
정보:
- 사용자: ${profile?.name} (${profile?.gender}, ${profile?.status})
- 생년월일: ${profile?.birthDate}
- 오늘 운세 점수: ${fortune?.score}점
- 키워드: ${fortune?.keywords?.join(", ")}
- 한줄 요약: "${fortune?.message}"

요청:
위 정보를 바탕으로 '심층 연애 운세 리포트'를 작성해주세요. 길이는 300~500자, Markdown 형식.

구성:
1. 💘 핵심 성향 분석 (사용자의 연애 스타일을 가볍게 분석)
2. 🔥 오늘의 솔루션 (점수가 ${fortune?.score}점인 이유와 구체적인 행동 가이드)
3. 🍀 행운의 팁 (오늘의 행운 아이템이나 장소 추천)

말투:
- "~해요", "~한 편이에요" 같은 부드러운 존댓말.
- 팩트 폭격도 섞어서 재미있게.
- 이모지 적절히 사용.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[Success] 응답 생성 완료`);
        res.json({ result: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.send('Fortune Teller Backend is Running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
