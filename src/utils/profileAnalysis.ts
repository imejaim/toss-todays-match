import type { SajuElement, HDType, HDProfile, UserProfile, SajuZodiac } from "../types";

// Enneagram Type to Animal Species mapping
export const getSpeciesByEnneagram = (type: number): string => {
    const speciesMap: Record<number, string> = {
        1: "Bee",
        2: "Dog",
        3: "Peacock",
        4: "Cat",
        5: "Owl",
        6: "Wolf",
        7: "Monkey",
        8: "Lion",
        9: "Elephant",
    };
    return speciesMap[type] || "Unknown";
};

// Saju Zodiac to Animal Species mapping
export const getZodiacSpecies = (zodiac: SajuZodiac): string => {
    const zodiacMap: Record<SajuZodiac, string> = {
        "Rat": "Rat", "Ox": "Ox", "Tiger": "Tiger", "Rabbit": "Rabbit",
        "Dragon": "Dragon", "Snake": "Snake", "Horse": "Horse", "Goat": "Goat",
        "Monkey": "Monkey", "Rooster": "Rooster", "Dog": "Dog", "Pig": "Pig"
    };
    return zodiacMap[zodiac] || "Unknown";
};

// Saju Element to Pastel Color mapping
export const getColorByElement = (element: SajuElement): string => {
    const colorMap: Record<SajuElement, string> = {
        Wood: "#A8E6CF",   // Mint Green
        Fire: "#FFD3B6",   // Coral Pink
        Earth: "#DCEDC1",  // Warm Yellow/Beige
        Metal: "#F1F1F1",  // Silver White
        Water: "#A8D8EA",  // Pastel Blue
    };
    return colorMap[element] || "#FFFFFF";
};

// Saju Element to Korean Name mapping
export const getElementKoreanName = (element: SajuElement): string => {
    const nameMap: Record<SajuElement, string> = {
        Wood: "목(木) 🌳",
        Fire: "화(火) 🔥",
        Earth: "토(土) 🌍",
        Metal: "금(金) ✨",
        Water: "수(水) 💧",
    };
    return nameMap[element] || "미지";
};

// Get element emoji only
export const getElementEmoji = (element: SajuElement): string => {
    const emojiMap: Record<SajuElement, string> = {
        Wood: "🌳",
        Fire: "🔥",
        Earth: "🌍",
        Metal: "✨",
        Water: "💧",
    };
    return emojiMap[element] || "⭐";
};

// Human Design Type to Icon/Item mapping
export const getIconByHDType = (type: HDType): string => {
    const iconMap: Partial<Record<HDType, string>> = {
        "Manifestor": "Crown",
        "Generator": "Engine",
        "Manifesting Generator": "Lightning",
        "Projector": "Compass",
        "Reflector": "Moon",
    };
    return iconMap[type] || "Star";
};

// Human Design Profile to Accessory mapping
export const getAccessoryByProfile = (profile: HDProfile): string => {
    // Priority mapping for mixed profiles
    if (profile.includes("5")) return "Aviator Goggles"; // Problem Solver / Visionary / Heretic
    if (profile.includes("3")) return "Backpack";        // Trial & Error / Explorer / Martyr
    if (profile.includes("1")) return "Book";            // Investigator
    if (profile.includes("2")) return "Magnifier";        // Hermit / Detail oriented
    if (profile.includes("4")) return "Badge";            // Opportunist / Networker
    if (profile.includes("6")) return "Scroll";           // Role Model / Wise
    return "None";
};

// Adjective generation based on Saju/HD
export const getAdjective = (element: SajuElement, hdType: HDType): string => {
    const elementAdjectives: Record<SajuElement, string> = {
        Wood: "Growing", Fire: "Passionate", Earth: "Relaxed", Metal: "Sharp", Water: "Wise"
    };
    const typeAdjectives: Record<HDType, string> = {
        "Manifestor": "Pioneering",
        "Generator": "Steady",
        "Manifesting Generator": "Energetic",
        "Projector": "Insightful",
        "Reflector": "Observant"
    };

    // Mix them or pick one
    return `${elementAdjectives[element]} ${typeAdjectives[hdType]}`;
};

