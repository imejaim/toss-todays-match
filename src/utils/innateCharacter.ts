/**
 * 타고난 캐릭터 설명 생성기
 * 사주, 휴먼디자인, 에니어그램을 통합하여 친근한 언어로 설명합니다.
 */
import type { UserProfile, SajuElement, HDType } from "../types";
import { analyzeSaju } from "./sajuEngine";

// ==========================================
// 오행(五行) 캐릭터 설명
// ==========================================
interface ElementDescription {
    title: string;
    metaphor: string;
    traits: string[];
    advice: string;
}

const ELEMENT_DESCRIPTIONS: Record<SajuElement, ElementDescription> = {
    "Wood": {
        title: "나무의 에너지",
        metaphor: "봄날의 새싹처럼 끊임없이 성장하는",
        traits: ["창의적", "진취적", "융통성 있는"],
        advice: "새로운 것을 시작할 때 빛나는 분이에요!"
    },
    "Fire": {
        title: "불의 에너지",
        metaphor: "타오르는 열정을 가진",
        traits: ["열정적", "표현력 풍부한", "사교적인"],
        advice: "사람들 속에서 에너지를 얻으시는 분이에요!"
    },
    "Earth": {
        title: "흙의 에너지",
        metaphor: "대지처럼 든든하고 안정적인",
        traits: ["신뢰할 수 있는", "인내심 강한", "실용적인"],
        advice: "꾸준함이 가장 큰 강점이에요!"
    },
    "Metal": {
        title: "쇠의 에너지",
        metaphor: "날카롭고 결단력 있는",
        traits: ["정의로운", "원칙적인", "깔끔한"],
        advice: "명확한 목표가 있을 때 빛나시는 분이에요!"
    },
    "Water": {
        title: "물의 에너지",
        metaphor: "바다와 같은 깊고 넓은",
        traits: ["지혜로운", "유연한", "직관적인"],
        advice: "깊이 있는 생각과 흐름을 읽는 능력이 있어요!"
    }
};

// ==========================================
// 휴먼디자인 타입 설명
// ==========================================
interface HDTypeDescription {
    title: string;
    population: string;
    description: string;
    strategy: string;
}

const HD_TYPE_DESCRIPTIONS: Record<HDType, HDTypeDescription> = {
    "Generator": {
        title: "창조적 에너자이저",
        population: "약 37%",
        description: "지구를 만들어가는 핵심 에너지를 가진",
        strategy: "직감이 '응!'하고 반응할 때 움직이세요"
    },
    "Manifesting Generator": {
        title: "멀티 에너자이저",
        population: "약 33%",
        description: "여러 가지를 동시에 해내는 만능형",
        strategy: "관심 가는 것에 먼저 뛰어들어 보세요"
    },
    "Projector": {
        title: "안내자 타입",
        population: "약 20%",
        description: "다른 사람의 에너지를 읽고 이끄는",
        strategy: "초대받을 때 빛이 나요. 기다림도 전략이에요"
    },
    "Manifestor": {
        title: "개척자 타입",
        population: "약 8%",
        description: "새로운 것을 시작하고 영향력을 발휘하는",
        strategy: "하고 싶을 때 먼저 알리고 행동하세요"
    },
    "Reflector": {
        title: "거울 타입",
        population: "약 1%",
        description: "주변 환경을 비추며 지혜를 나누는 희귀한",
        strategy: "한 달 주기로 큰 결정을 내리세요"
    }
};

// ==========================================
// 에니어그램 타입 설명
// ==========================================
interface EnneagramDescription {
    title: string;
    nickname: string;
    coreDesire: string;
    traits: string[];
}

const ENNEAGRAM_DESCRIPTIONS: Record<number, EnneagramDescription> = {
    1: {
        title: "1유형",
        nickname: "완벽주의자",
        coreDesire: "올바른 것을 추구하는",
        traits: ["원칙적", "책임감 있는", "개선을 추구하는"]
    },
    2: {
        title: "2유형",
        nickname: "조력가",
        coreDesire: "사랑받고 사랑주기를 원하는",
        traits: ["따뜻한", "배려심 깊은", "관계 중심적인"]
    },
    3: {
        title: "3유형",
        nickname: "성취자",
        coreDesire: "인정받고 성공하고 싶은",
        traits: ["목표 지향적", "적응력 있는", "자신감 있는"]
    },
    4: {
        title: "4유형",
        nickname: "예술가",
        coreDesire: "특별한 존재이고 싶은",
        traits: ["독창적", "감성적", "자기 표현적"]
    },
    5: {
        title: "5유형",
        nickname: "탐구자",
        coreDesire: "이해하고 알고 싶은",
        traits: ["분석적", "관찰력 있는", "독립적인"]
    },
    6: {
        title: "6유형",
        nickname: "충성가",
        coreDesire: "안전하고 확신을 얻고 싶은",
        traits: ["신중한", "책임감 있는", "협력적인"]
    },
    7: {
        title: "7유형",
        nickname: "열정가",
        coreDesire: "행복하고 자유롭고 싶은",
        traits: ["낙천적", "즉흥적", "다재다능한"]
    },
    8: {
        title: "8유형",
        nickname: "도전가",
        coreDesire: "강하고 주도적이고 싶은",
        traits: ["결단력 있는", "자기 확신적", "보호적인"]
    },
    9: {
        title: "9유형",
        nickname: "평화주의자",
        coreDesire: "평화롭고 조화롭게 살고 싶은",
        traits: ["수용적", "안정적", "공감 능력 있는"]
    }
};

