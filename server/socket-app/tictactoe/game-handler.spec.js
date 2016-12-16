var Handler = require('./game-handler');

describe("Game command handler", function () {


    var handler;

    var commandRouter, eventRouter, eventStore;

    var MessageRouter = require('client/src/common/framework/message-router');

    var executedCommand;
    var aggregate = function(events){
        return{
            executeCommand:function(commandMessage, resultingEventCb){
                executedCommand = commandMessage;
                resultingEventCb([
                    {'resulting':'event'}
                ])
            }
        }
    };

    var cache;

    var givenEvents=[];
    var eventStore;

    var resultingEvents =[];

    beforeEach(function () {
        executedCommand = undefined;
        commandRouter = MessageRouter();
        eventRouter = MessageRouter();
        resultingEvents=[];
        cache={
            add:function(key, obj){
                cache[key] = obj
            },
            get:function(key){
                return cache[key]
            }
        };
        eventStore = {
            loadedEvents:[],
            loadEvents:function(aggregateId, err, success){
                eventStore.loadedEvents.push(aggregateId);
                success(givenEvents);
            }
        };
        handler = Handler(inject({
            generateUUID : function(){
                return "fakeId"
            },
            commandRouter,
            eventRouter,
            eventStore,
            aggregate,
            Cache:function(){
                return cache;
            }
        }));
        eventRouter.on("*", function(event){
            resultingEvents.push(event)
        });
        handler.startHandling();
    });


    it('should not handle command without gameId attribute', function () {
        commandRouter.routeMessage({
            crap:'message'
        });
        expect(resultingEvents.length).toBe(0);
    });

    it('should load events for game Id',function(){
        commandRouter.routeMessage({
            gameId:"thisIsTheGame"
        });
        expect(eventStore.loadedEvents.length).toBeTruthy();
    });

    it('should execute command on tictactoe aggregate',function(){
        commandRouter.routeMessage({
            gameId:"thisIsTheGame"
        });
        expect(executedCommand.gameId).toEqual("thisIsTheGame");
    });

    it('should use cached version the second time.', function(){
        commandRouter.routeMessage({
            gameId:"thisIsTheGame"
        });
        commandRouter.routeMessage({
            gameId:"thisIsTheGame"
        });
        expect(eventStore.loadedEvents.length).toBe(1);

    });

    it('should hold game aggregates in cache',function(){
        commandRouter.routeMessage({
            gameId:"thisIsTheGame"
        });
        expect(cache["thisIsTheGame"]).toBeTruthy();
    });

    it('should not call another load from eventStore if receiving another command for same game before first loads',function(){

        eventStore.loadEvents=function(aggregateId, err, success){
                eventStore.loadedEvents.push(aggregateId);
            };

        commandRouter.routeMessage({
            gameId:"thisIsTheGame"
        });
        commandRouter.routeMessage({
            gameId:"thisIsTheGame"
        });

        expect(eventStore.loadedEvents.length).toBe(1);

    });

    it('should route resulting events to event router with all relevant information',function(){
        commandRouter.routeMessage({
            gameId:"thisIsTheGame",
            _session :{
                clientId:999,
            }
        });
        expect(resultingEvents.length).toEqual(1);
        expect(resultingEvents[0].gameId).toEqual('thisIsTheGame');
        expect(resultingEvents[0].userSession.clientId).toEqual(999);
    });

});