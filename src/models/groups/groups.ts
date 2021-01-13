// importing
import mongoose from 'mongoose';

// Creating schema for groups
const groupSchema = new mongoose.Schema({

    // adding user ids present in the group
    userIds: {
        userId: String,
        username: String
    },

    // adding messages present in the group
    messageIds: [{
        type: String
    }]

});

// Creating a model/Collection for groups
const Group = mongoose.model('Group', groupSchema);

// exporting
export { Group };