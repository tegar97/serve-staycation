const router = require('express').Router();

const apiController = require('../controllers/apiController')
const {uploadSingle,uploadMultiple } = require('../middleware/multer')


router.get('/landing-page',apiController.landing_page)
router.get('/detail-page/:id',apiController.detailPage)
router.post('/booking-page/',uploadSingle,apiController.bookingPage)


module.exports = router