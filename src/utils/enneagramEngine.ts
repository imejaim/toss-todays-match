import type { EnneagramProfile } from "../types";

/**
 * Deterministically calculates Enneagram type from birth data.
 */
export function calculateEnneagram(
    birthDate: string,
    birthTime: string
): EnneagramProfile {
    const seedStr = birthDate + birthTime + "enneagram";
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
    }

    const absHash = Math.abs(hash);
    const type = (absHash % 9) + 1; // 1 to 9

    // Random wing (one of the adjacent)
    const wingPool = [
        type === 1 ? 9 : type - 1,
        type === 9 ? 1 : type + 1
    ];
    const wing = wingPool[absHash % 2];

    return { type, wing };
}
