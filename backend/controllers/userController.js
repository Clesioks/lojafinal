import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";


//@desc Auth user & get token
//@route POST /api/users/login
//@access Public

const authUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })
    if (user && (await user.matchPassword(password))) {

      generateToken(res, user._id)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(401)
        throw new Error('Email ou senha inválidos')
    }
})

//@desc Auth user & get token
//@route POST /api/users/users
//@access Public

const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('Usuário já existe.')
    } 

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400)
        throw new Error('Dados de usuário inválidos')
    }

})

//@desc Logout user / clear cookie
//@route POST /api/users/logout
//@access Private

const logoutUser = asyncHandler (async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'Logout efetuado com sucesso!' })
})

//@desc GET user profile
//@route GET /api/users/profile
//@access Private

const getUserProfile = asyncHandler (async (req, res) => {
    
    const user = await User.findById(req.user._id)

    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }


})

//@desc Update user profile
//@route PUT /api/users/profile
//@access Private

const updateUserProfile = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password
        }

        const updateUser = await user.save()

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }
})

//@desc Get users
//@route GET /api/users
//@access Private/Admin

const getUsers = asyncHandler (async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})

//@desc Get user by ID
//@route GET /api/users/:id
//@access Private/Admin

const getUserByID = asyncHandler (async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }
})

//@desc Delete users
//@route DELETE /api/users/:id
//@access Private/Admin

const deleteUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        if (user.isAdmin) {
            res.status(400)
            throw new Error('Não pode deletar usuário admin')
        }
        await User.deleteOne({_id: user._id})
        res.status(200).json({ message: 'Usuário deletado com sucesso'})
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }
})

//@desc Update user
//@route PUT /api/users/:id
//@access Private/Admin

const updateUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)

        const updateUser = await user.save()

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        }) 
    } else {
        res.status(404)
        throw new Error('Usuário não encontrado')
    }
})

//@desc Create users
//@route POST /api/users
//@access Private/Admin

const createUser = asyncHandler (async (req, res) => {
    
  try {
    const user = new User({        
        name: 'Usuário Modelo',
        email: 'seuEmail@email.com',
        password: "123456",
        isAdmin: false
    })
    const createUser = await user.save()
    res.status(201).json(createUser)
  } catch (error) {
    res.status(500).json(error)
  }})



export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserByID,
    updateUser,
    createUser
}