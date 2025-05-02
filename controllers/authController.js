const User = require('../models/User')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const { stack } = require('../routes/authRoutes')

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '2h' })
}

//register
const registerUser = async (req, res) => {
    const { userName, email, password, role, languages } = req.body
    try {
        const user = await User.register(userName, email, password, role, languages)
        res.status(200).json({ mssg: 'Send to Approval' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//login
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user.id)
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Reset Password with Old Password
const resetPassword = async (req, res) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    try {
        if (!email || !oldPassword || !newPassword || !confirmPassword) throw Error('All fields must be filled');
        if (newPassword !== confirmPassword) throw Error('New password and confirm password do not match');

        const user = await User.findOne({ email });
        if (!user) throw Error('User not found');

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) throw Error('Incorrect old password');

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Forgot Password (Sends OTP & Token)
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }); // ✅ Fetch correct user
        if (!user || user.roleStatus !== 'Approved') throw Error('User not found or not approved');

        const resetToken = createToken(user.id, process.env.RESET_SECRET, '10h');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordToken = resetToken;
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

        await user.save({ validateBeforeSave: false }); // ✅ Save changes
        console.log("Saved OTP in DB:", user.resetPasswordOtp);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset OTP & Token',
            text: `Your OTP: ${otp}\nUse this token to reset your password: ${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reset OTP & token sent to email' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//Reset Password using Token & OTP
const resetPasswordWithToken = async (req, res) => {
    const { token } = req.params;
    const { otp, newPassword, confirmPassword } = req.body;

    try {
        if (!token || !otp || !newPassword || !confirmPassword) throw new Error('Missing required fields');
        if (newPassword !== confirmPassword) throw new Error('New password and confirm password do not match');

        // Verify JWT Token
        const decoded = jwt.verify(token, process.env.RESET_SECRET);
        const user = await User.findById(decoded.id); // ✅ Removed .lean()

        if (!user) return res.status(400).json({ error: 'User not found' });

        console.log("Stored OTP:", user.resetPasswordOtp);
        console.log("Received OTP:", otp);

        if (!user.resetPasswordOtp || user.resetPasswordOtp.toString() !== otp.toString()) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: 'OTP has expired. Request a new one.' });
        }

        // Hash and update password
        await User.findByIdAndUpdate(
            user._id,
            { 
                password: await bcrypt.hash(newPassword, 10),
                resetPasswordToken: null,
                resetPasswordOtp: null,
                resetPasswordExpires: null
            },
            { new: true }
        );

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    forgotPassword, 
    resetPasswordWithToken, 
    resetPassword 
};