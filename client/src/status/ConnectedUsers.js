import React from 'react';
import _ from 'lodash';

import './ConnectedUsers.css';

export default function (injected) {
    const socket = injected('socket');

    class ConnectedUsers extends React.Component {
        constructor() {
            super();
            this.state = {
                users: {},
                me: {
                    userName: ""
                }
            };
            this.userNameChanged = this.userNameChanged.bind(this);
        }
        componentWillMount() {
            socket.on('userJoined', (user)=> {
                var users = this.state.users;
                users[user.clientId] = user;
                this.setState({users: users});
            });
            socket.on('userAcknowledged', (user)=> {
                this.setState({me: user});
            });
            socket.on('userLeft', (user)=> {
                var users = this.state.users;
                delete users[user.clientId];
                this.setState({users: users});
            });
            socket.on('userChanged', (user)=> {
                var users = this.state.users;
                users[user.clientId] = user;
                if (user.clientId === this.state.me.clientId) {
                    this.setState({
                        me: user
                    })
                }
                this.setState({
                    users: users
                });
            });
            socket.on('usersConnected', (users)=> {
                this.setState({users: users});
            });
        }
        userNameChanged(event){
            socket.emit('changeUserName',{userName:event.target.value})
        }
        render() {
            var users = _.map(this.state.users, (user)=> {
                return <li key={user.clientId}><span>{user.clientId}</span> : <span>{user.userName}</span></li>
            });

            return (
                <div className="ConnectedUsers">
                    <p></p>
                    <label>Me:</label>
                    <input type="text" value={this.state.me.userName} onChange={this.userNameChanged}></input>
                    <p></p>
                    <div className="UserList">
                        <span>Connected:</span>
                        <ul>
                            {users}
                        </ul>
                    </div>

                </div>
            )
        }
    }
    return ConnectedUsers;

}

