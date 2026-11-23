import { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/legal-document';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bento',
  description:
    'Learn how Bento collects, uses, and protects your personal data. Read our comprehensive privacy policy and data protection guidelines.',
  openGraph: {
    title: 'Privacy Policy | Bento',
    description: 'Learn how Bento protects your personal data and privacy.',
    url: `${SITE_URL}/privacy-policy`,
    siteName: 'Bento',
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicy() {
  return (
    <LegalDocument
      file="privacy-policy"
      title="Privacy Policy"
      path="/privacy-policy"
    />
  );
}
