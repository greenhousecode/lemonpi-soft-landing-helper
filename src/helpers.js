export const getUrlQueryParameters = () =>
  window.location.search
    .replace(/^\?/, '')
    .split('&')
    .filter(parameter => parameter)
    .reduce(
      (parameters, parameter) =>
        Object.assign(parameters, {
          [decodeURI(parameter.split('=')[0])]: decodeURI(parameter.split('=')[1]),
        }),
      {},
    );

export const fetch = (url, resolve = () => {}, { method = 'GET', body }) => {
  let rejected = false;

  const timeout = setTimeout(() => {
    rejected = true;
    throw new Error('Request timed out');
  }, 3000);

  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      clearTimeout(timeout);

      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (_) {
          resolve();
        }
      } else if (!rejected) {
        throw new Error(`Server responded status ${xhr.status}`);
      }
    }
  };

  if (method === 'POST' && body) {
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
  } else {
    xhr.send();
  }
};
