// importing
import express, { Next } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './router/user/user-route';
import indexRoute from './router/index/index-route';
import groupRoute from './router/group/group-route';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { Message, IChatMessage } from './models/chatMessages/chatMessages';
import { Group } from './models/groups/groups';

// app config
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.REQUEST_ORIGIN
}))

// router
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/groups', groupRoute);

// db config
const connectionUrl = process.env.MONGODB_CONNECTION_URL;
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Successfully connected to mongodb")).catch(err => console.log("mongo error", err));


// app listen
const server = app.listen(port, () => console.log(`listening on port : ${port}`));

// registering a socket for server
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.REQUEST_ORIGIN,
        methods: ["GET", "POST"]
    }
});

let users = [];
let groupUsers = [];

// socket connection 
io.use(async (socket, next: Next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.ACCESS_TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {
    console.log('connect');

    socket.on('joinGroup', (groupId: string) => {
        socket.join(groupId);
        console.log('group');

        socket.to(groupId).on('chat-message', async (msg: string) => {
            try {
                if (msg) {
                    const chatMessage: IChatMessage = new Message({
                        userId: socket.decoded.userid,
                        username: socket.decoded.username,
                        message: msg,
                        timeStamp: new Date(),
                    })
                    const message: IChatMessage = await chatMessage.save();
                    await Group.updateOne({ _id: mongoose.Types.ObjectId(groupId) }, { $push: { messageIds: message._id } })
                    const data = {
                        _id: message._id,
                        message: msg,
                        username: socket.decoded.username,
                        timestamp: message.timestamp,
                        userId: message.userId
                    };

                    socket.broadcast.to(groupId).emit("chat-messages", data);
                }
            } catch (err) {
                console.log(err);
            }

            socket.on('disconnect', () => {
                removeUsersFromGroup();
            })
        })


        if (groupId !== null) {

            const isGroupAvailable = groupUsers.some((group) => group.groupId === groupId);
            if (isGroupAvailable) {
                const groups = groupUsers.map((group) => {
                    if (group.groupId === groupId) {
                        const isUserAlreadyJoined = group.users.some(user => user.id === socket.decoded.userid);
                        !isUserAlreadyJoined && group.users.push({ id: socket.decoded.userid, username: socket.decoded.username });
                        return group;
                    } else {
                        return group;
                    }
                });
                io.emit('room-users', groups);
            } else {
                users.push({ id: socket.decoded.userid, username: socket.decoded.username });
                const data = {
                    groupId,
                    users
                }
                groupUsers.push(data);
                console.log('emitted');
                io.emit('room-users', groupUsers);
            }
        }
    })

    socket.on('leaveAllGroup', () => {
        removeUsersFromGroup();
        io.emit('room-users', groupUsers);

    })

    socket.on('disconnect', () => {
        removeUsersFromGroup();
        io.emit('room-users', groupUsers);
    })

    const removeUsersFromGroup = () => {
        users = [];
        groupUsers = groupUsers.map((group) => {
            const isUser = group.users.some((user) => user.id === socket.decoded.userid);
            isUser && socket.leave(group.groupId);
            group.users = group.users.filter((user) => user.id !== socket.decoded.userid);
            return group;
        })
    }

})

