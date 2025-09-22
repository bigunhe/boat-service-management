import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// register a new user
const registerUser = async(req,res)=>{
  try{

    const {name, email, nic, password, passwordConfirm, phone, address, role} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({error: 'User already exists'});
    }

    const newUser = await User.create({
      name, 
      email, 
      nic, 
      password, 
      passwordConfirm, 
      phone, 
      address, 
      role: role || 'customer'
    });
    
    const token = jwt.sign(
      {id: newUser._id, role: newUser.role},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    // remove password from response
    newUser.password = undefined;

    // send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token 
      }
    })

  }catch(error){
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    })
  }
};


// login a user - original version //////////////////////////////////////////////////////////////
// const loginUser = async(req,res)=>{
//   try{
//   const {email, password} = req.body;

//   const user = await User.findOne({email}).select('+password');

//   if(!user){
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid email or password'
//     });
//   }

//   const isPasswordCorrect = await user.correctPassword(password, user.password);
//   if(!isPasswordCorrect){
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid email or password'
//     })
//   }

//   // generate JWT token

//   const token = jwt.sign(
//     {id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     {expiresIn: process.env.JWT_EXPIRES_IN}
//   );
  
//   // remove password from response
//   user.password = undefined;

//   // send success response
//   res.status(200).json({
//     success: true,
//     message: 'Login successful',
//     data: {
//       user,
//       token
//     },
//   })
// }catch(error){
//   console.error('Login error:', error);
//   res.status(500).json({
//     success: false,
//     message: 'Login failed',
//     error: error.message
//   });
// }
// };


// login a user - new version //////////////////////////////////////////////////////////////////
const loginUser = async(req,res)=>{
  try{
    console.log('Login request received', req.body);

    const {email, password} = req.body;
console.log('email: ', email);


  const user = await User.findOne({email}).select('+password');
  console.log("user found? : ", user ? 'yes': 'no');

  if(!user){
    console.log('user not found with email: ', email)
    return res.status(401).json({success: false,
      message: 'Invalid email or password',
      error: 'User not found'
    });
  }

  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if(!isPasswordCorrect){
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  // generate JWT token

  const token = jwt.sign(
    {id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN}
  );
  
  // remove password from response
  user.password = undefined;

  // send success response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    },
  })
}catch(error){
  console.error('Login error:', error);
  res.status(500).json({
    success: false,
    message: 'Login failed',
    error: error.message
  });
}
};


// update user
const updateProfile = async(req,res)=>{
  try{

    // extract user id from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // find user
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // define what the user cannot update
    let restrictedFields;

    // base restricted fields (for everyone)
    const baseRestricted = [  'email', 'nic', 'role', 'password'];

    // role specific restrictions
    if(user.role ==='customer'){
      restrictedFields = [...baseRestricted, 'employeeData', 'adminData'];
    }else if(user.role === 'employee'){
      restrictedFields = [...baseRestricted, 'adminData'];
    }else if(user.role === 'admin'){
      restrictedFields = baseRestricted;
    }


    // remove restricted fields from req.body
    const updateData = {...req.body};
    restrictedFields.forEach(field => {
      delete updateData[field];
    });

    // if no valid fields to update
    if(Object.keys(updateData).length === 0){
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      })
    }

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      {new: true, runValidators: true}
    );


    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {user: updatedUser}    
    })


}catch(error){

  console.error('Profile update error: ', error);
  res.status(500).json({
    success: false,
    message: 'Profile update failed',
    error: error.message
  })
}

}


// update password
const updatePassword = async(req,res)=>{
  try{

    // extract user id from JWT token (similar to updateProfile method)
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId= decoded.id;
    
    // check if user exists
    const user = await User.findById(userId).select('+password');

    if(!user){
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: error.message
      })
    }
    
    // get all form data (old password, new password, new password confirm)
    const {currentPassword, newPassword, newPasswordConfirm} = req.body;

    // check if old password is correct
    const isCurrentPasswordCorrect  = await user.correctPassword(currentPassword, user.password);
    if(!isCurrentPasswordCorrect){
      return res.status(401).json({
        success: flase,
        message: 'Current password is incorrect',
        error : error.message
      })
    }

    if(newPassword !== newPasswordConfirm){
      return res.status(400).json({
        success: false,
        message: 'New password and new password confirm do not match',
        error : error.message
      })
    }

    // update password
    user.password = newPassword;
    user.passwordConfirm = confirmPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    })

  }catch(error){
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      message: 'Password update failed',
      error: error.message
    })
  }
}


