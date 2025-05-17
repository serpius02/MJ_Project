// 간소화된 AuthLayout - 인증 로직 없이 UI만 렌더링
const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AuthLayout;
