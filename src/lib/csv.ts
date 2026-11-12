export function csvCell(value: unknown): string {
  let text = value == null ? '' : String(value)
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""').replace(/[\r\n]+/g, ' ')}"`
}
