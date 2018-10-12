import React, { Component } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { FormsList } from '../FormsList/FormsList';
import { FeedbackForms } from '../FeedbackForms/FeedbackForms';
import { UserForms } from '../UserForms/UserForms';

const App = ({ children }) => (
  <>
    <Header />

    <main>
      {children}
    </main>

    <Footer />
  </>
);

export default App;
