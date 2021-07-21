module.exports = (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(403).json({
      status: 'forbidden',
      code: 403,
    });
  }
  
  res.json({
    text: 'x',
  });
};
