/**
 * 짝꿍 이미지 프롬프트 생성기 v3
 * 
 * 명칭:
 * - 나의 모습: "오늘의 내 모습" 🪞
 * - 짝꿍 모습: "오늘의 운명 짝꿍" 💕
 * 
 * 스타일:
 * - 여성: 한국 이상적 미인 (에메랄드 그린 드레스 기준)
 * - 남성 20-30대: 차은우풍 미남
 * - 남성 40-50대: 정우성/원빈풍 미남
 * - 의상: 상황에 따라 변동 (캐주얼, 정장, 드레스, 비키니 등)
 */
import type { UserProfile, FortuneResult, SajuElement, HDType } from "../types";
import type { DailyEnergy } from "./dailyEnergy";

export interface MatchImagePrompt {
    prompt: string;
    gender: "male" | "female";
    style: string;
    keyFeatures: string[];
    moodScore: number;  // -2 ~ +2 (나쁨 ~ 좋음)
    title: string;      // UI 표시용 제목
}

// ==========================================
// 기준 프롬프트 (Base Prompt)
// ==========================================

// 여성 기준 프롬프트
const BASE_FEMALE_PROMPT = `Stunning idealized young Korean woman with doll-like perfect features, large captivating eyes, small v-line face, flawless porcelain skin, long silky black hair with soft waves flowing freely. Confident charismatic gaze, slight seductive alluring smile. Glamorous hourglass figure in {OUTFIT}. Standing in {SETTING}. {MOOD_ATMOSPHERE}. Soft dreamy lighting. Korean beauty ideal, slightly stylized perfection, high fashion editorial, 8k resolution.`;

// 남성 기준 프롬프트 (20-30대 - 차은우풍)
const BASE_MALE_YOUNG_PROMPT = `Incredibly handsome idealized young Korean man like Cha Eun-woo, with perfect doll-like features, deep captivating eyes, sharp jawline, flawless porcelain skin, styled dark wavy hair. Confident charismatic gaze, charming slight smile. Athletic fit body in {OUTFIT}. Standing in {SETTING}. {MOOD_ATMOSPHERE}. Soft dreamy lighting. Korean beauty ideal male, slightly stylized perfection, high fashion editorial, 8k resolution.`;

// 남성 기준 프롬프트 (40-50대 - 정우성/원빈풍)
const BASE_MALE_MATURE_PROMPT = `Incredibly handsome mature Korean man like Jung Woo-sung or Won Bin in his 40s, with sharp masculine features, deep magnetic eyes, defined jawline, flawless skin, styled dark hair with slight sophistication. Confident commanding gaze, charming mysterious smile. Athletic fit body in {OUTFIT}. Standing in {SETTING}. {MOOD_ATMOSPHERE}. Luxurious sophisticated atmosphere. Korean beauty ideal mature male, slightly stylized perfection, high fashion editorial, 8k resolution.`;

// ==========================================
// 오행별 색상 & 분위기
// ==========================================
interface ElementStyle {
    colors: string[];
    settings: string[];
    flowers: string[];
    animals: string[];
    outfitsFemale: string[];
    outfitsMale: string[];
}

