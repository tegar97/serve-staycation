const router = require('express').Router();
const adminController = require('../controllers/adminController')
const {uploadSingle,uploadMultiple } = require('../middleware/multer')
const auth = require('../middleware/auth')

router.get('/signin',adminController.viewLogin)
router.post('/signin',adminController.actionSignin)

router.get('/logout',adminController.actionLogout)
router.use(auth)
router.get('/dasboard',adminController.viewDasboard)


//Router category
router
     .route('/category')
     .get(adminController.viewCategory)
     .post(adminController.addCategory)
     .put(adminController.editCategory)

router
     .route('/category/:id')
     
     .delete(adminController.deleteCategory)
//end router category

//router bank 
router
     .route('/bank')
     .get(adminController.viewBank)
     .post(uploadSingle,adminController.addBank)
     .put(uploadSingle,adminController.editBank)
router
     .route('/bank/:id')
     .delete(adminController.deleteBank)

//end router bank

     // .delete(adminController.deleteCategory)
// router.delete('/category/:id',adminController.deleteCategory)
// router.get('/category',adminController.viewCategory)
// router.post('/category',adminController.addCategory)



router.get('/item',adminController.viewItem)
router.post('/item',uploadMultiple,adminController.addItem)
router.get('/item/show-image/:id',adminController.showImageItem)
router.get('/item/:id',adminController.showEditItem)
router.put('/item/:id',uploadMultiple,adminController.editItem)
router.delete('/item/:id',adminController.deleteItem)
router.get('/item/show-detail-item/:itemId',adminController.viewDetailItem)
//feature
router.post('/item/add/feature',uploadSingle,adminController.addFeature)
router.put('/item/update/feature',uploadSingle,adminController.editFeature)
router.delete('/item/:itemId/feature/:id',adminController.deleteFeature)



router.post('/item/add/activity',uploadSingle,adminController.addActivity)
router.put('/item/update/activity',uploadSingle,adminController.editActivity)
router.delete('/item/:itemId/activity/:id',adminController.deleteActivity)

router.get('/booking',adminController.viewbooking)
router.get('/booking/:id',adminController.showDetailBooking)
router.put('/booking/:id/confirmation',adminController.actionConfirmation)
router.put('/booking/:id/reject',adminController.actionReject)

module.exports = router