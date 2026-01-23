import React, { useState } from "react";
import { Button, ListHeader } from "../components/ui";
import type { UserProfile } from "../types";
import { generateCharacterPrompts, getElementEmoji } from "../utils/profileAnalysis";
import { calculateAffinity, getBestMatch } from "../utils/affinity";
import { analyzeInnateCharacter } from "../utils/innateCharacter";

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
    friends: UserProfile[];
    onGoProfile: () => void;
    onGoTodayFortune: () => void;
    onAddFriend: () => void;
    onEditFriend: (id: string) => void;
    onDeleteFriend: (id: string) => void;
}

export default function HomeScreen({
    profile,
    friends,
    onGoProfile,
    onGoTodayFortune,
    onAddFriend,
    onEditFriend,
    onDeleteFriend
}: Props) {
    // 1. My Character Info
    const character = profile.nickname ? generateCharacterPrompts(profile) : null;
    const zodiacEmoji = character ? getZodiacEmoji(character.species) : "✨";
    const elementEmoji = character ? getElementEmoji(character.element) : "✨";

    // 에너지 분석 (확장 시 표시)
    const energyAnalysis = profile.nickname ? analyzeInnateCharacter(profile) : null;

    // 프로필 카드 확장 상태
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);

    // 확장된 친구 카드 ID (null이면 모두 접힘)
    const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);

    // 2. Best Match Logic
    const bestMatch = (profile.nickname && friends.length > 0) ? getBestMatch(profile, friends) : null;

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
            <div style={{ padding: "60px 24px 40px", textAlign: "left" }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: "#191f28", lineHeight: 1.3 }}>
                    매일 만나는<br />나의 연애 점수
                </h1>

                {/* My Character Card - 탭하면 확장 */}
                <div
                    style={{
                        ...cardStyle,
                        cursor: profile.nickname ? "pointer" : "default",
                        transition: "all 0.3s ease"
                    }}
                    onClick={() => profile.nickname && setIsProfileExpanded(!isProfileExpanded)}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <ListHeader title="내 연애 프로필" />
                        {profile.nickname && (
                            <span style={{ fontSize: 12, color: "#8b95a1" }}>
                                {isProfileExpanded ? "▲ 접기" : "▼ 상세보기"}
                            </span>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            backgroundColor: profile.avatarUrl ? "#fff" : (character ? character.mainColor : "#f2f4f6"),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            border: profile.avatarUrl ? "3px solid #3182f6" : "3px solid #fff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            overflow: "hidden"
                        }}>
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt="내 프로필"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                zodiacEmoji
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 18, fontWeight: 700, color: "#191f28" }}>
                                    {profile.nickname || "여행자"}
                                </span>
                                {character && (
                                    <span style={{
                                        fontSize: 11,
                                        padding: "2px 8px",
                                        borderRadius: 12,
                                        backgroundColor: character.mainColor + "22",
                                        color: character.mainColor,
                                        fontWeight: 700,
                                        border: `1px solid ${character.mainColor}44`
                                    }}>
                                        {elementEmoji} {character.elementName}
                                    </span>
                                )}
                            </div>
                            <p style={{ fontSize: 13, color: "#6b7684", marginTop: 2 }}>
                                {character ? `${character.adjectiveKorean} ${character.speciesKorean}` : "프로필을 완성해보세요"}
                            </p>
                        </div>
                    </div>

                    {/* 확장된 에너지 분석 상세 정보 */}
                    {isProfileExpanded && energyAnalysis && (
                        <div style={{
                            marginTop: 20,
                            paddingTop: 20,
                            borderTop: "1px solid #f2f4f6"
                        }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#191f28", marginBottom: 12 }}>
                                ✨ 나의 타고난 에너지
                            </div>

                            {/* 뱃지들 */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                                {energyAnalysis.badges.map((badge, i) => (
                                    <div key={i} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        backgroundColor: "#f9fafb",
                                        padding: "6px 12px",
                                        borderRadius: 20,
                                        fontSize: 13
                                    }}>
                                        <span>{badge.emoji}</span>
                                        <span style={{ fontWeight: 600, color: "#191f28" }}>{badge.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* 설명 */}
                            <div style={{
                                backgroundColor: "#f2f8ff",
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 12
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#3182f6", marginBottom: 4 }}>
                                    💡 {energyAnalysis.elementDescription.title}
                                </div>
                                <p style={{ fontSize: 13, color: "#4e5968", lineHeight: 1.6, margin: 0 }}>
                                    {energyAnalysis.summaryText}
                                </p>
                            </div>

                            {/* 특성 키워드 */}
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {energyAnalysis.elementDescription.traits.map((trait, i) => (
                                    <span key={i} style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#3182f6",
                                        backgroundColor: "#eff6ff",
                                        padding: "4px 10px",
                                        borderRadius: 16
                                    }}>
                                        #{trait}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 24, display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                        <Button style={{ flex: 2 }} variant="fill" color="primary" onClick={onGoTodayFortune}>
                            운세 보기
                        </Button>
                        <Button style={{ flex: 1 }} variant="weak" color="primary" onClick={onGoProfile}>
                            수정
                        </Button>
                    </div>
                </div>

                {/* Today's Recommendation (Best Match) */}
                {bestMatch && (
                    <div style={{
                        marginTop: 40,
                        backgroundColor: "#f2f7ff",
                        borderRadius: 24,
                        padding: "24px",
                        border: "1px solid #e1eeff"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <span style={{ fontSize: 20 }}>💖</span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#3182f6" }}>오늘의 추천 꿍친</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 28,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                            }}>
                                {getZodiacEmoji(generateCharacterPrompts(bestMatch.friend).species)}
                            </div>
                            <div>
                                <p style={{ fontSize: 16, fontWeight: 700, color: "#191f28", margin: 0 }}>
                                    {bestMatch.friend.nickname}님과 {bestMatch.affinity.score}점!
                                </p>
                                <p style={{ fontSize: 13, color: "#4e5968", marginTop: 4, margin: 0 }}>
                                    {bestMatch.affinity.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Friends Section */}
                <div style={{ marginTop: 40 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#191f28" }}>내 꿍친들</h2>
                        <span onClick={onAddFriend} style={{ fontSize: 14, color: "#3182f6", fontWeight: 600, cursor: "pointer" }}>
                            + 친구 추가
                        </span>
                    </div>

                    {friends.length === 0 ? (
                        <div style={{
                            padding: "40px 20px",
                            textAlign: "center",
                            backgroundColor: "#f9fafb",
                            borderRadius: 20,
                            border: "1px dashed #d1d6db"
                        }}>
                            <p style={{ color: "#8b95a1", fontSize: 14 }}>아직 등록된 친구가 없어요.<br />친구의 사주를 추가하고 궁합을 보세요!</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {friends.map(friend => {
                                const fChar = generateCharacterPrompts(friend);
                                const affinity = profile.nickname ? calculateAffinity(profile, friend) : null;
                                const friendEnergy = analyzeInnateCharacter(friend);
                                const isExpanded = expandedFriendId === friend.id;

                                return (
                                    <div
                                        key={friend.id}
                                        style={{
                                            ...friendCardStyle,
                                            flexDirection: "column",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                        onClick={() => setExpandedFriendId(isExpanded ? null : friend.id)}
                                    >
                                        {/* 기본 정보 (항상 표시) */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                                            <div style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: "50%",
                                                backgroundColor: friend.avatarUrl ? "#fff" : fChar.mainColor,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 24,
                                                overflow: "hidden",
                                                border: friend.avatarUrl ? "2px solid #3182f6" : "none"
                                            }}>
                                                {friend.avatarUrl ? (
                                                    <img
                                                        src={friend.avatarUrl}
                                                        alt={friend.nickname}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    getZodiacEmoji(fChar.species)
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <span style={{ fontWeight: 600, color: "#333d4b" }}>{friend.nickname}</span>
                                                    {affinity && (
                                                        <span style={{
                                                            fontSize: 11,
                                                            color: "#3182f6",
                                                            backgroundColor: "#eff6ff",
                                                            padding: "1px 6px",
                                                            borderRadius: 8,
                                                            fontWeight: 700
                                                        }}>
                                                            {affinity.score}점
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: 12, color: "#6b7684", margin: 0 }}>{fChar.speciesKorean} / {fChar.elementName}</p>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                                                <span onClick={() => onEditFriend(friend.id)} style={actionBtnStyle}>수정</span>
                                                <span onClick={() => onDeleteFriend(friend.id)} style={{ ...actionBtnStyle, color: "#f04452" }}>삭제</span>
                                            </div>
                                        </div>

                                        {/* 확장 표시 (상세보기/접기) */}
                                        <div style={{
                                            textAlign: "center",
                                            fontSize: 11,
                                            color: "#8b95a1",
                                            marginTop: 8,
                                            paddingTop: 8,
                                            borderTop: isExpanded ? "none" : "1px dashed #e5e8eb"
                                        }}>
                                            {isExpanded ? "▲ 접기" : "▼ 상세보기"}
                                        </div>

                                        {/* 확장된 에너지 분석 상세 정보 */}
                                        {isExpanded && friendEnergy && (
                                            <div style={{
                                                marginTop: 12,
                                                paddingTop: 16,
                                                borderTop: "1px solid #e5e8eb",
                                                width: "100%"
                                            }}>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: "#191f28", marginBottom: 10 }}>
                                                    ✨ {friend.nickname}의 타고난 에너지
                                                </div>

                                                {/* 뱃지들 */}
                                                <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                                                    {friendEnergy.badges.map((badge, i) => (
                                                        <div key={i} style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 3,
                                                            backgroundColor: "#fff",
                                                            padding: "4px 10px",
                                                            borderRadius: 16,
                                                            fontSize: 12,
                                                            border: "1px solid #e5e8eb"
                                                        }}>
                                                            <span>{badge.emoji}</span>
                                                            <span style={{ fontWeight: 600, color: "#191f28" }}>{badge.label}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* 설명 */}
                                                <div style={{
                                                    backgroundColor: "#fff",
                                                    borderRadius: 10,
                                                    padding: 12,
                                                    marginBottom: 10,
                                                    border: "1px solid #e5e8eb"
                                                }}>
                                                    <p style={{ fontSize: 12, color: "#4e5968", lineHeight: 1.5, margin: 0 }}>
                                                        {friendEnergy.summaryText}
                                                    </p>
                                                </div>

                                                {/* 특성 키워드 */}
                                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                                    {friendEnergy.elementDescription.traits.map((trait, i) => (
                                                        <span key={i} style={{
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                            color: "#3182f6",
                                                            backgroundColor: "#eff6ff",
                                                            padding: "3px 8px",
                                                            borderRadius: 12
                                                        }}>
                                                            #{trait}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 40, paddingBottom: 60, borderTop: "1px solid #f2f4f6", paddingTop: 32 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333d4b", marginBottom: 8 }}>💕 오늘의 연애 운세</h3>
                    <p style={{ fontSize: 13, color: "#8b95a1", lineHeight: 1.6 }}>
                        나의 사주와 오늘의 기운을 분석하여 연애 운세를 알려드려요. 프리미엄 리포트에서는 운명의 짝꿍 이미지와 맞춤 플러팅 전략까지 무료로 확인할 수 있어요!
                    </p>
                </div>
            </div>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: "24px",
    marginTop: 32,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #f2f4f6",
    WebkitTapHighlightColor: "transparent"
};

const friendCardStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    border: "1px solid #f2f4f6",
    WebkitTapHighlightColor: "transparent"
};

const actionBtnStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#6b7684",
    padding: "4px 8px",
    cursor: "pointer",
    backgroundColor: "#fff",
    borderRadius: 8,
    border: "1px solid #e5e8eb",
    WebkitTapHighlightColor: "transparent"
};
