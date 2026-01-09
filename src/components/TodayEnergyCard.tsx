/**
 * 오늘의 에너지 카드 컴포넌트
 * 일진과 나의 오행 상호작용을 보여줍니다.
 */
import React from "react";
import type { DailyEnergy, EnergyInteraction } from "../utils/dailyEnergy";

interface Props {
    dailyEnergy: DailyEnergy;
    interaction: EnergyInteraction;
    themes: string[];
    compact?: boolean;
}

export function TodayEnergyCard({ dailyEnergy, interaction, themes, compact = false }: Props) {
    if (compact) {
        return <CompactEnergyCard dailyEnergy={dailyEnergy} interaction={interaction} />;
    }
    return <FullEnergyCard dailyEnergy={dailyEnergy} interaction={interaction} themes={themes} />;
}

/**
 * 컴팩트 버전
 */
function CompactEnergyCard({
    dailyEnergy,
    interaction
}: {
    dailyEnergy: DailyEnergy;
    interaction: EnergyInteraction;
}) {
    const scoreColor = interaction.score >= 1 ? "#22c55e" : interaction.score <= -1 ? "#ef4444" : "#f59e0b";

    return (
        <div style={styles.compactContainer}>
            <div style={styles.compactHeader}>
                <span style={styles.compactIcon}>⚡</span>
                <span style={styles.compactTitle}>오늘의 에너지</span>
            </div>

            <div style={styles.energyRow}>
                <div style={styles.pillarBox}>
                    <span style={styles.pillarHanja}>{dailyEnergy.pillarHanja}</span>
                    <span style={styles.pillarName}>({dailyEnergy.pillarName})일</span>
                </div>
                <span style={styles.interactionEmoji}>{interaction.emoji}</span>
            </div>

            <p style={styles.compactDescription}>
                {interaction.description}
            </p>

            <div style={styles.detailRow}>
                <span style={{ ...styles.scoreTag, backgroundColor: scoreColor }}>
                    {interaction.score > 0 ? "+" : ""}{interaction.score}
                </span>
                <span style={styles.elementInfo}>
                    {dailyEnergy.elementEmoji} {dailyEnergy.elementKorean} + {dailyEnergy.zodiacKorean}({dailyEnergy.branchKorean})
                </span>
            </div>
        </div>
    );
}

/**
 * 전체 버전
 */
function FullEnergyCard({
    dailyEnergy,
    interaction,
    themes
}: {
    dailyEnergy: DailyEnergy;
    interaction: EnergyInteraction;
    themes: string[];
}) {
    const scoreColor = interaction.score >= 1 ? "#22c55e" : interaction.score <= -1 ? "#ef4444" : "#f59e0b";
    const dateStr = dailyEnergy.date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div style={styles.fullContainer}>
            <div style={styles.fullHeader}>
                <span style={styles.fullIcon}>⚡</span>
                <h2 style={styles.fullTitle}>오늘의 우주 에너지</h2>
            </div>

            <div style={styles.dateBox}>
                <span style={styles.dateText}>{dateStr}</span>
                <div style={styles.pillarFullBox}>
                    <span style={styles.pillarHanjaFull}>{dailyEnergy.pillarHanja}</span>
                    <span style={styles.pillarNameFull}>({dailyEnergy.pillarName})일</span>
                </div>
            </div>

            <div style={styles.elementInfoFull}>
                <span style={styles.elementEmoji}>{dailyEnergy.elementEmoji}</span>
                <span style={styles.elementText}>
                    {dailyEnergy.elementKorean}과 {dailyEnergy.zodiacKorean}({dailyEnergy.branchKorean})의 기운이 만나는 날
                </span>
            </div>

            <div style={styles.interactionBox}>
                <div style={styles.interactionHeader}>
                    <span style={styles.interactionEmojiFull}>{interaction.emoji}</span>
                    <span style={{ ...styles.scoreTagFull, backgroundColor: scoreColor }}>
                        {interaction.relationshipKorean}
                    </span>
                </div>
                <p style={styles.interactionDesc}>
                    {interaction.description}
                </p>
            </div>

            <div style={styles.themesBox}>
                <span style={styles.themesLabel}>오늘의 테마:</span>
                <div style={styles.themeTags}>
                    {themes.map((theme, idx) => (
                        <span key={idx} style={styles.themeTag}>#{theme}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    // Compact styles
    compactContainer: {
        backgroundColor: "#fffbeb",
        borderRadius: 16,
        padding: "16px 20px",
        marginBottom: 20,
        border: "1px solid #fef3c7"
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
        color: "#92400e"
    },
    energyRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12
    },
    pillarBox: {
        display: "flex",
        alignItems: "baseline",
        gap: 6
    },
    pillarHanja: {
        fontSize: 24,
        fontWeight: 700,
        color: "#78350f"
    },
    pillarName: {
        fontSize: 14,
        color: "#92400e"
    },
    interactionEmoji: {
        fontSize: 28
    },
    compactDescription: {
        fontSize: 14,
        lineHeight: 1.6,
        color: "#78350f",
        margin: "0 0 12px 0"
    },
    detailRow: {
        display: "flex",
        alignItems: "center",
        gap: 10
    },
    scoreTag: {
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 700,
        color: "#fff"
    },
    elementInfo: {
        fontSize: 12,
        color: "#92400e"
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
    dateBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fefce8",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16
    },
    dateText: {
        fontSize: 14,
        color: "#78350f"
    },
    pillarFullBox: {
        display: "flex",
        alignItems: "baseline",
        gap: 4
    },
    pillarHanjaFull: {
        fontSize: 20,
        fontWeight: 700,
        color: "#78350f"
    },
    pillarNameFull: {
        fontSize: 13,
        color: "#92400e"
    },
    elementInfoFull: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16
    },
    elementEmoji: {
        fontSize: 24
    },
    elementText: {
        fontSize: 15,
        color: "#334155"
    },
    interactionBox: {
        backgroundColor: "#f8fafc",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16
    },
    interactionHeader: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10
    },
    interactionEmojiFull: {
        fontSize: 24
    },
    scoreTagFull: {
        padding: "4px 12px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: "#fff"
    },
    interactionDesc: {
        fontSize: 15,
        lineHeight: 1.6,
        color: "#334155",
        margin: 0
    },
    themesBox: {
        display: "flex",
        alignItems: "center",
        gap: 10
    },
    themesLabel: {
        fontSize: 13,
        color: "#64748b"
    },
    themeTags: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap"
    },
    themeTag: {
        fontSize: 12,
        color: "#3b82f6",
        backgroundColor: "#eff6ff",
        padding: "4px 10px",
        borderRadius: 10
    }
};
