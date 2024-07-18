const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');
const userRoles = require('../utils/userRoles');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        validate: [validator.isAlpha, 'Name must only contain characters']
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email must be unique"],
        validate: [validator.isEmail, "field must be contain a valid email"]
    },
    photo: {
        type: String,
        default:"https://res.cloudinary.com/duwfy7ale/image/upload/v1718038506/g3cp7vyymsh7rt5rsyg7.jpg"
    },
    role: {
        type: String,
        enum: [userRoles.User, userRoles.ADMIN, userRoles.MANAGER],
        default: userRoles.USER
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "password must at least 8 characters"],
        validate: {
            validator: function(value) {
                return /[0-9]/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value);
            },
            message: "Password must contain at least one number and one special character"
        },
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,

        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: "Passwords must match"
        }
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// Remove `confirmPassword` field before saving to the database
userSchema.pre('save',async function (next) {
    // only run this function if password was actually modified
    if (!this.isModified('password'))
    {
        return next();
    }

    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    

    //Delete password confirm field
    this.confirmPassword = undefined;
    next();
});

// in login to ensure the password user enters is correct

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.createPasswordResetToken = function () {
    
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 50 * 1000;

    return resetToken;
};

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    // if the password changed or modified
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    
    this.find({
        active: { $ne: false }
    });

    next();
});

module.exports = mongoose.model('User', userSchema);