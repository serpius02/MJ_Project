import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetConfirmationEmailProps {
  userEmail: string;
  loginUrl: string;
}

const PasswordResetConfirmationEmail = ({
  userEmail,
  loginUrl = "http://localhost:3000/ko/login",
}: PasswordResetConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>비밀번호 재설정이 완료되었습니다!</Preview>
      <Body>
        <Container>
          <Heading>비밀번호 재설정이 완료되었습니다!</Heading>
          <Text>{userEmail} 환영합니다!</Text>
          <Text>
            비밀번호 재설정이 완료되었습니다. 혹시 문제가 있으시다면 지원팀에
            문의해주세요.
          </Text>
          <Section>
            <Link href={loginUrl}>로그인 바로가기</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetConfirmationEmail;
