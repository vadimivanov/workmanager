const express = require('express');

const auth = require('../auth');
const routerUtils = require('./router-utils');

const router = express.Router();

router.post('/secret', auth.authenticate(), (req, res) => {
  routerUtils.getBodyByContentType(req)
    .then(console.log);

  res.send(req.auth.user);
});

module.exports = router;
