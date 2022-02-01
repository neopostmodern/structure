export default {
  // If set to to true, GitHunt will use `extractgql` in order to send only
  // the id corresponding to a query to the server rather than the query.
  //
  // Note that the same option must be enabled on the API server
  // and the extracted_queries.json file in both the client and API server
  // must be the same.
  persistedQueries: false,

  apiVersion: 7,
  releaseUrl: 'https://github.com/neopostmodern/structure/releases/latest',
};
