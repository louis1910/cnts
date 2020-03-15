const router = require('express').Router();

const {
	admin,
	addDocs
} = require('../controllers/adminController');

router.route('/').get(admin);
router.route('/add-document').get(addDocs);

module.exports = router;