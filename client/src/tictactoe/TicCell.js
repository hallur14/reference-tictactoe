import React from 'react';

export default function (injected) {
    const eventRouter = injected('eventRouter');
    const commandPort = injected('commandPort');
    const generateUUID = injected('generateUUID');

    class TicCell extends React.Component {
        constructor() {
            super();
            this.state = {
            }
        }
        componentWillMount(){
        }
        render() {
            return <div className="ticcell">
                CELL
            </div>
        }
    }
    return TicCell;
}
