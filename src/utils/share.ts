/**
 * 공유 기능 유틸리티
 * 토스 앱: getTossShareLink + native share 사용
 * 일반 웹: Web Share API 또는 클립보드 사용
 */
import { share as tossShare, getTossShareLink } from "@apps-in-toss/web-framework";
import type { UserProfile, FortuneResult } from "../types";

export interface ShareContent {
    title: string;
    text: string;
    url?: string;
    imageUrl?: string;
}

/**
 * 안전한 기본 URL 반환
 */
function getSafeUrl(): string {
    if (typeof window === 'undefined') return "https://toss.im";
    const currentUrl = window.location.href;
    // Private 도메인은 메인으로 대체
    if (currentUrl.includes('private-apps.tossmini.com') || currentUrl.includes('localhost')) {
        return "https://toss.im";
    }
    return currentUrl;
}

/**
 * 딥링크 생성 (토스 앱용)
 */
async function generateTossLink(ogImageUrl?: string): Promise<string> {
    try {
        // 앱 스킴: intoss://todays-match (granite.config.ts appName 기준)
        // OG 이미지가 없으면 기본 아이콘 사용
        const iconUrl = "https://raw.githubusercontent.com/imejaim/toss-todays-match/main/public/icon.png";

        return await getTossShareLink(
            "intoss://todays-match",
            ogImageUrl || iconUrl
        );
    } catch (e) {
        console.warn("Toss Share Link 생성 실패:", e);
        return getSafeUrl();
    }
}

/**
 * [Async] 통합 공유 함수
 * - 토스 환경: getTossShareLink -> tossShare
 * - 웹 환경: navigator.share -> clipboard
 */
export async function shareToToss(
    text: string,
    ogImageUrl?: string,
    fallbackUrl?: string
): Promise<boolean | string> {
    try {
        // 1. 토스 공유 링크 생성
        const shareLink = await generateTossLink(ogImageUrl);
        const fullMessage = `${text}\n\n${shareLink}`;

        // 2. 토스 네이티브 공유 시도
        try {
            await tossShare({ message: fullMessage });
            return true;
        } catch (e) {
            console.log("Not in Toss App, falling back to Web Share", e);
        }

        // 3. Fallback: Web Share API
        if (typeof navigator !== "undefined" && navigator.share) {
            await navigator.share({
                text: fullMessage,
                url: fallbackUrl || shareLink
            });
            return true;
        }

        // 4. Fallback: Clipboard
        const success = await copyToClipboard(fullMessage);
        return success ? "copied" : false;
    } catch (e) {
        console.error("Share failed:", e);
        return false;
    }
}

// ==========================================
// 비즈니스 로직별 공유 함수 (async)
// ==========================================

export async function shareFortune(profile: UserProfile, fortune: FortuneResult) {
    const nickname = profile.nickname || "익명";
    const score = fortune.score;
    const keywords = fortune.keywords.map(k => `#${k}`).join(" ");
    const scoreEmoji = score >= 90 ? "🌟" : score >= 75 ? "💕" : score >= 50 ? "✨" : "🍀";

    const text = `${scoreEmoji} ${nickname}님의 오늘 연애 점수: ${score}점!

${keywords}

나도 오늘의 연애 운세 확인하러 가기 👇`;

    return shareToToss(text);
}

export async function shareMatch(
    profile: UserProfile,
    fortune: FortuneResult,
    matchGender: "male" | "female",
    ogImageUrl?: string
) {
    const nickname = profile.nickname || "익명";
    const genderWord = matchGender === "female" ? "그녀" : "그";
    const keywords = fortune.keywords.slice(0, 2).map(k => `#${k}`).join(" ");

    const text = `💕 ${nickname}님이 오늘 만날 수 있는 ${genderWord}의 모습!

${keywords} #오늘의운명짝꿍

나도 오늘의 운명 짝꿍 확인하러 가기 👇`;

    return shareToToss(text, ogImageUrl);
}


// ==========================================
// 레거시 / 헬퍼 함수
// ==========================================

async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