const ELEMENT_STYLES: Record<SajuElement, ElementStyle> = {
    "Wood": {
        colors: ["emerald green", "forest green", "sage green"],
        settings: ["trendy botanical cafe with hanging plants and wooden interior, golden sunlight streaming through"],
        flowers: ["bamboo leaves", "fern fronds", "green ivy"],
        animals: ["small bird perched nearby", "butterfly landing on shoulder"],
        outfitsFemale: ["elegant emerald green off-shoulder satin dress showing beautiful collarbone", "stylish sage green silk blouse with delicate gold accessories", "chic forest green casual blazer dress"],
        outfitsMale: ["elegant emerald green casual blazer over white t-shirt", "stylish sage green linen shirt with rolled sleeves", "relaxed forest green sweater with sophisticated watch"]
    },
    "Fire": {
        colors: ["passionate red", "coral orange", "burgundy"],
        settings: ["rooftop terrace at golden hour with warm sunset glow and fairy lights, city skyline behind"],
        flowers: ["red roses", "orange marigolds", "fiery poppies"],
        animals: ["phoenix feather accessory", "small flame wisps around"],
        outfitsFemale: ["stunning passionate red off-shoulder gown showing elegant shoulders", "chic burgundy fitted dress with gold jewelry", "bold coral orange cocktail dress"],
        outfitsMale: ["elegant burgundy red tailored suit with open collar white shirt", "sophisticated passionate red blazer over black turtleneck", "stylish coral casual jacket with confident pose"]
    },
    "Earth": {
        colors: ["warm beige", "honey brown", "terracotta"],
        settings: ["cozy rustic cafe with warm lighting, exposed brick and lush greenery"],
        flowers: ["sunflowers", "daisies", "wheat stalks"],
        animals: ["small rabbit nearby", "gentle deer in background"],
        outfitsFemale: ["elegant warm beige off-shoulder knit dress with gold accents", "stylish honey brown wrap dress", "chic terracotta linen outfit"],
        outfitsMale: ["sophisticated warm beige cashmere sweater with tailored pants", "elegant honey brown blazer over cream shirt", "relaxed terracotta linen suit"]
    },
    "Metal": {
        colors: ["silver white", "platinum gray", "pearl"],
        settings: ["sleek modern gallery with minimalist decor and soft ambient lighting"],
        flowers: ["white orchids", "silver eucalyptus", "crystal flowers"],
        animals: ["white peacock feathers", "silver butterfly"],
        outfitsFemale: ["luxurious silver white satin gown with elegant draping", "chic platinum gray tailored dress with pearl accessories", "stunning pearl white off-shoulder top"],
        outfitsMale: ["sleek silver gray tailored suit with white pocket square", "elegant platinum blazer over black shirt", "sophisticated pearl white dress shirt with silver accessories"]
    },
    "Water": {
        colors: ["deep ocean blue", "midnight navy", "aqua teal"],
        settings: ["elegant oceanfront cafe with sea breeze, waves visible through large windows"],
        flowers: ["blue hydrangeas", "water lilies", "lotus flowers"],
        animals: ["koi fish in nearby pond", "gentle dolphins in background ocean"],
        outfitsFemale: ["elegant deep ocean blue off-shoulder satin dress with silver accessories", "stunning midnight navy cocktail dress", "chic aqua teal silk blouse showing collarbone"],
        outfitsMale: ["elegant deep ocean blue tailored suit with confident pose", "sophisticated midnight navy blazer over light blue shirt", "stylish aqua teal casual jacket with beach vibe"]
    }
};

// ==========================================
// 휴먼디자인 타입별 액세서리/소품
// ==========================================
const HD_TYPE_ACCESSORIES: Record<HDType, string[]> = {
    "Generator": ["energetic pose mid-action", "glowing aura effect", "vibrant energy particles"],
    "Manifesting Generator": ["dynamic multi-tasking pose", "multiple colorful elements swirling", "sparkling energy"],
    "Projector": ["elegant reading glasses as hair accessory", "wise owl companion", "guiding light effect"],
    "Manifestor": ["powerful confident stance", "magical staff or wand nearby", "crown of light", "initiator energy"],
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
    "fantastic": {
        atmosphere: "Magical fantasy atmosphere with sparkling golden dust, dreamy ethereal glow",
        lighting: "Heavenly golden sunlight with rainbow lens flares, angelic lighting",
        effects: "Glowing magical particles, cherry blossoms floating, starlight sparkles"
    },
    "great": {
        atmosphere: "Romantic dreamy atmosphere with soft warm ambiance",
        lighting: "Beautiful golden hour lighting with gentle lens flares",
        effects: "Soft petals floating, gentle bokeh lights"
    },
    "good": {
        atmosphere: "Pleasant bright atmosphere with cheerful vibe",
        lighting: "Natural soft lighting with warm tones",
        effects: "Subtle ambient light effects"
    },
    "neutral": {
        atmosphere: "Calm balanced atmosphere",
        lighting: "Even natural lighting",
        effects: "Minimal effects, clean look"
    },
    "caution": {
        atmosphere: "Mysterious moody atmosphere with slight tension",
        lighting: "Dramatic shadows with cool undertones",
        effects: "Slight fog or mist, dramatic contrast"
    },
    "dark": {
        atmosphere: "Dark dramatic atmosphere with intense mysterious vibe",
        lighting: "Dramatic noir lighting with deep shadows",
        effects: "Dark smoke wisps, dramatic rain or storm backdrop"
    }
};

function getMoodTier(score: number): string {
    if (score >= 90) return "fantastic";
    if (score >= 75) return "great";
    if (score >= 60) return "good";
    if (score >= 40) return "neutral";
    if (score >= 20) return "caution";
    return "dark";
}

/**
 * 사용자 나이 계산
 */
function calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

/**
 * 오늘의 운명 짝꿍 이미지 프롬프트 생성
 */