// get user profile
const getUserProfile = async(req,res)=>{
  try{

//  extract user id from auth middleware - using request object
    const userId = req.user.id;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // remove password from response
    user.password = undefined;

    // send the user profile data to the client/ whoever requested it
    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: {user: user}
    })
  }catch(error){
    console.error('User profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'User profile fetch failed'
    })

  }

}


// get user by id
const getUserById = async(req, res) =>{
  try{
    if(req.user.role !== 'admin'){
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource'
      });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: {user: user}
    });

  }catch(error){
    console.error('User fetch by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'User fetch by ID failed',
      error: error.message
    })
  }
}

//  get all users (admin only)
const getAllUsers = async(req, res) =>{
  try{
    // check if user is admin
    if(req.user.role !== 'admin'){
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to access this resource'
      })
    }
    // get all users from db - use find() method
    const users = await User.find();

    // if no users found
    if(users.length === 0){
      return res.status(404).json({
        success: false,
        message: 'No users found'
      })
    }

    // initialize arrays for each role (for grouping users by role)
    let customers =[];
    let employees =[];
    let admins =[];

    // remove password from response and categorize users by role
    users.forEach(user => {
      user.password = undefined;

      // categorize users based on their role and add to the appropriate array
      switch(user.role){
        case 'customer':
          customers.push(user);
          break;
        case 'employee':
          employees.push(user);
          break;
        case 'admin':
          admins.push(user);
          break;
        default:
          break;
      }
    });

    // send the users data to the client/ whoever requested it
    res.status(200).json({
      success: true,
      message: 'All users fetched successfully',
      data: {customers, employees, admins}
    })

  }catch(error){
    console.error('All users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'All users fetch failed'
    })
  }
}


// delete user (role specific)
const deleteUser = async(req, res) =>{
  try{
    // get who's making the request
    const deleter = req.user;
    
    // get who they want to delete
    const targetUserId = req.params.id; // or req.body.userId

    // find the target user
    const targetUser = await User.findById(targetUserId);

    if(!targetUser){
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // see if they have permission to delete the user and only allow relevant roles to delete specific users
    if(deleter.role === 'customer'){
      if(deleter.id != targetUserId){
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this user'
        })
      }
    }else if(deleter.role === 'employee'){
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete users'
      })
    }else if(deleter.role === 'admin'){
      if(deleter.id === targetUserId){
        return res.status(403).json({
          success: false,
          message: 'You cannot delete your own admin account'
        })
      }
    }

    // proceed with deletion
    await User.findByIdAndDelete(targetUserId);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })

  }catch(error){
    console.error('User deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'User deletion failed',
      error: error.message
    })
  }
}


// search users
const searchUsers = async(req, res) =>{
  try{
    const {query, role, limit = 10} = req.query;
    let searchCriteria = {};

    // search by name or email
    if(query){
      searchCriteria.$or = [
        {name: {$regex: query, $options: 'i'}}, // case insensitive search
        {email: {$regex: query, $options: 'i'}}
      ];
    }

    // filter by role
    if(role){
      searchCriteria.role = role;
    }

    // limit the number of results
    const users = await User.find(searchCriteria)
    .limit(parseInt(limit))
    .select('-password'); // exclude password from response

    res.status(200).json({
      success: true,
      message: 'Users found successfully',
      data: {
        users,
        count: users.length,
        query: query || '',
        role: role || 'all'

      }
    });
  }catch(error){
    console.error('User search error:', error);
    res.status(500).json({
      success: false,
      message: 'User search failed',
      error: error.message
    });

  }
}


export {registerUser, loginUser, updateProfile, updatePassword, getUserProfile, getAllUsers, deleteUser, searchUsers, getUserById}
