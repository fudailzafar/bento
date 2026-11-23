import { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/legal-document';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service | Bento',
  description:
    'Read our terms and conditions for using Bento. Learn about user agreements, service usage, and legal guidelines.',
  openGraph: {
    title: 'Terms of Service | Bento',
    description: 'Read our terms and conditions for using Bento.',
    url: `${SITE_URL}/terms-of-service`,
    siteName: 'Bento',
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
  },
};

export default function TermsOfService() {
  return (
    <LegalDocument
      file="terms-of-service"
      title="Terms of Service"
      path="/terms-of-service"
    />
  );
}
