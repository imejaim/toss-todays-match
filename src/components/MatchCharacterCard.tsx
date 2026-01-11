import React, { useMemo } from "react";
import type { MatchImagePrompt } from "../utils/matchImageGenerator";
import { Button } from "./ui";

interface Props {
    matchPrompt: MatchImagePrompt | null;
    description: string;
    imageUrl?: string;
    onGenerateImage?: () => void;
    isGenerating?: boolean;
}

export function MatchCharacterCard({
    matchPrompt,
    description,
    imageUrl,
    onGenerateImage,
    isGenerating = false
}: Props) {
    const showImage = !!imageUrl;

    // 2. Deterministic Card Info (훅은 조건부 return 전에 호출되어야 함)
    const cardInfo = useMemo(() => {
        if (!matchPrompt) return { no: "NO.------", rarity: "ULTRA RARE" };

        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const seedValue = (matchPrompt.title || "Secret").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const cardSuffix = (seedValue % 900) + 100;

        return {
            no: `NO.${today}-${matchPrompt.gender === "female" ? "F" : "M"}${cardSuffix}`,
            rarity: "ULTRA RARE"
        };
    }, [matchPrompt]);

    const { no: cardNo, rarity: rarityGrade } = cardInfo;

    // 1. Strict Guard (훅 호출 후에 조건부 return)
    if (!matchPrompt) return null;

    return (
        <div style={styles.container}>
            <div style={styles.cardFrame}>
                {/* Header Decoration */}
                <div style={styles.cardTopDecoration}>
                    <span style={styles.rarityBadge}>{rarityGrade}</span>
                    <span style={styles.cardId}>{cardNo}</span>
                </div>

                {/* Image Area */}
                <div style={styles.imageArea}>
                    {showImage && imageUrl ? (
                        <div style={styles.imageWrapper}>
                            <img src={imageUrl} alt="오늘의 이상형" style={styles.image} />
                            <div style={styles.imageOverlay}>
                                <span style={styles.genderBadge}>
                                    {matchPrompt.gender === "female" ? "♀️ DESTINY HER" : "♂️ DESTINY HIM"}
                                </span>
                            </div>
                            <div style={styles.shimmerLayer}></div>
                        </div>
                    ) : (
                        <div style={styles.placeholder}>
                            <span style={styles.placeholderEmoji}>
                                {matchPrompt.gender === "female" ? "👩‍🦰" : "👨‍🦱"}
                            </span>
                            <p style={styles.placeholderText}>
                                당신의 연애 세포가 자극되는 인연을 찾는 중...
                            </p>
                            {onGenerateImage && (
                                <Button
                                    variant="fill"
                                    color="primary"
                                    onClick={onGenerateImage}
                                    disabled={isGenerating}
                                    style={styles.generateButton}
                                >
                                    {isGenerating ? "✨ 생성 중..." : "✨ 운명의 짝꿍 보기"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div style={styles.cardInfoArea}>
                    <div style={styles.cardTitleLine}>
                        <h3 style={styles.title}>{matchPrompt.title || "Secret Soulmate"}</h3>
                        <div style={styles.elementBadge}>
                            {matchPrompt.matchElement === "Wood" && "🌳"}
                            {matchPrompt.matchElement === "Fire" && "🔥"}
                            {matchPrompt.matchElement === "Earth" && "🌍"}
                            {matchPrompt.matchElement === "Metal" && "✨"}
                            {matchPrompt.matchElement === "Water" && "💧"}
                        </div>
                    </div>

                    <p style={styles.description}>{description}</p>

                    <div style={styles.cardFooter}>
                        <div style={styles.featureTags}>
                            {(matchPrompt.keyFeatures || []).slice(0, 3).map((feature, idx) => (
                                <span key={idx} style={styles.featureTag}>#{feature}</span>
                            ))}
                        </div>
                        <span style={styles.saveHint}>꾹 눌러 이미지 저장 📥</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    container: {
        marginBottom: 32,
        perspective: "1000px"
    },
    cardFrame: {
        backgroundColor: "#fff",
        borderRadius: 28,
        padding: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
        background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
        border: "4px solid #fff",
        position: "relative",
    },
    cardTopDecoration: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 4px 12px 4px"
    },
    rarityBadge: {
        fontSize: 10,
        fontWeight: 800,
        color: "#fff",
        backgroundColor: "#3182f6",
        padding: "3px 8px",
        borderRadius: 6,
    },
    cardId: {
        fontFamily: "monospace",
        fontSize: 11,
        color: "#94a3b8",
        fontWeight: 600
    },
    imageArea: {
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#f8fafc",
        position: "relative"
    },
    imageWrapper: {
        position: "relative",
        width: "100%",
        paddingTop: "100%", // Maintain 1:1 ratio without aspectRatio
        overflow: "hidden"
    },
    image: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    shimmerLayer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
        pointerEvents: "none"
    },
    imageOverlay: {
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 2
    },
    genderBadge: {
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: "4px 10px",
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        color: "#fff",
    },
    cardInfoArea: {
        padding: "16px 8px 8px 8px"
    },
    cardTitleLine: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    title: {
        fontSize: 19,
        fontWeight: 800,
        color: "#0f172a",
        margin: 0,
    },
    elementBadge: {
        fontSize: 20,
    },
    description: {
        fontSize: 14,
        lineHeight: 1.6,
        color: "#475569",
        marginBottom: 16,
    },
    cardFooter: {
        borderTop: "1px dashed #e2e8f0",
        paddingTop: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8
    },
    featureTags: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
    },
    featureTag: {
        fontSize: 11,
        color: "#64748b",
        backgroundColor: "#f1f5f9",
        padding: "2px 8px",
        borderRadius: 6,
        fontWeight: 600
    },
    saveHint: {
        fontSize: 10,
        textAlign: "center",
        color: "#94a3b8",
        marginTop: 4,
    },
    placeholder: {
        padding: "60px 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "300px"
    },
    placeholderEmoji: {
        fontSize: 56,
        marginBottom: 16
    },
    placeholderText: {
        fontSize: 14,
        color: "#64748b",
        lineHeight: 1.6,
        margin: "0 0 24px 0"
    },
    generateButton: {
        height: 48,
        borderRadius: 12,
        padding: "0 24px",
        fontSize: 15,
        fontWeight: 700
    }
};
