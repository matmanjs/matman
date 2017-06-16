import React from 'react';

const Mocker = (props) => (
    <div>
        <h3>Hello, I am in {props.routeParams.mockerName}</h3>
    </div>
);

export default Mocker;