const User = require("./../models/userModal");
const Car = require('./../models/carModal'); // Assuming there's a carModel.js for car data
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
      const { username, password, confirmPassword, role } = req.body;
  
      // Check if password and confirmPassword match
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
  
      // Create a new user with hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, role });
  
      // Save the user
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(400).json({ error: 'Error registering user', details: error.message });
    }
  };
  

  exports.loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Log the hashed password and the input password for debugging (remove in production)
      console.log('Stored hashed password:', user.password);
      console.log('Input password:', password);
      const hashpassword = await bcrypt.hash(password, 10);
      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(hashpassword, user.password);
      console.log('Password match result:', isMatch);
      if (hashpassword === user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
     
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Set token as an HTTP-only cookie and send the response
      res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access
        maxAge: 3600000, // 1 hour
      });
  
      res.status(200).json({ message: 'Login successful', token });
      
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(400).json({ error: 'Error logging in' });
    }
  };
  

  exports.addCar = async (req, res) => {
    try {
      const { carName, manufacturingYear, price, imageUrl, websiteUrl, description } = req.body;
  
      // Ensure all required fields are present
      if (!carName || !manufacturingYear || !price || !imageUrl || !websiteUrl || !description) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create and save the new car instance
      const car = new Car({ carName, manufacturingYear, price, imageUrl, websiteUrl, description });
      await car.save();
      
      res.status(201).json({ message: 'Car added successfully' });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(400).json({ error: 'Error adding car', details: error.message });
    }
  };
  
  exports.updateCar = async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;
  
      // Update only the fields present in the request body
      const car = await Car.findByIdAndUpdate(id, updateFields, { new: true });
  
      if (!car) return res.status(404).json({ error: 'Car not found' });
  
      res.status(200).json({ message: 'Car updated successfully', car });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(400).json({ error: 'Error updating car', details: error.message });
    }
  };
  

exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting car' });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching cars' });
  }
};
exports.Welcome = async(req,res)=>{
    res.end('Welcome to Quadiro Technologies!');
}
// userController.js
exports.getCar = async (req, res) => {
  try {
    // Retrieve car by ID
    const car = await Car.findById(req.params.id);

    // Check if car was found
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Send the car data
    res.status(200).json(car);
  } catch (error) {
    // Handle and respond with a server error
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    // Fetch all cars
    const cars = await Car.find();
    
    // Count the total number of cars
    const carCount = await Car.countDocuments();

    // Return both the list of cars and the total count
    res.status(200).json({ cars, carCount });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching dashboard stats' });
  }
};

