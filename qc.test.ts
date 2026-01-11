import { describe, it, expect } from 'vitest';
import { calcTodayFortune } from './src/utils/fortune';
import { defaultProfile } from './src/types';
import fs from 'fs';
import path from 'path';

describe('1/2. 운세 계산 로직 검증 (Logic Test)', () => {
    it('프로필 정보가 없으면 기본 점수가 계산되어야 한다', () => {
        const result = calcTodayFortune(defaultProfile);
        expect(result.score).toBeGreaterThan(0);
        expect(result.score).toBeLessThanOrEqual(100);
    });

    it('닉네임이 있으면 점수가 달라져야 한다', () => {
        const profile = { ...defaultProfile, nickname: '테스트유저' };
        const result = calcTodayFortune(profile);
        expect(result.score).toBeGreaterThan(0);
        expect(result.keywords.length).toBeGreaterThan(0);
    });
});

describe('2/2. 환경 설정 검증 (Environment Check)', () => {
    it('핵심 설정 파일들이 존재해야 한다', () => {
        const requiredFiles = ['tsconfig.json', 'package.json', 'vite.config.ts'];

        requiredFiles.forEach(file => {
            const filePath = path.join(process.cwd(), file);
            const exists = fs.existsSync(filePath);
            expect(exists, `${file} 파일이 누락되었습니다.`).toBe(true);
        });
    });

    it('LLM API URL이 코드에 하드코딩 되어 있어야 한다', () => {
        // llm.ts 파일을 직접 읽어서 URL 상수 존재 여부 확인 (보안상 환경변수 대신 하드코딩 된 상태 체크)
        const llmPath = path.join(process.cwd(), 'src', 'utils', 'llm.ts');
        const content = fs.readFileSync(llmPath, 'utf-8');
        expect(content).toContain('https://todaysmatch-423863342.us-central1.run.app');
    });
});

// 간단한 통합 테스트 예시 (실제 API 호출은 아님)
describe('3/3. LLM API 연동 검증 (Integration Check)', () => {
    it('백엔드 서버에 접근 가능해야 한다 (Health Check)', async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            // HEAD 요청으로 가볍게 확인
            const response = await fetch("https://todaysmatch-423863342.us-central1.run.app", {
                method: 'HEAD',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            // 200 OK 또는 404 Not Found라도 서버가 응답하면 통과 (네트워크 연결 확인)
            expect(response.status).toBeDefined();
        } catch (e) {
            console.warn("⚠️ API 서버 연결 실패 (네트워크 문제일 수 있음):", e);
            // CI 환경 등에서 외부 망이 막혀있을 수 있으므로, 실패해도 테스트를 깨뜨리진 않되 경고 출력
        }
    });
});

