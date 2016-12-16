const TictactoeState = require('./tictactoe-state');
const Tictactoe = require('./tictactoe-handler');
const GameHandler = require('./game-handler');
const CacheModule = require('./cache');

module.exports=function(injected) {
    const generateUUID=injected('generateUUID');
    const commandRouter=injected('commandRouter');
    const eventRouter=injected('eventRouter');
    const eventStore= injected('eventStore');

    const tictactoe = Tictactoe(inject({
        TictactoeState:TictactoeState(inject({}))
    }));

    var gameHandler = GameHandler(inject({
        generateUUID,
        commandRouter,
        eventRouter,
        eventStore,
        aggregate:tictactoe,
        Cache: CacheModule(inject(
            {cacheSize:100}
        ))
    }));

    return {
        commandHandler:gameHandler
    }

};