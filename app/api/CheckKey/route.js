import { CheckKey } from "@/components/Author/CheckKeyServer"

export async function POST(req) {
  const { id } = await req.json()
  if (!id) {
    return Response.json({ error: "缺少用户ID" }, { status: 400 })
  }
  const isAllowed = await CheckKey({ id })
  return Response.json({ isAllowed })
}