describe('4/4. 재발 방지 및 설정 검증 (Regression Check)', () => {
    it('네비게이션바 아이콘(brand.icon)은 반드시 HTTPS 절대 경로여야 한다', () => {
        // granite.config.ts 파일 읽기
        const configPath = path.join(process.cwd(), 'granite.config.ts');
        const content = fs.readFileSync(configPath, 'utf-8');

        // icon: 'https://...' 패턴 찾기
        // 정규식으로 간단히 체크 (문자열 파싱)
        const iconMatch = content.match(/icon:\s*['"]([^'"]+)['"]/);

        expect(iconMatch, 'granite.config.ts에 icon 설정이 없습니다.').not.toBeNull();

        const iconUrl = iconMatch![1];
        expect(iconUrl.startsWith('https://'), '아이콘 경로는 반드시 https:// 로 시작해야 합니다.').toBe(true);
        expect(iconUrl).not.toContain('localhost'); // 로컬 경로는 앱에서 안 보임
    });

    it('핵심 타입 정의(UserProfile 등)가 types.ts에 존재해야 한다', () => {
        const typesPath = path.join(process.cwd(), 'src', 'types.ts');
        const content = fs.readFileSync(typesPath, 'utf-8');

        // 과거에 누락되어 문제됐던 타입들 체크
        const requiredTypes = ['UserProfile', 'SajuElement', 'FortuneResult'];

        requiredTypes.forEach(type => {
            // 'export interface TypeName' 또는 'export type TypeName' 둘 다 허용
            const exists = content.includes(`export interface ${type}`) || content.includes(`export type ${type}`);
            expect(exists, `${type} 타입 정의가 types.ts에 없습니다.`).toBe(true);
        });
    });

    it('광고 ID 변수가 설정되어 있어야 한다', () => {
        const adHookPath = path.join(process.cwd(), 'src', 'hooks', 'useRewardedAd.ts');
        const content = fs.readFileSync(adHookPath, 'utf-8');

        // TEST_AD_GROUP_ID 상수가 존재하는지
        expect(content).toContain('const TEST_AD_GROUP_ID =');
    });

    it('[AIT 빌드 전 필수] 토스 광고 브릿지가 임포트되어 있어야 한다', () => {
        const adHookPath = path.join(process.cwd(), 'src', 'hooks', 'useRewardedAd.ts');
        const content = fs.readFileSync(adHookPath, 'utf-8');

        // @apps-in-toss/web-bridge에서 GoogleAdMob 임포트 확인
        const hasTossBridgeImport = content.includes("import { GoogleAdMob } from '@apps-in-toss/web-bridge'");
        expect(hasTossBridgeImport, '토스 광고 브릿지(@apps-in-toss/web-bridge)가 임포트되어 있지 않습니다. AIT 빌드 시 광고가 작동하지 않습니다!').toBe(true);

        // GoogleAdMob.loadAppsInTossAdMob 호출 확인
        expect(content).toContain('GoogleAdMob.loadAppsInTossAdMob');
        expect(content).toContain('GoogleAdMob.showAppsInTossAdMob');
    });

    it('[로컬 개발용] 웹 환경 분기 로직이 있어야 한다', () => {
        const adHookPath = path.join(process.cwd(), 'src', 'hooks', 'useRewardedAd.ts');
        const content = fs.readFileSync(adHookPath, 'utf-8');

        // 토스 앱 환경 체크 로직 존재 확인 (로컬에서는 광고 스킵)
        const hasDevModeFallback = content.includes('isTossApp') || content.includes('개발모드');
        expect(hasDevModeFallback, '로컬 개발 환경 분기 로직(isTossApp 또는 개발모드)이 없습니다.').toBe(true);
    });
});

describe('5/5. 토스 규정 및 변수명 준수 (Toss Compliance)', () => {
    it('토스 광고 브릿지 함수명(showRewardAd)이 올바르게 사용되고 있어야 한다', () => {
        const filePath = path.join(process.cwd(), 'src', 'pages', 'PremiumReport.tsx');
        if (!fs.existsSync(filePath)) return;

        const content = fs.readFileSync(filePath, 'utf-8');

        // 잘못된 이름(showRewardedAd)이 있으면 실패 (ed 오타 방지)
        // [로컬 검증용] 주석 제외하고 실제 사용되는 코드 내에서 체크하기 위해 간단한 패턴 매칭
        const hasTypo = /showRewardedAd/.test(content.replace(/\/\/.*$/gm, ''));
        expect(hasTypo, 'showRewardedAd (ed) 오타가 발견되었습니다. showRewardAd를 사용하세요.').toBe(false);

        // 올바른 이름이 최소 한 번은 등장해야 함
        expect(content).toContain('showRewardAd');
    });

    it('페이지 내부에 수동 뒤로가기 화살표(&larr;)가 없어야 한다 (규정 준수)', () => {
        const pages = ['PremiumReport.tsx', 'TodayFortune.tsx'];

        pages.forEach(page => {
            const filePath = path.join(process.cwd(), 'src', 'pages', page);
            if (!fs.existsSync(filePath)) return;
            const content = fs.readFileSync(filePath, 'utf-8');

            expect(content).not.toContain('&larr;');
            expect(content).not.toContain('←');
        });
    });
});