// Character Prompt Generator Logic
export interface CharacterVisuals {
    species: string;
    speciesKorean: string;
    adjective: string;
    adjectiveKorean: string;
    mainColor: string;
    elementName: string;  // "수(水) 💧" format
    element: SajuElement;
    accessory: string;
    accessoryKorean: string;
}

// Korean translations
const speciesKoreanMap: Record<string, string> = {
    "Rat": "쥐", "Ox": "소", "Tiger": "호랑이", "Rabbit": "토끼",
    "Dragon": "용", "Snake": "뱀", "Horse": "말", "Goat": "양",
    "Monkey": "원숭이", "Rooster": "닭", "Dog": "강아지", "Pig": "돼지",
    "Bee": "꿀벌", "Cat": "고양이", "Owl": "부엉이", "Wolf": "늑대",
    "Peacock": "공작", "Lion": "사자", "Elephant": "코끼리"
};

const adjectiveKoreanMap: Record<string, string> = {
    "Growing": "성장하는", "Passionate": "열정적인", "Relaxed": "여유로운",
    "Sharp": "날카로운", "Wise": "지혜로운",
    "Pioneering": "개척하는", "Steady": "꾸준한", "Energetic": "에너지 넘치는",
    "Insightful": "통찰력 있는", "Observant": "관찰력 좋은"
};

const accessoryKoreanMap: Record<string, string> = {
    "Aviator Goggles": "비행 고글", "Backpack": "배낭", "Book": "책",
    "Magnifier": "돋보기", "Badge": "배지", "Scroll": "두루마리", "None": ""
};

export const generateCharacterPrompts = (
    profile: UserProfile
): CharacterVisuals => {
    // 1. Species Priority: Preference > Enneagram > Zodiac
    let species = profile.customization?.preferredSpecies || "Unknown";

    if (species === "Unknown" && profile.enneagram) {
        species = getSpeciesByEnneagram(profile.enneagram.type);
    }

    if (species === "Unknown" && profile.saju) {
        // Try Day branch zodiac first, then Year
        species = profile.saju.dayMaster.zodiac ? getZodiacSpecies(profile.saju.dayMaster.zodiac) : "Unknown";
        if (species === "Unknown") {
            species = profile.saju.pillars.year.zodiac ? getZodiacSpecies(profile.saju.pillars.year.zodiac) : "Monkey"; // Default fallback
        }
    }

    if (species === "Unknown") species = "Monkey"; // Final Fallback

    // 2. Adjective
    const dayMasterElement = profile.saju?.dayMaster.element || "Water";
    const hdType = profile.humanDesign?.type || "Generator";
    const adjective = profile.customization?.adjective || getAdjective(dayMasterElement, hdType);

    // 3. Color & Accessory
    const hdProfile = profile.humanDesign?.profile || "1/3";
    const accessory = getAccessoryByProfile(hdProfile);

    return {
        species,
        speciesKorean: speciesKoreanMap[species] || species,
        adjective,
        adjectiveKorean: adjective.split(" ").map(w => adjectiveKoreanMap[w] || w).join(" "),
        mainColor: getColorByElement(dayMasterElement),
        elementName: getElementKoreanName(dayMasterElement),
        element: dayMasterElement,
        accessory,
        accessoryKorean: accessoryKoreanMap[accessory] || accessory,
    };
};

export const getPromptFromVisuals = (visuals: CharacterVisuals): string => {
    return `A cheerful, ${visuals.mainColor}-themed ${visuals.species} character. 
            It is ${visuals.adjective} with a mischievous smile. 
            It is wearing ${visuals.accessory} and looking energetic. 
            3D render style, clean background, vivid pastel colors.`;
};
