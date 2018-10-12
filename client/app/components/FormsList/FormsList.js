import React, { Component } from 'react';
import 'whatwg-fetch';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { FeedbackForms } from '../FeedbackForms/FeedbackForms';
import { UserForms } from '../UserForms/UserForms';

import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class FormsList extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      fields : [],
      isLoading: false,
      newTitle: '',
      mFields: [],
      formUpdateError: '',
      token: '',
      adminId:'',
      hideMessage: false
    }
    //console.log(this)

    this.addToManditoryFields = this.addToManditoryFields.bind(this);
    this.createForm = this.createForm.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);

    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('Mern_App');
    //console.log(obj)
    this.setState({ isLoading: true });
    fetch('/api/account/fields')
    .then(res => res.json())
    .then(json => {
      //console.log(json);
      this.setState({
        fields:json[0].fields,
        isLoading:false
      });
    });
  }

  addToManditoryFields(e){
    let newElemKey = e.target.getAttribute('data-key');
    let newElemVal = e.target.getAttribute('data-value');

    let a = this.state.mFields;
    let index = a.findIndex(x => x.id==newElemKey)

    // here you can check specific property for an object whether it exist in your array or not
    if (index === -1){
      this.state.mFields.push({'id':newElemKey, 'name':newElemVal});
    }
    else {
      this.deleteField(e)
      /*for (let i =0; i < this.state.mFields.length; i++)
      if (this.state.mFields[i].id === newElemKey) {
        this.state.mFields.splice(i,1);
         break;
      }*/
    }
    this.forceUpdate();
  }

  onTitleChange(event){
    let key = event.target.value;
    if(key.length <= 36){
      this.setState({
        newTitle: event.target.value,
      });
    }
  }

  createForm(e){
    const obj = getFromStorage('Mern_App');
    //console.log(obj)
    const {
      newTitle
    } = this.state

    //let jsonBody = [];
    let jsonBody = {};

    let newArray = Array.from(document.querySelectorAll('.listItems>ul>span>li'),li => (li.textContent));
    newArray.unshift('title');
    
    //document.querySelector('.listItems>ul>span>li>').setAttribute("contentEditable", true)
    
    Array.from(newArray).forEach(function(el, index, newArray) {
     //console.log(el, index, newArray);
      if(index == 0){
        jsonBody[el] = newTitle;
        //jsonBody.push({"id":index+1, [el]:newTitle});
      }else{
        jsonBody[el] = "";
        //jsonBody.push({"id":index+1, [el]:""});
      }
      //jsonBody = {'id':index+1, 'formID': 123, 'title':newTitle, 'email':'', 'feedback':'' }
      //jsonBody.push({el:""})
      //let i = newArray[index];
      //jsonBody.push({"id":index+1, [el]:el});
      console.log(jsonBody);
      //const obj = getFromStorage('Mern_App');
      //console.log(obj)
    });

    //Post request to backend
    fetch('/api/account/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonBody),
     })
     .then(res => res.json())
     .then(json => {
      if(json.success){
        //setInStorage('Mern_App', { token: json.token });
        this.setState({
          formUpdateError: json.message,
          isLoading: false,
          newTitle:'',
          hideMessage: false
        });
      } else{
        this.setState({
          formUpdateError: json.message,
          isLoading: false,
          hideMessage: false
        });
      }
    });
    
  }

  deleteField(e){
    let newElemKey = e.target.getAttribute('data-key');
    for (let i =0; i < this.state.mFields.length; i++)
      if (this.state.mFields[i].id === newElemKey) {
        this.state.mFields.splice(i,1);
         break;
      }
      this.forceUpdate();
  }

  onClose(){
    this.setState({hideMessage: true})
  }

  render() {

    const style = this.state.hideMessage ? { display: 'none'} : { display: 'block'};

    const { fields, isLoading, formUpdateError, newTitle } = this.state;
    
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    let fieldsList = fields.slice(3,6);
    const listItems = fieldsList.map((d) => <li onClick={this.addToManditoryFields} className="btn btn--primary uppercase" data-key={d.id} data-value={d.name} key={d.id}>{d.name}</li>);
    
    let mFieldsLi = fields.slice(1,3);
    const manditoryList = mFieldsLi.map((d) => <span><li className="btn btn--primary btn--inside" key={d.id}>{d.name}</li></span>);
    
    
    const mFieldsList = this.state.mFields.map((d) => <span><li className="btn btn--primary btn--inside" key={d.id}>{d.name}</li><i onClick={this.deleteField} data-key={d.id} className="btn btn--outside">Delete</i></span>);
  
    //console.log(fields.filter((d) => { return d.name === 'title'; }))
    let titleField = fields.filter((d) => { return d.name === 'title'; });
    //const title = titleField.map((d) => <span><li><input className="btn btn--primary btn--inside" placeholder={d.name} data-key={d.id} data-value={d.name} /></li></span>);
    //const title = titleField.map((d) => <span><li className="btn btn--primary btn--inside" contenteditable="true" data-key={d.id} data-value={d.name} key={d.id}>{d.name}</li></span>);
    const title = titleField.map((d) => <input type="title" placeholder="Title" value={newTitle} onChange={this.onTitleChange} className="btn btn--primary btn--inside formTitle" contenteditable="true" data-key={d.id} data-value={d.name} key={d.id} />);

    return (
      <div className="container formsList">
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
          (formUpdateError) ? (
            <p className="errorMessage" style={style}>{formUpdateError}<a id="close" onClick={this.onClose}>(X)</a></p>
          ) : null
        }

        <ul className="fieldsRequired">{listItems}</ul>

        <div className="listItems">
          <ul className="fieldsRequired">
            {title}
            {manditoryList}
            {mFieldsList}
          </ul>
  
        </div>
        <button onClick={this.createForm} className="btn btn--primary uppercase">CREATE</button>
      </div>

    );
  }
}

export default FormsList;