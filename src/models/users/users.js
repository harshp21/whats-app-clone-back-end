"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// importing
var mongoose_1 = __importDefault(require("mongoose"));
var validator_service_1 = require("../../services/validator-service");
// creating instance of validator service
var validator = new validator_service_1.Validator();
// Creating Schema For User
var userSchema = new mongoose_1.default.Schema({
    // store email to identify user when login
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            }
        }
    },
    // store username
    username: {
        type: String,
        required: true
    },
    // store user's password
    password: {
        type: String,
        required: true
    },
    // store account activation code
    accountActivationCode: String,
    // store expiry time for account activation code
    accountActivationCodeExpiry: {
        type: Date,
        default: Date.now()
    },
    // check if registered account is activated or not
    isActive: {
        type: Boolean,
        default: false
    },
    // store reset password token
    resetPasswordToken: String,
    // store reset password token expiry time
    resetPasswordTokenExpiry: Number
});
//Create a model/Collection for user Schema
var User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=users.js.map