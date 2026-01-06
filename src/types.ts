export type Gender = "male" | "female" | "other" | "";
export type RelationshipStatus = "single" | "dating" | "married" | "complicated" | "";

export interface UserProfile {
    id: string; // Unique ID for each profile
    nickname: string;
    birthDate: string; // YYYY-MM-DD
    birthTime: string; // HH:mm or "unknown"
    gender: Gender;
    relationshipStatus: RelationshipStatus;
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
