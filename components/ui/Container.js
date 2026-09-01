import clsx from 'clsx'
 
export function Container({
  children,
  as: Component = 'section',
  className
}) {
  return (
    <Component className={clsx(
      'mx-auto w-full max-w-[65%] px-3 sm:px-6 xl:px-7',
      className
    )}>
      {children}
    </Component>
  )
}