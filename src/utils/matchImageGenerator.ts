/**
 * 짝꿍 이미지 프롬프트 생성기 v2
 * 사용자의 사주/휴먼디자인/에니어그램을 기반으로 오늘의 이상형 이미지 프롬프트를 생성합니다.
 * 
 * 기준 스타일: 에메랄드 그린 오프숄더 드레스, 보타니컬 카페 배경, 한국 이상적 미인
 */
import type { UserProfile, FortuneResult, SajuElement, HDType } from "../types";
import type { DailyEnergy } from "./dailyEnergy";

export interface MatchImagePrompt {
    prompt: string;
    gender: "male" | "female";
    style: string;
    keyFeatures: string[];
    moodScore: number;  // -2 ~ +2 (나쁨 ~ 좋음)
}

// ==========================================
// 기준 프롬프트 (Base Prompt)
// ==========================================
const BASE_FEMALE_PROMPT = `Stunning idealized young Korean woman with doll-like perfect features, large captivating eyes, small v-line face, flawless porcelain skin, long silky black hair with soft waves flowing freely. Confident charismatic gaze, slight seductive alluring smile. Glamorous hourglass figure in elegant {COLOR} satin {OUTFIT} showing beautiful collarbone and shoulders, delicate gold accessories. Standing in {SETTING}. {MOOD_ATMOSPHERE}. Soft dreamy lighting. Korean beauty ideal, slightly stylized perfection, high fashion editorial, 8k resolution.`;

const BASE_MALE_PROMPT = `Incredibly handsome idealized young Korean man with sharp perfect features, deep captivating eyes, strong jawline, flawless skin, styled dark hair. Confident charismatic gaze, charming slight smile. Athletic fit figure in elegant {COLOR} {OUTFIT}, sophisticated accessories. Standing in {SETTING}. {MOOD_ATMOSPHERE}. Soft cinematic lighting. Korean beauty ideal, slightly stylized perfection, high fashion editorial, 8k resolution.`;

// ==========================================
// 오행별 색상 & 분위기
// ==========================================
interface ElementStyle {
    colors: string[];
    settings: string[];
    flowers: string[];
    animals: string[];
}

const ELEMENT_STYLES: Record<SajuElement, ElementStyle> = {
    "Wood": {
        colors: ["emerald green", "forest green", "sage green", "olive"],
        settings: ["trendy botanical cafe with hanging plants and wooden interior, golden sunlight streaming through"],
        flowers: ["bamboo leaves", "fern fronds", "green ivy"],
        animals: ["small bird perched nearby", "butterfly landing on shoulder"]
    },
    "Fire": {
        colors: ["passionate red", "coral orange", "sunset pink", "burgundy"],
        settings: ["rooftop terrace at golden hour with warm sunset glow and fairy lights"],
        flowers: ["red roses", "orange marigolds", "fiery poppies"],
        animals: ["phoenix feather accessory", "small flame wisps around"]
    },
    "Earth": {
        colors: ["warm beige", "honey brown", "terracotta", "cream"],
        settings: ["cozy rustic cafe with warm lighting, exposed brick and lush greenery"],
        flowers: ["sunflowers", "daisies", "wheat stalks"],
        animals: ["small rabbit nearby", "gentle deer in background"]
    },
    "Metal": {
        colors: ["silver white", "platinum gray", "pearl", "ice blue"],
        settings: ["sleek modern gallery with minimalist decor and soft ambient lighting"],
        flowers: ["white orchids", "silver eucalyptus", "crystal flowers"],
        animals: ["white peacock feathers", "silver butterfly"]
    },
    "Water": {
        colors: ["deep ocean blue", "midnight navy", "aqua teal", "sapphire"],
        settings: ["elegant oceanfront cafe with sea breeze, waves visible through large windows"],
        flowers: ["blue hydrangeas", "water lilies", "lotus flowers"],
        animals: ["koi fish in nearby pond", "gentle dolphins in background ocean"]
    }
};

// ==========================================
// 휴먼디자인 타입별 액세서리/소품
// ==========================================
const HD_TYPE_ACCESSORIES: Record<HDType, string[]> = {
    "Generator": ["energetic pose mid-action", "glowing aura effect", "vibrant energy particles"],
    "Manifesting Generator": ["dynamic multi-tasking pose", "multiple colorful elements swirling", "sparkling energy"],
    "Projector": ["elegant reading glasses as hair accessory", "wise owl companion", "guiding light effect"],
    "Manifestor": ["powerful confident stance", "magical staff or wand", "crown of light", "initiator energy"],
    "Reflector": ["mirror-like crystal accessories", "moonlight glow", "ethereal translucent elements"]
};

// ==========================================
// 에니어그램별 테마 아이템
// ==========================================
const ENNEAGRAM_ITEMS: Record<number, string[]> = {
    1: ["elegant perfectionist styling", "clean symmetric composition", "pure white accents"],
    2: ["heart-shaped jewelry", "warm caring expression", "soft pink accents"],
    3: ["achievement trophy nearby", "spotlight effect", "star-quality aura"],
    4: ["artistic unique accessories", "dramatic romantic styling", "creative paint splashes"],
    5: ["sophisticated books nearby", "intellectual glasses", "mysterious depth"],
    6: ["protective amulet accessory", "loyal companion animal", "safe cozy setting"],
    7: ["playful confetti or bubbles", "adventure map elements", "joyful bright colors"],
    8: ["powerful commanding presence", "flame or fire accessories", "bold warrior elements"],
    9: ["peaceful zen elements", "harmony symbols", "soft flowing fabrics"]
};

