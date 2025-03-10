import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { storeUserProfile } from '@/lib/server/redis-actions';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: any;
    }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          // Store user profile data including Google profile image
          await storeUserProfile(user.email, {
            id: user.email,
            email: user.email,
            name: user.name || profile?.name,
            image: user.image || profile?.picture,
          });
        } catch (error) {
          console.error('Error storing user profile on sign-in:', error);
          // Don't block sign-in if profile storage fails
        }
      }
      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add Google profile data to session
      if (session.user) {
        session.user.id = token.sub; // Google user ID
        session.user.picture = token.picture; // profile pic
      }
      return session;
    },
    async jwt({
      token,
      account,
      profile,
    }: {
      token: any;
      account?: any;
      profile?: any;
    }) {
      if (account && profile) {
        token.picture = profile.picture;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
