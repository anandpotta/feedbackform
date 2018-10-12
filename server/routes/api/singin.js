const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
    /*/api/userinfo/singup*/
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        const {
            password
        } = body;
        let { email } = body;
        if(!email){
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank'
            });
        }
        if(!password){
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank'
            });
        }

        email = email.toLowerCase();

        // Steps
        // 1. Verify email doesn't exists through the JSON Web Token (JWT)
        // 2. Save

        //Verify the email
        User.find({
            email: email
        }, (err, previousUsers) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error : Server Error'
                });
            } else if(previousUsers.length > 0){
                return res.send({
                    success: false,
                    message: 'Error: Account already exist.'
                });
            }

            //Save the new user
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user)=>{
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error : Server Error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed up'
                });
            });
        });
    });

    /*/api/userinfo/singin*/
    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const {
            password
        } = body;
        let { email } = body;

        if(!email){
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank'
            });
        }
        if(!password){
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank'
            });
        }

        email = email.toLowerCase();

        User.find({
            email: email
        }, (err, users)  => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error : Server Error'
                });
            }
            if(users.length != 1){
                return res.send({
                    success: false,
                    message: 'Error : Invalid'
                });
            }

            const user = users[0];
            if(!user.validPassword(password)){
                return res.send({
                    success: false,
                    message: 'Error : Invalid Password'
                });
            }

            //Otherwise correct user
            const newUserSession = new UserSession();
            newUserSession.userId = user._id;
            newUserSession.save((err, doc) => {
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error : Server Error'
                    });
                }
                
                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc._id,
                    adminId: newUserSession.userId
                });
            });

        } );

    });

    // verify user by token
    app.get('/api/account/verify', (req, res, next) => {
        // Get the Token
        const { query } = req;
        const { token } = query;

        // ?token = test

        //verify the token is one of a kind and it's not deleted
        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, session) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            if(session.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }else {
                return res.send({
                    success: true,
                    message: 'Good'
                })
            }
        });
    });
    

    // logout
    app.get('/api/account/logout', (req, res, next) => {
        // Get the Token
        const { query } = req;
        const { token } = query;

        // ?token = test

        //verify the token is one of a kind and it's not deleted
        //findOneAndUpdate, findOneAndReplace, findOneAndRemove, findIDAndRemove are mangoose queries of collection db
        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false
        }, {
            $set:
            {
                isDeleted:true
            }
        }, null, (err, session) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            return res.send({
                success: true,
                message: 'Good'
            });
        });
    });

}