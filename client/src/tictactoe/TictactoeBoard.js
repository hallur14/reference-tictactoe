import React from 'react';
import './gameboard.css';

export default function (injected) {
    const TicCell = injected('TicCell');

    class TictactoeBoard extends React.Component {
        render() {
            var rows = [];
            for(var y=0;y<3;y++){
                var cells = [];
                for(var x=0;x<3;x++){
                    cells.push(<TicCell key={x} coordinates={{ x:x, y:y}} gameId={this.props.gameId} mySide={this.props.mySide}></TicCell>);
                }
                rows.push(<div key={y} className="ticrow">{cells}</div>);
            }

            return <div className="TictactoeBoard">
                <div className="board">
                    {rows}
                </div>
            </div>
        }
    }
    return TictactoeBoard;
}