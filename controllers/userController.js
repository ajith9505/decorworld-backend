const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const createUser = expressAsyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields required' })
    }

    const isDuplicate = await User.findOne({ email: email }).lean().exec()

    console.log(isDuplicate);
    if (isDuplicate) {
        return res.status(409).json({ message: 'User already exist' })
    }

    const hashPassword = await bcrypt.hash(password, 12)

    const user = new User({
        username,
        email,
        password: hashPassword
    })

    await user.save()

    res.json({ message: `User ${user.username} was registerd successfully` })

})

const login = expressAsyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(401).json({ message: 'All Fields are required' })
    }

    const user = await User.findOne({ email: email }).lean().exec()

    if (!user) {
        return res.status(401).json({ message: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' })
    }

    const payload = {
        user: {
            id: user._id,
            name: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        }
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

    // const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ token })
})

// const refresh = expressAsyncHandler(async (req, res) => {
//     const cookies = req.cookies

//     if (!cookies.jwt) {
//         return res.status(401).json({ messge: 'Unauthorized' })
//     }

//     const refreshToken = cookies.jwt

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
//         expressAsyncHandler(async (error, decoded) => {
//             if (error) return res.status(403).json({ message: 'Forbidden' })

//             const email = decoded.email

//             const user = await User.findOne({ email: email }).lean().exec()

//             if (!email) return res.status(401).json({ message: 'Unauthorized' })

//             const payload = {
//                 user: {
//                     id: user._id,
//                     name: user.username,
//                     email: user.email,
//                     isAdmin: user.isAdmin
//                 }
//             }

//             const accessToken = jwt.sign(
//                 payload,
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: '10m' }

//             )

//             res.json({ accessToken })

//         })
//     )

// })

const logOut = expressAsyncHandler((req, res) => {
    const cookies = req.body

    if (cookies?.jwt) return res.status(201)

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })

    res.json({ message: 'Cookies cleard' })
})

const getAllUsers = expressAsyncHandler(async (req, res) => {
    console.log('hi');

    const users = await User.find({});    
    res.json(users);
});

const getCurrentUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});

const updateCurrentUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    console.log(user);
    

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUserById = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user");
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});

const getUserById = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserById = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = {
    createUser,
    login,
    logOut,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
}