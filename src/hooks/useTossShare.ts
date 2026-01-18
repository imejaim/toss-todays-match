/**
 * 토스 앱 공유 기능 훅
 * - 토스 앱: @apps-in-toss/web-framework의 share, getTossShareLink 사용
 * - 웹/개발환경: 클립보드 복사로 폴백
 */

// 토스 SDK 타입 정의 (런타임에만 존재)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const TossWebFramework: any;

interface ShareOptions {
    message: string;                 // 공유할 메시지
    deepLinkPath?: string;          // 앱 내 경로 (예: "today-fortune")
    ogImageUrl?: string;            // OG 이미지 URL (HTTPS 필수)
}

/**
 * 토스 앱 환경 체크
 */
function checkTossEnvironment(): { share: ((opts: { message: string }) => Promise<void>) | null; getTossShareLink: ((opts: { url: string; ogImageUrl?: string }) => Promise<string>) | null } {
    // 방법 1: window에 직접 주입된 경우
    const win = window as unknown as {
        share?: (opts: { message: string }) => Promise<void>;
        getTossShareLink?: (opts: { url: string; ogImageUrl?: string }) => Promise<string>;
    };

    if (typeof win.share === 'function' && typeof win.getTossShareLink === 'function') {
        return {
            share: win.share,
            getTossShareLink: win.getTossShareLink
        };
    }

    // 방법 2: TossWebFramework 객체로 주입된 경우
    if (typeof TossWebFramework !== 'undefined') {
        return {
            share: TossWebFramework.share || null,
            getTossShareLink: TossWebFramework.getTossShareLink || null
        };
    }

    return { share: null, getTossShareLink: null };
}

/**
 * 토스 공유 기능 훅
 */
export function useTossShare() {
    const tossApi = checkTossEnvironment();
    const isTossApp = tossApi.share !== null && tossApi.getTossShareLink !== null;

    /**
     * 공유하기
     * @returns 'shared' | 'copied' | 'failed'
     */
    const handleShare = async (options: ShareOptions): Promise<'shared' | 'copied' | 'failed'> => {
        const { message, deepLinkPath, ogImageUrl } = options;

        try {
            // [Toss App] 토스 네이티브 공유 API 사용
            if (isTossApp && tossApi.share && tossApi.getTossShareLink) {
                console.log('[useTossShare] 토스 앱 환경 - 네이티브 공유 사용');

                let shareMessage = message;

                // 딥링크가 있으면 토스 공유 링크 생성
                if (deepLinkPath) {
                    try {
                        const tossLink = await tossApi.getTossShareLink({
                            url: `intoss://오늘의쪼꿍/${deepLinkPath}`,
                            ogImageUrl: ogImageUrl
                        });
                        shareMessage = `${message}\n\n${tossLink}`;
                        console.log('[useTossShare] 토스 공유 링크 생성됨:', tossLink);
                    } catch (linkError) {
                        console.warn('[useTossShare] 딥링크 생성 실패, 메시지만 전송:', linkError);
                    }
                }

                await tossApi.share({ message: shareMessage });
                return 'shared';
            }

            // [Web/개발환경] 클립보드 복사로 폴백
            console.log('[useTossShare] 웹 환경 - 클립보드 복사로 폴백');

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(message);
                return 'copied';
            }

            // 구형 브라우저 폴백
            const textarea = document.createElement('textarea');
            textarea.value = message;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
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
