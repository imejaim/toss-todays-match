import { useState, useEffect } from "react";
import type { UserProfile, Gender, RelationshipStatus } from "../types";

interface Props {
    initialProfile: UserProfile;
    onChange: (profile: UserProfile) => void;
    onSaveAndNext: () => void;
    onBack: () => void;
}

export function ProfileScreen({ initialProfile, onChange, onSaveAndNext, onBack }: Props) {
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
        <div style={styles.page}>
            <h1 style={styles.title}>연애 프로필</h1>
            <p style={styles.subtitle}>더 정확한 운세를 위해 정보를 입력해주세요.</p>

            <div style={styles.card}>
                {/* 1. Nickname */}
                <div style={styles.field}>
                    <label style={styles.label}>닉네임</label>
                    <input
                        style={styles.input}
                        value={localProfile.nickname}
                        onChange={(e) => update({ nickname: e.target.value })}
                        placeholder="예: 토스매니아"
                    />
                </div>

                {/* 2. Birthdate & Time */}
                <div style={styles.field}>
                    <label style={styles.label}>생년월일 및 태어난 시간</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                            style={{ ...styles.input, flex: 2 }}
                            type="date"
                            value={localProfile.birthDate}
                            onChange={(e) => update({ birthDate: e.target.value })}
                        />
                        <input
                            style={{ ...styles.input, flex: 1 }}
                            type="time"
                            disabled={localProfile.birthTime === "unknown"}
                            value={localProfile.birthTime === "unknown" ? "" : localProfile.birthTime}
                            onChange={(e) => update({ birthTime: e.target.value })}
                        />
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7684", marginTop: 4, cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={localProfile.birthTime === "unknown"}
                            onChange={(e) => update({ birthTime: e.target.checked ? "unknown" : "" })}
                        />
                        태어난 시간 모름
                    </label>
                </div>

                {/* 3. Gender */}
                <div style={styles.field}>
                    <label style={styles.label}>성별</label>
                    <div style={styles.radioGroup}>
                        {([
                            { val: "male", label: "남성" },
                            { val: "female", label: "여성" },
                            { val: "other", label: "선택 안함" },
                        ] as const).map((opt) => (
                            <button
                                key={opt.val}
                                style={localProfile.gender === opt.val ? styles.radioSelected : styles.radio}
                                onClick={() => update({ gender: opt.val as Gender })}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Relationship Status */}
                <div style={styles.field}>
                    <label style={styles.label}>연애 상태</label>
                    <select
                        style={styles.select}
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

                <div style={styles.buttonGroup}>
                    <button style={styles.primaryButton} onClick={handleSave}>
                        저장하고 운세 보러가기
                    </button>
                    <button style={styles.secondaryButton} onClick={onBack}>
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    page: {
        maxWidth: 480,
        margin: "0 auto",
        padding: "24px 20px 40px",
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 8,
        color: "#333",
    },
    subtitle: {
        fontSize: 15,
        color: "#6b7684",
        marginBottom: 24,
    },
    card: {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 600,
        color: "#4e5968",
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        fontSize: 16,
        borderRadius: 12,
        border: "1px solid #d1d6db",
        backgroundColor: "#f9fafb",
        outline: "none",
    },
    select: {
        width: "100%",
        padding: "12px 14px",
        fontSize: 16,
        borderRadius: 12,
        border: "1px solid #d1d6db",
        backgroundColor: "#f9fafb",
        outline: "none",
        appearance: "none", // Remove default arrow in some browsers
    },
    radioGroup: {
        display: "flex",
        gap: 8,
    },
    radio: {
        flex: 1,
        padding: "10px",
        borderRadius: 10,
        border: "1px solid #d1d6db",
        backgroundColor: "#fff",
        color: "#6b7684",
        fontSize: 14,
        cursor: "pointer",
    },
    radioSelected: {
        flex: 1,
        padding: "10px",
        borderRadius: 10,
        border: "1px solid #3182f6",
        backgroundColor: "#e8f3ff",
        color: "#3182f6",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
    },
    buttonGroup: {
        marginTop: 16,
    },
};
