// userRoute.js
const express = require('express');
const { registerUser, loginUser, getAllCars, addCar, updateCar, deleteCar, getDashboardStats,Welcome,getCar } = require('./controllers/userController');
const { authenticateAdmin, authenticateUser } = require('./authMiddleware');

const router = express.Router();

// Admin routes
router.post('/admin/register', registerUser);
router.post('/admin/login', loginUser);
router.post('/admin/cars', authenticateAdmin, addCar);
router.patch('/admin/cars/:id',updateCar);
router.delete('/admin/cars/:id',deleteCar);
router.get('/admin/carDetail/:id',authenticateAdmin,getCar);
router.get('/admin/dashboard', getDashboardStats);
router.get('/',Welcome);
// User routes
router.post('/user/login',authenticateUser,loginUser);
router.get('/cars',getAllCars);
module.exports = router;
