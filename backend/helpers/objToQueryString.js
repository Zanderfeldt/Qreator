function objectToQueryString(obj) {
  const queryString = Object.entries(obj)
    .filter(([key, value]) => key !== 'description' && value !== undefined && value !== null)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return queryString;
}

module.exports = { objectToQueryString };