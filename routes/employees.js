const express = require('express')

const router = express.Router()
const {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
  getEmployee,
} = require('../controllers/employees')

router.route('/').post(createEmployee).get(getAllEmployees)

router.route('/:id').get(getEmployee).delete(deleteEmployee).patch(updateEmployee)

module.exports = router
