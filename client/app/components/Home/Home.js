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

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      token: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      visibility: false,
      hideMessage: false
    };

    this.onSignInEmailChange = this.onSignInEmailChange.bind(this);
    this.onSignInPasswordChange = this.onSignInPasswordChange.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onLogout = this.onLogout.bind(this);

  }

  //On the componentDidMount it will fire of a fetch request to the token and if it is in localstorage, If there is no token in the local storage it will go to the signup
  componentDidMount() {
    const obj = getFromStorage('Mern_App');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify the token
      fetch('/api/account/verify?token=' + token)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          this.setState({
            token,
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

  onSignInEmailChange(event){
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onSignInPasswordChange(event){
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onSignIn(){
    //Grab state
    const {
      signInEmail,
      signInPassword
    } = this.state

    this.setState({
      isLoading: true
    })

    //Post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      }),
     }).then(res => res.json())
      .then(json => {
          if(json.success){
            setInStorage('Mern_App', { token: json.token });
            this.setState({
              signInError: json.message,
              isLoading: false,
              signInEmail: '',
              signInPassword: '',
              token: json.token,
              hideMessage: false
            });
          } else{
            this.setState({
              signInError: json.message,
              isLoading: false,
              hideMessage: false
            });
          }
      });
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

  onClose(){
    let note = document.getElementsByClassName("errorMessage");
    note[0].style.display = "none";
 }

  
  render() {

    const style = this.state.hideMessage ? { display: 'none'} : { display: 'block'};
    
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword
    } = this.state;

    if(isLoading){
      return (<div><p>Loading....</p></div>);
    }

    if(!token){
      return (
        <div class="Wrapper loginPage">
            {
              (signInError) ? (
                <p className="errorMessage" style={style}>{signInError}<a id="close" onClick={this.onClose}>(x)</a></p>
              ) : null
            }
              <h1 className="Title">Feedback Form Login</h1>
              <div className='Input'>
                <input
                  className='Input-text'
                  type="email"
                  placeholder="Email"
                  value={signInEmail}
                  onChange={this.onSignInEmailChange}
                />
                <label for='input' className='Input-label'>Email</label>
              </div>
              <br />
              <div className='Input'>
                <input
                  className='Input-text'
                  type="password"
                  placeholder="Password"
                  value={signInPassword}
                  onChange={this.onSignInPasswordChange}
                />
                <label for='input' className='Input-label'>Password</label>
              </div>
              <br />
              <button className="btn btn--primary uppercase" onClick={this.onSignIn}>Login</button>
              </div>
      );
    }
    
    return (
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
        <div className="headerComponent__logout">
          <button className="btn btn--primary uppercase" onClick={this.onLogout}>Logout</button>
        </div>
        </div>
        </div>
     )
  }
}
export default Home;
