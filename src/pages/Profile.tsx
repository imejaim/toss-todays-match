import React, { useState, useMemo } from "react";
import type { UserProfile, Gender, RelationshipStatus } from "../types";
import {
    Button,
    FixedBottomCTA,
    Checkbox
} from "../components/ui";
import { analyzeInnateCharacter } from "../utils/innateCharacter";
import { useToast } from "../components/Toast";
import { generateProfileImageUrl } from "../utils/matchImageGenerator";
import { useRewardedAd } from "../hooks/useRewardedAd";

interface Props {
    initialProfile: UserProfile;
    onSave: (p: UserProfile) => void;
    title?: string;
    ctaLabel?: string;
    isFriend?: boolean; // 꿍친 프로필인지 여부
}

// 년도 옵션 생성 (1940 ~ 현재년도)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => currentYear - i);

// 월 옵션
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

// 일 옵션 생성 함수
const getDayOptions = (year: number, month: number): number[] => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

export function ProfileScreen({ initialProfile, onSave, title = "프로필 정보", ctaLabel = "저장하기", isFriend = false }: Props) {
    const [nickname, setNickname] = useState(initialProfile.nickname);

    // 생년월일 개별 상태
    const initialDate = initialProfile.birthDate ? new Date(initialProfile.birthDate) : null;
    const [birthYear, setBirthYear] = useState<number>(initialDate ? initialDate.getFullYear() : 1990);
    const [birthMonth, setBirthMonth] = useState<number>(initialDate ? initialDate.getMonth() + 1 : 1);
    const [birthDay, setBirthDay] = useState<number>(initialDate ? initialDate.getDate() : 1);

    const [birthTime, setBirthTime] = useState(initialProfile.birthTime || "12:00");
    const [gender, setGender] = useState<Gender>(initialProfile.gender);
    const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>(initialProfile.relationshipStatus);
    const [isTimeUnknown, setIsTimeUnknown] = useState(initialProfile.birthTime === "unknown");

    // 에너지 미리보기 표시 상태
    const [showEnergyPreview, setShowEnergyPreview] = useState(false);

    // 아바타 이미지 URL 상태
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialProfile.avatarUrl);

    // 광고 훅
    const { loading: adLoading, showRewardAd } = useRewardedAd();

    // 생년월일 문자열 생성
    const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    // 일 옵션 (년/월에 따라 동적으로 변경)
    const dayOptions = useMemo(() => getDayOptions(birthYear, birthMonth), [birthYear, birthMonth]);

    // 일 선택이 해당 월의 마지막 날을 초과하면 조정
    React.useEffect(() => {
        const maxDay = dayOptions.length;
        if (birthDay > maxDay) {
            setBirthDay(maxDay);
        }
    }, [birthYear, birthMonth, dayOptions.length, birthDay]);

    // 에너지 분석 (미리보기용)
    const energyAnalysis = useMemo(() => {
        if (!nickname || !birthDate) return null;

        const tempProfile: UserProfile = {
            id: "preview",
            nickname,
            birthDate,
            birthTime: isTimeUnknown ? "12:00" : birthTime,
            gender,
            relationshipStatus
        };

        try {
            return analyzeInnateCharacter(tempProfile);
        } catch {
            return null;
        }
    }, [nickname, birthDate, birthTime, isTimeUnknown, gender, relationshipStatus]);

    const { showToast } = useToast();

    const handleCheckEnergy = () => {
        if (!nickname) {
            showToast("닉네임을 먼저 입력해주세요.");
            return;
        }
        setShowEnergyPreview(true);
    };

    const handleSave = () => {
        if (!nickname) {
            showToast("닉네임을 입력해주세요.");
            return;
        }
        onSave({
            ...initialProfile,
            nickname,
            birthDate,
            birthTime: isTimeUnknown ? "unknown" : birthTime,
            gender,
            relationshipStatus,
            avatarUrl  // 이미지 URL도 저장
        });
    };

    // 운명 이미지 생성 핸들러
    const handleGenerateImage = async () => {
        if (!nickname || !birthDate) {
            showToast("닉네임과 생년월일을 먼저 입력해주세요.");
            return;
        }

        // 광고 시청
        const rewarded = await showRewardAd();
        if (!rewarded) {
            showToast("광고 시청을 완료해야 이미지를 생성할 수 있어요.");
            return;
        }

        // 임시 프로필로 이미지 URL 생성
        const tempProfile: UserProfile = {
            ...initialProfile,
            nickname,
            birthDate,
            birthTime: isTimeUnknown ? "unknown" : birthTime,
            gender,
            relationshipStatus
        };
        const imageUrl = generateProfileImageUrl(tempProfile);
        setAvatarUrl(imageUrl);
        showToast("운명 이미지가 생성되었어요! 프로필을 저장해주세요.");
    };

    // 셀렉트 스타일
    const selectStyle: React.CSSProperties = {
        flex: 1,
        height: 48,
        padding: "0 12px",
        fontSize: 16,
        border: "1px solid #e5e8eb",
        borderRadius: 12,
        backgroundColor: "#fff",
        color: "#191f28",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7684' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        cursor: "pointer"
    };

    return (
        <div style={{ padding: "0 24px 180px", backgroundColor: "#fff", minHeight: "100vh" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: "40px 0 32px", color: "#191f28" }}>
                {title}
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* 닉네임 */}
                <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 8 }}>
                        닉네임
                    </label>
                    <input
                        type="text"
                        placeholder="이름이나 닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        style={{
                            width: "100%",
                            height: 48,
                            padding: "0 16px",
                            fontSize: 16,
                            border: "1px solid #e5e8eb",
                            borderRadius: 12,
                            backgroundColor: "#fff",
                            color: "#191f28",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* 생년월일 - 개별 선택 */}
                <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 8 }}>
                        생년월일
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                        <select
                            value={birthYear}
                            onChange={(e) => setBirthYear(Number(e.target.value))}
                            style={selectStyle}
                        >
                            {yearOptions.map(y => (
                                <option key={y} value={y}>{y}년</option>
                            ))}
                        </select>
                        <select
                            value={birthMonth}
                            onChange={(e) => setBirthMonth(Number(e.target.value))}
                            style={selectStyle}
                        >
                            {monthOptions.map(m => (
                                <option key={m} value={m}>{m}월</option>
                            ))}
                        </select>
                        <select
                            value={birthDay}
                            onChange={(e) => setBirthDay(Number(e.target.value))}
                            style={selectStyle}
                        >
                            {dayOptions.map(d => (
                                <option key={d} value={d}>{d}일</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 태어난 시간 */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: "#4e5968" }}>태어난 시간</label>
                        <Checkbox checked={isTimeUnknown} onChange={(e) => setIsTimeUnknown(e.target.checked)}>
                            <span style={{ fontSize: 13, color: "#8b95a1" }}>모름</span>
                        </Checkbox>
                    </div>
                    <input
                        type="time"
                        value={isTimeUnknown ? "" : birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        disabled={isTimeUnknown}
                        style={{
                            width: "100%",
                            height: 48,
                            padding: "0 16px",
                            fontSize: 16,
                            border: "1px solid #e5e8eb",
                            borderRadius: 12,
                            backgroundColor: isTimeUnknown ? "#f9fafb" : "#fff",
                            color: isTimeUnknown ? "#8b95a1" : "#191f28",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* 성별 */}
                <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 12 }}>성별</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {[
                            { id: "male", label: "남성" },
                            { id: "female", label: "여성" }
                        ].map((g) => (
                            <Button
                                key={g.id}
                                variant={gender === g.id ? "fill" : "weak"}
                                color={gender === g.id ? "primary" : "secondary"}
                                style={{ flex: 1, height: 48, borderRadius: 12 }}
                                onClick={() => setGender(g.id as Gender)}
                            >
                                {g.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* 연애 상태 */}
                <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 12 }}>연애 상태</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {[
                            { id: "single", label: "솔로" },
                            { id: "dating", label: "연애 중" },
                            { id: "married", label: "기혼" },
                            { id: "complicated", label: "복잡함" }
                        ].map((s) => (
                            <Button
                                key={s.id}
                                variant={relationshipStatus === s.id ? "fill" : "weak"}
                                color={relationshipStatus === s.id ? "primary" : "secondary"}
                                style={{ height: 48, borderRadius: 12 }}
                                onClick={() => setRelationshipStatus(s.id as RelationshipStatus)}
                            >
                                {s.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* 에너지 확인 버튼 */}
                {!showEnergyPreview && (
                    <Button
                        variant="weak"
                        color="primary"
                        onClick={handleCheckEnergy}
                        style={{
                            height: 56,
                            borderRadius: 16,
                            fontSize: 16,
                            fontWeight: 600,
                            border: "2px dashed #3182f6",
                            backgroundColor: "#f2f8ff"
                        }}
                    >
                        ✨ {isFriend ? (nickname ? `${nickname}의 에너지 확인하기` : "꿍친 에너지 확인하기") : "나의 에너지 확인하기"}
                    </Button>
                )}

                {/* 에너지 미리보기 카드 */}
                {showEnergyPreview && energyAnalysis && (
                    <div style={{
                        backgroundColor: "linear-gradient(135deg, #f0f7ff 0%, #fff5f5 100%)",
                        background: "linear-gradient(135deg, #f0f7ff 0%, #fff5f5 100%)",
                        borderRadius: 20,
                        padding: 24,
                        border: "1px solid #e1eeff"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <span style={{ fontSize: 24 }}>{energyAnalysis.badges[0]?.emoji || "✨"}</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "#191f28" }}>
                                {nickname}님의 타고난 에너지
                            </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                            <div style={{
                                backgroundColor: "#fff",
                                borderRadius: 12,
                                padding: 16,
                                textAlign: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                            }}>
                                <div style={{ fontSize: 28, marginBottom: 4 }}>{energyAnalysis.badges[0]?.emoji || "✨"}</div>
                                <div style={{ fontSize: 12, color: "#8b95a1" }}>주요 오행</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#191f28" }}>
                                    {energyAnalysis.badges[0]?.label || ""}
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: "#fff",
                                borderRadius: 12,
                                padding: 16,
                                textAlign: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                            }}>
                                <div style={{ fontSize: 28, marginBottom: 4 }}>{energyAnalysis.badges[1]?.emoji || "🔋"}</div>
                                <div style={{ fontSize: 12, color: "#8b95a1" }}>에너지 타입</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#191f28" }}>
                                    {energyAnalysis.hdDescription?.title || ""}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            padding: 16,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                        }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#3182f6", marginBottom: 8 }}>
                                💡 {energyAnalysis.elementDescription?.title || "당신의 에너지"}
                            </div>
                            <p style={{
                                fontSize: 14,
                                color: "#4e5968",
                                lineHeight: 1.6,
                                margin: 0
                            }}>
                                {energyAnalysis.summaryText || ""}
                            </p>
                        </div>

                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 16,
                            justifyContent: "center"
                        }}>
                            {(energyAnalysis.elementDescription?.traits || []).map((trait, i) => (
                                <span key={i} style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#3182f6",
                                    backgroundColor: "#eff6ff",
                                    padding: "6px 12px",
                                    borderRadius: 20
                                }}>
                                    #{trait}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 운명 이미지 생성 섹션 */}
            <div style={{
                backgroundColor: "#f9fafb",
                borderRadius: 20,
                padding: 20,
                marginTop: 32,
                textAlign: "center"
            }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#333d4b", marginBottom: 12 }}>
                    ✨ {isFriend ? "꿍친" : "나의"} 운명 이미지
                </div>

                {avatarUrl ? (
                    <div style={{ marginBottom: 16 }}>
                        <img
                            src={avatarUrl}
                            alt="운명 이미지"
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "3px solid #3182f6",
                                boxShadow: "0 4px 12px rgba(49, 130, 246, 0.3)"
                            }}
                        />
                    </div>
                ) : (
                    <p style={{ fontSize: 14, color: "#8b95a1", marginBottom: 16 }}>
                        광고를 시청하고 사주 기반 운명 이미지를 만들어 보세요!
                    </p>
                )}

                <Button
                    onClick={handleGenerateImage}
                    disabled={adLoading}
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: 12,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: adLoading ? "not-allowed" : "pointer",
                        opacity: adLoading ? 0.6 : 1
                    }}
                >
                    {adLoading ? "로딩 중..." : avatarUrl ? "🔄 이미지 새로 만들기" : "🎬 광고 보고 이미지 만들기"}
                </Button>
            </div>

            <FixedBottomCTA onClick={handleSave}>
                {ctaLabel}
            </FixedBottomCTA>
        </div>
    );
}