// ==========================================
// 통합 캐릭터 분석 결과
// ==========================================
export interface InnateCharacterAnalysis {
    // 기본 정보
    nickname: string;

    // 사주 기반
    element: SajuElement;
    elementDescription: ElementDescription;

    // HD 기반
    hdType: HDType;
    hdDescription: HDTypeDescription;

    // 에니어그램 기반
    enneagramType: number;
    enneagramDescription: EnneagramDescription;

    // 통합 설명 텍스트
    summaryText: string;
    detailText: string;

    // 뱃지 정보 (UI용)
    badges: Array<{ emoji: string; label: string; detail: string }>;
}

/**
 * 사용자 프로필로부터 타고난 캐릭터 분석 생성
 */
export function analyzeInnateCharacter(profile: UserProfile): InnateCharacterAnalysis {
    // 실시간 사주 계산 (프로필에 저장된 것이 없거나 생년월일과 불일치할 가능성 대비)
    let saju = profile.saju;
    if (!saju && profile.birthDate) {
        saju = analyzeSaju(profile.birthDate, profile.birthTime || "12:00");
    } else if (profile.birthDate && saju) {
        // 혹시 모르니 다시 한 번 계산 (안전장치)
        saju = analyzeSaju(profile.birthDate, profile.birthTime || "12:00");
    }

    const element = saju?.dayMaster.element || "Water";
    const hdType = profile.humanDesign?.type || "Generator";
    const enneagramType = profile.enneagram?.type || 7;

    const elementDesc = ELEMENT_DESCRIPTIONS[element];
    const hdDesc = HD_TYPE_DESCRIPTIONS[hdType];
    const enneagramDesc = ENNEAGRAM_DESCRIPTIONS[enneagramType] || ENNEAGRAM_DESCRIPTIONS[7];

    // 통합 요약 텍스트 생성
    const summaryText = generateSummaryText(profile.nickname, element, hdType, enneagramType);
    const detailText = generateDetailText(profile.nickname, elementDesc, hdDesc, enneagramDesc);

    // 뱃지 정보
    const badges = [
        {
            emoji: getElementEmoji(element),
            label: getElementShortName(element),
            detail: elementDesc.title
        },
        {
            emoji: "🔋",
            label: hdType === "Manifesting Generator" ? "MG" : hdType.charAt(0),
            detail: hdDesc.title
        },
        {
            emoji: "🎯",
            label: `${enneagramType}유형`,
            detail: enneagramDesc.nickname
        }
    ];

    return {
        nickname: profile.nickname || "익명",
        element,
        elementDescription: elementDesc,
        hdType,
        hdDescription: hdDesc,
        enneagramType,
        enneagramDescription: enneagramDesc,
        summaryText,
        detailText,
        badges
    };
}

/**
 * 친근한 한 문장 요약
 */
function generateSummaryText(
    nickname: string,
    element: SajuElement,
    hdType: HDType,
    enneagramType: number
): string {
    const elementDesc = ELEMENT_DESCRIPTIONS[element];
    const hdDesc = HD_TYPE_DESCRIPTIONS[hdType];
    const enneagramDesc = ENNEAGRAM_DESCRIPTIONS[enneagramType] || ENNEAGRAM_DESCRIPTIONS[7];

    return `${nickname}님은 ${elementDesc.metaphor} 에너지를 가지고 태어나셨어요. ${hdDesc.description} ${enneagramDesc.nickname} 타입이시죠!`;
}

/**
 * 상세 설명 텍스트 생성
 */
function generateDetailText(
    nickname: string,
    elementDesc: ElementDescription,
    hdDesc: HDTypeDescription,
    enneagramDesc: EnneagramDescription
): string {
    return `🪪 ${nickname}님은 이런 분이시네요!

${elementDesc.metaphor} 에너지로 태어나셨군요. ${getElementEmoji(elementDesc.title.includes("물") ? "Water" : elementDesc.title.includes("불") ? "Fire" : elementDesc.title.includes("나무") ? "Wood" : elementDesc.title.includes("쇠") ? "Metal" : "Earth")}
${elementDesc.traits.join(", ")}한 성향이 있으시고, ${elementDesc.advice}

또한 ${hdDesc.description} '${hdDesc.title}'이시네요. 🔋
지구 인구의 ${hdDesc.population}에 해당하는 희소성이에요.
${hdDesc.strategy}

본인의 메타 인지 결과(에니어그램)로 보면,
${enneagramDesc.coreDesire} '${enneagramDesc.nickname}'이시군요! 🎯
${enneagramDesc.traits.join(", ")}한 특성을 가지고 계세요.`;
}

/**
 * 오행 이모지
 */
function getElementEmoji(element: SajuElement | string): string {
    if (element === "Wood" || element.includes("나무")) return "🌳";
    if (element === "Fire" || element.includes("불")) return "🔥";
    if (element === "Earth" || element.includes("흙")) return "🌍";
    if (element === "Metal" || element.includes("쇠")) return "✨";
    if (element === "Water" || element.includes("물")) return "💧";
    return "⭐";
}

/**
 * 오행 짧은 이름
 */
function getElementShortName(element: SajuElement): string {
    const names: Record<SajuElement, string> = {
        "Wood": "목(木)",
        "Fire": "화(火)",
        "Earth": "토(土)",
        "Metal": "금(金)",
        "Water": "수(水)"
    };
    return names[element] || "?";
}
