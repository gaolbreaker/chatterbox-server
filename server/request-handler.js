/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const exampleData = [{ "message_id": 57080, "roomname": "lobby", "text": "asdfasdf", "username": "asdfasdf", "github_handle": "jakemgilfix", "campus": "rfp", "created_at": "2022-03-11T22:57:17.164Z", "updated_at": "2022-03-11T22:57:17.164Z" }, { "message_id": 57079, "roomname": "lobby", "text": "CASEY'S NOT HERE RIGHT NOW PLEASE TRY AGAIN LATER", "username": "asdfasdf", "github_handle": "jakemgilfix", "campus": "rfp", "created_at": "2022-03-11T21:23:07.685Z", "updated_at": "2022-03-11T21:23:07.685Z" }, { "message_id": 57078, "roomname": null, "text": "knock knock Casey", "username": null, "github_handle": "bogdangordin", "campus": "rfp", "created_at": "2022-03-11T20:58:10.977Z", "updated_at": "2022-03-11T20:58:10.977Z" }];

var requestHandler = function (request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // console.log('Request.url:' + request.url);
  // console.log('Request.method:' + request.method);
  // console.log('Entire request:' + Object.keys(request));

  // const exampleData = [{"message_id":57080,"roomname":"lobby","text":"asdfasdf","username":"asdfasdf","github_handle":"jakemgilfix","campus":"rfp","created_at":"2022-03-11T22:57:17.164Z","updated_at":"2022-03-11T22:57:17.164Z"},{"message_id":57079,"roomname":"lobby","text":"CASEY'S NOT HERE RIGHT NOW PLEASE TRY AGAIN LATER","username":"asdfasdf","github_handle":"jakemgilfix","campus":"rfp","created_at":"2022-03-11T21:23:07.685Z","updated_at":"2022-03-11T21:23:07.685Z"},{"message_id":57078,"roomname":null,"text":"knock knock Casey","username":null,"github_handle":"bogdangordin","campus":"rfp","created_at":"2022-03-11T20:58:10.977Z","updated_at":"2022-03-11T20:58:10.977Z"}];

  // request.on('end', () => {

  //   // console.log(data);
  //   exampleData.unshift(JSON.parse(data));
  //   console.log(exampleData);
  // });

  // const collectedData = (request) => {
  //   var data = '';
  //   request.on('data', (chunk) => {
  //     data += chunk;
  //   });
  //   request.on('end', () => {
  //     // console.log(data);
  //     exampleData.unshift(JSON.parse(data));
  //     console.log(exampleData);
  //   });
  // };

  // We will probably deal only with the situation where the request.url = /classes/messages/
  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      // return parsable stringified JSON
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(exampleData));
      //console.log('Result of GET');
      //console.log(exampleData);

    } else if (request.method === 'POST') {

      var data = '';
      request.on('data', (chunk) => {
        data += chunk; // COMMAND+d shortcut key
        exampleData.unshift(JSON.parse(data));
        console.log(JSON.parse(data));
        // console.log(exampleData);
        console.log('data:' + data.text); // be careful with variable types and +
        // type coercion
        // Notes: know readable streams,

        if (JSON.parse(data).text === '') {

          var statusCode = 400;
          var headers = defaultCorsHeaders;
          headers['Content-Type'] = 'text/plain';
          response.writeHead(statusCode, headers);
          response.end('done');

        } else if (JSON.parse(data).username.includes('<')) {

          var statusCode = 400;
          var headers = defaultCorsHeaders;
          headers['Content-Type'] = 'text/plain';
          response.writeHead(statusCode, headers);
          response.end('done');

        } else if (JSON.parse(data).text.includes('<')) {

          var statusCode = 400;
          var headers = defaultCorsHeaders;
          headers['Content-Type'] = 'text/plain';
          response.writeHead(statusCode, headers);
          response.end('done');
        } else {
          var statusCode = 201;
          var headers = defaultCorsHeaders;
          headers['Content-Type'] = 'text/plain';
          response.writeHead(statusCode, headers);
          response.end('done');

        }
      });
      // collectedData(request);

    }

    // collectedData(request, () => {response.end});
    // add some logic specifying that it should push the new message into our data structure so that a future get request will contain the new message

  } else {

    // Deal with POST
    // Deal with GET

    // The outgoing status.
    var statusCode = 404;

    // See the note below about CORS headers.
    var headers = defaultCorsHeaders;

    // Tell the client we are sending them plain text.
    //
    // You will need to change this if you are sending something
    // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'text/plain';

    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.writeHead(statusCode, headers);

    // Make sure to always call response.end() - Node may not send
    // anything back to the client until you do. The string you pass to
    // response.end() will be the body of the response - i.e. what shows
    // up in the browser.
    //
    // Calling .end "flushes" the response's internal buffer, forcing
    // node to actually send all the data over to the client.
    response.end('Hello, World!');
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};




module.exports.handleRequest = module.exports.requestHandler = requestHandler;
module.exports.defaultCorsHeaders = defaultCorsHeaders;
