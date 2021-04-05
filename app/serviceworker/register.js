if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js').then(
      (registration) => {
        // Registration was successful
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope,
        )
      },
      (err) => {
        // todo: error UI
        console.error('ServiceWorker registration failed: ', err)
      },
    )
  })
}
