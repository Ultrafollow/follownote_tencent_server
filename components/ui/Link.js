import NextLink from 'next/link'

export function Link({ href, ...rest }) {
  // 判断链接类型
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  // 处理内部链接（使用 Next.js 路由）
  if (isInternalLink) {
    return <NextLink className="break-words" href={href} {...rest} />
  }

  // 处理页面锚点链接
  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  // 处理外部链接（自动添加安全属性）
  return (
    <a
      className="break-words"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
    />
  )
}