/**
 * 오늘의 일진(日辰) 계산 엔진
 * 오늘 날짜의 천간/지지를 계산하고, 사용자의 일주와의 상호작용을 분석합니다.
 */
import { Solar } from "lunar-javascript";
import type { SajuElement, SajuZodiac } from "../types";

// 천간(天干) 목록
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
// 지지(地支) 목록
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 천간 → 오행
const STEM_TO_ELEMENT: Record<string, SajuElement> = {
    "甲": "Wood", "乙": "Wood",
    "丙": "Fire", "丁": "Fire",
    "戊": "Earth", "己": "Earth",
    "庚": "Metal", "辛": "Metal",
    "壬": "Water", "癸": "Water"
};

// 지지 → 띠
const BRANCH_TO_ZODIAC: Record<string, SajuZodiac> = {
    "子": "Rat", "丑": "Ox", "寅": "Tiger", "卯": "Rabbit",
    "辰": "Dragon", "巳": "Snake", "午": "Horse", "未": "Goat",
    "申": "Monkey", "酉": "Rooster", "戌": "Dog", "亥": "Pig"
};

// 천간 한글 읽기
const STEM_KOREAN: Record<string, string> = {
    "甲": "갑", "乙": "을", "丙": "병", "丁": "정", "戊": "무",
    "己": "기", "庚": "경", "辛": "신", "壬": "임", "癸": "계"
};

// 지지 한글 읽기
const BRANCH_KOREAN: Record<string, string> = {
    "子": "자", "丑": "축", "寅": "인", "卯": "묘", "辰": "진", "巳": "사",
    "午": "오", "未": "미", "申": "신", "酉": "유", "戌": "술", "亥": "해"
};

// 오행 한글명
const ELEMENT_KOREAN: Record<SajuElement, string> = {
    "Wood": "나무(木)", "Fire": "불(火)", "Earth": "흙(土)",
    "Metal": "쇠(金)", "Water": "물(水)"
};

// 오행 이모지
const ELEMENT_EMOJI: Record<SajuElement, string> = {
    "Wood": "🌳", "Fire": "🔥", "Earth": "🌍", "Metal": "✨", "Water": "💧"
};

// 띠 한글명
const ZODIAC_KOREAN: Record<SajuZodiac, string> = {
    "Rat": "쥐", "Ox": "소", "Tiger": "호랑이", "Rabbit": "토끼",
    "Dragon": "용", "Snake": "뱀", "Horse": "말", "Goat": "양",
    "Monkey": "원숭이", "Rooster": "닭", "Dog": "개", "Pig": "돼지"
};

// 오행 상생 관계 (A가 B를 생함)
const GENERATES: Record<SajuElement, SajuElement> = {
    "Wood": "Fire",   // 목생화
    "Fire": "Earth",  // 화생토
    "Earth": "Metal", // 토생금
    "Metal": "Water", // 금생수
    "Water": "Wood"   // 수생목
};

// 오행 상극 관계 (A가 B를 극함)
const OVERCOMES: Record<SajuElement, SajuElement> = {
    "Wood": "Earth",  // 목극토
    "Fire": "Metal",  // 화극금
    "Earth": "Water", // 토극수
    "Metal": "Wood",  // 금극목
    "Water": "Fire"   // 수극화
};

export interface DailyEnergy {
    date: Date;
    stem: string;           // 천간 (甲, 乙...)
    branch: string;         // 지지 (子, 丑...)
    stemKorean: string;     // 갑, 을...
    branchKorean: string;   // 자, 축...
    pillarName: string;     // 갑자, 기축...
    pillarHanja: string;    // 甲子, 己丑...
    element: SajuElement;   // 천간 기준 오행
    zodiac: SajuZodiac;     // 지지 기준 띠
    elementKorean: string;
    zodiacKorean: string;
    elementEmoji: string;
}

export interface EnergyInteraction {
    myElement: SajuElement;
    todayElement: SajuElement;
    relationship: "generate" | "overcome" | "weakened" | "controlled" | "same";
    relationshipKorean: string;
    score: number;          // -2 ~ +2
    description: string;
    emoji: string;
}

