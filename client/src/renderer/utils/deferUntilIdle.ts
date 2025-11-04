const deferUntilIdle = (callback: () => void, timeout = 1000) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        callback()
      },
      { timeout },
    )
  } else {
    setTimeout(() => {
      callback()
    }, timeout)
  }
}

export default deferUntilIdle
