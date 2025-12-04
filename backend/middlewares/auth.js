const { jwtVerify } = require("jose");

const authenticate = async (request, response, next) => {
  try {
    const token = request.cookies.token;
    if (!token)
      return response.status(401).json({ message: "Not authenticated." });

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    request.user = payload;
    next();
  } catch (error) {
    response.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticate;
