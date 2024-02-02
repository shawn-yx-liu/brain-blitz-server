# brain-blitz-server

This is the server code for the [Brain Blitz](https://github.com/shawn8913/brain-blitz/tree/main) app. I built this server as a way to learn Socket.io.


### Built With
[![Javascript][Javascript.js]][Javascript-url]\
[![Sockets.io][Sockets.js]][Sockets-url]\
[![Webpack][Webpack.js]][Webpack-url]

### Deployed With
[![Heroku][Heroku.js]][Heroku-url]

## Getting Started
### Build and Run the application:

```
$ npm install
$ npm start
````

## Usage
* Set up the Brain Blitz app on your local machine by following [these instructions](https://github.com/shawn8913/brain-blitz/tree/main#build-and-run-the-application).
* To get the app connected with your local server, you will have to change the socket URL in app.js:
  * ``const socket = io('http://localhost:4000');``
  * Change the port if your server is running on a different port on your machine.
 
 
# Authors
* [Shawn Liu](https://github.com/shawn8913)


[Sockets.js]: https://img.shields.io/badge/Sockets.io-20232A?style=for-the-badge&logo=socketdotio&logoColor=61DAFB
[Sockets-url]: https://socket.io/
[Javascript.js]: https://img.shields.io/badge/Javascript-20232A?style=for-the-badge&logo=javascript
[Javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Webpack.js]: https://img.shields.io/badge/Webpack-20232A?style=for-the-badge&logo=webpack
[Webpack-url]: https://webpack.js.org/
[Heroku.js]: https://img.shields.io/badge/Heroku-20232A?style=for-the-badge&logo=heroku
[Heroku-url]: https://dashboard.heroku.com/
