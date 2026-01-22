import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  resetUrl: string;
  userName?: string;
}

export default function ResetPasswordEmail({
  resetUrl,
  userName = 'there',
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Portfoliofy password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hey {userName}!</Heading>

          <Text style={text}>
            <strong>
              Forgot your password? Don't worry, it happens to the best of us...
              🙂
            </strong>
          </Text>

          <Text style={text}>
            To reset your password, click the button below. The link will
            self-destruct after 24h.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              ✨✨ Reset my Password
            </Button>
          </Section>

          <Text style={footerItalic}>
            <em>
              If you do not want to change your password or didn't request a
              reset, you can ignore and delete this email.
            </em>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '45px 20px 40px',
  marginBottom: '64px',
};

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#7C88FF',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '14px 20px',
};

const footer = {
  color: '#000000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0',
};

const footerItalic = {
  color: '#000000',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '24px',
  margin: '16px 0 0',
};

const link = {
  color: '#7C88FF',
  textDecoration: 'underline',
};
