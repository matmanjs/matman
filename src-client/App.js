import React from 'react';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import Home from './pages/home';
import About from './pages/about';
import Topics from './pages/topics';

const BasicExample = () => (
    <Router>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/admin/about">About</Link></li>
                <li><Link to="/admin/topics">Topics</Link></li>
            </ul>

            <hr />

            <Route exact path="/" component={Home} />
            <Route path="/admin/about" component={About} />
            <Route path="/admin/topics" component={Topics} />
        </div>
    </Router>
);

export default BasicExample