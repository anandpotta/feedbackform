const Fields = require('../../models/Fields');
const Forms = require('../../models/Forms');

module.exports = (app) => {
    /*/api/account/fields*/
    app.get('/api/account/fields', (req, res, next) => {
        Fields.find()
            .then(fields => res.json(fields));
    }); 
}