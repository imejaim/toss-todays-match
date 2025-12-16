export type Gender = "male" | "female" | "other" | "";
export type RelationshipStatus = "single" | "dating" | "married" | "complicated" | "";

export interface UserProfile {
    nickname: string;
    birthDate: string; // YYYY-MM-DD
    gender: Gender;
    relationshipStatus: RelationshipStatus;
}

export interface FortuneResult {
    score: number;
    keywords: string[];
    message: string;
}

export const defaultProfile: UserProfile = {
    nickname: "",
    birthDate: "",
    gender: "",
    relationshipStatus: "",
};
