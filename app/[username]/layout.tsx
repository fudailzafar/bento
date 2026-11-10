import { TooltipProvider } from '@/components/ui';

export default function UsernameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
}

