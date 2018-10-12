const Forms = require('../../models/Forms');
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {

    /*Get all feedback forms*/
    app.get('/api/account/forms', (req, res, next) => {
        Forms.find()
            .then(forms => res.json(forms));
    });

    /* Get a form based on its formId */
    app.get('/api/account/forms/:formId', (req, res, next) => {
        Forms.findOne({formId:req.params.formId})
            .then(forms => res.json(forms));    
    });

    /* Get feedback forms of particular admin */
    app.get('/api/account/forms/:adminId', (req, res, next) => {
        Forms.find({adminId:req.params.adminId})
            .then(forms => res.json(forms));
    });
    
    /*Get a feedbackform by passing two parameters - adminId with id*/
    app.get('/api/account/forms/:adminId/:_id', (req, res, next) => {
        Forms.findOne({adminId:req.params.adminId, _id:req.params._id})
            .then(forms => res.json(forms));
    });

    /*Create feedback form by admin*/
    app.post('/api/account/forms', (req, res, next) => {
        const { body } = req;
        const {
            title,
            feedback,
            mobile,
            date,
            address,
            adminId,
            url,
            formId
        } = body;
        let { email } = body;

        if(!title){
            debugger
            return res.send({
                success: false,
                message: 'Error: Title cannot be blank'
            });
        }

        //Verify the form exists or not based on its title
        Forms.find({
            title: title,
        }, (err, doc) => {
            //console.log(doc)
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error : Server Error'
                    });
                } else if(doc != '' && doc[0].title.length > 0){
                    return res.send({
                        success: false,
                        message: 'Error: Feedback form already exist.'
                    });
                }

            //Create and Save new form
            const newForm = new Forms();
            const newUserSession = new UserSession();
            newForm.title = title;
            newForm.email = email;
            newForm.feedback = feedback;
            newForm.mobile = mobile;
            newForm.date = date;
            newForm.address = address;
            newForm.url = 'http://localhost:8080/api/account/forms/'+newUserSession._id;
            newForm.adminId = adminId;
            newForm.formId = newUserSession._id;
            newForm.save((err, doc)=>{
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error : Server Error'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Feedback form successfully created. url://localhost:8080/api/account/forms/'+newUserSession._id,
                    url: 'http://localhost:8080/api/account/forms/'+newUserSession._id
                });
            });
        });
    });

}