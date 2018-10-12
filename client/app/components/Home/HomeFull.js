import React, { Component } from 'react';
import 'whatwg-fetch';

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

      signUpError: '',
      signUpEmail: '',
      signUpPassword: ''
    };

    this.onSignInEmailChange = this.onSignInEmailChange.bind(this);
    this.onSignInPasswordChange = this.onSignInPasswordChange.bind(this);
    this.onSignUpEmailChange = this.onSignUpEmailChange.bind(this);
    this.onSignUpPasswordChange = this.onSignUpPasswordChange.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
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

  onSignUpEmailChange(event){
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onSignUpPasswordChange(event){
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onSignInEmailChange(event){
    this.setState({
      signInEmail: event.target.value,
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
              token: json.token
            });
          } else{
            this.setState({
              signInError: json.message,
              isLoading: false
            });
          }
      });
  }

  onSignUp(){
    //Grab state
    const {
      signUpEmail,
      signUpPassword
    } = this.state

    this.setState({
      isLoading: true
    })

    //Post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword
      }),
     }).then(res => res.json())
      .then(json => {
          if(json.success){
            this.setState({
              signUpError: json.message,
              isLoading: false,
              signUpEmail: '',
              signUpPassword: ''
            });
          } else{
            this.setState({
              signUpError: json.message,
              isLoading: false
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

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpError,
      signUpEmail,
      signUpPassword
    } = this.state;

    if(isLoading){
      return (<div><p>Loading....</p></div>);
    }

    if(!token){
      return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : null
            }
              <p>Sign In</p>
              <input
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={this.onSignInEmailChange}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={this.onSignInPasswordChange}
              />
              <br />
              <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : null
            }
              <p>Sign Up</p>
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={this.onSignUpEmailChange}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={this.onSignUpPasswordChange}
              /> 
              <button onClick={this.onSignUp}>Sign Up</button>
          </div>
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
