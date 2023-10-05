function parseQueryString(url) {
  // Extract the query string part from the URL
  const queryString = url.split('?')[1];
  
// Return an empty object if there's no query string
  if (!queryString) {
    return {}; 
  }

  // Split the query string into key-value pairs
  const queryParams = queryString.split('&');

  // Initialize an empty object to store the result
  const result = {};

  // Iterate through the key-value pairs and populate the result object
  for (const param of queryParams) {
    const [key, value] = param.split('=');
    result[key] = decodeURIComponent(value.replace(/\+/g, ' ')); // Decoding URL-encoded values
  }

  return result;
}

export default parseQueryString;