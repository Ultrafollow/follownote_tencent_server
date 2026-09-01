'use client'
import { useSession } from "next-auth/react"
import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"

export default function NotesPage() {
  const { data: session } = useSession()
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
 
  const supabase = useMemo(() => {
    if (!session?.supabaseAccessToken) return null
    return createClient(session.supabaseAccessToken)
  }, [session?.supabaseAccessToken])

  // 查询 notes
  const fetchNotes = async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) {
      console.error("fetchNotes error:", error)
    }
    if (!error) setNotes(data)
    setLoading(false)
  }

  // 新增
  const addNote = async () => {
    if (!content.trim() || !supabase || !session?.user?.id) return
    setLoading(true)
    await supabase.from("notes").insert({
      content,
      user_id: session.user.id
    })
    setContent("")
    await fetchNotes()
    setLoading(false)
  }

  // 删除
  const deleteNote = async (id) => {
    if (!supabase) return
    setLoading(true)
    await supabase.from("notes").delete().eq("id", id)
    await fetchNotes()
    setLoading(false)
  }

  // 修改
  const updateNote = async (id, newContent) => {
    if (!supabase) return
    setLoading(true)
    await supabase.from("notes").update({ content: newContent }).eq("id", id)
    await fetchNotes()
    setLoading(false)
  }

  if (!session) return <div>请先登录</div>

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>我的笔记</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="输入新笔记内容"
          style={{ width: 400, marginRight: 8, padding: 8 }}
        />
        <button onClick={addNote} disabled={loading}>新增</button>
      </div>
      {loading && <div>加载中...</div>}
      <ul>
        {notes.map(note => (
          <li key={note.id} style={{ marginBottom: 8 }}>
            <input
              style={{ width: 300, marginRight: 8 }}
              defaultValue={note.content}
              onBlur={e => updateNote(note.id, e.target.value)}
            />
            <button onClick={() => deleteNote(note.id)} disabled={loading}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}