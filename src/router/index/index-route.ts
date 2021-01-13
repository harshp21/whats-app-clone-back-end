// importing
import express, { Request, Response, Router } from 'express';

// router config
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    try {
        res.json({
            message: 'Connection to server is successfull',
        })
    } catch (err) {
        console.log(err);
    }
})

export default router;

