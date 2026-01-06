/**
 * 웹 호환 UI 컴포넌트 (@toss/tds-mobile 대체)
 * 웹 브라우저와 토스 앱 모두에서 동일하게 작동합니다.
 */
import React from "react";

// ============================================
// Button 컴포넌트
// ============================================
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "fill" | "weak" | "outline";
    color?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export function Button({
    children,
    onClick,
    variant = "fill",
    color = "primary",
    size = "medium",
    disabled = false,
    style,
}: ButtonProps) {
    const sizeStyles: Record<string, React.CSSProperties> = {
        small: { padding: "10px 16px", fontSize: 14 },
        medium: { padding: "14px 20px", fontSize: 16 },
        large: { padding: "18px 24px", fontSize: 17 },
    };

    const colorMap = {
        primary: "#3182f6",
        secondary: "#6b7684",
        danger: "#f04452",
    };

    const baseStyle: React.CSSProperties = {
        border: "none",
        borderRadius: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.5 : 1,
        ...sizeStyles[size],
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        fill: {
            backgroundColor: colorMap[color],
            color: "#fff",
        },
        weak: {
            backgroundColor: "#f2f4f6",
            color: colorMap[color],
        },
        outline: {
            backgroundColor: "transparent",
            color: colorMap[color],
            border: `1px solid ${colorMap[color]}`,
        },
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={{ ...baseStyle, ...variantStyles[variant], ...style }}
        >
            {children}
        </button>
    );
}

// ============================================
// TextField 컴포넌트
// ============================================
interface TextFieldProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    type?: "text" | "date" | "time" | "email" | "number";
    disabled?: boolean;
    variant?: "box" | "underline";
    style?: React.CSSProperties;
}

export function TextField({
    value,
    onChange,
    placeholder,
    label,
    type = "text",
    disabled = false,
    variant = "box",
    style,
}: TextFieldProps) {
    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        fontSize: 16,
        borderRadius: variant === "box" ? 12 : 0,
        border: variant === "box" ? "1px solid #d1d6db" : "none",
        borderBottom: variant === "underline" ? "1px solid #d1d6db" : undefined,
        backgroundColor: disabled ? "#f2f4f6" : "#fff",
        outline: "none",
        color: "#191f28",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    };

    return (
        <div style={style}>
            {label && (
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4e5968", marginBottom: 8 }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#3182f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d6db")}
            />
        </div>
    );
}

// ============================================
// Checkbox 컴포넌트
// ============================================
interface CheckboxProps {
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
    disabled?: boolean;
}

export function Checkbox({ checked, onChange, children, disabled }: CheckboxProps) {
    return (
        <label style={{ display: "flex", alignItems: "center", cursor: disabled ? "not-allowed" : "pointer" }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                style={{
                    width: 20,
                    height: 20,
                    marginRight: 8,
                    accentColor: "#3182f6",
                }}
            />
            {children}
        </label>
    );
}

// Circle 스타일 체크박스
Checkbox.Circle = function CheckboxCircle({ checked, onChange, children, disabled }: CheckboxProps) {
    return (
        <label style={{ display: "flex", alignItems: "center", cursor: disabled ? "not-allowed" : "pointer" }}>
            <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: `2px solid ${checked ? "#3182f6" : "#d1d6db"}`,
                backgroundColor: checked ? "#3182f6" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
                transition: "all 0.2s",
            }}>
                {checked && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                style={{ display: "none" }}
            />
            {children}
        </label>
    );
};

// ============================================
// ListHeader 컴포넌트
// ============================================
interface ListHeaderProps {
    title: string;
    description?: string;
    style?: React.CSSProperties;
}

export function ListHeader({ title, description, style }: ListHeaderProps) {
    return (
        <div style={{ marginBottom: 8, ...style }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#6b7684", margin: 0 }}>
                {title}
            </h3>
            {description && (
                <p style={{ fontSize: 13, color: "#8b95a1", margin: "4px 0 0" }}>
                    {description}
                </p>
            )}
        </div>
    );
}

// ============================================
// FixedBottomCTA 컴포넌트
// ============================================
interface FixedBottomCTAProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export function FixedBottomCTA({ children, onClick, disabled }: FixedBottomCTAProps) {
    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 24px",
            paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            backgroundColor: "#fff",
            borderTop: "1px solid #f2f4f6",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
        }}>
            <Button
                variant="fill"
                color="primary"
                size="large"
                onClick={onClick}
                disabled={disabled}
                style={{ width: "100%" }}
            >
                {children}
            </Button>
        </div>
    );
}
