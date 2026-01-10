/**
 * 오늘의 짝꿍 이미지 카드 컴포넌트
 * AI 생성 이미지와 설명을 표시합니다.
 */
import React, { useState, useEffect } from "react";
import type { MatchImagePrompt } from "../utils/matchImageGenerator";
import { Button } from "./ui";

interface Props {
    matchPrompt: MatchImagePrompt;
    description: string;
    imageUrl?: string;  // 미리 생성된 이미지 URL
    onGenerateImage?: () => void;  // 이미지 생성 요청 콜백
    isGenerating?: boolean;
}

export function MatchCharacterCard({
    matchPrompt,
    description,
    imageUrl,
    onGenerateImage,
    isGenerating = false
}: Props) {
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        if (imageUrl) {
            setShowImage(true);
        }
    }, [imageUrl]);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.icon}>💕</span>
                <h3 style={styles.title}>{matchPrompt.title || "오늘의 운명 짝꿍"}</h3>
            </div>

            {/* 이미지 영역 */}
            <div style={styles.imageArea}>
                {showImage && imageUrl ? (
                    <div style={styles.imageWrapper}>
                        <img
                            src={imageUrl}
                            alt="오늘의 이상형"
                            style={styles.image}
                        />
                        <div style={styles.imageOverlay}>
                            <span style={styles.genderBadge}>
                                {matchPrompt.gender === "female" ? "👩" : "👨"}
                                {matchPrompt.gender === "female" ? "오늘의 그녀" : "오늘의 그"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div style={styles.placeholder}>
                        <span style={styles.placeholderEmoji}>
                            {matchPrompt.gender === "female" ? "👩‍🦰" : "👨‍🦱"}
                        </span>
                        <p style={styles.placeholderText}>
                            오늘 만날 수 있는 이상형의 모습을<br />
                            AI가 그려드릴게요!
                        </p>
                        {onGenerateImage && (
                            <Button
                                variant="fill"
                                color="primary"
                                onClick={onGenerateImage}
                                disabled={isGenerating}
                                style={styles.generateButton}
                            >
                                {isGenerating ? "✨ 그리는 중..." : "✨ 오늘의 짝꿍 보기"}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* 설명 영역 */}
            <div style={styles.descriptionArea}>
                <p style={styles.description}>{description}</p>

                {/* 특징 태그 */}
                <div style={styles.featureTags}>
                    {matchPrompt.keyFeatures.slice(0, 4).map((feature, idx) => {
                        // 영어 특징을 한글로 간단히 변환
                        let koreanFeature = feature;
                        if (feature.includes("warm")) koreanFeature = "따뜻한";
                        else if (feature.includes("mysterious")) koreanFeature = "신비로운";
                        else if (feature.includes("energetic")) koreanFeature = "활기찬";
                        else if (feature.includes("elegant")) koreanFeature = "우아한";
                        else if (feature.includes("charismatic")) koreanFeature = "카리스마";
                        else if (feature.includes("gentle")) koreanFeature = "부드러운";
                        else if (feature.includes("deep")) koreanFeature = "깊이있는";
                        else if (feature.includes("refined")) koreanFeature = "세련된";
                        else if (feature.includes("smile")) koreanFeature = "미소";
                        else if (feature.includes("tall")) koreanFeature = "늘씬한";
                        else koreanFeature = "";

                        if (!koreanFeature) return null;

                        return (
                            <span key={idx} style={styles.featureTag}>
                                #{koreanFeature}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    container: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        marginBottom: 24
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16
    },
    icon: {
        fontSize: 24
    },
    title: {
        fontSize: 17,
        fontWeight: 700,
        color: "#1e293b",
        margin: 0
    },
    imageArea: {
        marginBottom: 16
    },
    imageWrapper: {
        position: "relative",
        borderRadius: 16,
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: "auto",
        borderRadius: 16,
        display: "block"
    },
    imageOverlay: {
        position: "absolute",
        bottom: 12,
        left: 12,
        right: 12,
        display: "flex",
        justifyContent: "flex-start"
    },
    genderBadge: {
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        padding: "6px 12px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        color: "#334155"
    },
    placeholder: {
        backgroundColor: "#fdf2f8",
        borderRadius: 16,
        padding: "40px 20px",
        textAlign: "center",
        border: "2px dashed #fbcfe8"
    },
    placeholderEmoji: {
        fontSize: 48,
        marginBottom: 16,
        display: "block"
    },
    placeholderText: {
        fontSize: 14,
        color: "#9d174d",
        lineHeight: 1.6,
        margin: "0 0 20px 0"
    },
    generateButton: {
        borderRadius: 20,
        padding: "12px 24px",
        fontSize: 15
    },
    descriptionArea: {
        padding: "12px 0 0 0"
    },
    description: {
        fontSize: 15,
        lineHeight: 1.7,
        color: "#334155",
        margin: "0 0 12px 0",
        whiteSpace: "pre-wrap"
    },
    featureTags: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8
    },
    featureTag: {
        fontSize: 12,
        color: "#be185d",
        backgroundColor: "#fdf2f8",
        padding: "4px 10px",
        borderRadius: 10
    }
};
