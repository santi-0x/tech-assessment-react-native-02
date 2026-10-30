export async function approve(prompt, reason) {
  if (!prompt || typeof prompt.authenticate !== 'function') {
    throw new Error('prompt')
  }
  if (typeof reason !== 'string' || reason.trim().length === 0) {
    throw new Error('reason')
  }
  await prompt.authenticate({
    reason,
    fallbackLabel: 'Use device passcode',
    cancelLabel: 'Cancel',
  })
  return { ok: true, reason }
}
