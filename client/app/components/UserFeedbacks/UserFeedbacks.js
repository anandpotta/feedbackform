import React, { Component } from 'react';
import DynamicForm from '../DynamicForms/DynamicForm';
import 'whatwg-fetch';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class UserFeedbacks extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      form : [],
      formSubmitMsg: '',
      hideMessage: false
    }

    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch('/api/account/forms/5b9f3e306ffde7520c392579')
    .then(res => res.json())
    .then(json => {
      this.setState({
        form:json,
        isLoading:false
      });
    });
  }
  
  onSubmit(model){
    if(model != null){
    model.formId=this.state.form.formId;
    model.title=this.state.form.title;
  
    /*this.setState({
      data: [model, ...this.state.data]
    });*/

    //Post request to backend
    fetch('/api/account/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(model),
       })
       .then(res => res.json())
       .then(json => {
        if(json.success){
          //setInStorage('Mern_App', { token: json.token });
          this.setState({
            formSubmitMsg:json.message,
            isLoading: false,
            newTitle:'',
            hideMessage: false
          });
        } else{
          this.setState({
            formSubmitMsg: json.message,
            isLoading: false,
            hideMessage: false
          });
        }
      });
    }else{
        alert('Fill this feedback form before submit.');
    }
  }

  handleClick(e) {
    //console.log(e);
    //this.router.transitionTo('index');
  }

  onClose(event){
    this.setState({hideMessage: true});
  }

  render() {

    const style = this.state.hideMessage ? { display: 'none'} : { display: 'block'};

    const { form, formSubmitMsg } = this.state;
    //console.log(this.state)
    let jsonBody = [];
    let formTitle;
    for (const [key, value] of Object.entries(form)) {
        if(key == "title"){
            formTitle = value;
        }
        jsonBody.push({ key: key, label: key });
        //console.log(jsonBody);
    }

    let result = jsonBody.filter(function(i) {
        return i["key"] != "_id" && i["key"] != "__v" && i["key"] != "formId" && i["key"] != "adminId" && i["key"] != "url" && i["key"] != "title" 
    });
    //console.log(result)
    
    return (
        
        <div>
          
        {
           (formSubmitMsg) ? (
              <p className="errorMessage" style={style}>{formSubmitMsg}<a id="close" onClick={this.onClose}>(X)</a></p>
            ) : null
        }
        <DynamicForm
          className="form"
          title={formTitle}
          model={result}
          onSubmit={(model) => {this.onSubmit(model)}}
        />

        <pre style={{width:'300px'}}>
          {JSON.stringify(this.state.data)}
        </pre>

        </div>
        
    );
  }
}


export default UserFeedbacks;