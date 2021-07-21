const { APP_SECRET } = process.env;
const { default: axios } = require('axios');

const REQUEST_URL = '';

module.exports = async (req, res) => {
  const { token } = req.query;
  
  if (!token) return res.status(401).json({
    status: 401,
    error: 'Unauthorized',
  });
  
  if (token !== APP_SECRET) return res.status(403).json({
    status: 403,
    error: 'Forbidden',
  });
  
  const data = {
    head: 'refs/heads/main',
    inputs: {
      cron_schedule: '0 0 19 * * *',
    },
  };
  
  const headers = {
    'content-type': 'application/json',
    'authorization': 'token ' + GITHUB_TOKEN
  };
  
  axios({
    url: REQUEST_URL,
    method: 'POST',
    data,
    headers,
  });
  
  res.json({
    status: 200,
    message: 'OK',
  });
};
