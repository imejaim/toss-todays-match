import { useState, useMemo } from "react";
import type { UserProfile, FortuneResult } from "../types";
import { Button } from "../components/ui";
import { getDetailedFortune } from "../utils/llm";
import { useRewardedAd } from "../hooks/useRewardedAd";
import { MatchCharacterCard } from "../components/MatchCharacterCard";
import { generateMatchImagePrompt, generateMatchDescription } from "../utils/matchImageGenerator";
import { getTodayEnergy } from "../utils/dailyEnergy";

interface Props {
    profile: UserProfile;
    fortune: FortuneResult | null;
    onBackToday: () => void;
}

export function PremiumReportScreen({ profile, fortune, onBackToday }: Props) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportContent, setReportContent] = useState<string | null>(null);

    // 오늘의 짝꿍 이미지 관련
    const dailyEnergy = useMemo(() => getTodayEnergy(), []);
    const matchPrompt = useMemo(() => {
        if (!fortune) return null;
        return generateMatchImagePrompt(profile, fortune, dailyEnergy);
    }, [profile, fortune, dailyEnergy]);

    const matchDescription = useMemo(() => {
        if (!fortune || !matchPrompt) return "";
        return generateMatchDescription(matchPrompt, fortune, dailyEnergy);
    }, [fortune, matchPrompt, dailyEnergy]);

    // Ad Hook
    const { loading: isAdLoading, showRewardAd } = useRewardedAd();

    const fetchReport = async () => {
        setIsGenerating(true);
        try {
            const content = await getDetailedFortune(profile, fortune!);
            setReportContent(content);
            setIsUnlocked(true);
        } catch (error) {
            console.error("Failed to get premium report", error);
            setReportContent("보고서를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
            setIsUnlocked(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUnlock = () => {
        if (!fortune) return;

        if (isAdLoading) {
            alert("광고를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        showRewardAd({
            onRewarded: () => {
                console.log("Reward granted! Fetching report...");
                fetchReport();
            },
            onDismiss: () => {
                console.log("Ad dismissed without reward.");
            }
        });
    };

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh", paddingBottom: 60 }}>
            <div style={{
                position: "sticky",
                top: 0,
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #f2f4f6",
                zIndex: 100
            }}>
                <button onClick={onBackToday} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>&larr;</button>
                <span style={{ flex: 1, textAlign: "center", fontWeight: 700, marginRight: 24 }}>프리미엄 연애 보고서</span>
            </div>

            <div style={{ padding: "32px 24px" }}>
                {!isUnlocked ? (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 64, marginBottom: 24 }}>💎</div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#191f28" }}>
                            {profile.nickname}님만을 위한<br />심층분석이 도착했어요
                        </h1>
                        <p style={{ fontSize: 16, color: "#4e5968", lineHeight: 1.6, marginBottom: 40 }}>
                            타고난 기질과 오늘의 운의 흐름을 분석하여<br />
                            가장 매력적으로 보일 수 있는 비법을 알려드려요.
                        </p>

                        <div style={{ backgroundColor: "#f9fafb", borderRadius: 20, padding: "24px", textAlign: "left", marginBottom: 40 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>포함된 분석 내용</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                                {["맞춤형 플러팅 전략", "행운을 부르는 스타일링", "주의해야 할 행동 패턴", "오늘의 이상형 이미지"].map(item => (
                                    <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: "#333d4b" }}>
                                        <span style={{ color: "#3182f6" }}>✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            variant="fill"
                            color="primary"
                            onClick={handleUnlock}
                            disabled={isGenerating}
                            style={{ width: "100%", height: 56, fontSize: 18, fontWeight: 700, borderRadius: 16 }}
                        >
                            {isGenerating ? "분석 중..." : (isAdLoading ? "광고 로딩 중..." : "광고 보고 무료로 확인")}
                        </Button>
                        <p style={{ marginTop: 16, fontSize: 13, color: "#8b95a1" }}>
                            짧은 영상 시청 후 무료로 확인할 수 있습니다.
                        </p>
                    </div>

                ) : (
                    <div className="report-content">
                        {/* AI 심층 분석 결과 */}
                        <div style={{
                            backgroundColor: "#f2f8ff",
                            borderRadius: 24,
                            padding: "32px 24px",
                            marginBottom: 24,
                            border: "1px solid #e1eeff"
                        }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#191f28" }}>
                                ✨ AI 심층 분석 결과
                            </h2>
                            <div style={{
                                fontSize: 16,
                                lineHeight: 1.8,
                                color: "#333d4b",
                                whiteSpace: "pre-wrap",
                                wordBreak: "keep-all"
                            }}>
                                {reportContent || "보고서를 생성하지 못했습니다."}
                            </div>
                        </div>

                        {/* 오늘의 짝꿍 이미지 카드 */}
                        {matchPrompt && (
                            <MatchCharacterCard
                                matchPrompt={matchPrompt}
                                description={matchDescription}
                                imageUrl="/sample_match_female.png"  // 샘플 이미지 사용
                            />
                        )}

                        <Button
                            variant="weak"
                            color="secondary"
                            onClick={onBackToday}
                            style={{ width: "100%", borderRadius: 16 }}
                        >
                            닫기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

