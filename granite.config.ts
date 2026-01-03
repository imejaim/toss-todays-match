import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'todays-match',
  brand: {
    displayName: '오늘의 짝꿍',
    primaryColor: '#A88BFF',
    icon: 'https://raw.githubusercontent.com/imejaim/toss-todays-match/main/public/icon.png',
    bridgeColorMode: 'basic',
  },
  web: {
    host: 'localhost',  // Android에서는 adb reverse 기준으로 localhost 사용
    port: 5173,
    commands: {
      dev: 'vite --host',  // 이렇게 변경 (중요)
      build: 'vite build',
    },
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  },
  permissions: [],
});
