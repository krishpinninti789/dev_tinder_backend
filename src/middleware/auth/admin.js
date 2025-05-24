const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdmin = token === "xyz";
  if (!isAdmin) {
    res.status(401).send("Unauthorized access");
  } else {
    console.log("Admin access granted");
    next();
  }
};

module.exports = adminAuth;
