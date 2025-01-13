import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  logLevel: 'info',
  server: {
    hmr: {
      overlay: false, // HMR 에러 오버레이 비활성화
      hmr: false, // HMR 비활성화
    },
  },
})

// logLevel 옵션:

// info: 기본값, 모든 로그를 출력
// warn: 경고 및 에러만 출력
// error: 에러만 출력
// silent: 로그를 출력하지 않음 