import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  otp: string;
  isPasswordReset?: boolean;
}

const VerificationEmail = ({
  otp,
  isPasswordReset = false,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        {isPasswordReset
          ? "비밀번호 재설정 인증 코드"
          : "회원 가입 이메일 인증 코드"}
      </Preview>
      <Body>
        <Container>
          <Heading>
            {isPasswordReset
              ? "비밀번호 재설정 인증 코드"
              : "회원 가입 이메일 인증 코드"}
          </Heading>
          <Text>
            {isPasswordReset
              ? "아래 인증 코드를 입력하여 비밀번호를 재설정해주세요."
              : "아래 인증 코드를 입력하여 회원 가입 이메일 인증을 완료해주세요."}
          </Text>
          <Section>
            <Text>{otp}</Text>
          </Section>
          <Text>
            이 인증 코드는 10분 후에 만료됩니다. 만약 본인이 인증을 요청하지
            않았다면 이 메일을 무시하셔도 됩니다.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
