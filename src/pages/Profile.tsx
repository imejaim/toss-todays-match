import { useState, useEffect } from "react";
import type { UserProfile, Gender, RelationshipStatus } from "../types";
import {
    Button,
    TextField,
    FixedBottomCTA,
    Checkbox
} from "@toss/tds-mobile";

interface Props {
    initialProfile: UserProfile;
    onChange: (profile: UserProfile) => void;
    onSaveAndNext: () => void;
    onBack: () => void;
}

export function ProfileScreen({ initialProfile, onChange, onSaveAndNext }: Props) {
    const [localProfile, setLocalProfile] = useState<UserProfile>(initialProfile);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all fields exist
                const merged = { ...initialProfile, ...parsed };
                setLocalProfile(merged);
                onChange(merged);
            } catch (e) {
                console.error("Failed to parse profile", e);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const update = (patch: Partial<UserProfile>) => {
        const newProfile = { ...localProfile, ...patch };
        setLocalProfile(newProfile);
        onChange(newProfile);
    };

    const handleSave = () => {
        if (!localProfile.nickname.trim()) {
            alert("닉네임을 입력해주세요!");
            return;
        }
        localStorage.setItem("userProfile", JSON.stringify(localProfile));
        onSaveAndNext();
    };

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh", paddingBottom: 120 }}>


            <div style={{ padding: "0 24px" }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24, marginBottom: 8, color: "#191f28" }}>
                    연애 프로필
                </h1>
                <p style={{ fontSize: 16, color: "#4e5968", marginBottom: 32 }}>
                    더 정확한 운세를 위해 정보를 입력해주세요.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    {/* 1. Nickname */}
                    <TextField
                        variant="box"
                        label="닉네임"
                        placeholder="예: 토스매니아"
                        value={localProfile.nickname}
                        onChange={(e) => update({ nickname: e.target.value })}
                    />

                    {/* 2. Birthdate & Time */}
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 12 }}>
                            생년월일 및 태어난 시간
                        </p>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <TextField
                                style={{ flex: 2 }}
                                variant="box"
                                type="date"
                                value={localProfile.birthDate}
                                onChange={(e) => update({ birthDate: e.target.value })}
                            />
                            <TextField
                                style={{ flex: 1 }}
                                variant="box"
                                type="time"
                                disabled={localProfile.birthTime === "unknown"}
                                value={localProfile.birthTime === "unknown" ? "" : localProfile.birthTime}
                                onChange={(e) => update({ birthTime: e.target.value })}
                            />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <Checkbox.Circle
                                checked={localProfile.birthTime === "unknown"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ birthTime: e.target.checked ? "unknown" : "" })}
                            >
                                <span style={{ fontSize: 15, color: "#4e5968", marginLeft: 4 }}>태어난 시간 모름</span>
                            </Checkbox.Circle>
                        </div>
                    </div>

                    {/* 3. Gender */}
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 12 }}>
                            성별
                        </p>
                        <div style={{ display: "flex", gap: 8 }}>
                            {([
                                { val: "male", label: "남성" },
                                { val: "female", label: "여성" },
                                { val: "other", label: "선택 안함" },
                            ] as const).map((opt) => (
                                <Button
                                    key={opt.val}
                                    style={{ flex: 1 }}
                                    variant={localProfile.gender === opt.val ? "fill" : "weak"}
                                    color="primary"
                                    size="small"
                                    onClick={() => update({ gender: opt.val as Gender })}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Relationship Status */}
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 12 }}>
                            연애 상태
                        </p>
                        <select
                            style={legacyStyles.select}
                            value={localProfile.relationshipStatus}
                            onChange={(e) => update({ relationshipStatus: e.target.value as RelationshipStatus })}
                        >
                            <option value="" disabled>선택해주세요</option>
                            <option value="single">솔로</option>
                            <option value="dating">연애 중</option>
                            <option value="married">기혼</option>
                            <option value="complicated">복잡 미묘</option>
                        </select>
                    </div>
                </div>
            </div>

            <FixedBottomCTA onClick={handleSave}>
                저장하고 운세 보러가기
            </FixedBottomCTA>
        </div>
    );
}

const legacyStyles = {
    select: {
        width: "100%",
        padding: "14px 16px",
        fontSize: 16,
        borderRadius: 12,
        border: "1px solid #d1d6db",
        backgroundColor: "#f9fafb",
        outline: "none",
        appearance: "none" as const,
        color: "#191f28",
    }
};
