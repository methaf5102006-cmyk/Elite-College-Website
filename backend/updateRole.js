require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');

const emailToUpdate = 'liaqatfiza9@gmail.com';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await User.updateOne(
      { email: emailToUpdate },
      { $set: { role: 'superadmin' } }
    );

    console.log('Update result:', result);

    const updatedUser = await User.findOne({ email: emailToUpdate });
    console.log('Updated user:', updatedUser);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

run();