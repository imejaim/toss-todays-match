import { Button, ListHeader } from "../components/ui";
import type { UserProfile } from "../types";
import { generateCharacterPrompts, getElementEmoji } from "../utils/profileAnalysis";

// Get zodiac emoji from species
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

// Simple Card Component for Profile
function ProfileCard({
    profile,
    onClick,
    isMe
}: {
    profile: UserProfile;
    onClick: () => void;
    isMe?: boolean;
}) {
    const visuals = profile.saju ? generateCharacterPrompts(profile) : null;
    const characterEmoji = visuals ? getZodiacEmoji(visuals.species) : (
        profile.gender === "male" ? "🤴" : profile.gender === "female" ? "👸" : "🧙"
    );
    const elementEmoji = visuals ? getElementEmoji(visuals.element) : null;

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: isMe ? "#f2f4f6" : "#ffffff",
                border: isMe ? "none" : "1px solid #e5e8eb",
                borderRadius: 20,
                padding: "16px 20px",
                minWidth: "140px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                height: "100px",
                boxShadow: isMe ? "none" : "0 2px 8px rgba(0,0,0,0.05)"
            }}
        >
            {/* Character Avatar */}
            <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: visuals?.mainColor || "#e5e8eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
                position: "relative",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
                {characterEmoji}
                {elementEmoji && (
                    <span style={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        fontSize: 16,
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
                    }}>
                        {elementEmoji}
                    </span>
                )}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                    fontSize: 12,
                    color: isMe ? "#6b7684" : "#8b95a1",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 4
                }}>
                    {isMe ? "나의 프로필" : "신비한 꿍친"}
                </span>
                <strong style={{
                    fontSize: 18,
                    color: "#191f28",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}>
                    {profile.nickname || (isMe ? "입력 필요" : "이름 없음")}
                </strong>
                {visuals && (
                    <span style={{
                        fontSize: 12,
                        color: "#8b95a1",
                        display: "block",
                        marginTop: 2
                    }}>
                        {visuals.speciesKorean} • {visuals.elementName.split(" ")[0]}
                    </span>
                )}
            </div>
        </div>
    );
}

// Add Button Component
function AddCard({ onClick }: { onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: "#fff",
                border: "1px dashed #b0b8c1",
                borderRadius: 20,
                padding: "20px",
                minWidth: "140px",
                height: "140px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8
            }}
        >
            <div style={{ fontSize: 24, color: "#b0b8c1" }}>+</div>
            <div style={{ fontSize: 13, color: "#8b95a1", fontWeight: 600 }}>꿍친 추가</div>
        </div>
    );
}

interface HomeScreenProps {
    myProfile: UserProfile;
    friends: UserProfile[];
    onSelectProfile: (id: string) => void;
    onAddFriend: () => void;
    onGoTodayFortune: (id: string) => void;
}

export function HomeScreen(props: HomeScreenProps) {
    const { myProfile, friends, onSelectProfile, onAddFriend, onGoTodayFortune } = props;

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh", paddingBottom: 80 }}>
            {/* Header Area */}
            <div style={{ padding: "60px 24px 20px", textAlign: "left" }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#191f28", lineHeight: 1.3 }}>
                    오늘의 짝꿍<br />
                    <span style={{ color: "#3182f6" }}>나의 유니버스</span>
                </h1>
                <p style={{ fontSize: 16, color: "#4e5968", lineHeight: 1.5 }}>
                    나와 소중한 사람들의<br />
                    매일 달라지는 케미를 확인하세요.
                </p>
            </div>

            {/* 1. My Profile Section */}
            <div style={{ padding: "0 24px 40px" }}>
                <ListHeader title="나의 캐릭터" />
                <div style={{ marginTop: 10 }}>
                    <ProfileCard
                        isMe
                        profile={myProfile}
                        onClick={() => onSelectProfile(myProfile.id)}
                    />
                </div>

                {myProfile.nickname && (
                    <div style={{ marginTop: 16 }}>
                        <Button size="large" variant="fill" color="primary" onClick={() => onGoTodayFortune(myProfile.id)} style={{ width: "100%" }}>
                            내 운세 바로 보기
                        </Button>
                    </div>
                )}

                {/* Human Design Strategy Card */}
                {myProfile.humanDesign && myProfile.humanDesign.type && (
                    <div style={{ marginTop: 24 }}>
                        <ListHeader title="오늘의 전략 (Human Design)" />
                        <div style={{
                            marginTop: 10,
                            padding: "20px",
                            backgroundColor: "#f2f4f6", // Light gray background
                            borderRadius: 20,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 13, color: "#6b7684", fontWeight: 600 }}>
                                    {myProfile.humanDesign.type} • {myProfile.humanDesign.profile}
                                </span>
                                <span style={{ fontSize: 13, color: "#3182f6", fontWeight: 600 }}>
                                    {myProfile.humanDesign.authority} Authority
                                </span>
                            </div>
                            <strong style={{ fontSize: 20, color: "#191f28", lineHeight: 1.4 }}>
                                {getStrategyMessage(myProfile.humanDesign.strategy)}
                            </strong>
                            <p style={{ fontSize: 15, color: "#4e5968", marginTop: 4 }}>
                                {getAuthMessage(myProfile.humanDesign.authority)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Friends Section (Horizontal Scroll) */}
            <div style={{ paddingBottom: 40 }}>
                <div style={{ padding: "0 24px" }}>
                    <ListHeader title="나의 꿍친들" />
                </div>

                <div style={{
                    display: "flex",
                    gap: 12,
                    overflowX: "auto",
                    padding: "12px 24px",
                    scrollBehavior: "smooth",
                    scrollbarWidth: "none" // Firefox
                }}>
                    {/* Friends List */}
                    {friends.map(friend => (
                        <ProfileCard
                            key={friend.id}
                            profile={friend}
                            onClick={() => onSelectProfile(friend.id)}
                        />
                    ))}
                    {/* Add Button */}
                    <AddCard onClick={onAddFriend} />
                </div>
            </div>
        </div>
    );
}

function getStrategyMessage(strategy: string) {
    if (!strategy) return "나만의 전략을 발견해보세요.";
    switch (strategy) {
        case "To Respond": return "무언가 올 때까지 기다리고, 반응하세요.";
        case "To Inform": return "행동하기 전에 주변에 알리세요.";
        case "Wait for Invitation": return "초대를 받을 때까지 기다리세요.";
        case "Wait a Lunar Cycle": return "중요한 결정은 한 달(28일) 동안 지켜보세요.";
        default: return strategy;
    }
}

function getAuthMessage(auth: string) {
    if (!auth) return "";
    switch (auth) {
        case "Emotional": return "감정의 파도가 지나간 후 명료해질 때 결정하세요.";
        case "Sacral": return "머리로 생각하지 말고, 몸의 본능적인 반응(Uh-huh/Un-uh)을 믿으세요.";
        case "Splenic": return "순간적인 직관과 생존 본능을 따르세요. 두 번 말하지 않습니다.";
        case "Ego": return "내가 정말 원하고 약속할 수 있는 것인지 확인하세요.";
        case "G-Center": return "내 정체성과 방향성이 맞는지 스스로에게 물어보세요.";
        case "Mental": return "다른 사람과 대화하며 자신의 생각을 정리하세요. 결정은 환경이 줍니다.";
        case "Lunar": return "시간을 두고 다양한 환경에서 느껴지는 변화를 관찰하세요.";
        default: return "";
    }
}
