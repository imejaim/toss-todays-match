import { Button, ListHeader } from "../components/ui";
import type { UserProfile } from "../types";
import { generateCharacterPrompts, getElementEmoji } from "../utils/profileAnalysis";

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
    const character = profile.nickname ? generateCharacterPrompts(profile) : null;
    const zodiacEmoji = character ? getZodiacEmoji(character.species) : "✨";
    const elementEmoji = character ? getElementEmoji(character.rawElement) : "✨";

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
            <div style={{ padding: "60px 24px 40px", textAlign: "left" }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: "#191f28", lineHeight: 1.3 }}>
                    매일 만나는<br />나의 연애 점수
                </h1>

                {/* My Character Card */}
                <div style={cardStyle}>
                    <ListHeader title="내 연애 프로필" />
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            backgroundColor: character ? character.mainColor : "#f2f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            border: "3px solid #fff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                        }}>
                            {zodiacEmoji}
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

                    <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
                        <Button style={{ flex: 2 }} variant="fill" color="primary" onClick={onGoTodayFortune}>
                            운세 보기
                        </Button>
                        <Button style={{ flex: 1 }} variant="weak" color="primary" onClick={onGoProfile}>
                            수정
                        </Button>
                    </div>
                </div>

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
                                return (
                                    <div key={friend.id} style={friendCardStyle}>
                                        <div style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "50%",
                                            backgroundColor: fChar.mainColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 24
                                        }}>
                                            {getZodiacEmoji(fChar.species)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span style={{ fontWeight: 600, color: "#333d4b" }}>{friend.nickname}</span>
                                                <span style={{ fontSize: 11, color: "#8b95a1" }}>{fChar.elementName}</span>
                                            </div>
                                            <p style={{ fontSize: 12, color: "#6b7684", margin: 0 }}>{fChar.speciesKorean}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <span onClick={() => onEditFriend(friend.id)} style={actionBtnStyle}>수정</span>
                                            <span onClick={() => onDeleteFriend(friend.id)} style={{ ...actionBtnStyle, color: "#f04452" }}>삭제</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 40, paddingBottom: 60, borderTop: "1px solid #f2f4f6", paddingTop: 32 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#333d4b", marginBottom: 8 }}>궁합 분석 시스템</h3>
                    <p style={{ fontSize: 13, color: "#8b95a1", lineHeight: 1.6 }}>
                        등록된 꿍친들과의 오행 상생/상극 분석을 통해 매일 가장 잘 어울리는 '오늘의 꿍친'을 추천해 드립니다.
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
    border: "1px solid #f2f4f6"
};

const friendCardStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: 20,
    border: "1px solid #f2f4f6"
};

const actionBtnStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#6b7684",
    padding: "4px 8px",
    cursor: "pointer",
    backgroundColor: "#fff",
    borderRadius: 8,
    border: "1px solid #e5e8eb"
};
