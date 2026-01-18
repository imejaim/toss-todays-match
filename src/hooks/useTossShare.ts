/**
 * 토스 앱 공유 기능 훅
 * - 토스 앱: getTossShareLink + share API 사용 (딥링크 + OG 이미지 지원)
 * - 웹/개발환경: Web Share API 또는 클립보드 복사로 폴백
 */

// 토스 API 타입 선언 (런타임에 주입됨)
declare const share: ((message: { message: string }) => Promise<void>) | undefined;
declare const getTossShareLink: ((url: string, ogImageUrl?: string) => Promise<string>) | undefined;

interface ShareOptions {
    message: string;                 // 공유할 메시지
    deepLinkPath?: string;          // 앱 내 경로 (예: "/fortune?date=2026-01-16")
    ogImageUrl?: string;            // OG 이미지 URL (HTTPS 필수)
}

/**
 * 토스 공유 기능 훅
 */
export function useTossShare() {
    // 토스 앱 환경인지 체크
    const isTossApp = typeof share !== 'undefined' && typeof getTossShareLink !== 'undefined';

    /**
     * 공유하기
     * @returns 'shared' | 'copied' | 'failed'
     */
    const handleShare = async (options: ShareOptions): Promise<'shared' | 'copied' | 'failed'> => {
        const { message, deepLinkPath, ogImageUrl } = options;

        try {
            // [Toss App] 토스 네이티브 공유 API 사용
            if (isTossApp) {
                let shareMessage = message;

                // 딥링크가 있으면 토스 공유 링크 생성
                if (deepLinkPath) {
                    const intossUrl = `intoss://${deepLinkPath}`;
                    const tossLink = await getTossShareLink!(intossUrl, ogImageUrl);
                    shareMessage = `${message}\n\n${tossLink}`;
                }

                await share!({ message: shareMessage });
                return 'shared';
            }

            // [Web] Web Share API 시도
            if (navigator.share) {
                await navigator.share({
                    title: '오늘의 쪼꿍',
                    text: message,
                });
                return 'shared';
            }

            // [Fallback] 클립보드 복사
            await navigator.clipboard.writeText(message);
            return 'copied';
        } catch (error) {
            console.error('[useTossShare] 공유 실패:', error);

            // 사용자가 공유 취소한 경우는 성공으로 처리
            if (error instanceof Error && error.name === 'AbortError') {
                return 'shared';
            }

            return 'failed';
        }
    };

    return {
        isTossApp,
        share: handleShare,
    };
}
