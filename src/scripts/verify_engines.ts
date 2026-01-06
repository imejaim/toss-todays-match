/// <reference types="node" />

import { calculateSaju } from "../utils/sajuEngine";
import { calculateHumanDesign } from "../utils/hdEngine";
import { calculateEnneagram } from "../utils/enneagramEngine";
// import type { UserProfile, SajuProfile, HumanDesignProfile, EnneagramProfile } from "../types";

/**
 * [AntiGravity Verification Script]
 * 주요 계산 엔진(Saju, HD, Enneagram)의 정합성을 검증합니다.
 * 
 * Usage: npx tsx src/scripts/verify_engines.ts
 */

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

console.log("=== 🛡 AntiGravity Engine Verification Start ===\n");

// --- Test Case 1: Dong-ho (Special Case / Known Reference) ---
const dongHoProfile = {
    birthDate: "1980-03-10",
    birthTime: "00:00",
    isLunar: true // Important!
};

console.log(`[Test Case 1] Dong-ho (${dongHoProfile.birthDate}, Lunar: ${dongHoProfile.isLunar})`);

try {
    // 1. Saju Verification
    const saju = calculateSaju(dongHoProfile.birthDate, dongHoProfile.birthTime, dongHoProfile.isLunar);
    // Dong-ho (1980-03-10 Lunar) -> Day Master is 'Im-O' (Water Horse) or similar depending on library accuracy
    // Current library logic is 'simplified', so we check for consistency and non-empty values first.

    // Check structure
    assert(!!saju.dayMaster.stem, "Saju DayMaster Stem exists");
    assert(!!saju.dayMaster.element, "Saju DayMaster Element exists");
    console.log(`   -> Saju: ${saju.dayMaster.stem}${saju.dayMaster.branch} (${saju.dayMaster.element} ${saju.dayMaster.zodiac})`);

    // 2. Human Design Verification
    const hd = calculateHumanDesign(dongHoProfile.birthDate, dongHoProfile.birthTime);
    // Deterministic logic should return consistent results. 
    // Based on previous run: Projector / 2/4
    assert(hd.type === "Projector", "Human Design Type is Projector (Expected for deterministic seed)");
    assert(hd.profile === "2/4", "Human Design Profile is 2/4");
    console.log(`   -> HD: ${hd.type} (${hd.profile})`);

    // 3. Enneagram Verification
    const enneagram = calculateEnneagram(dongHoProfile.birthDate, dongHoProfile.birthTime);
    // Based on previous run: Type 3w2
    assert(enneagram.type === 3, "Enneagram Type is 3");
    assert(enneagram.wing === 2, "Enneagram Wing is 2");
    console.log(`   -> Enneagram: ${enneagram.type}w${enneagram.wing}`);

} catch (error) {
    console.error("❌ CRITICAL ERROR in Test Case 1:", error);
    process.exit(1);
}

console.log("\n[Test Case 1] Passed.\n");

// --- Test Case 2: General User (Stability Check) ---
const userProfile = {
    birthDate: "2000-01-01",
    birthTime: "12:00",
    isLunar: false
};

console.log(`[Test Case 2] General User (${userProfile.birthDate}, Solar)`);

try {
    const saju = calculateSaju(userProfile.birthDate, userProfile.birthTime, userProfile.isLunar);
    const hd = calculateHumanDesign(userProfile.birthDate, userProfile.birthTime);
    const enneagram = calculateEnneagram(userProfile.birthDate, userProfile.birthTime);

    // Just ensure they are generated without error
    assert(!!saju && !!hd && !!enneagram, "All engines returned objects");
    console.log(`   -> Saju: ${saju.dayMaster.stem}${saju.dayMaster.branch}`);
    console.log(`   -> HD: ${hd.type}`);

} catch (error) {
    console.error("❌ CRITICAL ERROR in Test Case 2:", error);
    process.exit(1);
}

console.log("\n[Test Case 2] Passed.\n");

console.log("=== 🎉 All Verification Tests Passed Successfully! ===");
