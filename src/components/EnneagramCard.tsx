import type { EnneagramProfile } from "../types";
import { getSpeciesByEnneagram } from "../utils/profileAnalysis";

interface EnneagramCardProps {
    enneagram: EnneagramProfile;
}

export const EnneagramCard: React.FC<EnneagramCardProps> = ({ enneagram }) => {
    const species = getSpeciesByEnneagram(enneagram.type);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.title}>내면의 동기 (Enneagram)</span>
            </div>
            <div style={styles.content}>
                <div style={styles.infoArea}>
                    <span style={styles.typeNum}>Type {enneagram.type}w{enneagram.wing}</span>
                    <h2 style={styles.speciesName}>{species}</h2>
                </div>
                <div style={styles.animalIcon}>
                    {/* Future: Real Illustrator icons or AI generated small crops */}
                    <div style={styles.placeholderIcon}>🐾</div>
                </div>
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
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    },
    header: {
        marginBottom: 8,
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
    infoArea: {
        display: "flex",
        flexDirection: "column",
    },
    typeNum: {
        fontSize: 13,
        color: "#3182f6",
        fontWeight: 600,
        marginBottom: 4,
    },
    speciesName: {
        fontSize: 22,
        fontWeight: 700,
        color: "#191f28",
        margin: 0,
    },
    animalIcon: {
        width: 60,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    placeholderIcon: {
        fontSize: 32,
    },
};
