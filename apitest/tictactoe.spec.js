const io = require('socket.io-client');
const RoutingContext = require('../client/src/routing-context');
var UserAPI = require('./fluentapi/user-api');
var TestAPI = require('./fluentapi/test-api');

const userAPI = UserAPI(inject({
    io,
    RoutingContext
}));

const testAPI = TestAPI(inject({
    io,
    RoutingContext
}));

describe('Tictactoe API', function () {
    var userA, userB;

    beforeEach(function (done) {
        var testapi = testAPI();
        testapi.waitForCleanDatabase().cleanDatabase().then(()=> {
            testapi.disconnect();
            userA = userAPI();
            userB = userAPI();
            done();
        });
    });

    afterEach(function () {
        userA.disconnect();
        userB.disconnect();
    });

    it('should be able to play game to end', function (done) {

        expect("Tictactoe API acceptance test").toBe("implemented here");

/*

This is exactly the sequence needed to make this work. You should not need to alter the code below.
Write the missing functionality in user-api.js in order to make this work.

Notice especially the passing of gameId from userA to userB. This is a must in this case, since games must be
played in lock-step. All "expectXXX" functions must check for matching gameId, otherwise this will not work
for a load test where multiple users will be playing.

        userA.expectGameCreated().createGame().then(()=> {
                userB.expectGameJoined().joinGame(userA.getGame().gameId).then(function () {
                    userA.expectMoveMade().placeMove(0, 0).then(()=> {
                        userA.expectMoveMade();
                        userB.expectMoveMade().placeMove(1, 0).then(()=> {
                            userB.expectMoveMade(); // By other user
                            userA.expectMoveMade().placeMove(1, 1).then(()=> {
                                userA.expectMoveMade(); // By other user
                                userB.expectMoveMade().placeMove(0, 2).then(()=> {
                                    userB.expectMoveMade(); // By other user
                                    userA.expectMoveMade().placeMove(2, 2)
                                        .expectGameWon().then(done); // Winning move
                                })
                            })
                        });
                    })
                })
            }
        );
*/


    });

});

