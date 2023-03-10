const express = require('express')
const router = express.Router()
const {
    getCashflows,
    setCashflow,
    getCashflow,
    getCashflowByPage
} = require('../controllers/cashflowController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, getCashflows)
router.route('/set').post(protect, setCashflow)
router.route('/cashflow').post(protect, getCashflow)
router.route('/cashflow-page').post(protect, getCashflowByPage)

module.exports = router