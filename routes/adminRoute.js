const router = require('express').Router();

const {
	admin,
	addCourse,
	postCourse
} = require('../controllers/adminController');

router.route('/').get(admin);
router.route('/add-new-course').get(addCourse);
router.route('/add-new-course').post(postCourse);

module.exports = router;