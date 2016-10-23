const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    github: String,
    instagram: String,
    linkedin: String,
    steam: String,
    tokens: Array,

    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String,
        tags: Array
    },

    following: [String]
}, {
    timestamps: true
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

/**
 * Helper method for following new user.
 */
userSchema.methods.followUser = function(userId) {
    const user = this;
    user.following.push(userId);
    user.save();
};

/**
 * Helper method to add username.
 */
userSchema.methods.addUsername = function(username) {
    this.username = username;
    this.save();
};

/**
 * Helper method for unfollowing existing user.
 */
userSchema.methods.unfollowUser = function(userId) {
    const user = this;
    user.following.remove(userId);
    user.save();
}

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function() {
    const size = 200;
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
