import Twemoji from '@/components/ui/Twemoji'

export function Intro() {
  return (
    <h1 className="text-neutral-900 dark:text-neutral-200">
      I'm <span className="font-medium">Follow Xu</span> - a graduate student studying Earth sciences in
      <span className="hidden font-medium">China</span>
      <span className="absolute ml-0.5 inline-flex pt-[2px]">
        <Twemoji emoji="flag-china" />
      </span>
    </h1>
  )
}
