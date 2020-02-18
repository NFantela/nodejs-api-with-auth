const router = require('express').Router();
const controller = require('./userController');
const auth = require('../../auth/auth');

const authMiddleware = [auth.decodeToken(), auth.getFreshUser()];

// lock down the right routes :)
router.param('id', controller.params);

router.route('/')
  .get( controller.get)
  .post(controller.post)

router.route('/:id')
  .get(controller.getOne)
  .put(authMiddleware, controller.put)
  .delete(authMiddleware, controller.delete)

module.exports = router;