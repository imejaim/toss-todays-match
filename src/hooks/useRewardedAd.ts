import { useCallback, useRef, useState } from 'react';
// import { GoogleAdMob } from '@apps-in-toss/web-framework'; // 실제 API가 있다면 이렇게 사용

// 테스트용 가짜 AdMob 객체 (웹 개발을 위해)
const MockGoogleAdMob = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadAppsInTossAdMob: ({ onEvent }: any) => {
        console.log("[AdMock] Loading Ad...");
        setTimeout(() => {
            console.log("[AdMock] Ad Loaded");
            onEvent({ type: 'loaded' });
        }, 1500);
        return () => { };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showAppsInTossAdMob: ({ onEvent }: any) => {
        console.log("[AdMock] Showing Ad...");
        setTimeout(() => {
            onEvent({ type: 'impression' });
            onEvent({ type: 'show' });
            // 3초 후 보상 지급 시뮬레이션
            setTimeout(() => {
                console.log("[AdMock] User Earned Reward");
                onEvent({ type: 'userEarnedReward' });
                onEvent({ type: 'dismissed' });
            }, 3000);
        }, 500);
    }
};

const TEST_AD_GROUP_ID = 'ait-ad-test-rewarded-id';

interface RewardedAdCallbacks {
    onRewarded?: () => void;
    onDismiss?: () => void;
}

export function useRewardedAd() {
    const [loading, setLoading] = useState(true); // 초기에는 로딩 상태
    const cleanupRef = useRef<(() => void) | undefined>();
    const rewardCallbackRef = useRef<(() => void) | undefined>();
    const dismissCallbackRef = useRef<(() => void) | undefined>();

    const loadRewardAd = useCallback(() => {
        setLoading(true);

        // 실제 환경에서는 GoogleAdMob 사용, 여기서는 Mock 사용
        // const AdModule = window.TossApp ? GoogleAdMob : MockGoogleAdMob;
        const AdModule = MockGoogleAdMob;

        cleanupRef.current?.();
        cleanupRef.current = undefined;

        const cleanup = AdModule.loadAppsInTossAdMob({
            options: {
                adGroupId: TEST_AD_GROUP_ID,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onEvent: (event: any) => {
                if (event.type === 'loaded') {
                    setLoading(false);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                console.error('광고 로드 실패', error);
                setLoading(false); // 에러나면 로딩 끝내서 버튼 활성화라도 시키거나 처리 필요
            },
        });

        cleanupRef.current = cleanup;
    }, []);

    const showRewardAd = ({ onRewarded, onDismiss }: RewardedAdCallbacks) => {
        if (loading) {
            alert('광고를 불러오는 중입니다. 잠시만 기다려주세요!');
            return;
        }

        rewardCallbackRef.current = onRewarded;
        dismissCallbackRef.current = onDismiss;

        const AdModule = MockGoogleAdMob;

        AdModule.showAppsInTossAdMob({
            options: {
                adGroupId: TEST_AD_GROUP_ID,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onEvent: (event: any) => {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                console.error('광고 보여주기 실패', error);
            },
        });
    };

    return {
        loading,
        loadRewardAd,
        showRewardAd,
    };
}
