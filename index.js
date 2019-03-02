var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var js = require('fadi_js');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

      //This handler will listen for requests on /*, any file from the root of our server.
        //See expressjs documentation for more info on routing.
app.get( '/*' , function( req, res, next ) {

            //This is the current file they have requested
        var file = req.params[0]; 

            //For debugging, we can track what files are requested.
        console.log('\t :: Express :: file requested : ' + file);

            //Send the requesting client the file.
        res.sendfile( __dirname + '/' + file );

}); //app.get *

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});