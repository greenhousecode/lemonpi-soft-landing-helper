// Returns all URL query parameters
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
