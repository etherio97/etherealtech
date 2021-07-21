const { APP_SECRET } = process.env;

module.exports = (req, res) => {
  const { token } = req.query;
  
  if (!token) return res.status(401).json({
    code: 401,
    status: 'error',
    message: 'Unauthorized',
  });
  
  if (token !== APP_SECRET) return res.status(403).json({
    code: 403,
    status: 'error',
    message: 'Forbidden',
  });
  
  res.json({
    code: 200,
    status: 'success',
    message: 'OK',
  });
};
