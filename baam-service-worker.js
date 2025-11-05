self.addEventListener('push', event => {
  const payload = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      data: payload.data,
      image: payload.notification.image,
    })
  );
  event.stopImmediatePropagation();
});
self.addEventListener('notificationclick', event => {
  event.preventDefault();
  const data = event.notification.data;
  const urlToOpen = data && data.url ? data.url : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].navigate(urlToOpen).then(client => client.focus());
      } else {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
  event.notification.close();
  event.stopImmediatePropagation();
});

// eslint-disable-next-line no-undef
importScripts('./ngsw-worker.js');
