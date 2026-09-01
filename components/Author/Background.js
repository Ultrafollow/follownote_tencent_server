import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { Image } from '@/components/ui/Image';
import { Link } from '@/components/ui/Link';
import Twemoji from '@/components/ui/Twemoji'
import { GrowingUnderline } from '@/components/ui/Growing-underline'

// 工作经历数据数组
const EXPERIENCES = [
    {
        org: 'SYSU',
        url: 'https://www.sysu.edu.cn/',
        logo: '/static/images/sysu.png',
        start: '2023.09',
        end: 'Present',
        title: "Master's degree student / Resources and Environment / Geophysics",
        icon: 'man-student',
        details: () => {
          return (
            <ul className="[&>li]:my-2 [&>li]:pl-0">
              <li>
                The fault activities on the Qinghai-Tibet Plateau are mainly studied by 
                using <strong>geophysical</strong> and <strong>numerical simulations</strong>.
              </li>
              <li>
                I received the first-class scholarship during my first year of postgraduate study.
              </li>
            </ul>
          )
        },
      },
      {
        org: 'CUMT',
        url: 'https://www.cumt.edu.cn/',
        logo: '/static/images/cumt.png',
        start: '2019.09',
        end: '2023.06',
        title: "Bachelor's degree",
        icon: 'man-student',
        details: () => {
          return (
            <ul className="[&>li]:my-2 [&>li]:pl-0">
                <li>
                    Obtained a bachelor's degree in geological engineering (geotechnical direction).
                </li>
                <li>
                    The topic of the graduation project is: 
                    Rules and Applications of Geological Unit Division Based on Logging and Geotechnical Mechanics Parameters.
                    The main application is the method of machine learning to
                    analyze geotechnical data and divide underground rock layers.
                </li>
                <li>
                    During my school years, I performed outstandingly and was 
                    recommended for postgraduate study at Sun Yat-sen University.
                </li>
            </ul>
          )
        },
      },
];

export function CareerTimeline() {
    return (
      <ul className="m-0 list-none p-0">
        {EXPERIENCES.map((exp, idx) => (
          <li key={exp.url} className="m-0 p-0">
            <TimelineItem exp={exp} last={idx === EXPERIENCES.length - 1} />
          </li>
        ))}
      </ul>
    )
  }
  
function TimelineItem({ exp, last }) {
    let { org, title, icon, url, logo, start, end, details: Details } = exp
    return (
      <div
        className={clsx(
          'group/timeline-item',
          'relative -mx-3 flex flex-row items-start gap-3 rounded-lg p-3',
          'cursor-pointer bg-transparent transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
          !last && [
            'before:absolute before:left-9 before:top-15',
            'before:h-full before:w-px',
            'before:bg-gray-300 dark:before:bg-gray-500',
          ]
        )}
      >
        <Image
          src={logo}
          alt={org}
          className="h-12 w-12 shrink-0 rounded-md dark:bg-gray-100"
          style={{ objectFit: 'contain' }}
          width={200}
          height={200}
        />
        <details className="w-full [&_.minus]:open:block [&_.plus]:open:hidden">
          <summary className="relative pr-10 marker:content-none">
            <Plus
              size={18}
              className={clsx([
                'plus',
                'group-hover/timeline-item:visible md:invisible',
                'absolute right-1 top-1',
                'transition-transform duration-300 ease-in-out',
                'text-gray-600 dark:text-gray-500',
              ])}
            />
            <Minus
              size={18}
              className={clsx([
                'minus hidden',
                'absolute right-1 top-1',
                'transition-transform duration-300 ease-in-out',
                'text-gray-600 dark:text-gray-500',
              ])}
            />
            <div className="flex flex-col">
              <div className="line-clamp-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">
                <span>{start}</span> – <span>{end}</span>
              </div>
              <Link
                href={url}
                className="line-clamp-1 w-fit font-semibold text-gray-900 no-underline hover:text-gray-900 dark:text-white dark:hover:text-white"
              >
                <GrowingUnderline>{org}</GrowingUnderline>
              </Link>
              <div className="flex items-center gap-1 pt-1 text-sm text-gray-700 dark:text-gray-200">
                <Twemoji emoji={icon} className="!-mt-1" />
                <span>{title}</span>
              </div>
            </div>
          </summary>
          <div className="pt-1 text-base">
            <Details />
          </div>
        </details>
      </div>
    )
}
  