import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  createGroup,
  getGroups,
  getGroupMessages,
  sendGroupMessage,
  leaveGroup,
} from '../controllers/group.controller.js';

const router = express.Router();

router.post('/', protectRoute, createGroup);
router.get('/', protectRoute, getGroups);
router.get('/:groupId/messages', protectRoute, getGroupMessages);
router.post('/:groupId/messages', protectRoute, sendGroupMessage);
router.post('/:groupId/leave', protectRoute, leaveGroup);

export default router;