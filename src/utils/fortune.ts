import type { UserProfile, FortuneResult } from "../types";

/**
 * 아주 간단한 가짜 운세 계산 로직
 * (나중에 LLM 기반이나 더 복잡한 로직으로 교체 예정)
 */
export function calcTodayFortune(profile: UserProfile): FortuneResult {
    // 1. Generate Seed
    const baseStr = (profile.birthDate || "1990-01-01") +
        (profile.birthTime || "12:00") +
        profile.nickname;

    let base = 0;
    for (let i = 0; i < baseStr.length; i++) {
        base += baseStr.charCodeAt(i);
    }

    const today = new Date();
    const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // 2. Calculate Score (70~100)
    const raw = (base * 157 + daySeed * 113) % 100;
    const score = 70 + (raw % 31);

    // 3. Generate Keywords
    const keywords: string[] = [];

    // Score-based keywords
    if (score > 95) keywords.push("최고의하루");
    else if (score > 90) keywords.push("러브시그널");
    else if (score > 80) keywords.push("자연스러운만남");
    else keywords.push("행운의징조");

    // Status-based keywords
    if (profile.relationshipStatus === "single") {
        const singlePool = ["운명적만남", "새로운인연", "매력발산", "심쿵주의"];
        keywords.push(singlePool[raw % singlePool.length]);
    } else if (profile.relationshipStatus === "dating") {
        const datingPool = ["애정확인", "설렘폭발", "깊어지는관계", "밀당금지"];
        keywords.push(datingPool[raw % datingPool.length]);
    } else if (profile.relationshipStatus === "married") {
        const marriedPool = ["가족의행복", "서로의신뢰", "따뜻한배려", "공감의시간"];
        keywords.push(marriedPool[raw % marriedPool.length]);
    } else {
        keywords.push("신비로운분위기");
    }

    // 4. Generate Message
    let message = "";
    if (profile.relationshipStatus === "single") {
        if (score > 90) message = "오늘따라 당신의 매력이 유난히 빛나요. 예상치 못한 곳에서 당신을 지켜보던 사람과 눈이 마주칠지도 몰라요. 솔직한 마음을 보여줄 때 행운이 찾아옵니다.";
        else if (score > 80) message = "사람들이 많이 모이는 곳에 운이 있어요. 가벼운 마음으로 나선 산책이나 친구와의 약속에서 흥미로운 대화가 시작될 것 같아요.";
        else message = "잠시 잊고 지냈던 자신의 장점을 발견하게 되는 날이에요. 스스로를 아끼는 모습이 다른 사람에게도 큰 매력으로 다가갑니다.";
    } else if (profile.relationshipStatus === "dating") {
        if (score > 90) message = "상대방과 마음이 닿는 진귀한 순간을 경험하게 될 거예요. 평소 전하지 못했던 진심을 담은 말 한마디가 두 사람의 사이를 훨씬 견고하게 만들어줍니다.";
        else if (score > 80) message = "사소한 오해가 풀리고 서로를 더 깊이 이해하게 되는 날입니다. 함께 맛있는 음식을 먹거나 조용히 걷는 시간만으로도 충분히 행복할 거예요.";
        else message = "오늘은 조금 더 귀를 기울여보세요. 상대방의 작은 배려를 발견할 때, 더 큰 사랑이 시작됩니다.";
    } else {
        if (score > 90) message = "함께하는 시간의 소중함을 느끼게 되는 하루입니다. 평소와 같은 일상이지만 상대방의 든든한 지지가 큰 힘이 되어줄 거예요.";
        else message = "익숙함 속에 숨겨진 고마움을 표현해보세요. 작은 칭찬이나 따뜻한 눈인사 하나로 오늘 하루가 한결 부드러워질 거예요.";
    }

    return { score, keywords, message };
}