/**
 * 오늘의 일진 계산
 */
export function getTodayEnergy(date: Date = new Date()): DailyEnergy {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    const stem = eightChar.getDayGan();
    const branch = eightChar.getDayZhi();

    return {
        date,
        stem,
        branch,
        stemKorean: STEM_KOREAN[stem] || stem,
        branchKorean: BRANCH_KOREAN[branch] || branch,
        pillarName: `${STEM_KOREAN[stem]}${BRANCH_KOREAN[branch]}`,
        pillarHanja: `${stem}${branch}`,
        element: STEM_TO_ELEMENT[stem] || "Earth",
        zodiac: BRANCH_TO_ZODIAC[branch] || "Rat",
        elementKorean: ELEMENT_KOREAN[STEM_TO_ELEMENT[stem]] || "흙(土)",
        zodiacKorean: ZODIAC_KOREAN[BRANCH_TO_ZODIAC[branch]] || "쥐",
        elementEmoji: ELEMENT_EMOJI[STEM_TO_ELEMENT[stem]] || "🌍"
    };
}

/**
 * 나의 오행과 오늘의 오행 상호작용 분석
 */
export function analyzeInteraction(myElement: SajuElement, todayElement: SajuElement): EnergyInteraction {
    let relationship: EnergyInteraction["relationship"];
    let score: number;
    let description: string;
    let emoji: string;

    if (myElement === todayElement) {
        // 같은 오행 - 비화(比和)
        relationship = "same";
        score = 1;
        description = "같은 기운이 만나 힘이 배가되는 날이에요.";
        emoji = "🤝";
    } else if (GENERATES[todayElement] === myElement) {
        // 오늘이 나를 생해줌 - 상생(相生) 받음
        relationship = "generate";
        score = 2;
        description = "우주가 나에게 에너지를 보내주는 날! 적극적으로 움직여도 좋아요.";
        emoji = "🌟";
    } else if (GENERATES[myElement] === todayElement) {
        // 내가 오늘을 생해줌 - 에너지 소모
        relationship = "weakened";
        score = 0;
        description = "내 에너지를 쓰는 날이에요. 무리하지 말고 여유롭게 보내세요.";
        emoji = "💨";
    } else if (OVERCOMES[todayElement] === myElement) {
        // 오늘이 나를 극함 - 상극 받음
        relationship = "controlled";
        score = -1;
        description = "약간 버거울 수 있는 날. 신중하게 행동하면 괜찮아요.";
        emoji = "⚡";
    } else if (OVERCOMES[myElement] === todayElement) {
        // 내가 오늘을 극함 - 통제력 발휘
        relationship = "overcome";
        score = 1;
        description = "리더십을 발휘하기 좋은 날! 주도적으로 움직여 보세요.";
        emoji = "💪";
    } else {
        // 그 외 (실제로는 위 조건에 다 걸림)
        relationship = "same";
        score = 0;
        description = "평온한 하루가 될 거예요.";
        emoji = "☁️";
    }

    const relationshipKoreanMap: Record<EnergyInteraction["relationship"], string> = {
        "generate": "상생 (받음)",
        "overcome": "상극 (주도)",
        "weakened": "설기 (소모)",
        "controlled": "상극 (받음)",
        "same": "비화 (같음)"
    };

    return {
        myElement,
        todayElement,
        relationship,
        relationshipKorean: relationshipKoreanMap[relationship],
        score,
        description,
        emoji
    };
}

/**
 * 오늘의 에너지 테마 생성
 */
export function getDailyTheme(energy: DailyEnergy): string[] {
    const themes: Record<SajuElement, string[]> = {
        "Wood": ["성장", "새로운 시작", "계획", "창의성"],
        "Fire": ["열정", "표현", "사교", "활력"],
        "Earth": ["안정", "신뢰", "인내", "실용"],
        "Metal": ["결단", "정리", "완성", "명확함"],
        "Water": ["지혜", "유연함", "직관", "흐름"]
    };
    return themes[energy.element] || ["평온", "균형"];
}
