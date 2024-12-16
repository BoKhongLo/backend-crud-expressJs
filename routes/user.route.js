const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth.middleware');
const user_controller = require('../controllers/user.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', user_controller.test);
router.post('/create', user_controller.user_create);
router.get('/getAll',verifyToken, user_controller.user_getAll);
router.get('/:id',verifyToken, user_controller.user_getById);
router.put('/:id/update',verifyToken, user_controller.user_update);
router.delete('/:id/delete',verifyToken, user_controller.user_delete);

module.exports = router;
