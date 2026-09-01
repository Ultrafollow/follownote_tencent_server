// export async function CheckKey({id}) {
//   const Ids = process.env.NEXT_PUBLIC_ALLOWED_USERS_ID?.split(',') || [];
//   const isAllowed = Ids.includes(id);

//     return isAllowed;
// }
import { createServiceClient } from "@/utils/supabase/server"

export async function CheckKey({ id }) {
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from("allowed_users")
    .select("user_id")
    .eq("user_id", id)
    .maybeSingle()
  const isAllowed = !!data
  return isAllowed
}