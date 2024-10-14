const mongoose = require('mongoose');
const schemaName = new mongoose.Schema({
    sample_string: {
        type: String
    },
    sample_date: {
        type: Date
    },
}, {timestamps: true})

//YOU CAN ADD MIDDLEWARE UNDER HERE

const Schema = mongoose.model('Model_Name', schemaName);
module.exports = Schema;