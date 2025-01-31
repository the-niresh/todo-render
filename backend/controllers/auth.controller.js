import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import transporter from "../config/nodemailer.js";

// signup controller
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password, isAdmin } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    if (!isAdmin) {
      return res
        .status(400)
        .json({ error: "Please check if you're an Admin or a User" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      
      await newUser.save();

      // sending welcome mail
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "welcome to Todo-Pro..!!",
        text: `Hii ${fullName}, Welcome to Todo_pro..!! Your account has been created successfully with the mail: ${email}`,
      };
      await transporter.sendMail(mailOptions);
	  
      return res.status(201).json({
        success: true,
		message: "Successfully registered"
        // _id: newUser._id,
        // fullName: newUser.fullName,
        // username: newUser.username,
        // email: newUser.email,
        // isAdmin: newUser.isAdmin,
		    // mailSent: true
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({ success: true, message: "Login Success" });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt-todo-pro");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get my profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    .populate({
      path: "teams.team", select: "teamName admins",
    });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
	// TODO console log user and check
  // console.log("!!!,user,getme",user)
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// send verification OTP to the User's mail.
export const sendVerifyOTP = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");

    if (user.isUserVerified) {
      return res.status(400).json({ success: false, message: "User is already verified" });
    }
    // logic for generating OTP
    const OTP = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = OTP;
    user.verifyOTPExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Todo-Pro..!!: Account Verification OTP",
      text: `Your OTP is ${OTP}. kindly verify your account with this OTP`,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Verification mail sent successfully" });
  } catch (error) {
    console.log("Error in sendVerifyOTP controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// verifying the User
export const verifyEmail = async (req, res) => {
	const { OTP } = req.body;
  const userId = req.user._id;

	if(!userId || !OTP) {
		return res.status(400).json({success: false, message: "missing Details"})
	}

	try {
		const user = await User.findById(userId);
		if(!user) {
			return res.status(400).json({ success: false, message: "User not found"})
		}

		if(user.verifyOTP === '' || user.verifyOTP !== OTP) {
			return res.status(400).json({ success: false, message: "invalid OTP"})
		}

		if(user.verifyOTPExpiresAt < Date.now()) {
			return res.status(400).json({ success: false, message: "OTP expired"})
		}

		user.isUserVerified = true;
		user.verifyOTP = '';
		user.verifyOTPExpiresAt = 0;

		await user.save();
		return res.status(200).json({ success: true, message: "email verified successfully"})

	} catch (error) {
		console.log("Error in verifyEmail controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
	}

}

// send passsword reset OTP
export const sendResetOTP = async (req, res) => {
  const {email} = req.body;
  if(!email){
    return res.status(400).json({success:false, message: "please provide valid email"})
  }

  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({success:false, message: "user not found"})
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = OTP;
    user.resetOTPExpiryTime = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Todo-Pro..!!: Password reset OTP",
      text: `Your OTP for resetting your account is ${OTP}.`,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to mail, successfully" });

  } catch (error) {
    console.log("Error in sendResetOTP controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// reset user password
export const resetPassword = async (req, res) => {
  const { OTP, email, newPassword } = req.body;

  if (!OTP || !email || !newPassword) {
    return res.status(400).json({ success: false, message: "missing Details" });
  }
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.resetOTP === "" || user.resetOTP !== OTP) {
      return res.status(400).json({ success: false, message: "invalid OTP" });
    }

    if (user.resetOTPExpiryTime < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetOTP = "";
    user.resetOTPExpiryTime = 0;

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "email verified successfully" });
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// check whether the user is Authenticated
export const isAuthenticated = async (req,res) => {
  try {
    return res.status(200).json({ success:true });
  } catch (error) {
    console.log("Error in isAuthenticated controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}