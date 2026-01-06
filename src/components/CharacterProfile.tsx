import React from "react";
import type { UserProfile } from "../types";
import { generateCharacterPrompts } from "../utils/profileAnalysis";

interface CharacterProfileProps {
    profile: UserProfile;
    imageUrl?: string;
}

export const CharacterProfile: React.FC<CharacterProfileProps> = ({ profile, imageUrl }) => {
    const visuals = generateCharacterPrompts(profile);

    return (
        <div style={styles.container}>
            <div style={styles.imageArea}>
                {imageUrl ? (
                    <img src={imageUrl} alt="My Character" style={styles.image} />
                ) : (
                    <div style={{ ...styles.placeholder, backgroundColor: visuals.mainColor }}>
                        <span style={styles.placeholderEmoji}>
                            {getZodiacEmoji(visuals.species)}
                        </span>
                    </div>
                )}
            </div>
            <div style={styles.summaryArea}>
                <h2 style={styles.charName}>
                    {visuals.adjectiveKorean} {visuals.speciesKorean}
                </h2>
                <p style={styles.description}>
                    {profile.nickname}님은 <strong style={{ color: visuals.mainColor === "#F1F1F1" ? "#888" : visuals.mainColor }}>{visuals.elementName}</strong> 에너지를 가진{" "}
                    <strong>{visuals.adjectiveKorean} {visuals.speciesKorean}</strong>예요!
                    {visuals.accessoryKorean && ` 멋진 ${visuals.accessoryKorean}을(를) 착용한 모습이 정말 잘 어울려요.`}
                </p>
            </div>
        </div>
    );
};

// Zodiac to Emoji mapping
function getZodiacEmoji(species: string): string {
    const emojiMap: Record<string, string> = {
        "Rat": "🐭", "Ox": "🐮", "Tiger": "🐯", "Rabbit": "🐰",
        "Dragon": "🐲", "Snake": "🐍", "Horse": "🐴", "Goat": "🐑",
        "Monkey": "🐵", "Rooster": "🐔", "Dog": "🐶", "Pig": "🐷",
        "Bee": "🐝", "Cat": "🐱", "Owl": "🦉", "Wolf": "🐺",
        "Peacock": "🦚", "Lion": "🦁", "Elephant": "🐘"
    };
    return emojiMap[species] || "🌟";
}

const styles: { [k: string]: React.CSSProperties } = {
    container: {
        padding: "24px 0",
        textAlign: "center",
    },
    imageArea: {
        width: 240,
        height: 240,
        margin: "0 auto 20px",
        borderRadius: 40,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        backgroundColor: "#f2f4f6",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    placeholder: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        color: "#8b95a1",
        fontSize: 14,
    },
    placeholderEmoji: {
        fontSize: 100,
        lineHeight: 1,
    },
    summaryArea: {
        marginTop: 16,
    },
    charName: {
        fontSize: 20,
        fontWeight: 700,
        color: "#191f28",
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: "#4e5968",
        lineHeight: 1.6,
        padding: "0 20px",
        wordBreak: "keep-all",
    },
};
