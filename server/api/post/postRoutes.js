const router = require('express').Router();
const controller = require('./postController');
const auth = require('../../auth/auth');

const authMiddleware = [auth.decodeToken(), auth.getFreshUser()];

router.param('id', controller.params);

router.route('/')
  .get(controller.get)
  .post(authMiddleware, auth.isAdmin, controller.post)

router.route('/:id')
  .get(controller.getOne)
  .put(authMiddleware, controller.put)
  .delete(authMiddleware, controller.delete)

module.exports = router;