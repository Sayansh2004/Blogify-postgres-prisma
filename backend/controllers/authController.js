import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { verifySignUpData } from "../utils/authUtils.js";
import prisma from "../config/db.js";

const signupController = async (req, res) => {
    try {
        verifySignUpData(req);
        const { email, password, username } = req.body;

        
        const existingUser = await prisma.user.findUnique({ 
            where: { email } 
        });

        if (existingUser) {
            throw new Error("User already exists. Please Sign in.");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

       
        return res.status(201).json({ success: true, message: "User signup successful" });
        
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            throw new Error("Invalid Request");
        }
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email format");
        }

        
        const existingUser = await prisma.user.findUnique({ 
            where: { email } 
        });

        if (!existingUser) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { id: existingUser.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "3d" }
        );

        
        res.cookie("token", token, {
            maxAge: 3 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        const { password: _, ...userWithoutPassword } = existingUser;
        
        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            data: userWithoutPassword 
        });

    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const logoutController = (req, res) => {
    try {
        
        res.clearCookie("token", {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

       
        return res.status(200).json({ success: true, message: "Logout successful" });
        
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error logging out" });
    }
}

export { signupController, loginController, logoutController };