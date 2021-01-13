// importing
import express, { Request, Response, Router } from 'express';
import { User, IUser } from '../../models/users/users';
import bycrypt from 'bcrypt';
import { Validator } from '../../services/validator-service';
import jwt from 'jsonwebtoken';
import { MailService } from '../../services/mail-service';
import crypto from 'crypto';

// router config
const router: Router = express.Router();

// creating instance of validator service
const validator = new Validator();

// handle user login 
router.post('/login', async (req: Request, res: Response) => {
    try {

        // find user exists and compare password to authenticate the user
        let user: IUser = await User.findOne({ email: req.body.email });
        let isUserAuthenticated: boolean = await bycrypt.compare(req.body.password, user.password);

        // if user authenticated create jwt token and sent to user.
        if (isUserAuthenticated) {
            let token: string = jwt.sign({ userid: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
            res.json({
                message: 'User logged In',
                token,
                data: {
                    email: user.email
                }
            })
        } else {
            res.json({
                message: 'Provided credentials are wrong please verify',
                data: user
            })
        }
    } catch (err) {
        res.status(400).json({
            message: 'user not found'
        })
    }
})

// handle user register
router.post('/register', async (req: Request, res: Response) => {
    try {

        // find is user exists with the help of email and handle accordingly 
        let user: IUser = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({
                message: "Email already registered"
            });
        } else if (!validator.isEmail(req.body.email)) {
            res.status(400).json({
                message: 'Invalid  Email, please enter a valid email',
            })
        } else {
            // hash the password send by the user 
            let salt = await bycrypt.genSalt(10);
            let hashPassword = await bycrypt.hash(req.body.password, salt);

            // create a random string for activation code
            let activationCode = await crypto.randomBytes(32).toString('hex');

            // insert the user in the db
            const newUser: IUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashPassword,
                accountActivationCode: activationCode,
                accountActivationCodeExpiry: Date.now() + 300000,
            })
            const result = await newUser.save();
            console.log(result);

            // Set value to send for account activation
            const mailService = new MailService();
            const mailSubject = 'Account Activation for whats-app-clone';
            const mailBody = `<div>
                                <h4>
                                 To activate the account please 
                                     <a href="http://localhost:3000/activate-account/${activationCode}">click here</a>
                                </h4>
                             </div>`;

            const mailTo = req.body.email;

            // send mail for account activation
            mailService.sendMail(mailSubject, mailBody, mailTo);

            // send response message 
            res.json({
                message: "User registered Successfully",
                data: result
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Unable to register user"
        })
    }
})


// verfiy account activation code and acivate the account and send jwt token
router.get('/activate-account/:activationCode', async (req: Request, res: Response) => {
    try {
        // find user if activation code is valid 
        let user = await User.findOne({ $and: [{ accountActivationCode: req.params.activationCode }, { accountActivationCodeExpiry: { $gt: Date.now() } }] });

        // if activation code is valid generate the jwt token and send it to client
        if (user) {
            user.isActive = true;
            await user.save();

            // redirect to the ui for login with success message
        } else {
            // redirect to the ui with error message
        }

    } catch (err) {
        console.log(err);
    }
})


export default router;