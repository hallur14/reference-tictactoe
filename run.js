module.exports = (function() {
    require('server/globals');

    var port = process.env.PORT || 8080;
    var env = process.env.NODE_ENV || 'development';

    console.log("Run env:", process.env);

    var server = require('./server/server.js')(inject({
        port,
        env
    }));

    server.startServer(function() {
        console.log('Server listening on port ' + port);
    });

})();
