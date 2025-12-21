import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@toss/tds-mobile";
import { ProfileScreen } from "./pages/Profile";
import { defaultProfile } from "./types";
import type { UserProfile, FortuneResult } from "./types";

import { TodayFortuneScreen } from "./pages/TodayFortune";
import { PremiumReportScreen } from "./pages/PremiumReport";
import { calcTodayFortune } from "./utils/fortune";

function App() {
  // 1. 초기값 설정 시 LocalStorage 확인
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
    return defaultProfile;
  });

  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 2. 프로필 저장 함수 (상태 + 로컬스토리지)
  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  const moveToTodayFortune = () => {
    if (!profile.nickname) {
      navigate("/profile");
      return;
    }
    const result = calcTodayFortune(profile);
    setFortune(result);
    navigate("/today-fortune"); // 라우터 이동
  };

  // 3. 딥링크/새로고침 처리: URL이 결과 페이지인데 운세 데이터가 없으면 자동 계산
  useEffect(() => {
    const path = location.pathname;
    const isResultPage = path === "/today-fortune" || path === "/premium-report";

    if (isResultPage && !fortune) {
      if (profile.nickname) {
        // 프로필이 있으면 운세 계산 후 보여줌
        const result = calcTodayFortune(profile);
        setFortune(result);
      } else {
        // 프로필이 없으면 프로필 입력 화면으로 유도
        // 약간의 딜레이를 주거나 바로 이동
        navigate("/profile", { replace: true });
      }
    }
  }, [location.pathname, fortune, profile, navigate]);

  return (
    <div style={styles.app}>
      <Routes>
        <Route
          path="/"
          element={
            <HomeScreen
              profile={profile}
              onGoProfile={() => navigate("/profile")}
              onGoTodayFortune={moveToTodayFortune}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfileScreen
              initialProfile={profile}
              onChange={handleProfileChange}
              onSaveAndNext={moveToTodayFortune}
              onBack={() => navigate("/")}
            />
          }
        />
        <Route
          path="/today-fortune"
          element={
            fortune ? (
              <TodayFortuneScreen
                profile={profile}
                fortune={fortune}
                onGoPremium={() => navigate("/premium-report")}
                onBackHome={() => navigate("/")}
              />
            ) : (
              // useEffect에서 처리될 동안 잠시 로딩
              <div style={{ padding: 20 }}>Loading...</div>
            )
          }
        />
        <Route
          path="/premium-report"
          element={
            fortune ? (
              <PremiumReportScreen
                profile={profile}
                fortune={fortune}
                onBackToday={() => navigate("/today-fortune")}
              />
            ) : (
              <div style={{ padding: 20 }}>Loading...</div>
            )
          }
        />
      </Routes>
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
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "60px 24px 40px", textAlign: "left" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: "#191f28", lineHeight: 1.3 }}>
          매일 만나는<br />나의 연애 점수
        </h1>
        <p style={{ fontSize: 16, color: "#4e5968", marginBottom: 40, lineHeight: 1.5 }}>
          오늘 하루 당신의 연애 흐름은 어떨까요?<br />
          간단한 프로필로 확인해보세요.
        </p>

        <div style={{
          backgroundColor: "#f9fafb",
          borderRadius: 24,
          padding: "32px 24px",
          marginBottom: 40,
          border: "1px solid #f2f4f6"
        }}>
          <p style={{ fontSize: 15, color: "#4e5968", marginBottom: 20, lineHeight: 1.6 }}>
            {profile.nickname
              ? <strong>{profile.nickname}</strong>
              : "연애 프로필"} 정보가 준비되었어요. {profile.nickname ? "" : "프로필을 입력하면 더 정확한 운세를 볼 수 있어요."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Button size="large" variant="fill" color="primary" onClick={onGoTodayFortune} style={{ width: "100%" }}>
              오늘 운세 보기
            </Button>
            <Button size="large" variant="weak" color="primary" onClick={onGoProfile} style={{ width: "100%" }}>
              {profile.nickname ? "프로필 수정하기" : "프로필 입력하기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  app: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
};

export default App;
