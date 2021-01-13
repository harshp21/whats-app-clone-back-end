"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing
var express_1 = __importDefault(require("express"));
var users_1 = require("../../models/users/users");
var bcrypt_1 = __importDefault(require("bcrypt"));
var validator_1 = __importDefault(require("validator"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mail_service_1 = require("../../services/mail-service");
// router config
var router = express_1.default.Router();
// handle user login 
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isUserAuthenticated, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, users_1.User.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, bcrypt_1.default.compare(req.body.password, user.password)];
            case 2:
                isUserAuthenticated = _a.sent();
                // if user authenticated create jwt token and sent to user.
                if (isUserAuthenticated) {
                    token = jsonwebtoken_1.default.sign({ userid: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
                    res.json({
                        message: 'User logged In',
                        token: token,
                        data: {
                            email: user.email
                        }
                    });
                }
                else {
                    res.json({
                        message: 'Provided credentials are wrong please verify',
                        data: user
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(400).json({
                    message: 'user not found'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// handle user register
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, salt, hashPassword, newUser, result, mailService, mailSubject, mailBody, mailTo, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4 /*yield*/, users_1.User.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 2];
                res.status(400).json({
                    message: "Email already registered"
                });
                return [3 /*break*/, 7];
            case 2:
                if (!!validator_1.default.isEmail(req.body.email)) return [3 /*break*/, 3];
                res.status(400).json({
                    message: 'Invalid  Email, please enter a valid email',
                });
                return [3 /*break*/, 7];
            case 3: return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 4:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(req.body.password, salt)];
            case 5:
                hashPassword = _a.sent();
                newUser = new users_1.User({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashPassword,
                    activationCode: 'random code',
                    activationCodeExpiry: Date.now() + 300000,
                    isActive: false
                });
                return [4 /*yield*/, newUser.save()];
            case 6:
                result = _a.sent();
                console.log(result);
                mailService = new mail_service_1.MailService();
                mailSubject = 'Account Activation for whats-app-clone';
                mailBody = "<div>\n                                <h4>\n                                 To activate the account please \n                                     <a href=\"http://localhost:3000/activate-account/" + result._id + "\">click here</a>\n                                </h4>\n                             </div>";
                mailTo = req.body.email;
                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);
                // send response message 
                res.json({
                    message: "User registered Successfully",
                    data: result
                });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(400).json({
                    message: "Unable to register user"
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=user-route.js.map