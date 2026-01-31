import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_TTL= '15m';
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

export const signIn = async (res, req) => {
    try {
        //get data
        const { username, password } = req.body;
        if (!username || !password) { 
            return res.status(400).json({ message: "Missing username or password" });
        }

        //clean up
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        //check username
        const user = await User.findOne({ username: trimmedUsername }).select("+hashedPassword");
        if (!user) {
            return res.status(401).json({ message: "Incorrect usermame or password" });
        }

        //check password
        const passwordCorrect = await bcrypt.compare(trimmedPassword, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Incorrect usermame or password" });
        }

        //create accesstoken with JWT
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

        //refresh
        const refreshToken = crypto.randomBytes(64).toString("hex");
        
        if (!refreshToken) {
            return res.status(500).json({ message: "Failed to generate refresh token." });
        }
        //create new session for save refreshtoken
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        })

        //refreshtoken in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        })

        //res accesssToken
        return res.status(200).json({ message: `User ${user.displayname} already Logged in`, accessToken });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error("Error signIn",error);
        return res.status(500).json({ message: "system error" });
    }
}
export const signOut = async (req, res) => {
    try {
        //get token from cookie
        const delToken = req.cookies?.refreshToken;
        
        //check token exists and clear token in cookie
        if (delToken) {
            await Session.deleteOne({ refreshToken: delToken });
            res.clearCookie("refreshToken");
        }

        return res.sendStatus(204);
    } catch (error) {
        console.error("signOut error:",error);
        return res.status(500).json({ message: "system error" });
    }
}