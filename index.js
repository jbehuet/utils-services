const http = require('http');
const url = require('url');
const fetch = require('node-fetch');
const ical = require('ical.js');

const PORT = process.env.PORT || 3000;

const flattenEvent = (e) => {
  const event = {};
  for (i in e[1]) {
    const prop = e[1][i];
    event[prop[0]] = e[1][i][3];
  }
  return event;
}

const requestHandler = (req, res) => {

  const allowedOrigins = [''];
  const origin = req.headers.origin;

  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
       res.setHeader('Access-Control-Request-Method', origin);
       res.setHeader('Access-Control-Allow-Headers', origin);
       res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  }

  const query = url.parse(req.url, true).query;
  if (req.url === '/') {
    res.end('Usage : ' + req.headers.host + '/?url={ICS_URL}')
  }
  fetch(query.url)
    .then(response => response.text())
    .then(data => {
      let parsed = ical.parse(data);
      let events = parsed[2];
      let result = events.map(e => flattenEvent(e));
      res.end(JSON.stringify(result))
    })
    .catch(e => {
      console.error(e);
      res.end('oO Ouppss something doesn\'t work, please try again\n' +
        'Usage : ' + req.headers.host + '/?url={ICS_URL}');
    });

}

const server = http.createServer(requestHandler);

server.listen(PORT);


