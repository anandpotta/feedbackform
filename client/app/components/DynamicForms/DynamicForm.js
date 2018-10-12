import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { ValidationError } from 'mongoose';

class DynamicForm extends React.Component {
    
    constructor(props){
        super(props)
      }

      onSubmit(e){
        e.preventDefault();
        if(this.props.onSubmit) this.props.onSubmit(this.state);
      }

      onChange(e, key){
        this.setState({
            [key]:this[key].value
        });
      }


      renderForm(){
        let model = this.props.model;
        //console.log(model)

        let formUI = model.map((m) => { 
            let key = m.key;
            let type = m.type;
            let value = m.value;
            let props = m.props || {};

            if(value != undefined){
                return(
                    <div key={key} className="form-group">
                        <label className="form-label"
                            key={"1" + key}
                            htmlFor={m.key}>
                                <input {...props}
                                    ref={(key)=>{this[m.key]=key}}
                                    className="form-input"
                                    key={"i"+m.key}
                                    value={m.value}
                                    readonly
                                />
                            <span>{m.label.toUpperCase()}</span>
                        </label>
                    </div>
                )
            }else{
                if(key === "feedback" || key === "address"){
                    return(
                        <div key={key} className="form-group">
                            <label className="form-label"
                                key={"1" + key}
                                htmlFor={m.key}>
                                    <textarea {...props}
                                        ref={(key)=>{this[m.key]=key}}
                                        className="form-textarea"
                                        type={type}
                                        key={"i"+m.key}
                                        maxLength="75"
                                        placeholder={m.key.toUpperCase()}
                                        onChange={(e) => {this.onChange(e, key)}}
                                    />
                                <span>{m.label.toUpperCase()}</span>
                            </label>
                        </div>
                    )
                }else{
                    return(
                        <div key={key} className="form-group">
                            <label className="form-label"
                                key={"1" + key}
                                htmlFor={m.key}>
                                    <input {...props}
                                        ref={(key)=>{this[m.key]=key}}
                                        className="form-input"
                                        type={type}
                                        key={"i"+m.key}
                                        placeholder={m.key.toUpperCase()}
                                        onChange={(e) => {this.onChange(e, key)}}
                                    />
                                <span>{m.label.toUpperCase()}</span>
                            </label>
                        </div>
                    )
                }
            }
        });
        return formUI;
      }

      render(){
        let title = this.props.title || "Dynamic Form"

        if(this.props.className === "userFeedback"){
            return(
                <div className={this.props.className}>
                  <h3>{title}</h3>
                  <form className="dynamic-form">
                      {this.renderForm()}
                  </form>
                </div>
            )
        }else{
            return(
                <div className={this.props.className}>
                  <h3>{title}</h3>
                  <form className="dynamic-form" onSubmit={(e) => {this.onSubmit(e)}}>
                      {this.renderForm()}
                      
                      <div className="form-group">
                          <button type="submit" className="btn btn--primary uppercase">Submit</button>
                      </div>
                  </form>
                </div>
            )
            
        }
      }

}

export default DynamicForm;