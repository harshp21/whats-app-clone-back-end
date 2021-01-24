import express, { Request, Response, Router } from 'express';
import { Group, IGroup } from '../../models/groups/groups';
import { Message, IChatMessage } from '../../models/chatMessages/chatMessages';
import mongoose from 'mongoose';
import { authenticate } from '../../services/authentication-sevice';

// router config
const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        // fetch all the available groups
        const groups = await Group.find();
        if (groups.length > 0) {
            res.json({
                message: 'Entered group successfully',
                groups
            })
        } else {
            res.status(400).json({
                message: 'invalid group'
            })
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/group-messages/:groupId', authenticate, async (req: Request, res: Response) => {
    try {
        // find the group by group id 
        let group = await Group.findOne({ _id: mongoose.Types.ObjectId(req.params.groupId) });

        // fetch the messages for the group
        let messsageIds = group.messageIds.map(messageId => mongoose.Types.ObjectId(messageId));
        let messages: Array<IChatMessage> = await Message.find({ _id: { $in: messsageIds } });

        // if message exists send response essage
        if (messages) {
            res.json({
                message: 'group messages fetched',
                data: {
                    messages
                }
            })
        } else {
            res.status(400).json({
                message: 'unable to fetch the group messages'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'unable to fetch the group messages'
        })
    }
})

router.post('/group', authenticate, async (req: Request, res: Response) => {
    try {
        // Create a new group
        const group = new Group({
            groupName: req.body.groupName,
            messageIds: [],
        })
        let createdGroup = await group.save();
        res.json({
            message: 'Group created Successfully',
            data: {
                group: createdGroup
            }
        })
    } catch (err) {
        res.status(400).json({
            message: 'unable to create a group'
        })
    }
})

export default router;