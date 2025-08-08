import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials?.username === 'admin') return { id: '1', name: 'Admin' };
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
});

export { handler as GET, handler as POST };
