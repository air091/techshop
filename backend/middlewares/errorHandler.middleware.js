const errorHandler = (error, request, response, next) => {
  if (error.kind === "ObjectId") {
    return response.status(400).json({ message: "Invalid ID." });
  }

  if (error.code === 11000)
    return response.status(400).json({ message: "Email is already use." });

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((err) => err.message);
    return response.status(400).json({ message: message[0] });
  }

  return response.status(500).json({ message: error });
};

module.exports = errorHandler;
