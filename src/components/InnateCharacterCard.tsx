/**
 * 타고난 캐릭터 카드 컴포넌트
 * 사주 + 휴먼디자인 + 에니어그램을 통합하여 보여줍니다.
 */
import React from "react";
import type { InnateCharacterAnalysis } from "../utils/innateCharacter";

interface Props {
    analysis: InnateCharacterAnalysis;
    compact?: boolean;  // 간략한 버전 (운세 화면용)
}

export function InnateCharacterCard({ analysis, compact = false }: Props) {
    if (compact) {
        return <CompactCard analysis={analysis} />;
    }
    return <FullCard analysis={analysis} />;
}

/**
 * 컴팩트 버전 (운세 화면 상단용)
 */
function CompactCard({ analysis }: { analysis: InnateCharacterAnalysis }) {
    return (
        <div style={styles.compactContainer}>
            <div style={styles.compactHeader}>
                <span style={styles.compactIcon}>🪪</span>
                <span style={styles.compactTitle}>나는 어떤 사람?</span>
            </div>

            <p style={styles.compactSummary}>
                {analysis.summaryText}
            </p>

            <div style={styles.badgeRow}>
                {analysis.badges.map((badge, idx) => (
                    <div key={idx} style={styles.badge}>
                        <span style={styles.badgeEmoji}>{badge.emoji}</span>
                        <span style={styles.badgeLabel}>{badge.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * 전체 버전 (상세 페이지용)
 */
function FullCard({ analysis }: { analysis: InnateCharacterAnalysis }) {
    return (
        <div style={styles.fullContainer}>
            <div style={styles.fullHeader}>
                <span style={styles.fullIcon}>🪪</span>
                <h2 style={styles.fullTitle}>{analysis.nickname}님의 타고난 캐릭터</h2>
            </div>

            <div style={styles.fullContent}>
                <p style={styles.fullText}>
                    {analysis.detailText.split("\n").map((line, idx) => (
                        <React.Fragment key={idx}>
                            {line}
                            {idx < analysis.detailText.split("\n").length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            </div>

            <div style={styles.badgeRowFull}>
                {analysis.badges.map((badge, idx) => (
                    <div key={idx} style={styles.badgeFull}>
                        <span style={styles.badgeEmojiFull}>{badge.emoji}</span>
                        <div style={styles.badgeTextColumn}>
                            <span style={styles.badgeLabelFull}>{badge.label}</span>
                            <span style={styles.badgeDetail}>{badge.detail}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    // Compact styles
    compactContainer: {
        backgroundColor: "#f8fafc",
        borderRadius: 16,
        padding: "16px 20px",
        marginBottom: 20,
        border: "1px solid #e2e8f0"
    },
    compactHeader: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12
    },
    compactIcon: {
        fontSize: 20
    },
    compactTitle: {
        fontSize: 15,
        fontWeight: 700,
        color: "#334155"
    },
    compactSummary: {
        fontSize: 14,
        lineHeight: 1.6,
        color: "#475569",
        margin: "0 0 16px 0"
    },
    badgeRow: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
    },
    badge: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: "6px 12px"
    },
    badgeEmoji: {
        fontSize: 14
    },
    badgeLabel: {
        fontSize: 12,
        fontWeight: 600,
        color: "#64748b"
    },

    // Full styles
    fullContainer: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
    },
    fullHeader: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20
    },
    fullIcon: {
        fontSize: 28
    },
    fullTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: "#1e293b",
        margin: 0
    },
    fullContent: {
        backgroundColor: "#f8fafc",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20
    },
    fullText: {
        fontSize: 15,
        lineHeight: 1.8,
        color: "#334155",
        margin: 0,
        whiteSpace: "pre-wrap"
    },
    badgeRowFull: {
        display: "flex",
        justifyContent: "space-between",
        gap: 12
    },
    badgeFull: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#f1f5f9",
        borderRadius: 12,
        padding: "12px 16px"
    },
    badgeEmojiFull: {
        fontSize: 24
    },
    badgeTextColumn: {
        display: "flex",
        flexDirection: "column"
    },
    badgeLabelFull: {
        fontSize: 14,
        fontWeight: 700,
        color: "#334155"
    },
    badgeDetail: {
        fontSize: 11,
        color: "#64748b"
    }
};
