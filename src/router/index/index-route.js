"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing
var express_1 = __importDefault(require("express"));
// router config
var router = express_1.default.Router();
router.get('/', function (req, res) {
    try {
        res.json({
            message: 'Connection to server is successfull',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = router;
//# sourceMappingURL=index-route.js.map