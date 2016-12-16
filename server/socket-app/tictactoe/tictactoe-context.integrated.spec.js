const context = require('./tictactoe-context');

describe('Tictactoe game server context', function () {

    var tictactoeContextModule = require('./tictactoe-context');
    var context, commandRouter, eventRouter, eventStore;
    var MessageRouter = require('client/src/common/framework/message-router');

    var fakeEventStore = function (existingEvents) {
        var eventsLoadCount = 0;
        return {
            _eventsLoadCount: function () {
                return eventsLoadCount;
            },
            loadEvents: function (aggregateId, err, success) {
                eventsLoadCount++;
                success(existingEvents);
            }
        }
    };

    beforeEach(function () {

        commandRouter = MessageRouter();
        eventRouter = MessageRouter();
        eventStore = fakeEventStore([]);

        context = tictactoeContextModule(inject({
            generateUUID: function () {
                return "fakeUid"
            },
            commandRouter: commandRouter,
            eventRouter: eventRouter,
            eventStore: eventStore

        }))
    });

    it('should wire without an issue', function () {
        // Just checking for a wiring/injection error

    });

    it('should expose command handler', function () {
        expect(context.commandHandler).toBeTruthy();
    });

    it('should handle create game command and emit game created event', function (done) {
        context.commandHandler.startHandling();

        eventRouter.on('*', function (event) {
            done();
        });

        commandRouter.routeMessage({
            gameId: "gameOne",
            type:"CreateGame"

        });


    });
});