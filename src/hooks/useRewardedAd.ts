/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  🚨🚨🚨 경고: 이 파일은 절대 함부로 수정하지 마세요! 🚨🚨🚨             ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  이 파일의 import 라인을 변경하면 토스 앱에서 광고가 작동하지 않습니다.  ║
 * ║                                                                          ║
 * ║  [2026-01-21 사고] import를 declare로 변경하여 광고 미작동 발생.         ║
 * ║  → 출시 3일 지연, 광고 수익 손실.                                        ║
 * ║                                                                          ║
 * ║  수정이 필요한 경우:                                                     ║
 * ║  1. 반드시 담당자 승인 필요                                              ║
 * ║  2. 토스 샌드박스에서 광고 로딩 테스트 필수                              ║
 * ║  3. QC 테스트(qc.test.ts) 통과 확인 필수                                 ║
 * ║                                                                          ║
 * ║  참조: docs/03_RULEBOOK.md 9장, 10장                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useCallback, useRef, useState, useEffect } from 'react';

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  🔒 절대 삭제/변경 금지! 이 import가 없으면 광고가 작동하지 않습니다.    ║
// ║  - declare const GoogleAdMob 으로 변경 금지                               ║
// ║  - 주석 처리 금지                                                         ║
// ║  - 조건부 import 금지                                                     ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let GoogleAdMob: any = undefined;

// 토스 앱 환경에서만 web-bridge 로드 시도 (Top-level await 제거)
// 비동기로 로드되므로 훅 내부에서 접근 시 undefined 체크 필수
import('@apps-in-toss/web-bridge')
    .then((module) => {
        GoogleAdMob = module.GoogleAdMob;
    })
    .catch((e) => {
        console.log('[useRewardedAd] 토스 브릿지 로드 실패 (로컬 개발 환경)', e);
    });

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
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 아래 isTossApp 로직은 웹/토스 앱 환경을 자동으로 분기합니다.
 * - 웹 브라우저: GoogleAdMob이 undefined → 개발 모드로 동작 (광고 스킵)
 * - 토스 앱: GoogleAdMob이 실제 객체 → 광고 정상 동작
 * 이 로직을 변경하면 양쪽 환경 모두 문제가 발생할 수 있습니다.
 * ═══════════════════════════════════════════════════════════════════════════
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
