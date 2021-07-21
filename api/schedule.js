const { APP_SECRET, DATABASE_TOKEN, GITHUB_TOKEN } = process.env;
const { default: axios } = require('axios');

const REQUEST_URL = 'https://api.github.com/repos/etherealtech/aungsan-live-schedule/actions/workflows/11461024/dispatches';
class DB {
    static BASE_URL = 'https://us1-merry-cat-32748.upstash.io';

    static async set(key, value) {
        const { data } = await axios.post(`${this.BASE_URL}/set/${key}/${value}?_token=${DATABASE_TOKEN}`);
        return data;
    }

    static async get(key) {
        const { data } = await axios.post(`${this.BASE_URL}/get/${key}?_token=${DATABASE_TOKEN}`);
        return data['result'] || null;
    }
}

module.exports = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(401).json({ status: 401, error: 'Unauthorized' });
  if (token !== APP_SECRET) return res.status(403).json({ status: 403, error: 'Forbidden' });
  const headers = {
    'content-type': 'application/json',
    'authorization': 'token ' + GITHUB_TOKEN,
  };
  const { status, data } = await axios.post(REQUEST_URL,  {
    head: 'refs/heads/main',
    inputs: {
      cron_schedule: '0 0 19 * * *'
    }
  }, { headers });
  
  res.json({ status, data });
};
