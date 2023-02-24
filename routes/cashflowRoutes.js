const express = require('express')
const router = express.Router()
const {
    getCashflows,
    setCashflow,
    getCashflow
} = require('../controllers/cashflowController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, getCashflows)
router.route('/set').post(protect, setCashflow)
router.route('/cashflow').post(protect, getCashflow)

module.exports = router