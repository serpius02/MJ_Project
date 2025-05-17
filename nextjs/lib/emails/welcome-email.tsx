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

interface WelcomeEmailProps {
  userEmail: string;
  homeUrl?: string;
}

// TODO: 환영 이메일 템플릿 수정
const WelcomeEmail = ({
  userEmail,
  homeUrl = "http://localhost:3000/ko",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>회원가입이 완료되었습니다!</Preview>
      <Body>
        <Container>
          <Heading>회원가입이 완료되었습니다!</Heading>
          <Text>{userEmail} 환영합니다!</Text>
          <Text>
            회원가입이 완료되었습니다. 혹시 문제가 있으시다면 지원팀에
            문의해주세요.
          </Text>
          <Section>
            <Link href={homeUrl}>홈 바로가기</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
