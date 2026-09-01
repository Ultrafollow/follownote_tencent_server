'use client'
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      // 打印 session 信息
      console.log("登录成功，session:", session)
      // 打印用户信息
      console.log("用户信息:", session.user)
      // 打印 supabaseAccessToken
      console.log("supabaseAccessToken:", session.supabaseAccessToken)
    }
  }, [session])

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 32, border: "1px solid #eee", borderRadius: 8 }}>
      <h2 style={{ fontSize: 24, marginBottom: 24 }}>登录</h2>
      {!session ? (
        <button
          style={{
            background: "#24292f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "12px 24px",
            fontSize: 16,
            cursor: "pointer",
            width: "100%"
          }}
          onClick={() => signIn("github")}
        >
          使用 GitHub 登录
        </button>
      ) : (
        <button
          style={{
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "12px 24px",
            fontSize: 16,
            cursor: "pointer",
            width: "100%"
          }}
          onClick={() => signOut()}
        >
          退出登录
        </button>
      )}
    </div>
  )
}