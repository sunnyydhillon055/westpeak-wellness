import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { normalizeEmail } from '@/lib/portal-auth';
import { isClientAllowed, isAdmin } from '@/lib/portal-store';
import { verifyPassword } from '@/lib/portal-users';

/* Sign-in for the client portal and the admin area.
 *
 * TWO QUESTIONS, ANSWERED SEPARATELY. Providers answer "are you who you say you
 * are"; the `signIn` callback answers "are you allowed here". A valid Google
 * account proves identity and nothing more — it grants access only if that
 * address is on the client list, known to Cliniko, or an administrator. Without
 * that second check, anyone with a Google account would be able to sign in.
 *
 * NextAuth rather than hand-rolled OAuth: state, PKCE, token exchange and ID
 * token validation are where the subtle bugs live, and this guards client data.
 *
 * Role is resolved once at sign-in and carried in the JWT, so the two gated
 * pages do not each have to re-derive it. They still re-check authorization on
 * every render — see the note in lib/portal-auth.ts about why both layers exist.
 */

async function resolveRole(email: string): Promise<'admin' | 'client' | null> {
  const e = normalizeEmail(email);
  if (!e) return null;
  if (isAdmin(e)) return 'admin';
  if (await isClientAllowed(e)) return 'client';
  return null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  providers: [
    Google({
      // Only present when configured; NextAuth tolerates the empty case and the
      // sign-in page hides the button, so the site works before Google is set up.
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: 'access-code',
      name: 'Email access code',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Access code', type: 'text' },
      },
      /* The code proves control of the address. Whether that address is
         allowed here is still the signIn callback's decision, exactly as with
         the password provider — one provider must never be a way around the
         authorisation check the others go through. */
      async authorize(raw) {
        const email = normalizeEmail(String(raw?.email ?? ''));
        const code = String(raw?.code ?? '');
        if (!email || !code) return null;
        const { verifyCode } = await import('@/lib/portal-otp');
        if (!(await verifyCode(email, code))) return null;
        return { id: email, email };
      },
    }),
    Credentials({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const email = normalizeEmail(String(raw?.email ?? ''));
        const password = String(raw?.password ?? '');
        if (!email || !password) return null;
        if (!(await verifyPassword(email, password))) return null;
        // Authorization is still the signIn callback's job — returning a user
        // here only means the password was right.
        return { id: email, email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const email = normalizeEmail(user?.email ?? '');
      if (!email) return false;

      // Google can assert an address it has not verified; that must not be
      // enough to reach someone else's portal.
      if (account?.provider === 'google') {
        const verified = (account as { email_verified?: boolean }).email_verified;
        if (verified === false) return false;
      }

      return (await resolveRole(email)) !== null;
    },
    async jwt({ token, user }) {
      const email = normalizeEmail((user?.email ?? token.email) as string);
      if (email && !token.role) token.role = await resolveRole(email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
    // Send people where they belong rather than always to the same page.
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
});

export function googleConfigured(): boolean {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}
