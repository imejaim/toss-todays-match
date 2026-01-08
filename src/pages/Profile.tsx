import React, { useState } from "react";
import type { UserProfile, Gender, RelationshipStatus } from "../types";
import {
    Button,
    TextField,
    FixedBottomCTA,
    Checkbox
} from "../components/ui";

interface Props {
    initialProfile: UserProfile;
    onSave: (p: UserProfile) => void;
    title?: string;
    ctaLabel?: string;
}

export function ProfileScreen({ initialProfile, onSave, title = "프로필 정보", ctaLabel = "저장하기" }: Props) {
    const [nickname, setNickname] = useState(initialProfile.nickname);
    const [birthDate, setBirthDate] = useState(initialProfile.birthDate);
    const [birthTime, setBirthTime] = useState(initialProfile.birthTime);
    const [gender, setGender] = useState<Gender>(initialProfile.gender);
    const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>(initialProfile.relationshipStatus);
    const [isTimeUnknown, setIsTimeUnknown] = useState(initialProfile.birthTime === "unknown");

    const handleSave = () => {
        if (!nickname || !birthDate) {
            alert("닉네임과 생년월일을 입력해주세요.");
            return;
        }
        onSave({
            ...initialProfile,
            nickname,
            birthDate,
            birthTime: isTimeUnknown ? "unknown" : birthTime,
            gender,
            relationshipStatus
        });
    };

    return (
        <div style={{ padding: "0 24px 120px", backgroundColor: "#fff", minHeight: "100vh" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: "40px 0 32px", color: "#191f28" }}>
                {title}
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <TextField
                    label="닉네임"
                    placeholder="이름이나 닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />

                <div>
                    <TextField
                        label="생년월일"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </div>

                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 600, color: "#4e5968" }}>태어난 시간</label>
                        <Checkbox checked={isTimeUnknown} onChange={(e) => setIsTimeUnknown(e.target.checked)}>
                            <span style={{ fontSize: 13, color: "#8b95a1" }}>모름</span>
                        </Checkbox>
                    </div>
                    <TextField
                        type="time"
                        value={isTimeUnknown ? "" : birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        disabled={isTimeUnknown}
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 12 }}>성별</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {["male", "female"].map((g) => (
                            <Button
                                key={g}
                                variant={gender === g ? "fill" : "weak"}
                                color={gender === g ? "primary" : "secondary"}
                                style={{ flex: 1, height: 48, borderRadius: 12 }}
                                onClick={() => setGender(g as Gender)}
                            >
                                {g === "male" ? "남성" : "여성"}
                            </Button>
                        ))}
                    </div>
                </div>

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
            </div>

            <FixedBottomCTA onClick={handleSave}>
                {ctaLabel}
            </FixedBottomCTA>
        </div>
    );
}
