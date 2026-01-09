/**
 * 짝꿍 이미지 프롬프트 생성기
 * 사용자의 사주/운세를 기반으로 오늘의 이상형 이미지 프롬프트를 생성합니다.
 */
import type { UserProfile, FortuneResult, SajuElement } from "../types";
import type { DailyEnergy } from "./dailyEnergy";

export interface MatchImagePrompt {
    prompt: string;
    gender: "male" | "female";
    style: string;
    keyFeatures: string[];
}

// 오행별 외모 특징
const ELEMENT_APPEARANCE: Record<SajuElement, { style: string; colors: string[]; vibe: string }> = {
    "Wood": {
        style: "tall and slender, youthful energy",
        colors: ["green accents", "natural earth tones", "fresh spring colors"],
        vibe: "vibrant and energetic, like a fresh spring morning"
    },
    "Fire": {
        style: "striking and charismatic, warm smile",
        colors: ["warm red undertones", "golden highlights", "sunset orange"],
        vibe: "passionate and magnetic, radiant presence"
    },
    "Earth": {
        style: "warm and approachable, gentle features",
        colors: ["warm beige", "honey brown", "soft cream"],
        vibe: "dependable and comforting, like a cozy embrace"
    },
    "Metal": {
        style: "sharp and refined, sophisticated look",
        colors: ["silver accessories", "platinum blonde", "cool white"],
        vibe: "elegant and polished, modern chic"
    },
    "Water": {
        style: "mysterious and deep, dreamy eyes",
        colors: ["deep blue", "ocean teal", "midnight black hair"],
        vibe: "enigmatic and wise, calm depth"
    }
};

// 운세 점수별 무드
const SCORE_MOOD: Record<string, { expression: string; setting: string }> = {
    "high": {      // 80-100
        expression: "bright beaming smile, sparkling eyes",
        setting: "golden hour sunlight, cherry blossoms falling"
    },
    "medium": {    // 50-79
        expression: "gentle warm smile, soft gaze",
        setting: "cafe terrace, afternoon sun"
    },
    "low": {       // 0-49
        expression: "mysterious slight smile, thoughtful look",
        setting: "rainy window, cozy indoor lighting"
    }
};

// 오늘의 테마별 액세서리/소품
const THEME_ACCESSORIES: Record<string, string[]> = {
    "성장": ["plant pot nearby", "green scarf"],
    "열정": ["red lipstick", "heart-shaped earrings"],
    "안정": ["cozy sweater", "warm coffee cup"],
    "결단": ["sleek watch", "business casual"],
    "지혜": ["glasses", "books in background"],
    "사교": ["party lights", "champagne glass"],
    "창의성": ["artist beret", "colorful background"],
    "유연함": ["flowing dress", "beach in background"]
};

/**
 * 오늘의 이상형 이미지 프롬프트 생성
 */
export function generateMatchImagePrompt(
    profile: UserProfile,
    fortune: FortuneResult,
    dailyEnergy: DailyEnergy
): MatchImagePrompt {
    // 사용자 성별의 반대 성별로 이상형 생성
    const matchGender: "male" | "female" = profile.gender === "male" ? "female" : "male";

    // 오늘의 오행 기반 외모 특징
    const appearance = ELEMENT_APPEARANCE[dailyEnergy.element];

    // 운세 점수에 따른 무드
    const scoreTier = fortune.score >= 80 ? "high" : fortune.score >= 50 ? "medium" : "low";
    const mood = SCORE_MOOD[scoreTier];

    // 키워드에서 액세서리 추출
    const accessories: string[] = [];
    fortune.keywords.forEach(keyword => {
        const related = Object.entries(THEME_ACCESSORIES).find(([theme]) =>
            keyword.includes(theme) || theme.includes(keyword)
        );
        if (related) {
            accessories.push(related[1][Math.floor(Math.random() * related[1].length)]);
        }
    });

    // 기본 액세서리 추가
    if (accessories.length === 0) {
        accessories.push("minimal elegant jewelry");
    }

    // 핵심 특징 리스트
    const keyFeatures = [
        appearance.style,
        appearance.vibe,
        mood.expression,
        ...appearance.colors.slice(0, 2),
        ...accessories.slice(0, 2)
    ];

    // 프롬프트 생성
    const genderDesc = matchGender === "female"
        ? "breathtakingly beautiful young Korean woman, stunning natural beauty"
        : "incredibly handsome young Korean man, striking masculine features";

    const prompt = `Portrait photo of a ${genderDesc}, ${appearance.style}, 
        ${mood.expression}, ${appearance.vibe}.
        Wearing stylish modern Korean fashion, ${accessories.join(", ")}.
        ${mood.setting}. 
        Colors: ${appearance.colors.join(", ")}.
        High quality fashion photography, soft bokeh background, 
        natural lighting, magazine quality, 8k resolution.
        NOT cartoon, NOT anime, photorealistic, real person.`.replace(/\s+/g, " ").trim();

    return {
        prompt,
        gender: matchGender,
        style: appearance.vibe,
        keyFeatures
    };
}

/**
 * 짧은 설명 텍스트 생성
 */
export function generateMatchDescription(
    prompt: MatchImagePrompt,
    fortune: FortuneResult,
    dailyEnergy: DailyEnergy
): string {
    const genderWord = prompt.gender === "female" ? "그녀" : "그";
    const zodiacKorean: Record<string, string> = {
        "Rat": "쥐", "Ox": "소", "Tiger": "호랑이", "Rabbit": "토끼",
        "Dragon": "용", "Snake": "뱀", "Horse": "말", "Goat": "양",
        "Monkey": "원숭이", "Rooster": "닭", "Dog": "개", "Pig": "돼지"
    };

    const traits = prompt.keyFeatures.slice(0, 3).map(f => {
        // 영어 특징을 한글로 간단히 변환
        if (f.includes("warm")) return "따뜻한";
        if (f.includes("mysterious")) return "신비로운";
        if (f.includes("energetic")) return "활기찬";
        if (f.includes("elegant")) return "우아한";
        if (f.includes("charismatic")) return "카리스마 있는";
        if (f.includes("gentle")) return "부드러운";
        if (f.includes("deep")) return "깊이 있는";
        if (f.includes("refined")) return "세련된";
        return "";
    }).filter(Boolean);

    return `오늘 ${dailyEnergy.zodiacKorean}의 기운을 가진 ${genderWord}가 나타날 수 있어요.
${traits.join(", ")} 분위기의 ${genderWord}와 눈이 마주칠지도 몰라요!
#${fortune.keywords[0] || "설렘"} #오늘의짝꿍`;
}
