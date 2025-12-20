import type { UserProfile, FortuneResult } from "../types";

interface Props {
    profile: UserProfile;
    fortune: FortuneResult;
    onGoPremium: () => void;
    onBackHome: () => void;
}

export function TodayFortuneScreen({ profile, fortune, onGoPremium, onBackHome }: Props) {
    const nameLabel = profile.nickname || "오늘의 짝꿍";

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>오늘의 연애 운세</h1>

            <div style={styles.card}>
                <p style={{ marginBottom: 4 }}>{nameLabel}님의 오늘 점수</p>
                <p style={styles.scoreText}>{fortune.score}점</p>

                <div style={styles.tagRow}>
                    {fortune.keywords.map((k) => (
                        <span key={k} style={styles.tag}>
                            {k}
                        </span>
                    ))}
                </div>

                <p style={styles.message}>{fortune.message}</p>

                <button style={styles.primaryButton} onClick={onGoPremium}>
                    연애 심층 리포트 보기
                </button>
                <button style={styles.secondaryButton} onClick={onBackHome}>
                    홈으로
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
        marginBottom: 8,
        color: "#333",
    },
    card: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        alignItems: "center",
        textAlign: "center",
    },
    scoreText: {
        fontSize: 48,
        fontWeight: 800,
        color: "#3182f6",
        margin: "8px 0 16px",
    },
    tagRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        marginBottom: 16,
    },
    tag: {
        fontSize: 13,
        padding: "6px 10px",
        borderRadius: 8,
        backgroundColor: "#e8f3ff",
        color: "#1b64da",
        fontWeight: 600,
    },
    message: {
        fontSize: 16,
        lineHeight: 1.6,
        color: "#4e5968",
        marginTop: 8,
        marginBottom: 32,
        wordBreak: "keep-all",
    },
    primaryButton: {
        width: "100%",
        padding: "14px",
        borderRadius: 12,
        border: "none",
        fontSize: 16,
        fontWeight: 600,
        color: "#fff",
        backgroundColor: "#3182f6",
        cursor: "pointer",
        marginBottom: 8,
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
