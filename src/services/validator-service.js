"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var validator_1 = __importDefault(require("validator"));
var Validator = /** @class */ (function () {
    function Validator() {
    }
    Validator.prototype.isEmail = function (email) {
        return validator_1.default.isEmail(email);
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=validator-service.js.map