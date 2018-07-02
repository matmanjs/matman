import React from 'react';
import { Route } from 'react-router-dom';

import List from './components/list';
import Mocker from './components/mocker';

import './index.less';

export default function MockersContainer(props) {
  let { match } = props;

  return (
    <div className="page-mockers">
      <Route path={`${match.url}/:mockerName`} component={Mocker} />
      <Route exact path={match.url} component={List} />
    </div>
  );
}

