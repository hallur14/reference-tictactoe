import React from 'react';
import _ from 'lodash';
import './Chat.css';

export default function(injected){

    const commandPort =injected('commandPort');
    const eventRouter =injected('eventRouter');
    const queryRouter =injected('queryRouter');

    const generateUUID = injected('generateUUID');

    class Chat extends React.Component{
        constructor(){
            super();

            this.state={
                messageList:[],
                stats:{
                }
            };

            this.sendChatMessage = this.sendChatMessage.bind(this);
            this.unsentMessageChanged = this.unsentMessageChanged.bind(this);
        }
        sendChatMessage(){
            var cmdId = generateUUID();
            commandPort.routeMessage({commandId:cmdId, type:"chatCommand", message: this.state.unsentMessage });
        }
        unsentMessageChanged(event){
            this.setState({
                unsentMessage: event.target.value
            })
        }

        componentWillMount(){
            const chatMessageReceived = (messageObj)=>{
                var messageList = this.state.messageList;
                messageList.push(messageObj);
                this.setState({
                    messageList:messageList
                });
            };
            eventRouter.on('chatMessageReceived', chatMessageReceived);
            queryRouter.on('chatHistoryResult', (resultMessage)=>{
                _.each(resultMessage.events, function(event){
                    if(event.type==='chatMessageReceived'){
                        chatMessageReceived(event);
                    }
                });
            });
            commandPort.routeMessage({commandId:generateUUID(), type:"requestChatHistory"})
        }
        render(){

            var messages = _.map(this.state.messageList, (message, idx)=>{
                return <span key={idx}>{message.sender.userName} says {message.message}<p></p></span>
            });

            return (
                <div className="Chat">

                    <textarea value={this.state.unsentMessage} onChange={this.unsentMessageChanged}></textarea>
                    <p></p>
                    <button onClick={this.sendChatMessage}>Send message</button>
                    <p></p>

                    <p></p>
                    { messages }
                    <p></p>
                </div>
            )
        }
    }
    return Chat;
}