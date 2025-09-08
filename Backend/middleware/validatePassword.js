module.exports = (req, res, next) => {
  const { password } = req.body;
  const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!strongRegex.test(password)) {
    return res.status(400).json({ message: "Password is not strong enough!" });
  }
  next();
};
