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

class Header extends Component {

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
    this.render();
  }

  onLogout(){
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('Mern_App');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify the token
      fetch('/api/account/logout?token=' + token)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          this.setState({
            token: '',
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
    } else {
      this.setState({
        isLoading: false
      });
    }
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
        <header>
            <div className="headerComponent__title">Feedback Form</div>
        </header>
      )
    }

    return(
      <div></div>
      /*<header>
        <div className="headerComponent">
          <div className="headerComponent__title">Feedback Form</div>
          <button className="btn btn--primary uppercase" onClick={this.onLogout}>Logout</button>
        </div>
      </header>*/
    )

  };

}

export default Header;
