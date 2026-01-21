export type Gender = "male" | "female" | "other" | "";
export type RelationshipStatus = "single" | "dating" | "married" | "complicated" | "";

export type SajuElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type SajuZodiac = "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake" | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export interface SajuPillar {
    element: SajuElement;
    zodiac: SajuZodiac;
}

export interface SajuPillars {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    hour?: SajuPillar;
}

export interface SajuResult {
    pillars: SajuPillars;
    dayMaster: SajuPillar;
}

export type HDType = "Manifestor" | "Generator" | "Manifesting Generator" | "Projector" | "Reflector";
export type HDProfile = string; // e.g. "1/3"
export type HDAuthority = "Sacral" | "Splenic" | "Emotional" | "Mental" | "Lunar" | string;
export type HDStrategy = "To Respond" | "To Inform" | "Wait for Invitation" | "Wait a Lunar Cycle" | "";

export interface HDResult {
    type: HDType;
    profile: HDProfile;
    authority?: HDAuthority;
    strategy?: HDStrategy;
}

export type HumanDesignProfile = HDResult;

export interface EnneagramProfile {
    type: number;
    wing?: number;
}

export interface UserProfile {
    id: string;
    nickname: string;
    birthDate: string;
    birthTime: string;
    gender: Gender;
    relationshipStatus: RelationshipStatus;
    saju?: SajuResult;
    humanDesign?: HumanDesignProfile;
    enneagram?: EnneagramProfile;
    avatarUrl?: string;  // 운명의 짝꿍 이미지 URL
    customization?: {
        preferredSpecies?: string;
        adjective?: string;
    };
}

export interface FortuneResult {
    score: number;
    keywords: string[];
    message: string;
}

export const defaultProfile: UserProfile = {
    id: "me",
    nickname: "",
    birthDate: "",
    birthTime: "",
    gender: "",
    relationshipStatus: "",
};
