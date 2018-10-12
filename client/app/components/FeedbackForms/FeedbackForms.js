import React, { Component } from 'react';
import DynamicForm from '../../components/DynamicForms/DynamicForm';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { FormsList } from '../FormsList/FormsList';
import { UserForms } from '../UserForms/UserForms';
import 'whatwg-fetch';

class FeedbackForms extends React.Component {

  constructor(){
    super()
    this.state = {
      forms : [],
      feedbacks: [],
      userFeedback: [],
      isLoading: false,
      hideTable: true,
      condition:false,
      hideTable2: true,
      condition2:false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleFeedbackClick = this.handleFeedbackClick.bind(this);
  }
  
  componentDidMount() {
    this.setState({ isLoading: true });
    fetch('/api/account/forms')
    .then(res => res.json())
    .then(json => {
      this.setState({
        forms:json,
        isLoading:false
      });
    });
  }


  handleClick(e, index) {
    //console.log(e);
    //console.log(this.props.history)
    //<Redirect to='/UserForms' />
    //this.props.history.push('/UserForms')
    var url = e.target.innerText;
    var n = url.lastIndexOf('/');
    var rowId = url.substring(n + 1);

    fetch('/api/account/feedbacks/' + rowId)
      .then(res => res.json())
      .then(json => {
        if(json.length){
          //setInStorage('Mern_App', { token: json.token });
          document.getElementById('feedbacks').style.display = 'block';
          document.getElementById('fbForms').style.display = 'none';
          document.getElementById('userFeedbackDetails').style.display = 'none';
          //userFeedbackDetails
          this.setState({
            feedbacks:json,
            isLoading:false,
            hideTable: false,
            condition : !this.state.condition
          });
        } else{
          this.setState({
            feedbacks:json,
            isLoading:false,
            hideTable: true
          });
        }
      });
  }

  handleFeedbackClick(e){
    //this.props.history.push('/UserFeedbacks')
    //console.log(e)
    //document.getElementById('fbForms').hide();
    const formid = e.currentTarget.getAttribute('data-formid');
    const id = e.currentTarget.getAttribute('data-id');

    fetch('/api/account/feedbacks/' + formid + '/' + id)
      .then(res => res.json())
      .then(json => {
        if(json != null){
          //setInStorage('Mern_App', { token: json.token });
          //document.getElementById('userFeedbackDetails').style.display = 'block';
          document.getElementById('feedbacks').style.display = 'none';
          document.getElementById('userFeedbackDetails').style.display = 'block';
          this.setState({
            userFeedback:json,
            isLoading:false,
            hideTable2: false,
            condition2 : !this.state.condition
          });
        } else{
          this.setState({
            userFeedback:json,
            isLoading:false,
            hideTable2: true
          });
        }
      });
  }

  onNavigate(){
    document.getElementById('feedbacks').style.display = 'none';
    document.getElementById('userFeedbackDetails').style.display = 'none';
    document.getElementById('fbForms').style.display = 'block';
  }

  onToUserFeedback(){
    document.getElementById('fbForms').style.display = 'none';
    document.getElementById('feedbacks').style.display = 'block';
    document.getElementById('userFeedbackDetails').style.display = 'none';
  }

  render() {
    const table1Hide = this.state.hideTable ? { display: 'none'} : { display: 'block'};
    const table2Hide = this.state.hideTable2 ? { display: 'none'} : { display: 'block'};

    const { forms, isLoading, feedbacks, userFeedback, data } = this.state;

    let jsonBody = [];
    let formTitle;
    for (const [key, value] of Object.entries(userFeedback)) {
        if(key == "title"){
          formTitle = value;
        }
        jsonBody.push({ key: key, label: key, type: key, value: value });
        //console.log(jsonBody);
    }


    //console.log(this.state)
    //console.log(forms)
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    const formTabel = forms.map((d, index) => <tr className="clickStyle" onClick={(e) => {this.handleClick(e)}} key={index}>
                                               <td className="idInfo">{index+1}</td><td>{d.title}</td><td>{d.url}</td>
                                              </tr>);
    
    const feedbackTable = feedbacks.map((d, index) => <tr data-formid={d.formId} data-id={d._id} onClick={(e) => {this.handleFeedbackClick(e)}} key={index}>
                                                        <td>{d.email}</td><td>{d.date}</td><td className="hide">{d._Id}</td>
                                                      </tr>);

    //const userFeedbackDetails = userFeedback.title
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
              <table className="dataGrid"><tbody>{formTabel}</tbody></table>
            </div>
        </div>

        <div className={this.state.condition ? "tableContainer" :""} style={table1Hide} id="feedbacks" >
          <h1>User Feedbacks to this FeedbackForm</h1>
          <div className="tbl-header">
            <table cellSpacing='0' cellPadding='0'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Record Date</th>
                  <th className="hide">feedbackId</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content">
            <table className="dataGrid" cellSpacing='0' cellPadding='0'><tbody>{feedbackTable}</tbody></table>
          </div>
          <br />
          <button className="btn btn--primary uppercase" onClick={this.onNavigate}>Back to Feedback Forms</button>
        </div>

        <div className={this.state.condition2 ? "" :""} style={table2Hide} id="userFeedbackDetails">
          <DynamicForm
            className="userFeedback"
            title={formTitle}
            model={result}
            onSubmit={(model) => {this.onSubmit(model)}}
          />
          <button className="btn btn--primary uppercase" onClick={this.onToUserFeedback}>Back to User Feedbacks</button>
        </div>


        </div>
        /*<div>No feedsback forms are created.</div>*/
    );
  }
}


export default FeedbackForms;