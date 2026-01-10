/**
 * 공유 기능 유틸리티
 * 운세 결과와 짝꿍 이미지를 SNS/앱으로 공유합니다.
 */
import type { UserProfile, FortuneResult } from "../types";

export interface ShareContent {
    title: string;
    text: string;
    url?: string;
    imageUrl?: string;
}

/**
 * 오늘의 운세 공유 콘텐츠 생성
 */
export function createFortuneShareContent(
    profile: UserProfile,
    fortune: FortuneResult
): ShareContent {
    const nickname = profile.nickname || "익명";
    const score = fortune.score;
    const keywords = fortune.keywords.map(k => `#${k}`).join(" ");

    const scoreEmoji = score >= 90 ? "🌟" : score >= 75 ? "💕" : score >= 50 ? "✨" : "🍀";

    return {
        title: `${nickname}님의 오늘의 연애 운세`,
        text: `${scoreEmoji} ${nickname}님의 오늘 연애 점수: ${score}점!

${keywords}

나도 오늘의 연애 운세 확인하러 가기 👇`,
        url: "https://toss.im/todays-match" // 실제 앱 링크로 교체 필요
    };
}

/**
 * 오늘의 운명 짝꿍 공유 콘텐츠 생성
 */
export function createMatchShareContent(
    profile: UserProfile,
    fortune: FortuneResult,
    matchGender: "male" | "female"
): ShareContent {
    const nickname = profile.nickname || "익명";
    const genderWord = matchGender === "female" ? "그녀" : "그";
    const keywords = fortune.keywords.slice(0, 2).map(k => `#${k}`).join(" ");

    return {
        title: `${nickname}님의 오늘의 운명 짝꿍`,
        text: `💕 오늘 만날 수 있는 ${genderWord}의 모습!

${keywords} #오늘의운명짝꿍

나도 오늘의 운명 짝꿍 확인하러 가기 👇`,
        url: "https://toss.im/todays-match"
    };
}

/**
 * Web Share API 지원 여부 확인
 */
export function canShare(): boolean {
    return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const result = document.execCommand("copy");
        document.body.removeChild(textarea);
        return result;
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        return false;
    }
}

/**
 * Web Share API로 공유
 */
export async function shareContent(content: ShareContent): Promise<boolean> {
    if (!canShare()) {
        console.warn("Web Share API not supported");
        return false;
    }

    try {
        await navigator.share({
            title: content.title,
            text: content.text,
            url: content.url
        });
        return true;
    } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
            console.error("Share failed:", error);
        }
        return false;
    }
}

/**
 * 카카오톡 공유 (카카오 SDK 필요)
 */
export function shareToKakao(content: ShareContent): void {
    // 카카오 SDK가 로드되어 있는지 확인
    const Kakao = (window as unknown as { Kakao?: { Share?: { sendDefault: (config: unknown) => void } } }).Kakao;

    if (!Kakao?.Share) {
        console.warn("Kakao SDK not loaded");
        // Fallback: 일반 공유 시도
        if (canShare()) {
            shareContent(content);
        } else {
            copyToClipboard(`${content.text}\n${content.url || ""}`);
            alert("링크가 복사되었습니다!");
        }
        return;
    }

    Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
            title: content.title,
            description: content.text.slice(0, 100),
            imageUrl: content.imageUrl || "https://toss.im/todays-match/og-image.png",
            link: {
                mobileWebUrl: content.url,
                webUrl: content.url
            }
        },
        buttons: [
            {
                title: "운세 보러가기",
                link: {
                    mobileWebUrl: content.url,
                    webUrl: content.url
                }
            }
        ]
    });
}

/**
 * 간편 공유 함수 (자동으로 최적의 방법 선택)
 */
export async function quickShare(content: ShareContent): Promise<"shared" | "copied" | "failed"> {
    // 1. Web Share API 시도
    if (canShare()) {
        const shared = await shareContent(content);
        if (shared) return "shared";
    }

    // 2. 클립보드 복사 fallback
    const shareText = `${content.text}\n\n${content.url || ""}`;
    const copied = await copyToClipboard(shareText);
    if (copied) return "copied";

    return "failed";
}
