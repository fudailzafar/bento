import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  storeUserProfile,
  verifyUserCredentials,
  getUserProfile,
} from '@/lib/server';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const userId = await verifyUserCredentials(
          credentials.email,
          credentials.password
        );

        if (!userId) {
          return null;
        }

        // Get user profile
        const userProfile = await getUserProfile(userId);

        return {
          id: userId,
          email: credentials.email,
          name: userProfile?.name || null,
          image: userProfile?.image || null,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },

  secret: process.env.AUTH_SECRET,
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
      // Add user data to session
      if (session.user) {
        session.user.id = token.sub; // user ID
        session.user.email = token.email;
        session.user.picture = token.picture; // profile pic
      }
      return session;
    },
    async jwt({
      token,
      account,
      profile,
      user,
    }: {
      token: any;
      account?: any;
      profile?: any;
      user?: any;
    }) {
      if (account && profile) {
        token.picture = profile.picture;
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
