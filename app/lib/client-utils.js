export function formatDate(dateStr, locale = 'zh-CN') {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }