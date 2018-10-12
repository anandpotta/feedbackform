const Feedbacks = require('../../models/Feedbacks');
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {

    /*List of User Feedbacks*/
    app.get('/api/account/feedbacks', (req, res, next) => {
        //console.log(req);
        Feedbacks.find()
            .then(feedbacks => res.json(feedbacks));
    });

    /* Get feedbacks came to particular adminId 
    app.get('/api/account/feedbacks/:adminId', (req, res, next) => {
        Feedbacks.find({adminId:req.params.adminId})
            .then(feedbacks => res.json(feedbacks));
    });*/

    app.get('/api/account/feedbacks/:formId/:_id', (req, res, next) => {
        Feedbacks.findOne({formId:req.params.formId, _id:req.params._id})
            .then(feedbacks => res.json(feedbacks));
    });

    /* Get feedbacks came to particular formId */
    app.get('/api/account/feedbacks/:formId', (req, res, next) => {
        //console.log(req.params.formId);
        Feedbacks.find({formId:req.params.formId})
            .then(feedbacks => res.json(feedbacks));
    });


    /*Get a feedbackform by passing two parameters - adminId with id*/
    app.get('/api/account/feedbacks/:_id', (req, res, next) => {
        Feedbacks.findOne({_id:req.params._id})
            .then(feedbacks => res.json(feedbacks));
    });

    /*Get a feedbackform by passing two parameters - adminId with id*/
    app.get('/api/account/feedbacks/:adminId/:_id', (req, res, next) => {
        Feedbacks.findOne({adminId:req.params.adminId, _id:req.params._id})
            .then(feedbacks => res.json(feedbacks));
    });

        /*Create feedback form by admin*/
        app.post('/api/account/feedbacks', (req, res, next) => {
            const { body } = req;
            const {
                title,
                feedback,
                mobile,
                date,
                address,
                adminId,
                formId,
                url
            } = body;
            let { email } = body;
    
            if(!feedback){
                return res.send({
                    success: false,
                    message: 'Error: Feedback should not be blank'
                });
            }

            if(!email){
                return res.send({
                    success: false,
                    message: 'Error: Email should not be blank'
                });
            }
            if(!feedback){
                return res.send({
                    success: false,
                    message: 'Error: Feedback should not be blank'
                });
            }
            if(!mobile){
                return res.send({
                    success: false,
                    message: 'Error: Mobile number should not be blank'
                });
            }
            if(!date){
                return res.send({
                    success: false,
                    message: 'Error: Date should not be blank'
                });
            }
            if(!address){
                return res.send({
                    success: false,
                    message: 'Error: Address should not be blank'
                });
            }
    
            //Verify the form exists or not based on its title
            Feedbacks.find({
                email: email,
                formId: formId,
            }, (err, doc) => {
                //console.log(doc)
                    if(err){
                        return res.send({
                            success: false,
                            message: 'Error : Server Error'
                        });
                    } else if(doc != '' && doc[0].email.length && doc[0].formId.length> 0){
                        return res.send({
                            success: false,
                            message: 'Error: Your feedback already exists.'
                        });
                    }
    
                //Create and Save new feedback
                const newFeedback = new Feedbacks();
                newFeedback.title = title;
                newFeedback.email = email;
                newFeedback.feedback = feedback;
                newFeedback.mobile = mobile;
                newFeedback.date = date;
                newFeedback.address = address;
                newFeedback.adminId = adminId;
                newFeedback.formId = formId;
                newFeedback.save((err, doc)=>{
                    if(err){
                        return res.send({
                            success: false,
                            message: 'Error : Server Error'
                        });
                    }
    
                    return res.send({
                        success: true,
                        message: 'Feedback successfully submitted, Thank you for the Feedback.'
                    });
                });
            });
        })

}