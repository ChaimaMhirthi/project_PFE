
const router = require('express').Router();
const { createComment } = require('../controller/comment');

router.post('/comments',createComment);

module.exports = router;