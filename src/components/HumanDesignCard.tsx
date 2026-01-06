import React from "react";
import type { HumanDesignProfile } from "../types";
import { getIconByHDType } from "../utils/profileAnalysis";

interface HumanDesignCardProps {
    hd: HumanDesignProfile;
}

export const HumanDesignCard: React.FC<HumanDesignCardProps> = ({ hd }) => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.title}>인생 사용 설명서 (Human Design)</span>
            </div>
            <div style={styles.content}>
                <div style={styles.typeBadge}>
                    <span style={styles.icon}>{getIconByHDType(hd.type) === "Lightning" ? "⚡" : "⚙️"}</span>
                    <div style={styles.typeInfo}>
                        <span style={styles.typeLabel}>{hd.type}</span>
                        <span style={styles.strategyLabel}>{hd.strategy}</span>
                    </div>
                </div>
                <div style={styles.divider} />
                <div style={styles.profileArea}>
                    <span style={styles.profileValue}>{hd.profile}</span>
                    <span style={styles.profileLabel}>Profile</span>
                </div>
            </div>
            <div style={styles.footer}>
                <span style={styles.authority}>내적 권위: {hd.authority}</span>
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
        border: "1px solid #f2f4f6",
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: 600,
        color: "#8b95a1",
    },
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    typeBadge: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    icon: {
        fontSize: 24,
    },
    typeInfo: {
        display: "flex",
        flexDirection: "column",
    },
    typeLabel: {
        fontSize: 17,
        fontWeight: 700,
        color: "#333d4b",
    },
    strategyLabel: {
        fontSize: 12,
        color: "#3182f6",
        fontWeight: 600,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: "#f2f4f6",
    },
    profileArea: {
        textAlign: "right",
    },
    profileValue: {
        fontSize: 24,
        fontWeight: 800,
        color: "#333d4b",
        display: "block",
    },
    profileLabel: {
        fontSize: 11,
        color: "#b0b8c1",
    },
    footer: {
        marginTop: 16,
        paddingTop: 12,
        borderTop: "1px solid #f2f4f6",
    },
    authority: {
        fontSize: 13,
        color: "#4e5968",
    },
};
