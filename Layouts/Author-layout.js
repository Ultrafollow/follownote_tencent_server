import { Container } from '@/components/ui/Container';
import { ProfileCard } from '@/components/Cards/Profile'
import '@/app/globals.css'
import 'github-markdown-css'
import Twemoji from '@/components/ui/Twemoji'
import { CareerTimeline } from '@/components/Author/Background'

export function AuthorLayout() {
  return (
    <Container className="pt-4 lg:pt-12">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 md:text-lg md:leading-7">
            Further insights into who I am and the purpose of this blog.
          </p>
        </div>
        <div className="py-8 grid md:grid-cols-[350px_1fr] gap-8 max-w-screen-xl mx-auto">
            <div className="w-[350px] md:w-full md:max-w-[350px]">
                <ProfileCard />
            </div>
            <div className="min-w-0">
                <div className="prose prose-lg dark:prose-invert">
                    <div>
                        <h2 className="mt-0">
                            Hi guys <Twemoji emoji="waving-hand" /> I'm FollowXu{' '}
                        </h2>
                        <p>
                            I'm <strong>FollowXu</strong>, I am a current postgraduate student in China, 
                            and my research discipline is <strong>Earth science</strong>. 
                            The main approach is to use <strong>geophysical</strong> observation methods to explore underground structures 
                            and tectonic activities, supplemented by{' '} 
                            <strong>numerical simulation</strong>({' '}
                                <a href="https://pylith.readthedocs.io/en/latest/index.html" target="_blank">
                                Pylith
                                </a>{' '}
                            ) to verify theoretical models.
                        </p>
                        <h2 className="mt-12">
                            Why create this blog ?
                        </h2>
                        <p>
                            The original intention of creating this blog was to 
                            record some notes of my scientific research and study. 
                        </p>
                        <p>
                            I have used paper 
                            notes, ipad and OneNote before, but none of them met my usage requirements. Finally, it was 
                            decided to create a personal blog.
                        </p>
                        <p>
                            Of course, I am also extremely curious about computer 
                            technology and am willing to teach myself some computer technology.
                        </p>
                        <p>   
                            Besides, personally, I 
                            have received help from many bloggers' articles during the process of scientific research and learning. Therefore, I think blogs can exchange knowledge better than other methods.
                        </p>
                        <p>
                            I would greatly appreciate any comments and thoughts on my posts{' '}
                            <Twemoji emoji="clinking-beer-mugs" />.
                        </p>
                    </div>
                    <div>
                        <div className="mb-[1em] mt-[2em] flex items-center justify-between [&>h2]:my-0">
                            <h2>My Educational background</h2>
                            {/* <Button as="a" href="/static/resume.pdf" target="_blank">
                            <span>Resume</span>
                            <Twemoji emoji="page-facing-up" />
                            </Button> */}
                        </div>
                        <CareerTimeline />
                    </div>
                    <div>
                        <h2>Tech stack</h2>
                        <p>
                            This blog is hosted on{' '}
                            <a href="https://vercel.com/" target="_blank">
                            Vercel
                            </a>
                            , built with{' '}
                            <a href="https://nextjs.org/" target="_blank">
                            Next.js
                            </a>{' '}
                            and{' '}
                            <a href="https://tailwindcss.com/" target="_blank">
                            Tailwind CSS
                            </a>{' '}
                            using <strong>Tailwind Nextjs Starter Blog</strong>.


                        </p>
                        <p>
                            The creation of this blog is mostly based on the framework of leohuynh.dev and Karhdo.dev.
                            Thank you very much to the open-source blog projects of{' '} 
                            <a target="_blank" href="https://twitter.com/hta218_">
                                Leo Huynh
                            </a>{' '}
                            ,{' '}
                            <a target="_blank" href="https://x.com/karhdo">
                                Do Trong Khanh
                            </a>{' '}
                            and{' '}
                            <a target="_blank" href="https://github.com/sunwu51">
                                sunwu.
                            </a>{' '}
                        </p>
                        <p>The main technical selection for me to build this blog:</p>
                        <ul>
                            <li>
                                <Twemoji emoji="atom-symbol" /> Using <strong>React v19</strong>,{' '}
                                <strong>Next v15</strong>
                                (Using App router and webpack),{' '}
                                and <strong>JavaScript</strong>.
                            </li>
                            <li>
                                <Twemoji emoji="eyes" /> Theming in dark mode with{' '}
                                <a
                                    href="https://github.blog/changelog/2021-04-14-dark-and-dimmed-themes-are-now-generally-available/"
                                    target="_blank"
                                >
                                    Github dark dimmed
                                </a>{' '}
                                colors for better contrast
                            </li>
                            <li>
                                <Twemoji className="!mr-2" emoji="man-technologist" /> My website refers to the design and code from the{' '}
                                <a target="_blank" href="https://github.com/hta218/leohuynh.dev">
                                lehuynh.dev
                                </a>{' '}
                                ,{' '}
                                <a target="_blank" href="https://github.com/Karhdo/karhdo.dev">
                                    Karhdo.dev
                                </a>{' '}
                                and{' '}
                                <a target="_blank" href="https://github.com/sunwu51/notebook">
                                    xiaogenban1993
                                </a>{' '}
                                repositories.
                            </li>
                            <li>
                                <Twemoji emoji="inbox-tray" /> Select <code>max-bundler</code> compile 
                                and bundle my MDX files,
                                and use <code>rehype</code>/<code>remark</code> plugins and dependencies to
                                extend the MDX functionality.
                            </li>
                            <li>
                                <Twemoji emoji="party-popper" /> I used{' '}
                                <a target="_blank" href="https://prismjs.com/">
                                    Prismjs
                                </a>{' '}
                                to complete the code highlighting function and selected{' '}
                                <a target="_blank" href="https://imgur.com/">
                                    imgur
                                </a>{' '}
                                as the image hosting.
                            </li>
                        </ul>
                        <p>
                            See my{' '}
                            <a href="https://github.com/Ultrafollow/notebookBlog" target="_blank">
                                Github repository
                            </a>{' '}
                            for this blog.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Container>
  )
}
