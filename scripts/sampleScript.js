var h = 0;
const sample = (request, response, next) => {
  response.send("true")
  console.log(request.url)
};

module.exports = sample;