app.post("/sendConnectionRequest", adminAuth, (req, res) => {
  try {
    res.send("Connection request sent successfully");
  } catch (err) {
    res.status(500).send("Error : " + err);
  }
});
