import type { HDType, HDProfile, HumanDesignProfile, HDAuthority, HDStrategy } from "../types";

const HD_TYPES: HDType[] = ["Generator", "Projector", "Manifestor", "Manifesting Generator", "Reflector"];
const HD_PROFILES: HDProfile[] = ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"];

/**
 * Deterministically calculates Human Design profile from birth data.
 * (Simplified for demo / initial universal logic)
 */
export function calculateHumanDesign(
    birthDate: string,
    birthTime: string
): HumanDesignProfile {
    // Generate a stable seed from birth data
    const seedStr = birthDate + birthTime;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    const absHash = Math.abs(hash);

    // Deterministic selection
    const type = HD_TYPES[absHash % HD_TYPES.length];
    const profile = HD_PROFILES[absHash % HD_PROFILES.length];

    // Authority depends slightly on type (simplified)
    let authority: HDAuthority = "Sacral";
    if (type === "Generator" || type === "Manifesting Generator") {
        authority = (absHash % 2 === 0) ? "Sacral" : "Emotional";
    } else if (type === "Projector") {
        const pAuth: HDAuthority[] = ["Splenic", "Emotional", "Mental"]; // Simplified list matching types.ts
        authority = pAuth[absHash % pAuth.length];
    } else if (type === "Manifestor") {
        authority = (absHash % 2 === 0) ? "Splenic" : "Emotional";
    } else {
        authority = "Lunar";
    }

    const strategyMap: Record<HDType, HDStrategy> = {
        "Generator": "To Respond",
        "Manifesting Generator": "To Respond",
        "Manifestor": "To Inform",
        "Projector": "Wait for Invitation",
        "Reflector": "Wait a Lunar Cycle",
        "": ""
    };

    return {
        type,
        profile,
        authority,
        strategy: strategyMap[type] || "To Respond"
    };
}
