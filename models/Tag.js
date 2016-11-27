const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    ids: [String],
    name: String
}, {
    timestamps: true
});

/**
 * Method to add a user to the specified tag
 */
tagSchema.methods.addUser = function(userId) 
{
    this.ids.push(userId);
    this.save();
}

/**
 * Method to remove a user from the specified tag
 */
tagSchema.methods.removeUser = function(userId) 
{
    this.ids.remove(userId);
    this.save();
}

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
