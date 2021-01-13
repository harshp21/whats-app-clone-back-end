"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// importing
var mongoose_1 = __importDefault(require("mongoose"));
// Creating Schema For User
var userSchema = new mongoose_1.default.Schema({
    // store email to identify user when login
    email: {
        type: String,
        required: true
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
    activationCode: String,
    // store expiry time for account activation code
    activationCodeExpiry: {
        type: Date,
        default: Date.now()
    },
    // check if registered account is activated or not
    isActive: Boolean
});
//Create a model/Collection for user Schema
var User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=users.js.map