import { Solar, Lunar } from "lunar-javascript";
import type { SajuElement, SajuPillar, SajuZodiac, SajuProfile } from "../types";

const STEM_ELEMENTS: Record<string, SajuElement> = {
    "甲": "Wood", "乙": "Wood",
    "丙": "Fire", "丁": "Fire",
    "戊": "Earth", "己": "Earth",
    "庚": "Metal", "辛": "Metal",
    "壬": "Water", "癸": "Water"
};

const BRANCH_ZODIAC: Record<string, SajuZodiac> = {
    "子": "Rat", "丑": "Ox", "寅": "Tiger", "卯": "Rabbit",
    "辰": "Dragon", "巳": "Snake", "午": "Horse", "未": "Goat",
    "申": "Monkey", "酉": "Rooster", "戌": "Dog", "亥": "Pig"
};

const BRANCH_ELEMENTS: Record<string, SajuElement> = {
    "子": "Water", "亥": "Water",
    "寅": "Wood", "卯": "Wood",
    "巳": "Fire", "午": "Fire",
    "申": "Metal", "酉": "Metal",
    "辰": "Earth", "戌": "Earth", "丑": "Earth", "未": "Earth"
};

/**
 * Calculates Saju Profile from birth date and time
 */
export function calculateSaju(
    birthDate: string, // YYYY-MM-DD
    birthTime: string, // HH:mm
    isLunar: boolean = false
): SajuProfile {
    const [year, month, day] = birthDate.split("-").map(Number);
    const [hour, minute] = birthTime.split(":").map(Number);

    let solar: Solar;
    if (isLunar) {
        // Simplified: assuming positive lunar date
        const lunar = Lunar.fromYmd(year, month, day);
        solar = lunar.getSolar();
    } else {
        solar = Solar.fromYmd(year, month, day);
    }

    // Set time for more accurate hour pillar
    const solarWithTime = Solar.fromYmdHms(
        solar.getYear(),
        solar.getMonth(),
        solar.getDay(),
        hour,
        minute,
        0
    );

    const lunarObj = solarWithTime.getLunar();
    const eightChar = lunarObj.getEightChar();

    const createPillar = (stem: string, branch: string): SajuPillar => ({
        stem,
        branch,
        element: STEM_ELEMENTS[stem] || BRANCH_ELEMENTS[branch] || "Earth",
        zodiac: BRANCH_ZODIAC[branch]
    });

    const pillars = {
        year: createPillar(eightChar.getYearGan(), eightChar.getYearZhi()),
        month: createPillar(eightChar.getMonthGan(), eightChar.getMonthZhi()),
        day: createPillar(eightChar.getDayGan(), eightChar.getDayZhi()),
        time: createPillar(eightChar.getTimeGan(), eightChar.getTimeZhi())
    };

    return {
        pillars,
        dayMaster: pillars.day
    };
}
