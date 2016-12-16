import React from 'react';

export default function (injected) {
    var title = injected('title', true) || 'FAKE';

    var renderedProps = [];
    var FakeView = React.createClass({
        getInitialState: function () {
            return this.props;
        },
        render: function () {
            renderedProps.push(this.props);
            return (
                <div className="fakediv">{title}</div>
            );
        },
        statics: {
            props: function (idx) {
                idx = idx !== undefined ? idx : renderedProps.length-1;
                return renderedProps[idx];
            },
            renderCount: function () {
                return renderedProps.length;
            },
            reset: function () {
                renderedProps.length=0;
            }
        }
    });
    return FakeView
};