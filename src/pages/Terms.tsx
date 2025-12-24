
export function TermsScreen() {
    return (
        <div style={{ padding: "20px", lineHeight: "1.6", color: "#333", backgroundColor: "#fff", minHeight: "100vh" }}>
            <header style={{ marginBottom: "20px", borderBottom: "1px solid #efefef", paddingBottom: "10px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>서비스 이용약관</h1>
            </header>

            <section>
                <p>
                    본 약관은 '오늘의 짝꿍'(이하 '회사')이 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>

                <h3 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}>제 1조 (목적)</h3>
                <p>본 서비스는 사용자에게 재미로 보는 연애 운세 및 관련 콘텐츠를 제공합니다.</p>

                <h3 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}>제 2조 (면책 조항)</h3>
                <p>제공되는 운세 정보는 과학적 근거가 없으며, 재미를 위한 목적으로만 제공됩니다. 회사는 본 서비스의 이용으로 인해 발생하는 결과에 대해 책임지지 않습니다.</p>

                <h3 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }}>제 3조 (개인정보의 보호)</h3>
                <p>회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.</p>

                <div style={{ marginTop: "30px", fontSize: "12px", color: "#999" }}>
                    시행일자: 2025년 1월 1일
                </div>
            </section>
        </div>
    );
}
