'use client'
import { useState,useMemo } from "react"
import { createClient } from "@/utils/supabase/client"

export default function ApplyPermissionModal({ userId, accessToken }) {
  const [showModal, setShowModal] = useState(false)
  const [applyReason, setApplyReason] = useState("")
  const [applyMsg, setApplyMsg] = useState("")

  const supabase = useMemo(() => {
    if (!accessToken) return null
    return createClient(accessToken)
  }, [accessToken])

  const handleApply = async (e) => {
    e.preventDefault()
    setApplyMsg("")
    if (!userId || !applyReason.trim()) {
      setApplyMsg("请填写申请理由")
      return
    }
    const { error } = await supabase
      .from("permission_requests")
      .insert({ user_id: userId, reason: applyReason })
    if (error) {
      setApplyMsg("提交失败：" + error.message)
    } else {
      setApplyMsg("申请已提交，请等待审核")
      setApplyReason("")
      setTimeout(() => {
        setShowModal(false)
        setApplyMsg("")
      }, 2000)
    }
  }

  return (
    <>
      <button
        className="w-full text-left text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
        onClick={() => setShowModal(true)}
        type="button"
      >
        申请权限
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center">
          <div className="
            min-w-[16rem] bg-white dark:bg-gray-700 
            rounded-lg shadow-lg p-6 space-y-3
            border border-gray-100 dark:border-gray-600
            w-[90vw] max-w-md
          ">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">申请权限</h3>
            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block mb-1 text-gray-800 dark:text-gray-200">
                    申请人ID_Key: <span className="font-semibold">{userId}</span>
                </label>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">申请理由</label>
                <textarea
                  id="applyReason"
                  name="applyReason"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  rows={3}
                  value={applyReason}
                  onChange={e => setApplyReason(e.target.value)}
                  placeholder="请填写你申请权限的理由"
                />
              </div>
              {applyMsg && <div className="mb-2 text-sm text-blue-600">{applyMsg}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}