import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (credentials.email !== adminEmail) return null;

                // Support both plain text (dev) and bcrypt hash (prod)
                const isValid =
                    credentials.password === adminPassword ||
                    (adminPassword?.startsWith("$2") &&
                        (await bcrypt.compare(credentials.password, adminPassword)));

                if (!isValid) return null;

                return { id: "1", email: adminEmail, name: "Admin" };
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/admin/login" },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
