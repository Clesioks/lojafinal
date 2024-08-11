import express from 'express'
const router = express.Router()
import { authUser, 
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserByID,
    updateUser,
    createUser
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'



router.route('/').post(registerUser, protect, admin, createUser).get(protect, admin, getUsers)
router.post('/logout', logoutUser)
router.post('/auth', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserByID).put(protect, admin, updateUser)


 
export default router 