const router = require('express').Router();

const multer = require('multer');

const upload = multer({ dest: './uploads/file/' });

const {
	admin,
	addCourse,
	postCourse
} = require('../controllers/adminController');

router.route('/').get(admin);
router.route('/add-new-course').get(addCourse);
router.route('/add-new-course').post(upload.single('filename'),postCourse);

module.exports = router;