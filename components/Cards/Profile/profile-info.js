import React, { useState } from 'react';
import { useEffect, useRef } from 'react'; // React核心API
import { SITE_METADATA } from '@/data/site-metadata' // 站点配置
import { 
  Github,
  School,
  Mail, 
  MapPin 
} from 'lucide-react' // 引入图标库
import { Fragment } from 'react' // React片段组件
import WechatIcon from '@/icon/wechat.svg' // 自定义图标
import Twemoji from '@/components/ui/Twemoji' // 表情符号组件
import { Image } from '@/components/ui/Image'

// 从URL中提取账号名称（最后一段路径）
function getAccountHandle(url = '') {
    const parts = url.split('/')
    return parts.pop() || url // 防止空值
  }

const SOCIALS = [
{
    platform: 'github',
    handle: getAccountHandle(SITE_METADATA.github), // 提取用户名
    href: SITE_METADATA.github, // 跳转链接
    Icon: () => <Github size={20} strokeWidth={1.5}/>, // 动态图标组件
},
{
    platform: 'wechat',
    handle: 'follow',
    isQR: true,
    Icon: () => <WechatIcon className="h-6 w-6" fill="#666666" viewBox='0 0 1000 1000'/>,
}]

export function ProfileCardInfo() {
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
          if (qrRef.current && !qrRef.current.contains(e.target)) {
            setShowQR(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      
    return (
      <div className="hidden py-4 md:block md:px-5"> {/* 移动端隐藏 */}
        {/* 标题区块 */}
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Follow XU
        </h3>
        <h5 className="py-2 text-gray-500 dark:text-gray-400">Learner | student</h5>
  
        {/* 详细信息区块 */}
        <div className="mb-2 mt-4 space-y-4">
          {/* 工作信息 */}
          <div className="flex items-center text-gray-700 dark:text-gray-200">
            <div className="space-y-2">
                <div className="flex items-center"> {/* 单个学校行 */}
                    <School strokeWidth={1.5} size={20} />
                    <span className="ml-2">Undergraduate College @ </span>
                    <a 
                        href="https://www.cumt.edu.cn/" 
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-4 hover:underline ml-1"
                    >
                        CUMT
                    </a>
                </div>
                
                <div className="flex items-center"> {/* 第二个学校行 */}
                    <div className="w-[20px] h-5"></div> 
                    <span className="ml-2">Master Degree Candidate @ </span>
                    <a 
                        href="https://www.sysu.edu.cn/" 
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-4 hover:underline ml-1"
                    >
                        SYSU
                    </a>
                </div>
            </div>
          </div>
  
          {/* 地理位置 */}
          <div className="flex items-center text-gray-700 dark:text-gray-200">
            <MapPin strokeWidth={1.5} size={20} /> {/* 地图标记图标 */}
            <p className="px-2">
              Zhuhai City, Guangdong Province,
              <span className="absolute ml-1 inline-flex pt-px">
                <Twemoji emoji="flag-china" />
              </span>
            </p>
          </div>
  
          {/* 邮箱地址 */}
          <div className="flex items-center text-gray-700 dark:text-gray-200">
            <Mail strokeWidth={1.5} size={20} /> {/* 邮件图标 */}
            <a className="px-2" href={`mailto:${SITE_METADATA.email}`}>
              {SITE_METADATA.email}
            </a>
          </div>
  
          {/* 社交媒体链接 */}
          <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-200 relative">
            {SOCIALS.map((social, index) => {
                  const { Icon } = social
                return (
                    <Fragment key={social.platform}>
                        <div className="relative">
                            {social.isQR ? (
                                <button 
                                onClick={() => setShowQR(!showQR)}
                                className="flex items-center cursor-pointer underline-offset-4 hover:underline"
                                >
                                    <Icon />
                                    <span className="ml-px text-gray-500">/</span>
                                    <span className="ml-0.5">{social.handle}</span>
                                </button>
                            ) : (
                                <a
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center underline-offset-4 hover:underline"
                                >
                                    <Icon />
                                    <span className="ml-px text-gray-500">/</span>
                                    <span className="ml-0.5">{social.handle}</span>
                                </a>
                            )}
                
                            {/* 二维码下拉展示 */}
                            {social.isQR && showQR && (
                                <div 
                                ref={qrRef}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-8 z-[999]] shadow-demure rounded-xl"
                                >
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                                        <Image 
                                        src={SITE_METADATA.wechatQR}
                                        alt={SITE_METADATA.wechat}
                                        width={160} 
                                        height={160}
                                        style={{ objectFit: 'contain'}}
                                        className="w-40 h-40"
                                        />
                                        <div className="text-center text-sm mt-2 text-gray-600 dark:text-gray-300">
                                          Scan the QR code using wechat <Twemoji emoji="beaming-face-with-smiling-eyes" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
            
                        {index !== SOCIALS.length - 1 && (
                        <span className="text-gray-400 dark:text-gray-500">|</span>
                        )}
                    </Fragment>
                )
            })}
        </div>
      </div>
    </div>
)}