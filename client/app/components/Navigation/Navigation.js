import React, { Component } from 'react';
import 'whatwg-fetch';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { FormsList } from '../FormsList/FormsList';
import { FeedbackForms } from '../FeedbackForms/FeedbackForms';
import { UserForms } from '../UserForms/UserForms';

import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      token: ''
    };

    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('Mern_App');
  }
  

  render() {
    const {
      isLoading,
      token
    } = this.state;

    if(isLoading){
      return (<div><p>Loading....</p></div>);
    }

    
    //console.log(this.state);
    if(!token){
      return(
        <div>
              <div className="headerComponent">
              <div  className="headerComponent__navigation">
              <ul>
                <li className="btn btn--primary uppercase"><Link to={'/FeedbackForms'}>List of Feedback Forms</Link></li>
                <li className="btn btn--primary uppercase"><Link to={'/FormsList'}>Create a Feedback Form</Link></li>
                <li className="btn btn--primary uppercase"><Link to={'/UserForms'}>UserForms</Link></li>
              </ul>
              <Switch>
                <Route exact path='/FeedbackForms' component={FeedbackForms} />
                <Route exact path='/FormsList' component={FormsList} />
                <Route exact path='/UserForms' component={UserForms} />
              </Switch>
              </div>
              
              </div>
        </div>
      )
    }

    return(
      /*<header>
        <div className="headerComponent">
          <div className="headerComponent__title">Feedback Form</div>
          <button className="btn btn--primary uppercase" onClick={this.onLogout}>Logout</button>
        </div>
      </header>*/
      <div></div>
    )

  };

}

export default Navigation;