// ==========================================
// 운세 점수별 분위기
// ==========================================
interface MoodStyle {
    atmosphere: string;
    lighting: string;
    effects: string;
}

const MOOD_STYLES: Record<string, MoodStyle> = {
    "fantastic": {  // 90-100
        atmosphere: "Magical fantasy atmosphere with sparkling golden dust, dreamy ethereal glow",
        lighting: "Heavenly golden sunlight with rainbow lens flares, angelic lighting",
        effects: "Glowing magical particles, cherry blossoms floating, starlight sparkles"
    },
    "great": {  // 75-89
        atmosphere: "Romantic dreamy atmosphere with soft warm ambiance",
        lighting: "Beautiful golden hour lighting with gentle lens flares",
        effects: "Soft petals floating, gentle bokeh lights"
    },
    "good": {  // 60-74
        atmosphere: "Pleasant bright atmosphere with cheerful vibe",
        lighting: "Natural soft lighting with warm tones",
        effects: "Subtle ambient light effects"
    },
    "neutral": {  // 40-59
        atmosphere: "Calm balanced atmosphere",
        lighting: "Even natural lighting",
        effects: "Minimal effects, clean look"
    },
    "caution": {  // 20-39
        atmosphere: "Mysterious moody atmosphere with slight tension",
        lighting: "Dramatic shadows with cool undertones",
        effects: "Slight fog or mist, dramatic contrast"
    },
    "dark": {  // 0-19
        atmosphere: "Dark dramatic atmosphere with intense mysterious vibe",
        lighting: "Dramatic noir lighting with deep shadows",
        effects: "Dark smoke wisps, dramatic rain or storm backdrop"
    }
};

/**
 * 운세 점수에서 분위기 등급 결정
 */
function getMoodTier(score: number): string {
    if (score >= 90) return "fantastic";
    if (score >= 75) return "great";
    if (score >= 60) return "good";
    if (score >= 40) return "neutral";
    if (score >= 20) return "caution";
    return "dark";
}

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
    const basePrompt = matchGender === "female" ? BASE_FEMALE_PROMPT : BASE_MALE_PROMPT;

    // 오늘의 오행 기반 스타일
    const elementStyle = ELEMENT_STYLES[dailyEnergy.element];
    const color = elementStyle.colors[Math.floor(Math.random() * elementStyle.colors.length)];
    const setting = elementStyle.settings[0];

    // 휴먼디자인 타입 소품
    const hdType = profile.humanDesign?.type || "Generator";
    const hdAccessory = HD_TYPE_ACCESSORIES[hdType][Math.floor(Math.random() * HD_TYPE_ACCESSORIES[hdType].length)];

    // 에니어그램 아이템
    const enneagramType = profile.enneagram?.type || 7;
    const enneagramItem = ENNEAGRAM_ITEMS[enneagramType]?.[0] || "joyful expression";

    // 운세 점수 기반 분위기
    const moodTier = getMoodTier(fortune.score);
    const moodStyle = MOOD_STYLES[moodTier];
    const moodScore = fortune.score >= 75 ? 2 : fortune.score >= 60 ? 1 : fortune.score >= 40 ? 0 : fortune.score >= 20 ? -1 : -2;

    // 오행에 따른 추가 요소
    const flower = elementStyle.flowers[Math.floor(Math.random() * elementStyle.flowers.length)];
    const animal = elementStyle.animals[Math.floor(Math.random() * elementStyle.animals.length)];

    // 의상 결정
    const outfit = matchGender === "female"
        ? "off-shoulder dress"
        : "tailored blazer";

    // 프롬프트 조합
    const moodAtmosphereText = `${moodStyle.atmosphere}. ${moodStyle.lighting}. ${moodStyle.effects}`;

    let prompt = basePrompt
        .replace("{COLOR}", color)
        .replace("{OUTFIT}", outfit)
        .replace("{SETTING}", setting)
        .replace("{MOOD_ATMOSPHERE}", moodAtmosphereText);

    // 추가 요소들
    const additionalElements = [
        hdAccessory,
        enneagramItem,
        `${flower} decoration`,
        animal
    ].filter(Boolean).join(", ");

    prompt += ` Additional elements: ${additionalElements}. NOT cartoon, NOT anime.`;

    // 핵심 특징 리스트
    const keyFeatures = [
        `${color} outfit`,
        hdAccessory,
        enneagramItem,
        moodTier + " mood",
        flower
    ];

    return {
        prompt,
        gender: matchGender,
        style: `${dailyEnergy.elementKorean} + ${hdType} + ${enneagramType}유형`,
        keyFeatures,
        moodScore
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

    const moodDesc = prompt.moodScore >= 1
        ? "환상적인 분위기로 만남이 기대되는"
        : prompt.moodScore <= -1
            ? "신비롭고 미스터리한 분위기의"
            : "편안하고 자연스러운 분위기의";

    return `오늘 ${dailyEnergy.zodiacKorean}의 기운을 가진 ${genderWord}가 나타날 수 있어요.
${moodDesc} ${genderWord}와 눈이 마주칠지도 몰라요!
#${fortune.keywords[0] || "설렘"} #오늘의짝꿍`;
}
