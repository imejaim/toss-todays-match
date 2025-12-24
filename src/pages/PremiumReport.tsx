import { useState } from "react";
import type { UserProfile, FortuneResult } from "../types";
import { Button } from "@toss/tds-mobile";
import { getDetailedFortune } from "../utils/llm";

interface Props {
    profile: UserProfile;
    fortune: FortuneResult | null;
    onBackToday: () => void;
}

export function PremiumReportScreen({ profile, fortune, onBackToday }: Props) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Ad loading & LLM generation
    const [isAdPlaying, setIsAdPlaying] = useState(false); // Ad simulation state
    const [reportContent, setReportContent] = useState<string | null>(null);

    // Mock Ad Simulation & Unlocking
    const handleUnlock = async () => {
        if (!fortune) return;

        setIsLoading(true);

        // 1. Simulate Ad Loading (1s)
        await new Promise(r => setTimeout(r, 800));
        setIsAdPlaying(true);
        setIsLoading(false);

        // 2. Simulate Ad Playing (3s)
        await new Promise(r => setTimeout(r, 3000));
        setIsAdPlaying(false);

        // 3. Generate LLM Content
        setIsLoading(true);
        const text = await getDetailedFortune(
            { ...profile, name: profile.nickname || "사용자" },
            {
                score: fortune.score,
                keywords: fortune.keywords,
                message: fortune.message
            }
        );

        setReportContent(text);
        setIsUnlocked(true);
        setIsLoading(false);
    };

    /**
     * Markdown-like simple parser for display
     */
    const renderMarkdown = (text: string) => {
        return text.split("\n").map((line, idx) => {
            if (line.startsWith("### ")) {
                return <h3 key={idx} style={styles.mdH3}>{line.replace("### ", "")}</h3>;
            } else if (line.startsWith("- ")) {
                return <li key={idx} style={styles.mdLi}>{line.replace("- ", "")}</li>;
            } else if (line.trim() === "") {
                return <br key={idx} />;
            } else {
                return <p key={idx} style={styles.mdP}>{line}</p>;
            }
        });
    };

    if (isAdPlaying) {
        return (
            <div style={styles.adOverlay}>
                <div style={styles.adBadge}>AD</div>
                <h2 style={{ color: "#fff", marginBottom: 16 }}>광고 시청 중...</h2>
                <div style={styles.spinner} />
                <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 24 }}>
                    잠시 후 심층 리포트가 공개됩니다
                </p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", paddingBottom: 100 }}>
            {/* Header */}
            <header style={styles.header}>

                <span style={styles.headerTitle}>심층 리포트</span>
                <div style={{ width: 24 }} />
            </header>

            <div style={{ padding: "0 20px 40px" }}>
                {/* Intro Card */}
                <div style={styles.card}>
                    <h1 style={styles.title}>
                        {profile.nickname || "당신"}님의<br />
                        <span style={{ color: "#e86b8b" }}>숨겨진 연애 본능</span>은?
                    </h1>
                    <p style={styles.subtitle}>
                        {isUnlocked
                            ? "AI가 분석한 당신만의 시크릿 리포트입니다."
                            : "AI가 당신과 오늘의 운세를 깊이 분석하고 있어요."}
                    </p>
                </div>

                {/* Content Area */}
                <div style={styles.reportArea}>
                    {isUnlocked && reportContent ? (
                        // 🔓 Unlocked Content
                        <div style={styles.reportContent}>
                            {renderMarkdown(reportContent)}

                            <div style={styles.footerNote}>
                                * AI 분석 결과로 재미로만 봐주세요.
                            </div>
                        </div>
                    ) : (
                        // 🔒 Locked Content
                        <div style={styles.lockedContainer}>
                            <div style={styles.blurLayer}>
                                <div style={styles.skeletonText} />
                                <div style={styles.skeletonText} />
                                <div style={styles.skeletonText} />
                                <div style={{ ...styles.skeletonText, width: "60%" }} />
                            </div>

                            <div style={styles.lockInfo}>
                                <div style={styles.lockIcon}>🔒</div>
                                <h3>심층 분석 완료</h3>
                                <p>짧은 광고를 보고<br />전체 내용을 무료로 확인하세요</p>
                                <Button
                                    onClick={handleUnlock}
                                    loading={isLoading}
                                    style={{ marginTop: 16 }}
                                >
                                    광고 보고 결과 보기
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: "0 20px 40px" }}>
                <Button variant="weak" color="primary" onClick={onBackToday} style={{ width: "100%", height: 50 }}>
                    {isUnlocked ? "홈으로 돌아가기" : "뒤로가기"}
                </Button>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    header: {
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #f2f4f6",
    },
    backButton: {
        background: "none",
        border: "none",
        fontSize: 24,
        cursor: "pointer",
        color: "#333d4b",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#333d4b",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: "32px 24px",
        marginTop: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        textAlign: "center" as const,
    },
    title: {
        fontSize: 22,
        fontWeight: 700,
        lineHeight: 1.4,
        color: "#191f28",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: "#8b95a1",
    },
    reportArea: {
        marginTop: 20,
    },
    reportContent: {
        padding: "20px 4px",
    },
    mdH3: {
        fontSize: 18,
        fontWeight: 700,
        color: "#333d4b",
        marginTop: 24,
        marginBottom: 12,
    },
    mdP: {
        fontSize: 16,
        lineHeight: 1.7,
        color: "#4e5968",
        marginBottom: 12,
        wordBreak: "keep-all" as const,
    },
    mdLi: {
        fontSize: 16,
        lineHeight: 1.7,
        color: "#4e5968",
        marginLeft: 20,
        marginBottom: 4,
    },
    footerNote: {
        marginTop: 40,
        fontSize: 13,
        color: "#b0b8c1",
        textAlign: "center" as const,
    },
    lockedContainer: {
        position: "relative",
        minHeight: 300,
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid #e5e8eb",
    },
    blurLayer: {
        padding: 24,
        filter: "blur(6px)",
        pointerEvents: "none",
        opacity: 0.5,
    },
    skeletonText: {
        height: 16,
        backgroundColor: "#f2f4f6",
        borderRadius: 4,
        marginBottom: 12,
    },
    lockInfo: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        textAlign: "center" as const,
        backgroundColor: "rgba(255,255,255,0.6)",
    },
    lockIcon: {
        fontSize: 40,
        marginBottom: 16,
    },
    // Ad Overlay Styles
    adOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#191f28",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    adBadge: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 700,
    },
    spinner: {
        width: 40,
        height: 40,
        border: "4px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
};
