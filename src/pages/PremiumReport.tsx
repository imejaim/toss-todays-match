import { useState, useEffect } from "react";
import type { UserProfile, FortuneResult } from "../types";
import { useRewardedAd } from "../hooks/useRewardedAd";

interface Props {
    profile: UserProfile;
    fortune: FortuneResult | null;
    onBackToday: () => void;
}

export function PremiumReportScreen({ profile, fortune, onBackToday }: Props) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const { loadRewardAd, showRewardAd, loading } = useRewardedAd();

    // 화면 진입 시 광고 로드
    useEffect(() => {
        loadRewardAd();
    }, [loadRewardAd]);

    const handleWatchAd = () => {
        showRewardAd({
            onRewarded: () => {
                setIsUnlocked(true);
            },
            onDismiss: () => {
                // 광고 닫힘 (보상 받았으면 isUnlocked가 true가 됨)
                loadRewardAd(); // 다음을 위해 다시 로드 (선택 사항)
            },
        });
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>연애 심층 리포트</h1>

            <div style={styles.card}>
                <p style={{ marginBottom: 16, lineHeight: 1.5 }}>
                    {profile.nickname
                        ? <strong>{profile.nickname}</strong>
                        : "회원"} 님의 연애 성향을<br />간단히 정리해 봤어요.
                </p>

                {/* 잠금 상태일 때 블러 처리 또는 숨김 */}
                <div style={isUnlocked ? styles.contentUnlocked : styles.contentLocked}>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>💖 나의 숨겨진 연애 성향 확인!</li>
                        <li style={styles.listItem}>⚡️ 갈등 패턴과 해결 팁 조언</li>
                        <li style={styles.listItem}>🏹 {profile.nickname ? profile.nickname : "나"}님과 잘 맞는 연애 스타일</li>
                        <li style={styles.listItem}>📅 이번 달 연애 운 흐름 분석</li>
                    </ul>

                    {fortune && (
                        <div style={styles.fortuneBox}>
                            <p style={styles.fortuneTitle}>오늘의 핵심 조언</p>
                            <p style={styles.message}>
                                {fortune.keywords.join(", ")} 키워드가 중요한 날이에요.<br />
                                감정을 솔직하게 표현하되<br />상대의 속도를 존중해보세요.
                            </p>
                        </div>
                    )}
                </div>

                {!isUnlocked && (
                    <div style={styles.lockOverlay}>
                        <p style={{ marginBottom: 12, color: "#666", fontSize: 14 }}>
                            광고를 보고 전체 리포트를<br />무료로 확인하세요!
                        </p>
                        <button
                            style={loading ? styles.disabledButton : styles.primaryButton}
                            onClick={handleWatchAd}
                            disabled={loading}
                        >
                            {loading ? "광고 로딩 중..." : "광고 보고 결과 무료 확인"}
                        </button>
                    </div>
                )}

                <div style={styles.demoNotice}>
                    ※ 현재는 데모 버전입니다.<br />
                    추후 유료 리포트와 연동될 예정이에요.
                </div>

                <button style={styles.secondaryButton} onClick={onBackToday}>
                    오늘의 운세로 돌아가기
                </button>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    page: {
        maxWidth: 480,
        margin: "0 auto",
        padding: "24px 20px 40px",
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 16,
        color: "#333",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden", // 블러 처리가 삐져나가지 않게
    },
    contentUnlocked: {
        opacity: 1,
        filter: "none",
        transition: "all 0.5s ease",
    },
    contentLocked: {
        opacity: 0.3,
        filter: "blur(4px)",
        pointerEvents: "none", // 클릭 방지
        userSelect: "none",
    },
    lockOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 120, // 하단 버튼들은 가리지 않게
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        // 배경을 투명하게 하거나 그라데이션 줄 수 있음
    },
    list: {
        paddingLeft: 20,
        marginBottom: 24,
        color: "#4e5968",
    },
    listItem: {
        marginBottom: 8,
        fontSize: 15,
    },
    fortuneBox: {
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    fortuneTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: "#3182f6",
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        lineHeight: 1.6,
        color: "#333",
        wordBreak: "keep-all",
    },
    demoNotice: {
        fontSize: 13,
        color: "#8b95a1",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 1.5,
        backgroundColor: "#f2f4f6",
        padding: "12px",
        borderRadius: 8,
        marginTop: 24,
    },
    primaryButton: {
        width: "80%",
        padding: "14px",
        borderRadius: 12,
        border: "none",
        fontSize: 16,
        fontWeight: 600,
        color: "#fff",
        backgroundColor: "#3182f6",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(49, 130, 246, 0.3)",
    },
    disabledButton: {
        width: "80%",
        padding: "14px",
        borderRadius: 12,
        border: "none",
        fontSize: 16,
        fontWeight: 600,
        color: "#fff",
        backgroundColor: "#b1b8c0",
        cursor: "not-allowed",
    },
    secondaryButton: {
        width: "100%",
        padding: "14px",
        borderRadius: 12,
        border: "1px solid #d1d6db",
        fontSize: 16,
        fontWeight: 600,
        color: "#6b7684",
        backgroundColor: "#fff",
        cursor: "pointer",
    },
};
