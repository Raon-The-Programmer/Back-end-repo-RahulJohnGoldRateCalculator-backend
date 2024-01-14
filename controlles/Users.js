const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../utils/config')
const nodemailer = require('nodemailer')

const userController = {
    signUp: async (req, res) => {
        try {
            const body = req.body

            if (!body.password || body.password.length < 3) {
                return res.status(400).json({
                    error: 'Password Invalid!'
                })
            }

            const passwordHash = await bcrypt.hash(body.password, 10)

            const user = new User({
                username: body.username,
                name: body.name,
                passwordHash
            })

            const savedUser = await user.save()
            res.status(201).json({ message: `User ${user.name} created Successfully!!`, user: savedUser })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },
    getUserList: async (req, res) => {
        try {
            const userList = await User.find({})
            return res.status(200).json(userList)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },
    signIn: async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(401).json({ Message: "User Not Found:(" })
            }
            const passwordCheck = await bcrypt.compare(password, user.passwordHash)
            if (!passwordCheck) {
                return res.status(401).json({ Message: "Invalid Password:(" })
            }

            const payload = {
                username: user.username,
                name: user.name,
                id: user._id
            }
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1hr' })

            return res.status(200).json({ username: user.username, name: user.name, Token: token })
        }
        catch (err) {
            return res.status(500).json({ error: err.message })
        }
    },
    getProfile: async (req, res) => {
        try {
            const userId = req.userId
            const user = await User.findById(userId, {})
            console.log("user: ", user)
            return res.status(200).json(user)
        }
        catch (err) {
            return res.status(500).json({ error: err.message })
        }
    },
    editProfile: async (req, res) => {
        try {
            const userId = req.userId
            const { username, name } = req.body
            const user = await User.findByIdAndUpdate(userId, { name, username }, { new: true })
            return res.status(200).json({ message: "User updated successfully!!", user })
        }
        catch (err) {
            return res.status(500).json({ error: err.message })
        }
    },
    deleteProfile: async (req, res) => {
        try {
            const userId = req.userId
            const user = await User.findByIdAndDelete(userId)
            return res.status(200).json({ message: "User deleted successsfully!!" })
        }
        catch (err) {
            return res.status(500).json({ error: err.message })
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ username: email })
           
            if (!user) {
                return res.status(500).json({ message: "User not Found:(" })
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2h' })
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smpt.gmail.com',
                auth: {
                    user: "msdrahuljohn@gmail.com",
                    pass: "asad qnea mfbk ibbm "
                }
        
            })
            const mailOption = {
                from: { name: 'John', address: 'msdrahuljohn@gmail.com' },
                to:email,
                subject: 'Reset Password',
                text: `https://aesthetic-biscotti-d1a45d.netlify.app/resetpassword/${user._id}/${token}`
            }
            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    console.log({ error: err })
                }
                else {
                    console.log({ Information: info })
                }
            })
        }
        catch (err) {
            return res.status(401).json({ message: "Server error" })
        }
    },
    resetPassword: async (req, res) => {
        try {
        
          const { userId, token } = req.params;

          const { newPassword } = req.body;
    
          // Verify the token
          const decoded = jwt.verify(token, JWT_SECRET);
    
          if (decoded.id !== userId) {
            return res.status(401).json({ message: 'Invalid token' });
          }
    
          // Update the user's password
          const user = await User.findById(userId);
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.passwordHash = hashedPassword;
          await user.save();
    
          res.status(200).json({ message: 'Password reset successful' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      }

}

module.exports = userController;