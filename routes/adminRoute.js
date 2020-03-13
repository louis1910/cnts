const router = require('express').Router();

const {
	addDocs
} = require('../controllers/adminController');

router.route('/').get(addDocs);

module.exports = router;