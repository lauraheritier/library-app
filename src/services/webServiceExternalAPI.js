const getQuote = (dataType, id, parameter) => {
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("7179d710ff32d9d26df46b14314ff3e6d99e8d0e143a1f23ace4719d07136083");

const params = {
  engine: "google_scholar_cite",
  q: "FDc6HiktlqEJ"
};

const callback = function(data) {
  console.log(data['citations']);
};

// Show result as JSON
search.json(params, callback);
}




const exportedObject = {
  
  getQuote
}


export default exportedObject;