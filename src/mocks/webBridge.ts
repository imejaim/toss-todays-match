/**
 * Mock implementation of @apps-in-toss/web-bridge for local development
 * 로컬 개발 환경에서 앱이 크래시되지 않도록 토스 브릿지 기능을 흉내냅니다.
 */

// 광고 모듈 Mock
export const GoogleAdMob = {
    loadAppsInTossAdMob: async () => {
        console.log("[Mock] GoogleAdMob initialized (Local Mode)");
        return true;
    },
    rewardedVideo: {
        load: async () => {
            console.log("[Mock] Rewarded ad loaded (Local Mode)");
            return true;
        },
        show: async () => {
            console.log("[Mock] Rewarded ad shown - Success (Local Mode)");
            // 실제 광고 시청 완료처럼 true 반환
            return true;
        }
    }
};

// 공유 기능 Mock
export const share = async (data: any) => {
    console.log("[Mock] Shared called with data:", data);
    console.log(`[Mock] 공유하기 기능이 호출되었습니다. 내용: ${data.message}`);
    return true;
};

// 딥링크 생성 Mock
export const getTossShareLink = async (data: any) => {
    console.log("[Mock] Generating Toss Share Link for:", data);
    return "https://toss.im/mock-share-link-for-local-dev";
};
