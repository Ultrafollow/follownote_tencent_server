import clsx from 'clsx';
import Twemoji from '../ui/Twemoji.js';

const GreetingComponent = () => {
  const className = clsx(
    'font-greeting',
    'bg-gradient-to-r from-teal-500 via-teal-300 via-violet-400 to-violet-500 dark:bg-gradient-to-l dark:from-indigo-600 dark:to-lime-300',
    'mb-8 bg-clip-text text-[28px] font-extrabold leading-[40px] tracking-tight text-transparent',
    'sm:text-[33px] sm:leading-[60px] md:text-7xl md:leading-[86px]'
  );

  return (
    <div className={className}>
      Hi, guys! <Twemoji emoji="waving-hand" size="base" />
      <div className="font-bold text-[36px] mt-2 sm:text-[60px] sm:mt-2 md:text-7xl">
        Welcome to FollowXu&apos;s blog! <Twemoji emoji="sparkles" size="base" />
      </div>
    </div>
  );
};

export default GreetingComponent;
