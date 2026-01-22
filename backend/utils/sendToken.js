const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // send cookie over HTTPS only in production
        sameSite: 'Strict', // helps prevent CSRF attacks
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
};

export default sendToken;


