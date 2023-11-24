const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const userController = {
    signup: async (request, response) => {
        try {
            const body = request.body;

            if (!body.password || body.password.length < 3) {
                return response.status(400).json({
                    error: 'password must be at least 3 characters long'
                });
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(body.password, saltRounds);

            const user = new User({
                username: body.username,
                name: body.name,
                passwordHash
            });

            const savedUser = await user.save();

            response.status(201).json({ message: 'User created successfully', user: savedUser });
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    },

    getUserList: async (request, response) => {
        try {
            const userList = await User.find({}, {});
            response.status(200).json(userList);
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    },

    signin: async (request, response) => {
        try {
            const { username, password } = request.body;

            const user = await User.findOne({ username });

            if(!user) {
                return response.status(401).json({ error: 'User Not found' });
            }

            const passwordMatch = await bcrypt.compare(password, user.passwordHash);

            if(!passwordMatch) {
                return response.status(401).json({ error: 'Invalid Password' });
            }

            const token = jwt.sign({
                username: user.username,
                id: user._id,
                name: user.name,
            }, config.JWT_SECRET);

            response.status(200).json({ token, username: user.username, name: user.name });

        } catch(error) {
            response.status(500).json({ error: error.message })
        }
    },

    getProfile: async (request, response) => {
        try {
            const userId = request.userId;
            const user = await User.findById(userId, {});
            response.status(200).json(user);
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    },

    editProfile: async (request, response) => {
        try {
            const userId = request.userId;
            const { username, name } = request.body;
            
            const user = await User.findByIdAndUpdate(
                userId,
                { username, name },
                { new: true }
            );
            response.status(200).json({ message: 'User updated successfully', user });
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    },

    deleteProfile: async (request, response) => {
        try {
            const userId = request.userId;
            await User.findByIdAndDelete(userId);
            response.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }
}

module.exports = userController;