const Employee = require('../models/Employee')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ employees, count: employees.length })
}
const getEmployee = async (req, res) => {
  const {
    user: { userId },
    params: { id: employeeId },
  } = req

  const employee = await Employee.findOne({
    _id: employeeId,
    createdBy: userId,
  })
  if (!employee) {
    throw new NotFoundError(`No employee with id ${employeeId}`)
  }
  res.status(StatusCodes.OK).json({ employee })
}

const createEmployee = async (req, res) => {
  req.body.createdBy = req.user.userId
  const employee = await Employee.create(req.body)
  res.status(StatusCodes.CREATED).json({ employee })
}

const updateEmployee = async (req, res) => {
  const {
    body: { name, company, position },
    user: { userId },
    params: { id: employeeId },
  } = req

  if (name === '' || company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const employee = await Employee.findByIdAndUpdate(
    { _id: employeeId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!employee) {
    throw new NotFoundError(`No employee with id ${employeeId}`)
  }
  res.status(StatusCodes.OK).json({ employee })
}

const deleteEmployee = async (req, res) => {
  const {
    user: { userId },
    params: { id: employeeId },
  } = req

  const employee = await Employee.findByIdAndRemove({
    _id: employeeId,
    createdBy: userId,
  })
  if (!employee) {
    throw new NotFoundError(`No employee with id ${employeeId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
  getEmployee,
}
