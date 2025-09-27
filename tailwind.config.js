/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ✅ "app" 폴더 내의 모든 하위 폴더를 스캔하도록 이 경로를 사용하세요.
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        "inter-tight": [
          "var(--font-inter-tight)",
          "Inter Tight",
          "Inter",
          "sans-serif",
        ],
        pretendard: ["var(--font-pretendard)", "Pretendard", "sans-serif"],
        nanum: ["var(--font-nanum-square-round)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
