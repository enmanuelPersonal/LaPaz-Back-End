const path = require('path');
const multer = require('multer');
const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.use(
  multer({
    dest: path.join(__dirname, '../../../public/uploads'),
  }).single('image')
);

router.post('/', handler.addImg);

module.exports = router;
