const userController = require('../controllers/userController')
const router = require('express').Router()
const { authenticate, authorizeAdmin } = require('../middleware/verifyJWT')

router.route('/')
    .post(userController.createUser)
    .get(authenticate, authorizeAdmin, userController.getAllUsers);

router.post('/auth', userController.login);

router.post('/logout', userController.logOut)

// router.get('/refresh', userController.refresh)

router
    .route("/profile")
    .get(authenticate, userController.getCurrentUserProfile)
    .put(authenticate, userController.updateCurrentUserProfile);

// ADMIN ROUTES 👇
router
    .route("/:id")
    .delete(authenticate, authorizeAdmin, userController.deleteUserById)
    .get(authenticate, authorizeAdmin, userController.getUserById)
    .put(authenticate, authorizeAdmin, userController.updateUserById);


module.exports = router