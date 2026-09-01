import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"

export const { handlers, auth, signIn, signOut } = NextAuth({ 
    providers: [ GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
        checks: [],
    }) ],
    session:{
        strategy: "jwt",
    },
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
        // secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }),
    secret: process.env.AUTH_SECRET,
    cookies: {
        pkceCodeVerifier: {
            name: 'authjs.pkce.code_verifier',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false,
            },
        },
        state: {
            name: 'authjs.state',
            options: {
                httpOnly: true,
                sameSite: 'none',
                path: '/',
                secure: true,
            },
        },
    },
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (account && profile) {
                token.github_id = profile.id
            }
            if (user?.id) {
                token.uid = user.id
                token.id = user.id
            }
            if (user?.email) {
                token.email = user.email
            }
            return token
        },
        session: async ({ session, token, user }) => {
            const signingSecret = process.env.SUPABASE_JWT_SECRET
            const userId = user?.id || token?.uid
            const userEmail = user?.email || token?.email
            if (signingSecret && userId) {
                const payload = {
                    aud: "authenticated",
                    exp: Math.floor(new Date(session.expires).getTime() / 1000),
                    sub: userId,
                    email: userEmail,
                    role: "authenticated",
                }
                session.supabaseAccessToken = jwt.sign(payload, signingSecret)
            }
            if (session.user && (userId || token?.uid)) {
                session.user.id = userId || token?.uid
            }
            // 如需兼容老逻辑，可保留 GitHub id
            if (session.user && token?.github_id) {
                session.user.github_id = String(token.github_id) // 可选：保留 GitHub id
            }
            return session
        }
    }
})
