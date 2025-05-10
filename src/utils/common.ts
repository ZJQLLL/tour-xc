export  function toBeijingTime(isoString: string): string {
  const date = new Date(isoString)
  // 北京时间 = UTC + 8小时
  const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1000)

  const Y = beijingDate.getFullYear()
  const M = String(beijingDate.getMonth() + 1).padStart(2, '0')
  const D = String(beijingDate.getDate()).padStart(2, '0')
  const h = String(beijingDate.getHours()).padStart(2, '0')
  const m = String(beijingDate.getMinutes()).padStart(2, '0')
  const s = String(beijingDate.getSeconds()).padStart(2, '0')

  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}
