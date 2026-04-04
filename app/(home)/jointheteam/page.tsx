import { Footer, HomeNavbar } from '@/components/home';
import { JoinTheTeam } from '@/components/team/join-the-team';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfoliofy - Join the Team',
};

export default function JoinTheTeamPage() {
  return (
    <div className="flex w-full flex-col items-center overflow-x-clip bg-white">
      <HomeNavbar alwaysVisible href="/" />
      <JoinTheTeam />
      <Footer />
    </div>
  );
}
