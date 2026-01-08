import React from "react";
import type { UserProfile, FortuneResult } from "../types";
import {
    Button,
} from "../components/ui";
import { generateCharacterPrompts } from "../utils/profileAnalysis";

// Get zodiac emoji from species
function getZodiacEmoji(species: string): string {
    const emojiMap: Record<string, string> = {
        "Rat": "🐭", "Ox": "🐮", "Tiger": "🐯", "Rabbit": "🐰",
        "Dragon": "🐲", "Snake": "🐍", "Horse": "🐴", "Goat": "🐑",
        "Monkey": "🐵", "Rooster": "🐔", "Dog": "🐶", "Pig": "🐷",
    };
    return emojiMap[species] || "✨";
}

interface Props {
    profile: UserProfile;
    fortune: FortuneResult;
    onGoPremium: () => void;
    onBackHome: () => void;
}

export function TodayFortuneScreen({ profile, fortune, onGoPremium, onBackHome }: Props) {
    const nameLabel = profile.nickname || "오늘의 짝꿍";
    const character = generateCharacterPrompts(profile);

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh", paddingBottom: 110 }}>
            <div style={{ padding: "0 24px", textAlign: "center" }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: "24px 0 32px", color: "#191f28" }}>
                    오늘의 연애 운세
                </h1>

                {/* Character Avatar on Fortune Screen */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 8
                }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: character.mainColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 40,
                        border: "4px solid #fff",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.08)"
                    }}>
                        {getZodiacEmoji(character.species)}
                    </div>
                </div>

                <div style={{ padding: "20px 0 40px" }}>
                    <p style={{ fontSize: 16, color: "#4e5968", marginBottom: 8 }}>
                        {nameLabel}님의 오늘 연애 점수
                    </p>
                    <p style={{ fontSize: 72, fontWeight: 800, color: "#3182f6", margin: 0 }}>
                        {fortune.score}<span style={{ fontSize: 24 }}>점</span>
                    </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 32 }}>
                    {fortune.keywords.map((k) => (
                        <span key={k} style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#3182f6",
                            backgroundColor: "#f2f8ff",
                            padding: "8px 14px",
                            borderRadius: 10
                        }}>
                            #{k}
                        </span>
                    ))}
                </div>

                <div style={{
                    backgroundColor: "#f9fafb",
                    padding: "24px",
                    borderRadius: 20,
                    textAlign: "left",
                    marginBottom: 40,
                    border: "1px solid #f2f4f6"
                }}>
                    <p style={{
                        fontSize: 17,
                        lineHeight: 1.6,
                        color: "#333d4b",
                        whiteSpace: "pre-wrap",
                        wordBreak: "keep-all"
                    }}>
                        {fortune.message}
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Button
                        variant="fill"
                        color="primary"
                        onClick={onGoPremium}
                        style={{ width: "100%", height: 52, fontSize: 17, fontWeight: 700, borderRadius: 16 }}
                    >
                        더 자세한 연애 비법 보기 &rarr;
                    </Button>

                    <Button
                        variant="weak"
                        color="primary"
                        onClick={onBackHome}
                        style={{ width: "100%", height: 48, fontSize: 15, color: "#8b95a1", borderRadius: 16 }}
                    >
                        다음에 할게요 (홈으로)
                    </Button>
                </div>
            </div>
        </div>
    );
}
