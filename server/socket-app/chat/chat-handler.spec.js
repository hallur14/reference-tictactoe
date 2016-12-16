describe('chat handler', function(){

    const ChatHandler = require('./chat-handler');
    const FakeMessageRouter = require('./fake-message-router');

    var chatHandler;
    var commandRouter;
    var eventRouter;

    beforeEach(function(){
        commandRouter = FakeMessageRouter();
        eventRouter = FakeMessageRouter();

        chatHandler = ChatHandler(inject({
            generateUUID: function () {
                return "yourId"
            },
            commandRouter: commandRouter,
            eventRouter: eventRouter
        }));
    });

    it('should construct without error',function(){
        expect(commandRouter.subscriptions['chatCommand']).toBeFalsy();
    });

    it('should subscribe to chatCommand when started to handle commands', function(){
        chatHandler.startHandling();
        expect(commandRouter.subscriptions['chatCommand']).toBeTruthy();
    });

    it('should issue messageReceived event on sendMessage command, with unique id', function(){
        chatHandler.startHandling();

        commandRouter.subscriptions['chatCommand']({
            message:'test message',
            _session:{clientId:999}
        });
    });
});
