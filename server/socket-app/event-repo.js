module.exports=function(injected){

    const dbPool = injected('dbPool');
    const eventRouter = injected('eventRouter');
    const commandRouter = injected('commandRouter');
    const queryRouter = injected('queryRouter');

    var repo = {
        storeEvent:function(eventObj, errCb, successCb){

            dbPool.connect(function(err, connection, done) {
                if(err) {
                    errCb('error fetching db connection from pool' + err);
                }

                var statement = 'INSERT INTO eventlog (id, aggregate_id, timestamp, json) VALUES ($1,$2,$3,$4)';
                var statementParams = [eventObj.eventId, eventObj.gameId, new Date(), JSON.stringify(eventObj)];

                connection.query(statement,statementParams, function(err) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        errCb('error executing statement ' + err + ", params:" + statementParams);
                    } else {
                        successCb();
                    }
                });
            });

        },
        retrieveEventLog:function(cmdObj, errCb, successCb){

            dbPool.connect(function(err, connection, done) {
                if(err) {
                    errCb('error fetching db connection from pool:' + err);
                }

                var statement = 'SELECT id, timestamp, json FROM eventlog';
                var statementParams = [];

                connection.query(statement,statementParams, function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        errCb('error executing statement ' + err + ", params:" + statementParams);
                    } else {
                        successCb(result);
                    }
                });
            });
        },
        loadEvents:function(aggregateId, errCb, successCb){
//            var startTimer = new Date().getTime();
            dbPool.connect(function(err, connection, done) {
                if(err) {
                    return console.error('error fetching db connection from pool', err);
                }

                var statement = 'SELECT id, timestamp, json FROM eventlog where aggregate_id = $1';
                var statementParams = [aggregateId];

                connection.query(statement,statementParams, function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        console.error('error executing statement ', statement, "params", statementParams, "ERROR: ", err);
                        errCb('error executing statement ' + statement + "params"+ statementParams );
                    } else {

                        var events = _.map(result.rows, function(row){
                            return JSON.parse(row.json);
                        });

                        //var endTime = new Date().getTime();
                        //var elapsed = endTime - startTimer;
                        //console.debug(statement, "took", elapsed, "ms to execute");
                        successCb(events);
                    }
                });
            });
        },
        retrieveOpenGames:function(aggregateId, errCb, successCb){
            dbPool.connect(function(err, connection, done) {
                if(err) {
                    return console.error('error fetching db connection from pool', err);
                }

                var statement = 'SELECT a.id, a.timestamp, a.json, a.aggregate_id FROM eventlog a LEFT JOIN eventlog b USING(aggregate_id) GROUP BY a.id HAVING count(b.id)=1';
                var statementParams = [];

                connection.query(statement,statementParams, function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        console.error('error executing statement ', statement, "params", statementParams, "ERROR: ", err);
                        errCb('error executing statement ' + statement + "params"+ statementParams );
                    } else {

                        var events = _.map(result.rows, function(row){
                            return JSON.parse(row.json);
                        });

                        successCb(events);
                    }
                });
            });
        }
    };
    commandRouter.on('requestChatHistory', function(requestCommand){
        repo.retrieveEventLog(requestCommand, function(err){
            queryRouter.routeMessage({type:"chatHistoryResult", requestCommand, requestError:err})
        }, function(resultSet){
            var events = _.map(resultSet.rows, function(row){
                return JSON.parse(row.json);
            });

            // Can you do better than using lodash filter here? Directly in the query perhaps?
            events = _.filter(events, (ev)=>{return ev.type==="chatMessageReceived"});

            queryRouter.routeMessage({type:"chatHistoryResult", requestCommand, events})
        });
    });
    commandRouter.on('RequestOpenGames', function(requestCommand){
        repo.retrieveOpenGames(requestCommand, function(err){
            queryRouter.routeMessage({type:"OpenGamesResult", requestCommand, requestError:err})
        }, function(resultSet){
            queryRouter.routeMessage({type:"OpenGamesResult", requestCommand, resultSet})
        });
    });
    eventRouter.on('*', function(eventObj){
        repo.storeEvent(eventObj, function(err){
            console.error('Error storing event object: ' + err)
        }, function(){
            // All is fine
        })
    });

    return repo
};