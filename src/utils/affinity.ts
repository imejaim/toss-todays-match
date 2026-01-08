import type { SajuElement, UserProfile } from "../types";
import { analyzeSaju } from "./sajuEngine";

/**
 * Wu Xing (Five Elements) Compatibility Logic
 */
const GeneratingCycle: Record<SajuElement, SajuElement> = {
    Wood: "Fire",
    Fire: "Earth",
    Earth: "Metal",
    Metal: "Water",
    Water: "Wood",
};

const OvercomingCycle: Record<SajuElement, SajuElement> = {
    Wood: "Earth",
    Earth: "Water",
    Water: "Fire",
    Fire: "Metal",
    Metal: "Wood",
};

const ElementNameKr: Record<SajuElement, string> = {
    Wood: "목(木)",
    Fire: "화(火)",
    Earth: "토(土)",
    Metal: "금(金)",
    Water: "수(水)",
};

export interface AffinityResult {
    score: number;
    relation: "Generating" | "Overcoming" | "Same" | "Neutral";
    description: string;
}

export const calculateAffinity = (user: UserProfile, friend: UserProfile): AffinityResult => {
    // 1. Get Saju for both if not already present
    const userSaju = user.saju || analyzeSaju(user.birthDate, user.birthTime);
    const friendSaju = friend.saju || analyzeSaju(friend.birthDate, friend.birthTime);

    const userElement = userSaju.dayMaster.element;
    const friendElement = friendSaju.dayMaster.element;

    let score = 75; // Initial base score
    let relation: AffinityResult["relation"] = "Neutral";
    let description = "무난하고 평온한 관계입니다.";

    // 2. Main Logic: Generating
    if (GeneratingCycle[userElement] === friendElement) {
        score += 20;
        relation = "Generating";
        description = `${ElementNameKr[userElement]} 기운이 ${ElementNameKr[friendElement]} 기운을 북돋아주는 상생의 관계입니다.`;
    } else if (GeneratingCycle[friendElement] === userElement) {
        score += 15;
        relation = "Generating";
        description = `${ElementNameKr[friendElement]} 기운이 나를 든든하게 받쳐주는 따뜻한 관계입니다.`;
    }
    // 3. Overcoming
    else if (OvercomingCycle[userElement] === friendElement) {
        score -= 15;
        relation = "Overcoming";
        description = "서로의 다름을 인정하고 조율하는 지혜가 필요한 관계입니다.";
    } else if (OvercomingCycle[friendElement] === userElement) {
        score -= 20;
        relation = "Overcoming";
        description = "때로는 긴장감이 맴돌 수 있으니 서로 배려가 필요합니다.";
    }
    // 4. Same Element
    else if (userElement === friendElement) {
        score += 10;
        relation = "Same";
        description = "서로 성향이 비슷하여 말하지 않아도 통하는 친구입니다.";
    }

    // Cap score
    score = Math.min(score, 99);
    score = Math.max(score, 50);

    return { score, relation, description };
};

export const getBestMatch = (user: UserProfile, friends: UserProfile[]) => {
    if (friends.length === 0) return null;

    const results = friends.map(f => ({
        friend: f,
        affinity: calculateAffinity(user, f)
    }));

    return results.reduce((prev, current) =>
        (prev.affinity.score > current.affinity.score) ? prev : current
    );
};
