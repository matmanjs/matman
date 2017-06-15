import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

import MockerList from './components/list';
import Mocker from './components/mocker';

const Mockers = ({ match }) => (
  <div>
    <h2>Mockers</h2>

    <Route path={`${match.url}/:mockerName`} component={Mocker} />
    <Route exact path={match.url} component={MockerList} />

  </div>
);

export default Mockers;