import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/lib/types/database.types.ts", // database.types.ts 파일 제외
      "**/types/database.types.ts", // 혹시 다른 경로에 있을 경우
    ],
  },
];

export default eslintConfig;
