/**
 * 공유 버튼 컴포넌트
 * 운세 결과나 짝꿍 이미지를 공유할 수 있는 버튼들을 제공합니다.
 */
import React, { useState } from "react";
import { quickShare, copyToClipboard, type ShareContent } from "../utils/share";

interface Props {
    content: ShareContent;
    variant?: "full" | "compact";  // full: 큰 버튼, compact: 작은 아이콘 버튼
}

export function ShareButtons({ content, variant = "full" }: Props) {
    const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "copied" | "failed">("idle");

    const handleShare = async () => {
        setShareStatus("sharing");
        const result = await quickShare(content);

        if (result === "copied") {
            setShareStatus("copied");
            setTimeout(() => setShareStatus("idle"), 2000);
        } else if (result === "shared") {
            setShareStatus("idle");
        } else {
            setShareStatus("failed");
            setTimeout(() => setShareStatus("idle"), 2000);
        }
    };

    const handleCopyLink = async () => {
        const shareText = `${content.text}\n\n${content.url || ""}`;
        const copied = await copyToClipboard(shareText);

        if (copied) {
            setShareStatus("copied");
            setTimeout(() => setShareStatus("idle"), 2000);
        } else {
            setShareStatus("failed");
            setTimeout(() => setShareStatus("idle"), 2000);
        }
    };

    if (variant === "compact") {
        return (
            <div style={styles.compactContainer}>
                <button
                    onClick={handleShare}
                    style={styles.compactButton}
                    disabled={shareStatus === "sharing"}
                    title="공유하기"
                >
                    {shareStatus === "copied" ? "✓" : shareStatus === "sharing" ? "..." : "📤"}
                </button>
                <button
                    onClick={handleCopyLink}
                    style={styles.compactButton}
                    title="링크 복사"
                >
                    {shareStatus === "copied" ? "✓" : "🔗"}
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <button
                onClick={handleShare}
                style={styles.shareButton}
                disabled={shareStatus === "sharing"}
            >
                {shareStatus === "copied" ? (
                    <span>✅ 복사 완료!</span>
                ) : shareStatus === "sharing" ? (
                    <span>공유 중...</span>
                ) : (
                    <>
                        <span style={styles.buttonIcon}>📤</span>
                        <span>친구에게 공유하기</span>
                    </>
                )}
            </button>

            <button
                onClick={handleCopyLink}
                style={styles.copyButton}
            >
                <span style={styles.buttonIcon}>🔗</span>
                <span>링크 복사</span>
            </button>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        gap: 12,
        marginTop: 16
    },
    shareButton: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "14px 20px",
        backgroundColor: "#3182f6",
        color: "#fff",
        border: "none",
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s"
    },
    copyButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "14px 20px",
        backgroundColor: "#f2f4f6",
        color: "#333d4b",
        border: "none",
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s"
    },
    buttonIcon: {
        fontSize: 18
    },
    compactContainer: {
        display: "flex",
        gap: 8
    },
    compactButton: {
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f4f6",
        border: "none",
        borderRadius: 10,
        fontSize: 18,
        cursor: "pointer",
        transition: "all 0.2s"
    }
};
