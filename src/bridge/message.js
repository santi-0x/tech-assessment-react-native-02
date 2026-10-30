export function messageFrom(event, openedOrigin) {
  if (!event || !event.nativeEvent) {
    throw new Error('message')
  }
  let page
  let allowed
  try {
    page = new URL(event.nativeEvent.url)
    allowed = new URL(openedOrigin)
  } catch {
    throw new Error('origin')
  }
  if (page.origin !== allowed.origin) {
    throw new Error('origin')
  }
  let body
  try {
    body = JSON.parse(event.nativeEvent.data)
  } catch {
    throw new Error('message')
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('message')
  }
  return body
}
