export function openableUrl(text) {
  let parsed
  try {
    parsed = new URL(text)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:') {
    return null
  }
  if (parsed.username || parsed.password) {
    return null
  }
  return parsed.origin
}