export function generateMatchImagePrompt(
    profile: UserProfile,
    fortune: FortuneResult,
    dailyEnergy: DailyEnergy
): MatchImagePrompt {
    // 사용자 성별의 반대 성별로 이상형 생성
    const matchGender: "male" | "female" = profile.gender === "male" ? "female" : "male";

    // 나이 계산 (짝꿍 나이대 결정용 - 사용자와 비슷한 나이대)
    const userAge = profile.birthDate ? calculateAge(profile.birthDate) : 30;
    const isMature = userAge >= 40;

    // 기본 프롬프트 선택
    let basePrompt: string;
    if (matchGender === "female") {
        basePrompt = BASE_FEMALE_PROMPT;
    } else {
        basePrompt = isMature ? BASE_MALE_MATURE_PROMPT : BASE_MALE_YOUNG_PROMPT;
    }

    // 오늘의 오행 기반 스타일
    const elementStyle = ELEMENT_STYLES[dailyEnergy.element];
    const setting = elementStyle.settings[0];

    // 의상 선택 (오행에 맞는 색상의 의상)
    const outfits = matchGender === "female" ? elementStyle.outfitsFemale : elementStyle.outfitsMale;
    const outfit = outfits[Math.floor(Math.random() * outfits.length)];

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

    // 프롬프트 조합
    const moodAtmosphereText = `${moodStyle.atmosphere}. ${moodStyle.lighting}. ${moodStyle.effects}`;

    let prompt = basePrompt
        .replace("{OUTFIT}", outfit)
        .replace("{SETTING}", setting)
        .replace("{MOOD_ATMOSPHERE}", moodAtmosphereText);

    // 추가 요소들
    const additionalElements = [hdAccessory, enneagramItem, `${flower} decoration`, animal].filter(Boolean).join(", ");
    prompt += ` Additional elements: ${additionalElements}. NOT cartoon, NOT anime.`;

    // 핵심 특징 리스트
    const keyFeatures = [
        dailyEnergy.elementKorean,
        hdType,
        `${enneagramType}유형`,
        moodTier
    ];

    // 제목 결정
    const title = "오늘의 운명 짝꿍 💕";

    return {
        prompt,
        gender: matchGender,
        style: `${dailyEnergy.elementKorean} + ${hdType} + ${enneagramType}유형`,
        keyFeatures,
        moodScore,
        title
    };
}

/**
 * 오늘의 내 모습 이미지 프롬프트 생성
 */
export function generateSelfImagePrompt(
    profile: UserProfile,
    fortune: FortuneResult,
    dailyEnergy: DailyEnergy
): MatchImagePrompt {
    // 자신의 성별로 이미지 생성
    const selfGender: "male" | "female" = profile.gender === "male" ? "male" : "female";

    // 나이 계산
    const userAge = profile.birthDate ? calculateAge(profile.birthDate) : 30;
    const isMature = userAge >= 40;

    // 기본 프롬프트 선택
    let basePrompt: string;
    if (selfGender === "female") {
        basePrompt = BASE_FEMALE_PROMPT;
    } else {
        basePrompt = isMature ? BASE_MALE_MATURE_PROMPT : BASE_MALE_YOUNG_PROMPT;
    }

    // 나머지는 동일한 로직
    const elementStyle = ELEMENT_STYLES[dailyEnergy.element];
    const setting = elementStyle.settings[0];
    const outfits = selfGender === "female" ? elementStyle.outfitsFemale : elementStyle.outfitsMale;
    const outfit = outfits[Math.floor(Math.random() * outfits.length)];

    const hdType = profile.humanDesign?.type || "Generator";
    const hdAccessory = HD_TYPE_ACCESSORIES[hdType][Math.floor(Math.random() * HD_TYPE_ACCESSORIES[hdType].length)];

    const enneagramType = profile.enneagram?.type || 7;
    const enneagramItem = ENNEAGRAM_ITEMS[enneagramType]?.[0] || "joyful expression";

    const moodTier = getMoodTier(fortune.score);
    const moodStyle = MOOD_STYLES[moodTier];
    const moodScore = fortune.score >= 75 ? 2 : fortune.score >= 60 ? 1 : fortune.score >= 40 ? 0 : fortune.score >= 20 ? -1 : -2;

    const flower = elementStyle.flowers[Math.floor(Math.random() * elementStyle.flowers.length)];
    const animal = elementStyle.animals[Math.floor(Math.random() * elementStyle.animals.length)];

    const moodAtmosphereText = `${moodStyle.atmosphere}. ${moodStyle.lighting}. ${moodStyle.effects}`;

    let prompt = basePrompt
        .replace("{OUTFIT}", outfit)
        .replace("{SETTING}", setting)
        .replace("{MOOD_ATMOSPHERE}", moodAtmosphereText);

    const additionalElements = [hdAccessory, enneagramItem, `${flower} decoration`, animal].filter(Boolean).join(", ");
    prompt += ` Additional elements: ${additionalElements}. NOT cartoon, NOT anime.`;

    const keyFeatures = [dailyEnergy.elementKorean, hdType, `${enneagramType}유형`, moodTier];
    const title = "오늘의 내 모습 🪞";

    return {
        prompt,
        gender: selfGender,
        style: `${dailyEnergy.elementKorean} + ${hdType} + ${enneagramType}유형`,
        keyFeatures,
        moodScore,
        title
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
#${fortune.keywords[0] || "설렘"} #오늘의운명짝꿍`;
}
