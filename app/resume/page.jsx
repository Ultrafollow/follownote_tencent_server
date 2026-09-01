'use client'
import { useHeader } from '@/components/Header/HeaderContext'

const resumeData = {
    basics: {
      name: "徐火龙",
      title: "在校求职",
      email: "zhangsan@example.com",
      phone: "+86 138-1234-5678",
      location: "上海，中国",
      website: "https://www.followxu.top/"
    },
    education: [
      {
        school: "中山大学",
        degree: "资源与环境 硕士",
        date: "2023-2026"
      }
    ],
    skills: [
      { name: "JavaScript", level: 95, type: "frontend" },
      { name: "React", level: 90, type: "frontend" },
      { name: "Node.js", level: 85, type: "backend" }
    ],
    projects: [
      {
        name: "在线协作平台",
        role: "技术负责人",
        date: "2023.01-2024.03",
        points: [
          "带领5人团队完成React+Node.js全栈开发",
          "实现实时协作编辑功能，响应速度<200ms"
        ]
      }
    ],
    interests: ["开源贡献", "技术写作", "AI工程化"]
  }
  
  export default function Resume() {
    const { visible, toggleHeader } = useHeader()
    return (
      <div className="max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        <button
            onClick={toggleHeader}
            className="fixed h-8 w-22 text-xs text-white top-8 right-20 z-50 bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg shadow-blue-500/50 hover:bg-blue-200 hover:text-black hover:scale-110 transition-colors duration-700"
        >
            {visible ? 'hidden Header' : 'display Header'}
        </button>
        {/* 头部信息 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-400 p-8 text-white">
          <div className="flex items-center gap-8">
            <img 
              src='https://imgur.com/61z8oc7.png'
              className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover object-center"
              alt="头像"
            />
            <div>
              <h1 className="text-4xl font-bold">{resumeData.basics.name}</h1>
              <p className="text-xl mt-2 opacity-90">{resumeData.basics.title}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            {Object.entries(resumeData.basics).map(([key, value]) => (
              key !== 'name' && key !== 'title' && key !== 'avatar' && (
                <div key={key} className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                  {value}
                </div>
              )
            ))}
          </div>
        </div>
  
        {/* 主体内容 */}
        <div className="p-8 grid md:grid-cols-3 gap-8">
          {/* 左侧栏 */}
          <div className="md:col-span-1 space-y-6">
            <Section title="教育背景">
              {resumeData.education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                  <p className="text-gray-600">{edu.degree}</p>
                  <p className="text-sm text-gray-500">{edu.date}</p>
                </div>
              ))}
            </Section>
  
            <Section title="技能专长">
              <div className="space-y-3">
                {resumeData.skills.map((skill, i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between mb-1">
                      <span>{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          skill.type === 'frontend' ? 'bg-blue-500' : 
                          skill.type === 'backend' ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
  
          {/* 右侧主内容 */}
          <div className="md:col-span-2 space-y-8">
            <Section title="项目经历">
              {resumeData.projects.map((project, i) => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <span className="text-sm text-gray-500">{project.date}</span>
                  </div>
                  <p className="text-sm text-blue-600 mb-2">{project.role}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {project.points.map((point, j) => (
                      <li key={j} className="text-gray-700">{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>
  
            <Section title="自我评价">
              <p className="text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
                拥有5年全栈开发经验，擅长复杂系统架构设计。主导过多个百万级用户项目，对性能优化有深入研究。热爱技术分享，GitHub开源项目获星1.2k+。
              </p>
            </Section>
  
            <Section title="个人兴趣">
              <div className="flex flex-wrap gap-2">
                {resumeData.interests.map((interest, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    )
  }
  
  // 可复用区块组件
  function Section({ title, children }) {
    return (
      <div className="border-b pb-6 last:border-b-0">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-1 h-6 bg-blue-500 mr-3" />
          {title}
        </h2>
        {children}
      </div>
    )
  }