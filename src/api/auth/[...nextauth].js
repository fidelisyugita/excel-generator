import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post('https://fidel.com/login', {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data.success) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              accessToken: response.data.accessToken, // Store the accessToken
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken; // Save accessToken to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Make accessToken available in session
      return session;
    },
  },
});
