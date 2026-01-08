import { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleAdMob } from '@apps-in-toss/web-bridge';

const TEST_AD_GROUP_ID = 'ait.v2.live.f7cf74bd6b6b4c55';

interface RewardedAdCallbacks {
    onRewarded?: () => void;
    onDismiss?: () => void;
}

export function useRewardedAd() {
    const [loading, setLoading] = useState(true);
    const cleanupRef = useRef<(() => void) | undefined>();
    const rewardCallbackRef = useRef<(() => void) | undefined>();
    const dismissCallbackRef = useRef<(() => void) | undefined>();

    const loadRewardAd = useCallback(() => {
        setLoading(true);

        // [Web/Localhost Safe Guard]
        // GoogleAdMob 객체가 없거나(웹), 로드 메서드가 없으면 Mock 모드로 동작
        if (typeof GoogleAdMob === 'undefined' || !GoogleAdMob?.loadAppsInTossAdMob) {
            console.warn("⚠️ GoogleAdMob is not available (Web/Dev mode). Using Mock.");
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            return;
        }

        const isAdUnsupported =
            GoogleAdMob.loadAppsInTossAdMob.isSupported?.() === false;

        if (isAdUnsupported) {
            console.warn('광고가 준비되지 않았거나, 지원되지 않아요.');
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
            },
        });

        cleanupRef.current = cleanup;
    }, []);

    // Preload on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadRewardAd();
        return () => {
            cleanupRef.current?.();
        };
    }, [loadRewardAd]);

    const showRewardAd = ({ onRewarded, onDismiss }: RewardedAdCallbacks) => {
        // [Web/Localhost Safe Guard] Mock Show
        if (typeof GoogleAdMob === 'undefined' || !GoogleAdMob?.showAppsInTossAdMob) {
            const confirmed = window.confirm("[개발모드] 광고를 시청하시겠습니까? (확인=보상지급, 취소=닫기)");
            if (confirmed) {
                onRewarded?.();
            } else {
                onDismiss?.();
            }
            return;
        }

        const isAdUnsupported =
            GoogleAdMob.showAppsInTossAdMob.isSupported?.() === false;

        if (loading) {
            console.warn('광고가 아직 로딩 중입니다.');
            return;
        }

        if (isAdUnsupported) {
            console.warn('광고 지원되지 않음 - 보상 바로 지급');
            // Fallback: grant reward if ads are broken/unsupported
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
