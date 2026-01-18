import React, { useState, useMemo } from "react";
import type { UserProfile, FortuneResult } from "../types";
import { useRewardedAd } from "../hooks/useRewardedAd";
import { getDetailedFortune } from "../utils/llm";
import { generateMatchImagePrompt, generateMatchDescription } from "../utils/matchImageGenerator";
import { getTodayEnergy } from "../utils/dailyEnergy";
import { createMatchShareContent } from "../utils/share";

/**
 * 간단한 마크다운을 HTML로 변환 (엔진 없이 기본 문법만 처리)
 */
function markdownToHtml(text: string): string {
    return text
        // ## 헤더 → <strong> 
        .replace(/^##\s+(.+)$/gm, '<strong style="display:block;font-size:18px;margin:16px 0 8px;color:#191f28;">$1</strong>')
        // ### 헤더 → <strong>
        .replace(/^###\s+(.+)$/gm, '<strong style="display:block;font-size:16px;margin:12px 0 6px;color:#333d4b;">$1</strong>')
        // **bold** → <strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // *italic* → <em>
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // 줄바꿈 유지
        .replace(/\n/g, '<br/>');
}

/**
 * PremiumReportScreen: 프리미엄 분석 리포트 화면
 * - 토스 앱: 실제 광고 시청 후 리포트 해금
 * - 로컬/웹: 자동 해금 (개발 편의)
 */
export function PremiumReportScreen({ profile, fortune, onBackToday }: { profile: UserProfile, fortune: FortuneResult | null, onBackToday: () => void }) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportContent, setReportContent] = useState<string | null>(null);

    // 광고 훅 (토스/웹 자동 분기)
    const { loading, showRewardAd } = useRewardedAd();

    // 1. Data Calculation
    const dailyEnergy = useMemo(() => getTodayEnergy(), []);

    const matchPrompt = useMemo(() => {
        if (!profile || !fortune) return null;
        return generateMatchImagePrompt(profile, fortune, dailyEnergy);
    }, [profile, fortune, dailyEnergy]);

    const matchDescription = useMemo(() => {
        if (!matchPrompt || !fortune) return "";
        return generateMatchDescription(matchPrompt, fortune, dailyEnergy);
    }, [matchPrompt, fortune, dailyEnergy]);

    // GitHub에서 이미지 로드 (이미지 추가 시 앱 재출시 불필요)
    const GITHUB_IMAGE_BASE = 'https://raw.githubusercontent.com/imejaim/toss-todays-match/main/public';

    const matchImageUrl = useMemo(() => {
        if (!matchPrompt) return "";
        // 1~3 사이 랜덤 선택 (이미지 바리에이션)
        const variant = Math.floor(Math.random() * 3) + 1;
        const variantStr = variant.toString().padStart(2, '0');
        return `${GITHUB_IMAGE_BASE}/match_images/${matchPrompt.gender}/${matchPrompt.matchElement.toLowerCase()}_${variantStr}.png`;
    }, [matchPrompt]);

    const shareContent = useMemo(() => {
        if (!profile || !fortune || !matchPrompt) return null;
        return createMatchShareContent(profile, fortune, matchPrompt.gender);
    }, [profile, fortune, matchPrompt]);

    // 2. 광고 시청 후 리포트 해금
    const handleUnlock = () => {
        setIsGenerating(true);

        showRewardAd({
            onRewarded: async () => {
                console.log("[PremiumReport] 광고 보상 받음 - 리포트 생성 시작");
                try {
                    const content = await getDetailedFortune(profile, fortune!);
                    setReportContent(content);
                    setIsUnlocked(true);
                } catch (error) {
                    console.error("[PremiumReport] 리포트 생성 실패:", error);
                    setReportContent("보고서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                    setIsUnlocked(true);
                } finally {
                    setIsGenerating(false);
                }
            },
            onDismiss: () => {
                console.log("[PremiumReport] 광고 닫힘");
                setIsGenerating(false);
            }
        });
    };

    const handleShare = () => {
        if (!shareContent) return;
        if (navigator.share) {
            navigator.share({
                title: shareContent.title,
                text: shareContent.text,
                url: window.location.href
            }).catch(() => { });
        } else {
            alert("공유하기를 지원하지 않는 브라우저입니다.");
        }
    };

    // Guards
    if (!profile || !fortune) {
        return <div style={{ padding: 40, textAlign: "center" }}>데이터가 부족합니다.</div>;
    }

    const emojiData: Record<string, string> = { Wood: "🌳", Fire: "🔥", Earth: "🌍", Metal: "✨", Water: "💧" };

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "32px 24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
            {!isUnlocked ? (
                /* ----------------- 1. LOCK SCREEN ----------------- */
                <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>💎</div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#191f28" }}>
                        심층 분석 리포트
                    </h1>
                    <p style={{ fontSize: 16, color: "#4e5968", lineHeight: 1.6, marginBottom: 40 }}>
                        {profile.nickname}님의 타고난 매력과<br />오늘의 운을 정밀 분석합니다.
                    </p>

                    <div style={{ backgroundColor: "#f9fafb", borderRadius: 24, padding: "24px", textAlign: "left", marginBottom: 40, border: "1px solid #f2f4f6" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {["맞춤형 플러팅 전략", "행운의 스타일링 비법", "오늘의 연애 금기사항", "나의 운명적 인연 이미지"].map((t, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#333d4b" }}>
                                    <span style={{ color: "#3182f6", fontWeight: "bold" }}>✓</span> {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleUnlock}
                        disabled={isGenerating || loading}
                        style={{
                            width: "100%", height: 56, borderRadius: 18, border: "none", fontSize: 16, fontWeight: 700, cursor: (isGenerating || loading) ? "not-allowed" : "pointer",
                            backgroundColor: (isGenerating || loading) ? "#e5e8eb" : "#3182f6", color: "#fff"
                        }}
                    >
                        {isGenerating ? "분석 리포트 생성 중..." : (loading ? "광고 로딩 중..." : "광고 보고 무료로 확인")}
                    </button>

                    <button
                        onClick={onBackToday}
                        style={{ width: "100%", height: 56, marginTop: 12, borderRadius: 18, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer", backgroundColor: "transparent", color: "#4e5968" }}
                    >
                        나중에 보기
                    </button>
                </div>
            ) : (
                /* ----------------- 2. UNLOCKED REPORT ----------------- */
                <div style={{ maxWidth: 500, margin: "0 auto" }}>
                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#191f28" }}>✨ 로맨스 분석 솔루션</h2>
                        <div
                            style={{ backgroundColor: "#f2f8ff", borderRadius: 24, padding: "24px", fontSize: 16, lineHeight: 1.8, color: "#333d4b", border: "1px solid #e1eeff" }}
                            dangerouslySetInnerHTML={{ __html: reportContent ? markdownToHtml(reportContent) : "리포트를 불러오는 중입니다..." }}
                        />
                    </div>

                    {/* INLINED MATCH CARD */}
                    {matchPrompt && (
                        <div style={{
                            marginBottom: 32, backgroundColor: "#fff", borderRadius: 28, padding: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", backgroundColor: "#3182f6", padding: "3px 8px", borderRadius: 6 }}>ULTRA RARE</span>
                                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>#MATCH-{new Date().getFullYear()}</span>
                            </div>
                            <div style={{ width: "100%", paddingBottom: "100%", position: "relative", borderRadius: 20, overflow: "hidden", backgroundColor: "#f8fafc", marginBottom: 16 }}>
                                {matchImageUrl ? (
                                    <img src={matchImageUrl} alt="Match" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>❓</div>
                                )}
                            </div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>{matchPrompt.title}</h3>
                                    <span>{emojiData[matchPrompt.matchElement] || "❤️"}</span>
                                </div>
                                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px 0" }}>{matchDescription}</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                                    {(matchPrompt.keyFeatures || []).map((f: string, i: number) => (
                                        <span key={i} style={{ fontSize: 11, color: "#64748b", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: 6 }}>#{f}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleShare}
                        style={{ width: "100%", height: 56, borderRadius: 18, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", backgroundColor: "#e8f3ff", color: "#1b64da", marginBottom: 12 }}
                    >
                        🤝 이 기운 친구에게 공유하기
                    </button>

                    <button
                        onClick={onBackToday}
                        style={{ width: "100%", height: 56, borderRadius: 18, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer", backgroundColor: "#f2f4f6", color: "#4e5968" }}
                    >
                        돌아가기
                    </button>
                </div>
            )}
        </div>
    );
}
