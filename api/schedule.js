const { APP_SECRET, DATABASE_TOKEN, GITHUB_TOKEN } = process.env;
const { default: axios } = require('axios');

const GITHUB_WORKFLOW_ID = '11461024';
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

class Actions {
    static BASE_URL = 'https://github.com/etherealtech/aungsan-live-schedule/actions';
    static REST_API = 'https://api.github.com/repos/etherealtech/aungsan-live-schedule/actions';
    
    static dispatch(id, inputs) {
      return axios.post(`${this.REST_API}/workflows/${id}/dispatches`,  {
        ref: 'refs/heads/main',
        inputs
      }, { 
        headers:{
          authorization: 'token ' + GITHUB_TOKEN,
          'content-type': 'application/json'
        }
      });
    }
    
    static async runs() {
        let { data: { workflow_runs } } = await axios.get(`${this.REST_API}/runs`, {
          headers: {
            authorization: 'token ' + GITHUB_TOKEN 
          }
        });
        return (workflow_runs || []).filter(({ event }) => event === 'workflow_dispatch');
    }
}

module.exports = async (req, res) => {
  let { token, hr, min, test } = req.query;
  let cron_schedule = hr ? `0 ${min || 0} ${hr} * * *` : '0 0 19 * * *';
  if (!token) return res.status(401).json({ status: 401, error: 'Unauthorized' });
  if (token !== APP_SECRET) return res.status(403).json({ status: 403, error: 'Forbidden' });
  try {
    if (test) {
        await Actions.dispatch(GITHUB_WORKFLOW_ID, { cron_schedule });
        res.json({ status: 200, message: Actions.BASE_URL });
        return;
    }
    let [ run ] = await Actions.runs();
    let { id, status, conclusion, html_url, created_at, updated_at } = run;
    switch(status) {
      case 'queued':
      case 'in_progress':
        return res.status(400).json({ status: 400, error: 'Bad Request', message: html_url });
      case 'completed':
        break;
      default:
        console.log('[Unexcepted Run Status] %s', status);
    }
    await Actions.dispatch(GITHUB_WORKFLOW_ID, { cron_schedule });
    res.json({ status: 200, message: Actions.BASE_URL });
  } catch(e) {
    console.error('[ERR]', e);
    res.status(500).json({ error: e.message });
  }
};
