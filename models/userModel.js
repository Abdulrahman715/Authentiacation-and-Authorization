const mongoose = require('mongoose');

const validator = require('validator');

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
    password: {
        type: String,
        required: true,
        minlength: [8, "password must at least 8 characters"],
        validate: {
            validator: function(value) {
                return /[0-9]/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value);
            },
            message: "Password must contain at least one number and one special character"
        }
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
    }
});

// Remove `confirmPassword` field before saving to the database
userSchema.pre('save', function(next) {
    this.confirmPassword = undefined;
    next();
});

module.exports = mongoose.model('User', userSchema);