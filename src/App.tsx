import { useState } from "react";
//import { Button } from '@toss/tds-mobile';

type Screen = "home" | "profile" | "todayFortune" | "premiumReport";

type Gender = "male" | "female" | "other";
type RelationshipStatus = "single" | "dating" | "married" | "complicated";

interface Profile {
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  relationshipStatus: RelationshipStatus;
}

interface FortuneResult {
  score: number;
  keywords: string[];
  message: string;
}

const defaultProfile: Profile = {
  nickname: "",
  birthDate: "",
  gender: "other",
  relationshipStatus: "single",
};

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
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
          profile={profile}
          onChange={setProfile}
          onSaveAndGoTodayFortune={moveToTodayFortune}
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
  profile: Profile;
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

/** ----- 화면 2: Profile ----- */
function ProfileScreen(props: {
  profile: Profile;
  onChange: (p: Profile) => void;
  onSaveAndGoTodayFortune: () => void;
  onBack: () => void;
}) {
  const { profile, onChange, onSaveAndGoTodayFortune, onBack } = props;

  const update = (patch: Partial<Profile>) => {
    onChange({ ...profile, ...patch });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>연애 프로필</h1>

      <div style={styles.card}>
        <label style={styles.label}>
          닉네임
          <input
            style={styles.input}
            value={profile.nickname}
            onChange={(e) => update({ nickname: e.target.value })}
            placeholder="예: 초천재"
          />
        </label>

        <label style={styles.label}>
          생년월일
          <input
            style={styles.input}
            type="date"
            value={profile.birthDate}
            onChange={(e) => update({ birthDate: e.target.value })}
          />
        </label>

        <label style={styles.label}>
          성별
          <select
            style={styles.input}
            value={profile.gender}
            onChange={(e) => update({ gender: e.target.value as Gender })}
          >
            <option value="other">선택 안함</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </label>

        <label style={styles.label}>
          연애 상태
          <select
            style={styles.input}
            value={profile.relationshipStatus}
            onChange={(e) =>
              update({
                relationshipStatus: e.target.value as RelationshipStatus,
              })
            }
          >
            <option value="single">솔로</option>
            <option value="dating">연애 중</option>
            <option value="married">기혼</option>
            <option value="complicated">복잡 미묘</option>
          </select>
        </label>

        <button
          style={styles.primaryButton}
          onClick={onSaveAndGoTodayFortune}
        >
          저장하고 운세 보러가기
        </button>
        <button style={styles.secondaryButton} onClick={onBack}>
          홈으로
        </button>
      </div>
    </div>
  );
}

/** ----- 화면 3: TodayFortune ----- */
function TodayFortuneScreen(props: {
  profile: Profile;
  fortune: FortuneResult;
  onGoPremium: () => void;
  onBackHome: () => void;
}) {
  const { profile, fortune, onGoPremium, onBackHome } = props;
  const nameLabel = profile.nickname || "오늘의 짝궁";

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>오늘의 연애 운세</h1>

      <div style={styles.card}>
        <p style={{ marginBottom: 4 }}>{nameLabel}님의 오늘 점수</p>
        <p style={styles.scoreText}>{fortune.score}점</p>

        <div style={styles.tagRow}>
          {fortune.keywords.map((k) => (
            <span key={k} style={styles.tag}>
              {k}
            </span>
          ))}
        </div>

        <p style={styles.message}>{fortune.message}</p>

        <button style={styles.primaryButton} onClick={onGoPremium}>
          연애 심층 리포트 보기
        </button>
        <button style={styles.secondaryButton} onClick={onBackHome}>
          홈으로
        </button>
      </div>
    </div>
  );
}

/** ----- 화면 4: PremiumReport ----- */
function PremiumReportScreen(props: {
  profile: Profile;
  fortune: FortuneResult | null;
  onBackToday: () => void;
}) {
  const { profile, fortune, onBackToday } = props;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>연애 심층 리포트</h1>

      <div style={styles.card}>
        <p style={{ marginBottom: 8 }}>
          {profile.nickname
            ? `${profile.nickname} 님의 연애 성향을 간단히 정리해 봤어요.`
            : "연애 프로필을 자세히 입력할수록 더 정확해져요."}
        </p>

        <ul style={{ paddingLeft: 18, marginBottom: 16 }}>
          <li>나의 연애 성향</li>
          <li>갈등 패턴과 해결 팁</li>
          <li>잘 맞는 연애 스타일</li>
          <li>이번 달 연애 운 흐름</li>
        </ul>

        {fortune && (
          <p style={styles.message}>
            오늘 운세 기준으로 보면, {fortune.keywords.join(", ")} 쪽이 특히
            강조되는 하루예요. 중요한 대화나 만남이 있다면, 감정을 솔직하게
            표현하되 상대의 속도를 존중하는 태도가 도움이 될 거예요.
          </p>
        )}

        <p style={{ fontSize: 12, color: "#666" }}>
          ※ 현재는 데모 버전이에요. 나중에는 유료 리포트와 연동될 예정입니다.
        </p>

        <button style={styles.secondaryButton} onClick={onBackToday}>
          오늘 운세로 돌아가기
        </button>
      </div>
    </div>
  );
}

/** ----- 아주 간단한 가짜 운세 계산 로직 ----- */
function calcTodayFortune(profile: Profile): FortuneResult {
  const base = profile.birthDate
    ? Number(profile.birthDate.replace(/-/g, "").slice(-4))
    : 7777;
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const raw = (base * 37 + daySeed * 17) % 100;
  const score = 60 + (raw % 41); // 60~100 사이 점수

  const keywords: string[] = [];
  if (score > 90) keywords.push("고백운");
  else if (score > 80) keywords.push("소개팅운");
  else if (score > 70) keywords.push("대화운");
  else keywords.push("셀프케어");

  if (profile.relationshipStatus === "single") {
    keywords.push("새로운인연");
  } else if (profile.relationshipStatus === "dating") {
    keywords.push("관계성장");
  } else if (profile.relationshipStatus === "married") {
    keywords.push("가족운");
  }

  const message =
    score > 85
      ? "오늘은 마음이 가는 방향으로 한 걸음 더 다가가 보기에 좋은 날이에요."
      : score > 70
      ? "조급해하기보다는 가볍게 안부를 묻고, 분위기를 살피는 쪽이 좋아요."
      : "나를 돌보고 에너지를 채우는 데 집중하면, 다음 기회가 훨씬 편해질 거예요.";

  return { score, keywords, message };
}

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
  label: {
    display: "block",
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    display: "block",
    width: "100%",
    marginTop: 4,
    marginBottom: 8,
    padding: "8px 10px",
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #ddd",
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
