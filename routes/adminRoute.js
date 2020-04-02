const router = require('express').Router();

const shortid = require("shortid");

// let storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, './uploads')
// 		},
// 	filename: function (req, file, cb) {
// 		    let extArray = file.mimetype.split("/");
// 		    let extension = extArray[extArray.length - 1];
// 		    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
// 		}
// })

const path = require('path');
const multer = require('multer');
const crypto = require('crypto');


var storage = multer.diskStorage({
  destination: './uploads/file',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })



const {
	admin,
	addCourse,
	postCourse,
	getFile,
  member,
  inventory,
  addDocument,
  adv,
  feedback,
  settings
} = require('../controllers/adminController');

router.route('/').get(admin);
router.route('/add-new-course').get(addCourse);
router.route('/add-new-course').post(upload.single('filename'),postCourse);
// router.route('/getfile').get(getFile);
router.route('/member').get(member);
router.route('/inventory').get(inventory);
router.route('/add-new-document').get(addDocument);
router.route('/adv').get(adv);
router.route('/feedback').get(feedback);
router.route('/settings').get(settings);

module.exports = router;

module.exports = router;