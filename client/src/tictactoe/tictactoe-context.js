import inject from '../common/framework/inject';
import TictacToeGameModule from './TictactoeGame';
import TictacToeBoardModule from './TictactoeBoard';
import TicCellModule from './TicCell';
import MessageRouter from '../common/framework/message-router';

import generateUUID from '../common/framework/uuid';

function TictactoeContext(injected){
    const eventRouter = injected('eventRouter');
    const commandRouter = injected('commandRouter');
    const queryRouter = injected('queryRouter');
    const socket = injected('socket');

    const TicCell = TicCellModule(inject({
        eventRouter,
        commandPort:commandRouter,
        generateUUID
    }));

    const TictactoeBoard = TictacToeBoardModule(inject({
        TicCell,
        eventRouter,
        MessageRouter
    }));

    const TictactoeGame = TictacToeGameModule(inject({
        TictactoeBoard,
        eventRouter,
        commandPort:commandRouter,
        queryRouter,
        generateUUID,
        socket
    }));

    return {
        TictactoeGame
    };
}

export default TictactoeContext;