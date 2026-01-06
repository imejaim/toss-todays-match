import React from "react";
import type { SajuProfile, SajuPillar } from "../types";
import { getColorByElement } from "../utils/profileAnalysis";

interface SajuCardProps {
    saju: SajuProfile;
}

export const SajuCard: React.FC<SajuCardProps> = ({ saju }) => {
    const renderPillar = (label: string, pillar: SajuPillar) => (
        <div style={styles.pillar}>
            <span style={styles.pillarLabel}>{label}</span>
            <div style={{ ...styles.stem, backgroundColor: getColorByElement(pillar.element) }}>
                {pillar.stem}
            </div>
            <div style={{ ...styles.branch, backgroundColor: getColorByElement(pillar.element) }}>
                {pillar.branch}
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>사주 팔자 (The Four Pillars)</h3>
            <div style={styles.pillarsGrid}>
                {renderPillar("시주", saju.pillars.time)}
                {renderPillar("일주", saju.pillars.day)}
                {renderPillar("월주", saju.pillars.month)}
                {renderPillar("년주", saju.pillars.year)}
            </div>
            <div style={styles.dayMasterInfo}>
                <span style={styles.dayMasterText}>
                    나의 본질: <strong>{saju.dayMaster.stem} ({saju.dayMaster.element})</strong>
                </span>
            </div>
        </div>
    );
};

const styles: { [k: string]: React.CSSProperties } = {
    container: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        margin: "12px 0",
    },
    title: {
        fontSize: 14,
        fontWeight: 600,
        color: "#8b95a1",
        marginBottom: 16,
        textAlign: "center",
    },
    pillarsGrid: {
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
    },
    pillar: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    pillarLabel: {
        fontSize: 11,
        color: "#b0b8c1",
        marginBottom: 4,
    },
    stem: {
        width: "100%",
        height: 40,
        borderRadius: "8px 8px 0 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 700,
        color: "#333d4b",
    },
    branch: {
        width: "100%",
        height: 40,
        borderRadius: "0 0 8px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 700,
        color: "#333d4b",
        borderTop: "1px solid rgba(0,0,0,0.05)",
    },
    dayMasterInfo: {
        marginTop: 16,
        textAlign: "center",
        padding: "8px 0",
        backgroundColor: "#f9fafb",
        borderRadius: 12,
    },
    dayMasterText: {
        fontSize: 14,
        color: "#4e5968",
    },
};
