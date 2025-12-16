import { useState } from "react";
import { Button } from '@toss/tds-mobile';
import { ProfileScreen } from "./pages/Profile";
import { defaultProfile } from "./types";
import type { UserProfile, FortuneResult } from "./types";

type Screen = "home" | "profile" | "todayFortune" | "premiumReport";

import { TodayFortuneScreen } from "./pages/TodayFortune";
import { calcTodayFortune } from "./utils/fortune";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);

  const moveToTodayFortune = () => {
    // 아주 간단한 가짜 운세 로직 (나중에 교체 예정)
    const result = calcTodayFortune(profile);
    setFortune(result);
    setScreen("todayFortune");
  };

  return (
    <div style={styles.app}>
      {screen === "home" && (
        <HomeScreen
          profile={profile}
          onGoProfile={() => setScreen("profile")}
          onGoTodayFortune={moveToTodayFortune}
        />
      )}

      {screen === "profile" && (
        <ProfileScreen
          initialProfile={profile}
          onChange={setProfile}
          onSaveAndNext={moveToTodayFortune}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "todayFortune" && fortune && (
        <TodayFortuneScreen
          profile={profile}
          fortune={fortune}
          onGoPremium={() => setScreen("premiumReport")}
          onBackHome={() => setScreen("home")}
        />
      )}

      {screen === "premiumReport" && (
        <PremiumReportScreen
          profile={profile}
          fortune={fortune}
          onBackToday={() => setScreen("todayFortune")}
        />
      )}
    </div>
  );
}

/** ----- 화면 1: Home ----- */
function HomeScreen(props: {
  profile: UserProfile;
  onGoProfile: () => void;
  onGoTodayFortune: () => void;
}) {
  const { profile, onGoProfile, onGoTodayFortune } = props;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>오늘의 짝궁</h1>
      <p style={styles.subtitle}>오늘 나의 연애 운세를 확인해 보세요.</p>

      <div style={styles.card}>
        <p style={{ marginBottom: 8 }}>
          {profile.nickname
            ? `${profile.nickname} 님의 오늘 연애 운세를 준비했어요.`
            : "연애 프로필을 입력하면 더 정확한 운세를 볼 수 있어요."}
        </p>
        <button style={styles.primaryButton} onClick={onGoTodayFortune}>
          오늘 운세 보기
        </button>
        <button style={styles.secondaryButton} onClick={onGoProfile}>
          연애 프로필 설정
        </button>
      </div>
    </div>
  );
}

import { PremiumReportScreen } from "./pages/PremiumReport";

// ... (existing imports)

// ... (App component)

// ... (HomeScreen component)


/** ----- 매우 간단한 스타일 ----- */
const styles: { [k: string]: React.CSSProperties } = {
  app: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#f5f5fa",
    minHeight: "100vh",
  },
  page: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "16px 16px 40px",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
  primaryButton: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 999,
    border: "none",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    background:
      "linear-gradient(135deg, #A88BFF 0%, #7366FF 50%, #FF77C8 100%)",
  },
  secondaryButton: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 4,
    borderRadius: 999,
    border: "1px solid #ddd",
    fontSize: 14,
    backgroundColor: "#fff",
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 700,
    margin: "4px 0 8px",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    backgroundColor: "#f0e9ff",
    color: "#5b41c8",
  },
  message: {
    fontSize: 14,
    lineHeight: 1.5,
    marginTop: 8,
    marginBottom: 16,
  },
};

export default App;
