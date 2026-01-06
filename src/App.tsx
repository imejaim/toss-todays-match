import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import { ProfileScreen } from "./pages/Profile";
import { defaultProfile } from "./types";
import type { UserProfile, FortuneResult } from "./types";

import { TodayFortuneScreen } from "./pages/TodayFortune";
import { PremiumReportScreen } from "./pages/PremiumReport";

import { TermsScreen } from "./pages/Terms";
import { PrivacyScreen } from "./pages/Privacy";
import { calcTodayFortune } from "./utils/fortune";
import Home from "./pages/Home";

function App() {
  // 1. My Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved), id: "me" };
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
    return { ...defaultProfile, id: "me" };
  });

  // 2. Friends List State
  const [friends, setFriends] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem("friendsList");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load friends list", e);
    }
    return [];
  });

  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 3. Storage Synced Setters
  const handleProfileChange = (updatedProfile: UserProfile) => {
    const finalProfile = { ...updatedProfile, id: "me" };
    setProfile(finalProfile);
    localStorage.setItem("userProfile", JSON.stringify(finalProfile));
    navigate("/");
  };

  const handleAddFriend = (newFriend: UserProfile) => {
    const friendWithId = { ...newFriend, id: Date.now().toString() };
    const newList = [...friends, friendWithId];
    setFriends(newList);
    localStorage.setItem("friendsList", JSON.stringify(newList));
    navigate("/");
  };

  const handleUpdateFriend = (updatedFriend: UserProfile) => {
    const newList = friends.map(f => f.id === updatedFriend.id ? updatedFriend : f);
    setFriends(newList);
    localStorage.setItem("friendsList", JSON.stringify(newList));
    navigate("/");
  };

  const handleDeleteFriend = (id: string) => {
    const newList = friends.filter(f => f.id !== id);
    setFriends(newList);
    localStorage.setItem("friendsList", JSON.stringify(newList));
  };

  const moveToTodayFortune = () => {
    if (!profile.nickname) {
      navigate("/profile");
      return;
    }
    const result = calcTodayFortune(profile);
    setFortune(result);
    navigate("/today-fortune");
  };

  // 4. Persistence Effect
  useEffect(() => {
    const path = location.pathname;
    const isResultPage = path === "/today-fortune" || path === "/premium-report";

    if (isResultPage && !fortune) {
      if (profile.nickname) {
        const result = calcTodayFortune(profile);
        setFortune(result);
      } else {
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
            <Home
              profile={profile}
              friends={friends}
              onGoProfile={() => navigate("/profile")}
              onGoTodayFortune={moveToTodayFortune}
              onAddFriend={() => navigate("/friends/add")}
              onEditFriend={(id) => navigate(`/friends/edit/${id}`)}
              onDeleteFriend={handleDeleteFriend}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfileScreen
              initialProfile={profile}
              onSave={handleProfileChange}
              title="내 프로필 수정"
              ctaLabel="저장하기"
            />
          }
        />
        <Route
          path="/friends/add"
          element={
            <ProfileScreen
              initialProfile={{ ...defaultProfile, id: "temp" }}
              onSave={handleAddFriend}
              title="새 꿍친 추가"
              ctaLabel="추가하기"
            />
          }
        />
        <Route
          path="/friends/edit/:id"
          element={
            <FriendEditWrapper
              friends={friends}
              onUpdate={handleUpdateFriend}
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
        <Route path="/terms" element={<TermsScreen />} />
        <Route path="/privacy" element={<PrivacyScreen />} />
      </Routes>
    </div>
  );
}

function FriendEditWrapper({ friends, onUpdate }: { friends: UserProfile[], onUpdate: (p: UserProfile) => void }) {
  const { id } = useParams();
  const friend = friends.find(f => f.id === id);

  if (!friend) return <div style={{ padding: 20 }}>친구를 찾을 수 없습니다.</div>;

  return (
    <ProfileScreen
      initialProfile={friend}
      onSave={onUpdate}
      title="꿍친 프로필 수정"
      ctaLabel="수정완료"
    />
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
