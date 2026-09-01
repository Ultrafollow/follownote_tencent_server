import { signIn, signOut, auth } from "auth"
import { 
    Github,
    Folders,
    CircleUser,
    KeyRound,
    LogOut,
    Mail,
} from 'lucide-react' // 引入图标库
import Tip from '@/components/Header/Tooltip'
import { CheckKey } from '@/components/Author/CheckKeyServer';
import ApplyPermissionModal from './ApplyPermissionModal' // 客户端弹窗组件

export default async function WebAuth() {
  const session = await auth()
  const location = await CheckKey({id: session?.user.id});
  const access = session?.user?.id === process.env.DEFAULT_SESSION_ID
  const text = <span>{session?.user?.id}</span>
  let editorPathName = "";
  if (session?.user?.name) {
    function slugify(text) {
      return encodeURIComponent(text);
    }
    editorPathName = slugify(session.user.name);
  }
  // 未登录状态
  if (!session?.user) {
    return (
      <header className="flex justify-start items-center gap-4 rounded-full dark:bg-gray-800 shadow-sm">
        <form
          action={async () => {
            "use server"
            await signIn("github")
          }}
        >
          <button
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full hover:bg-gray-200 hover:scale-[1.05] transition-transform cursor-pointer"
          >
            <Github size={22} strokeWidth={2}/>
          </button>
        </form>
      </header>
    )
  }
 
  // 已登录状态（含下拉交互）
  return (
    <header className="flex justify-start items-center gap-4 rounded-full dark:bg-gray-800 shadow-sm relative">
      <details className="cursor-pointer">
        {/* 触发区域（头像） */}
        <summary 
          className="list-none" // 隐藏默认下拉箭头
        >
          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full hover:bg-gray-200 hover:scale-[1.05] transition-transform">
            <img 
              src={session.user.image}
              className="w-10 h-10 rounded-full object-cover object-center"
              alt="avatar"
            />
          </div>
        </summary>
 
        {/* 下拉内容 */}
        <div className="
          absolute right-0
          xl:left-0 top-full mt-4 
          min-w-[16rem] bg-white dark:bg-gray-700 
          rounded-lg shadow-lg p-4 space-y-3
          border border-gray-100 dark:border-gray-600
        ">
          {/* 用户名称 */}
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                <CircleUser className="inline-block mr-1" size={16} strokeWidth={2}/>
                {session.user.name}
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              <Tip text={text}>
                <KeyRound className="inline-block mr-1" size={16} strokeWidth={2}/>
                key:{session.user.id}
              </Tip>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                <Mail className="inline-block mr-1" size={16} strokeWidth={2}/>
                {session.user.email}
            </div>
            {location && (
              <div className="mt-1">
                <Folders className="inline-block mr-1" size={16} strokeWidth={2}/>
                <a href={`/admin/editor/${editorPathName}`} className="hover:underline text-sm text-gray-900 dark:text-white">
                    {session.user.name} 的笔记
                </a>
              </div>
            )}
            {access && (
              <div className="mt-1">
                <Folders className="inline-block mr-1" size={16} strokeWidth={2}/>
                <a href={`/manage`} className="hover:underline text-sm text-gray-900 dark:text-white">
                    后台管理
                </a>
              </div>
            )}
            {/* 客户端弹窗按钮 */}
            <ApplyPermissionModal userId={session.user.id} accessToken={session?.supabaseAccessToken} />

          {/* 退出按钮 */}
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" });
            }}
            className="mt-1"
          >
            <button
              className="w-full text-left text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
            >
                <LogOut className="inline-block mr-1" size={16} strokeWidth={2}/>
                退出登录
            </button>
          </form>
        </div>
      </details>
    </header>
  )
}