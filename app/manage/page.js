'use client'
import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function ManagePermissionRequestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState([])
  const [msg, setMsg] = useState("")

  // 权限校验：不是指定ID就跳转首页
  useEffect(() => {
    if (status === "loading") return
    if (!session?.user?.id || session.user.id !== process.env.NEXT_PUBLIC_DEFAULT_SESSION_ID) {
      router.replace("/")
    }
  }, [session, status, router])

  const supabase = useMemo(() => {
    if (!session?.supabaseAccessToken) return null
    return createClient(session.supabaseAccessToken)
  }, [session?.supabaseAccessToken])

  // 拉取申请列表
  const fetchRequests = async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from("permission_requests")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error) setRequests(data || [])
  }

  useEffect(() => {
    fetchRequests()
    // eslint-disable-next-line
  }, [supabase])

  // 通过
  const handleApprove = async (req) => {
    if (!supabase) return
    // 检查是否已存在
    const { data: exist } = await supabase
      .from("allowed_users")
      .select("user_id")
      .eq("user_id", req.user_id)
      .maybeSingle()
    if (!exist) {
      await supabase.from("allowed_users").insert({ user_id: req.user_id })
    }
    await supabase.from("permission_requests").update({ handled: true }).eq("id", req.id)
    setMsg("已通过")
    fetchRequests()
    setTimeout(() => setMsg(""), 2000)
  }

  // 拒绝
  const handleReject = async (req) => {
    if (!supabase) return
    await supabase.from("permission_requests").update({ handled: true }).eq("id", req.id)
    setMsg("已拒绝")
    fetchRequests()
    setTimeout(() => setMsg(""), 2000)
  }

  // 添加删除按钮功能
  const handleDeleteRequest = async (req) => {
    if (!supabase) return;
    const confirmDelete = confirm('确定要删除这条申请吗？删除后无法恢复！');
    if (!confirmDelete) return;
    await supabase.from('permission_requests').delete().eq('id', req.id);
    setMsg('已删除');
    fetchRequests();
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2 className="text-xl font-bold mb-4">权限申请处理</h2>
      {msg && <div style={{ marginBottom: 16, color: "#2563eb" }}>{msg}</div>}
      <div className="space-y-4">
        {requests.length === 0 && <div className="text-gray-500">暂无申请</div>}
        {requests.map(req => (
          <div
            key={req.id}
            className={`
              p-4 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-2
              ${req.handled
                ? "bg-gray-100 dark:bg-gray-800 opacity-60"
                : "bg-white dark:bg-gray-700"}
              transition-all
            `}
            style={req.handled ? { filter: "blur(0.5px)" } : {}}
          >
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                申请人ID: <span className="font-mono">{req.user_id}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-200 mt-1">
                理由: {req.reason || <span className="text-gray-400">无</span>}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                时间: {new Date(req.created_at).toLocaleString()}
              </div>
              <div className="text-xs mt-1">
                状态: {req.handled ? <span className="text-green-600">已处理</span> : <span className="text-yellow-600">待处理</span>}
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {!req.handled && (
                <>
                  <button
                    className="min-w-[64px] px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-center"
                    style={{ display: "inline-block" }}
                    onClick={() => handleApprove(req)}
                  >
                    通过
                  </button>
                  <button
                    className="min-w-[64px] px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 transition-colors text-center"
                    style={{ display: "inline-block" }}
                    onClick={() => handleReject(req)}
                  >
                    拒绝
                  </button>
                </>
              )}
              <button
                className="min-w-[64px] px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors text-center"
                style={{ display: "inline-block" }}
                onClick={() => handleDeleteRequest(req)}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}