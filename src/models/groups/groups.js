"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
// importing
var mongoose_1 = __importDefault(require("mongoose"));
// Creating schema for groups
var groupSchema = new mongoose_1.default.Schema({
    // adding user ids present in the group
    userIds: [{
            userId: String,
            username: String
        }],
    // adding messages present in the group
    messageIds: [{
            type: String,
            default: []
        }],
    groupName: String,
});
// Creating a model/Collection for groups
var Group = mongoose_1.default.model('Group', groupSchema);
exports.Group = Group;
//# sourceMappingURL=groups.js.map