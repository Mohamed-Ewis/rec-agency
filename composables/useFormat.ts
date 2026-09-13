export function useFormat() {
  const gbp = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  })

  const number = new Intl.NumberFormat('en-GB')

  function money(value: number) {
    return gbp.format(value)
  }

  function compactMoney(value: number) {
    if (value >= 1000) return `£${Math.round(value / 1000)}k`
    return money(value)
  }

  function date(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(value))
  }

  function dateTime(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value))
  }

  function relative(value: string) {
    const delta = Date.now() - new Date(value).getTime()
    const days = Math.round(delta / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 31) return `${Math.round(days / 7)}w ago`
    return date(value)
  }

  function initials(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('')
  }

  return { money, compactMoney, number, date, dateTime, relative, initials }
}
