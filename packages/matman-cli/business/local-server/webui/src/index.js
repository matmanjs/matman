import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import createStore from './store';

import App from './App';

const store = createStore(window.__initialState);

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}

const Root = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render((
    <Provider store={store}>
        <Root />
    </Provider>
), document.getElementById('root'));

