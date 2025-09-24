const express = require('express');
const {
  signup,
  dashboard,
  loginUser,
  updateProfile,
  deleteProfile,
  getAllCustomers,
  googleAuth,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const route = express.Router();




route.post('/', loginUser);
route.post('/register', signup);
route.post('/google-auth', googleAuth);
route.get('/profile', protect, dashboard);
route.put('/profile', protect, updateProfile);
 
route.get('/all', getAllCustomers); 


route.delete('/delete', deleteProfile); 
module.exports = route;
