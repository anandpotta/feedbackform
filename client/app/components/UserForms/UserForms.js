import React, { Component } from 'react';
import DynamicForm from '../DynamicForms/DynamicForm';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { FormsList } from '../FormsList/FormsList';
import { FeedbackForms } from '../FeedbackForms/FeedbackForms';
import 'whatwg-fetch';

class UserForms extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      forms : [],
      form : [],
      formSubmitMsg: '',
      hideMessage: false
    }

    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch('/api/account/forms')
    .then(res => res.json())
    .then(json => {
      document.getElementById('submitFeedback').style.display = 'none';
      this.setState({
        forms:json,
        isLoading:false
      });
    });


    /*fetch('/api/account/forms/5bab270f59b3124b7c0c5793')
    .then(res => res.json())
    .then(json => {
      this.setState({
        form:json,
        isLoading:false
      });
    });*/
  }

  handleClick(e, index) {
    //console.log(e);
    //console.log(this.props.history)
    //<Redirect to='/UserForms' />
    //this.props.history.push('/UserForms')
    const formid = e.currentTarget.getAttribute('data-formid');

    fetch('/api/account/forms/' + formid)
      .then(res => res.json())
      .then(json => {
        if(json != null){
          //setInStorage('Mern_App', { token: json.token });
          document.getElementById('fbForms').style.display = 'none';
          document.getElementById('submitFeedback').style.display = 'block';
          this.setState({
            form:json,
            isLoading:false
          });
        } else{
          this.setState({
            form:json,
            isLoading:false
          });
        }
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

  onNavigate(){
    document.getElementById('fbForms').style.display = 'block';
    document.getElementById('submitFeedback').style.display = 'none';
  }

  onClose(event){
    this.setState({hideMessage: true});
  }

  render() {
    //console.log(this.props);
    const style = this.state.hideMessage ? { display: 'none'} : { display: 'block'};

    const { forms, form, formSubmitMsg } = this.state;

    const formTabel = forms.map((d, index) => <tr className="clickStyle" data-formid={d.formId} onClick={(e) => {this.handleClick(e)}} key={index}>
                                               <td className="idInfo">{index+1}</td><td>{d.title}</td><td>{d.url}</td>
                                              </tr>);

    //console.log(this.state)
    let jsonBody = [];
    let formTitle;
    let fieldProps;
    for (const [key, value] of Object.entries(form)) {
        if(key == "title"){
          formTitle = value;
        }else if(key == "mobile"){
          fieldProps = {required: true, maxLength: 10}
        }
        /*if(key == "mobile"){
          fieldProps = {required: true, maxLength: 10}
        }*/
        
        jsonBody.push({ key: key, label: key, type: key });
        //console.log(jsonBody);
    }

    let result = jsonBody.filter(function(i) {
        return i["key"] != "_id" && i["key"] != "__v" && i["key"] != "formId" && i["key"] != "adminId" && i["key"] != "url" && i["key"] != "title" 
    });
    //console.log(result)
    
    return (
        
        <div className="container">
        <div className="headerComponent">
          <div  className="headerComponent__navigation">
            <ul>
              <li className="btn btn--primary uppercase"><Link to={'/FeedbackForms'}>List of Feedback Forms</Link></li>
              <li className="btn btn--primary uppercase"><Link to={'/FormsList'}>Create a Feedback Form</Link></li>
              <li className="btn btn--primary uppercase"><Link to={'/UserForms'}>UserForms</Link></li>
            </ul>
          </div>
        </div>

        {
           (formSubmitMsg) ? (
              <p className="errorMessage" style={style}>{formSubmitMsg}<a id="close" onClick={this.onClose}>(X)</a></p>
            ) : null
        }

        <div className="tableContainer" id="fbForms" >
            <h1>List of Feedback Forms</h1>
            <div className="tbl-header">
              <table cellSpacing='0' cellPadding='0'>
                <thead>
                  <tr>
                    <th className="idInfo">S.No.</th>
                    <th>Feedback Form title</th>
                    <th>Url</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="tbl-content">
              <table className="dataGrid" cellSpacing='0' cellPadding='0'><tbody>{formTabel}</tbody></table>
            </div>
        </div>

        <div id="submitFeedback">
        <DynamicForm
          className="form"
          title={formTitle}
          model={result}
          onSubmit={(model) => {this.onSubmit(model)}}
        />

        <pre style={{width:'300px'}}>
          {JSON.stringify(this.state.data)}
        </pre>

        <button className="btn btn--primary uppercase" onClick={this.onNavigate}>Back to Feedback Forms</button>
        </div>

        </div>
        
    );
  }
}


export default UserForms;