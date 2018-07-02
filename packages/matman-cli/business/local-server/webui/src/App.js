import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Layout } from 'antd';

import LayoutHeader from './components/layout-header';

import Home from './pages/home';
import Mockers from './pages/mockers';

import './App.less';

const App = () => (
  <Router>

    <Layout className="matman-container">

      <LayoutHeader />

      <Layout.Content>
        <Route exact path="/" component={Home} />
        <Route path="/matman-admin/dashboard" component={Home} />
        <Route path="/matman-admin/mockers" component={Mockers} />
      </Layout.Content>
    </Layout>

  </Router>
);

export default App;