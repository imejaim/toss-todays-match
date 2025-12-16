import type { UserProfile, FortuneResult } from "../types";

/**
 * 아주 간단한 가짜 운세 계산 로직
 * (나중에 LLM 기반이나 더 복잡한 로직으로 교체 예정)
 */
export function calcTodayFortune(profile: UserProfile): FortuneResult {
    const base = profile.birthDate
        ? Number(profile.birthDate.replace(/-/g, "").slice(-4))
        : 7777;
    const today = new Date();
    const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const raw = (base * 37 + daySeed * 17) % 100;
    const score = 60 + (raw % 41); // 60~100 사이 점수

    const keywords: string[] = [];
    if (score > 90) keywords.push("고백운");
    else if (score > 80) keywords.push("소개팅운");
    else if (score > 70) keywords.push("대화운");
    else keywords.push("셀프케어");

    if (profile.relationshipStatus === "single") {
        keywords.push("새로운인연");
    } else if (profile.relationshipStatus === "dating") {
        keywords.push("관계성장");
    } else if (profile.relationshipStatus === "married") {
        keywords.push("가족운");
    }

    const message =
        score > 85
            ? "오늘은 마음이 가는 방향으로 한 걸음 더 다가가 보기에 좋은 날이에요."
            : score > 70
                ? "조급해하기보다는 가볍게 안부를 묻고, 분위기를 살피는 쪽이 좋아요."
                : "나를 돌보고 에너지를 채우는 데 집중하면, 다음 기회가 훨씬 편해질 거예요.";

    return { score, keywords, message };
}
