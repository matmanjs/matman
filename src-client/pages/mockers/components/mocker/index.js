import React from 'react';

const Mocker = ({ match }) => (
    <div>
        <h3>Hello, I am {match.params.mockerName}</h3>
    </div>
);

export default Mocker;