const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const model = require('../models');
const { User, Followers } = model;
var bcrypt = require('bcryptjs');

// @desc    Register a new user in DB and return data for userInfo
// @route   POST /api/users
// @access
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      res.status(401).json({
        message: 'A user with this email already exists!',
      });
      throw new Error('A user with this email already exists!');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      hash,
      first_name,
      last_name,
    });

    res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (e) {
    // Any error caught here is a ValidationErrorItem for incorrect email fields
    res.status(500).send({
      message: 'Please enter a valid email!',
    });
  }
});

// @desc    Log user in (match credentials and return session data for userInfo in localstorage)
// @route   POST /api/users/login
// @access
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (user) {
    const validPwd = await bcrypt.compare(password, user.hash);
    if (validPwd) {
      res.json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    } else {
      // return Promise.reject('Invalid password!');
      res.status(401).json({ message: 'Invalid password!' });
      throw new Error('Invalid password!');
    }
  } else {
    res.status(401).json({
      message:
        'There is no account associated with this email, please register!',
    });
    throw new Error(
      'There is no account associated with this email, please register!'
    );
  }
});

// @desc    Update a User Profile
// @route   PUT /api/users/edit
const editUserProfile = asyncHandler(async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    currentPassword,
    newPassword,
  } = req.body;
  const user = await User.findByPk(userId);

  const validPwd = await bcrypt.compare(currentPassword, user.hash);

  if (validPwd) {
    // Make any name changes
    user.first_name = firstName != '' ? firstName : user.first_name;
    user.last_name = lastName != '' ? lastName : user.last_name;

    // Hash the new password (if exists) and update the user record to match the change
    if (newPassword != '') {
      const hash = await bcrypt.hash(newPassword, 10);
      user.hash = hash;
    }

    // Save the record
    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
    });
  } else {
    res.status(401).json({ message: 'Your current password is incorrect!' });
    throw new Error('Users current password was wrong!');
  }
});

// @desc    Create record of a Soundhub users followers on their linked spotify
// @route   POST /api/users/followers
const logUserFollowerData = asyncHandler(async (req, res) => {
  const { user_id, followers } = req.body;

  const userWithFollowerData = await Followers.create({
    user_id,
    followers,
  });

  res.status(201).json({
    followers: userWithFollowerData.followers,
  });
});

// @desc    Get data on weekly, monthly, AND last 6 month follower changes for a given user
// @route   GET /api/users/followers
const getUserFollowerData = asyncHandler(async (req, res) => {
  // Create date objects for today  1 WEEK ago, and 1 MONTH ago
  let dateToday = new Date();
  let weekAgo = new Date(dateToday - 604800000);
  let monthAgo = new Date(dateToday - 2592000000);

  // Collect all logged follower records from the past WEEK
  const weeklyFollowers = await Followers.findAll({
    where: {
      createdAt: { [Op.between]: [weekAgo, dateToday] },
      user_id: req.params.user_id,
    },
  });

  // Calculate todays followers minus the amount at the start of the WEEK
  const weeklyChange =
    weeklyFollowers[0].followers -
    weeklyFollowers[weeklyFollowers.length - 1].followers;

  // Collect all logged follower records from the past month
  const monthlyFollowers = await Followers.findAll({
    where: {
      createdAt: { [Op.between]: [monthAgo, dateToday] },
      user_id: req.params.user_id,
    },
  });

  // Calculate todays followers minus the amount at the start of the MONTH
  const monthlyChange =
    monthlyFollowers[0].followers -
    monthlyFollowers[monthlyFollowers.length - 1].followers;

  let lastSixMonthsFollowers = [];
  let promises = [];

  // Get all records falling between the start and end of each month (for the last 6 months)
  for (let i = 2592000000; i <= 18144000000; i++) {
    let month = new Date(dateToday - i);

    // Define month start/end boundaries to search within
    let firstDayofCurrentMonth = new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    );
    let lastDayofCurrentMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    );

    promises.push(
      Followers.findAll({
        where: {
          createdAt: {
            [Op.between]: [firstDayofCurrentMonth, lastDayofCurrentMonth],
          },
          user_id: req.params.user_id,
        },
      })
    );

    i = i + 2592000000;
  }

  // Obtain and push last record from each month (signifying the closing # of followers for the month)
  // After array of closing values is populated, return it along with the weekly and monthly counts
  Promise.all(promises).then((values) => {
    for (let i = 0; i < promises.length; i++) {
      if (values[i][values[i].length > 0]) {
        lastSixMonthsFollowers.push(values[i][values[i].length - 1].followers);
      } else {
        lastSixMonthsFollowers.push(0);
      }
    }
    res.json({
      weeklyChange: weeklyChange,
      monthlyChange: monthlyChange,
      lastSixMonthsFollowers: lastSixMonthsFollowers,
    });
  });
});

module.exports = {
  registerUser,
  loginUser,
  editUserProfile,
  logUserFollowerData,
  getUserFollowerData,
};
