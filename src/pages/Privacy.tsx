
export function PrivacyScreen() {
    return (
        <div style={{ padding: "20px", lineHeight: "1.6", color: "#333", backgroundColor: "#fff", minHeight: "100vh" }}>
            <header style={{ marginBottom: "20px", borderBottom: "1px solid #efefef", paddingBottom: "10px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>개인정보 처리방침</h1>
            </header>

            <section>
                <p>
                    '오늘의 짝꿍'은(는) 이용자의 개인정보를 중요시하며, '개인정보 보호법'을 준수하고 있습니다.
                </p>

                <h3 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}>1. 수집하는 개인정보 항목</h3>
                <p>서비스 이용 과정에서 아래와 같은 정보들이 수집될 수 있습니다.</p>
                <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
                    <li>필수항목: 닉네임, 생년월일, 성별, 연애 상태 (서비스 내에서만 임시 사용되며 서버에 영구 저장되지 않음)</li>
                </ul>

                <h3 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}>2. 개인정보의 처리 및 보유기간</h3>
                <p>이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.</p>

                <h3 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}>3. 제3자 제공</h3>
                <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.</p>

                <div style={{ marginTop: "30px", fontSize: "12px", color: "#999" }}>
                    시행일자: 2025년 1월 1일
                </div>
            </section>
        </div>
    );
}
