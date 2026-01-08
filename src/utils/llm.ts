import type { UserProfile, FortuneResult } from "../types";

// Backend Connection URL
const BACKEND_URL = "https://todaysmatch-423863342.us-central1.run.app";


// Fallback Mock Data (서버 에러 시)
const MOCK_REPORT = `
### 💘 당신의 연애 성향 분석

당신은 겉으로는 쿨해 보이지만 사실은 세심한 배려를 바라는 '외강내유' 스타일이시군요! 
상대방의 사소한 말 한마디에도 의미를 부여하는 경향이 있어요.

### 🔥 오늘의 공략 포인트

오늘은 평소보다 조금 더 솔직해져도 좋은 날입니다. 
자존심 때문에 하고 싶은 말을 삼키면 오히려 오해가 쌓일 수 있어요. 
"나 오늘 기분이 좀 그래"라고 가볍게 던져보는 건 어때요?

### 🍀 행운의 액션

점심 시간 이후, 가벼운 산책이나 커피 타임에 기회가 찾아옵니다.
의외의 장소에서 설레는 눈맞춤이 있을 수 있어요!
`;

export async function getDetailedFortune(profile: UserProfile, fortune: FortuneResult): Promise<string> {
    try {
        console.log("🚀 Requesting fortune from Backend:", BACKEND_URL);

        // API 호출: 3초 타임아웃 대신 넉넉하게 기다림
        const response = await fetch(`${BACKEND_URL}/api/fortune`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                profile: {
                    name: profile.nickname, // UserProfile uses nickname
                    gender: profile.gender,
                    status: profile.relationshipStatus, // 서버에서 status로 받음
                    birthDate: profile.birthDate
                },
                fortune
            }),
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.result) {
            // 백엔드 프롬프트의 플레이스홀더를 우리 브랜드 AI 이름으로 치환
            const processedResult = data.result
                .replace(/\[당신의 AI 이름\]/g, "큐피 AI")
                .replace(/\[AI 이름\]/g, "큐피 AI");
            return processedResult;
        } else {
            throw new Error("Empty result from server");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Backend API Error:", error);

        // 서버 에러 시 사용자에게는 자연스러운 Mock Data 제공
        // (개발자 콘솔에는 에러 로그 남음)
        return MOCK_REPORT;
    }
}
