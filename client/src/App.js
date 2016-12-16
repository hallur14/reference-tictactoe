import React from 'react';
import _ from 'lodash';

import logo from './logo.svg';
import './App.css';

export default function(injected){
    const ConnectedClients = injected("ConnectedClients");
    const ConnectedUsers = injected("ConnectedUsers");
    const Chat = injected("Chat");
    const TictactoeGame = injected("TictactoeGame");

    class App extends React.Component {

        render() {
            return (
                <div className="App">
                    <div className="App-header">
                        <div>
                            <img src={logo} className="App-logo" alt="logo"/>
                        </div>
                        <div>
                            <h2>Welcome to HGOP 2016 base app</h2>
                        </div>
                        <div className="App-header-right">
                            <ConnectedClients></ConnectedClients>
                        </div>

                        <div className="devMode">
                            <small>Running in <b>{process.env.NODE_ENV}</b> mode.</small>
                        </div>
                    </div>


                    <div className="App-body">

                        <div className="App-container">
                            <TictactoeGame></TictactoeGame>
                        </div>


                        <div className="App-left-column">

                            <ConnectedUsers></ConnectedUsers>

                            <Chat></Chat>

                        </div>


                    </div>


                </div>
            );
        }
    }
    return App;
};
