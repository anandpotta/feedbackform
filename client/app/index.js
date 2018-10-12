import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';

import Home from './components/Home/Home';
import Header from './components/Header/Header';

import FeedbackForms from './components/FeedbackForms/FeedbackForms';
import FormsList from './components/FormsList/FormsList';
import UserForms from './components/UserForms/UserForms';
import UserFeedbacks from './components/UserFeedbacks/UserFeedbacks';

import './styles/styles.scss';

render((
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/FeedbackForms" component={FeedbackForms}/>
        <Route path="/FormsList" component={FormsList}/>
        <Route path="/UserForms" component={UserForms}/>
        <Route path="/UserFeedbacks" component={UserFeedbacks}/>
        <Route component={NotFound}/>
      </Switch>
    </App>
  </Router>
), document.getElementById('app'));
