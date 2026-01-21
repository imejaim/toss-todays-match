import { useCallback, useRef, useState, useEffect } from 'react';
// ⚠️ 삭제 금지: 토스 앱에서 광고가 작동하려면 반드시 실제 import 필요 (RULEBOOK 10.1)
import { GoogleAdMob } from '@apps-in-toss/web-bridge';

// 토스 콘솔에서 발급받은 광고 그룹 ID
const TEST_AD_GROUP_ID = 'ait.v2.live.f7cf74bd6b6b4c55';

interface RewardedAdCallbacks {
    onRewarded?: () => void;
    onDismiss?: () => void;
}

/**
 * 토스 리워드 광고 훅
 * - 토스 앱: 실제 GoogleAdMob 광고 표시
 * - 웹/개발환경: 자동 보상 지급 (개발 편의)
 */
export function useRewardedAd() {
    const [loading, setLoading] = useState(true);
    const cleanupRef = useRef<(() => void) | undefined>();
    const rewardCallbackRef = useRef<(() => void) | undefined>();
    const dismissCallbackRef = useRef<(() => void) | undefined>();

    // 토스 앱 환경인지 체크 (광고 SDK 존재 여부)
    const isTossApp = typeof GoogleAdMob !== 'undefined' && GoogleAdMob?.loadAppsInTossAdMob;

    const loadRewardAd = useCallback(() => {
        // [Web/Localhost] 웹 환경에서는 로딩 필요 없음
        if (!isTossApp) {
            console.log("[useRewardedAd] 개발모드 - 광고 로드 스킵");
            setLoading(false);
            return;
        }

        setLoading(true);

        const isAdUnsupported = GoogleAdMob.loadAppsInTossAdMob.isSupported?.() === false;

        if (isAdUnsupported) {
            console.warn('광고가 준비되지 않았거나, 지원되지 않아요.');
            setLoading(false);
            return;
        }

        cleanupRef.current?.();
        cleanupRef.current = undefined;

        const cleanup = GoogleAdMob.loadAppsInTossAdMob({
            options: {
                adGroupId: TEST_AD_GROUP_ID,
            },
            onEvent: (event: { type: string }) => {
                if (event.type === 'loaded') {
                    console.log('Ad Loaded');
                    setLoading(false);
                }
            },
            onError: (error: unknown) => {
                console.error('광고 로드 실패', error);
                setLoading(false);
            },
        });

        cleanupRef.current = cleanup;
    }, [isTossApp]);

    // Preload on mount (토스 앱에서만)
    useEffect(() => {
        if (isTossApp) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadRewardAd();
        } else {
            setLoading(false);
        }
        return () => {
            cleanupRef.current?.();
        };
    }, [loadRewardAd, isTossApp]);

    const showRewardAd = ({ onRewarded, onDismiss }: RewardedAdCallbacks) => {
        // [Web/Localhost] 개발모드: 팝업 없이 자동 보상 지급
        if (!isTossApp) {
            console.log("[개발모드] 광고 스킵 - 보상 자동 지급");
            setTimeout(() => {
                onRewarded?.();
            }, 500);
            return;
        }

        // [Toss App] 실제 광고 표시
        const isAdUnsupported = GoogleAdMob.showAppsInTossAdMob?.isSupported?.() === false;

        if (loading) {
            console.warn('광고가 아직 로딩 중입니다.');
            return;
        }

        if (isAdUnsupported) {
            console.warn('광고 지원되지 않음 - 보상 바로 지급');
            onRewarded?.();
            return;
        }

        rewardCallbackRef.current = onRewarded;
        dismissCallbackRef.current = onDismiss;

        GoogleAdMob.showAppsInTossAdMob({
            options: {
                adGroupId: TEST_AD_GROUP_ID,
            },
            onEvent: (event: { type: string }) => {
                console.log('Ad Event:', event.type);
                switch (event.type) {
                    case 'dismissed':
                        dismissCallbackRef.current?.();
                        dismissCallbackRef.current = undefined;
                        break;

                    case 'userEarnedReward':
                        rewardCallbackRef.current?.();
                        rewardCallbackRef.current = undefined;
                        break;
                }
            },
            onError: (error: unknown) => {
                console.error('광고 보여주기 실패', error);
                dismissCallbackRef.current?.();
            },
        });
    };

    return {
        loading,
        loadRewardAd,
        showRewardAd,
    };
}
