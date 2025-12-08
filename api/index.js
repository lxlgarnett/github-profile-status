const http = require('http');
const url = require('url');
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

const server = http.createServer(async (req, res) => {
  console.log('Request received');
  const reqUrl = url.parse(req.url, true);
  const username = reqUrl.pathname.slice(1);
  const format = reqUrl.query.format;

  if (!username) {
    console.log('No username provided');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Please provide a github username');
    return;
  }

  try {
    console.log(`Fetching repos for ${username}`);
    const repos = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );
    console.log('Repos fetched');

    const nonForkRepos = repos.data.filter((repo) => !repo.fork);

    const langStats = {};
    const langPromises = nonForkRepos.map((repo) =>
      axios.get(`https://api.github.com/repos/${repo.full_name}/languages`)
    );

    console.log('Fetching languages');
    const langResults = await Promise.all(langPromises);
    console.log('Languages fetched');

    for (const langResult of langResults) {
      for (const lang in langResult.data) {
        if (langStats[lang]) {
          langStats[lang] += langResult.data[lang];
        } else {
          langStats[lang] = langResult.data[lang];
        }
      }
    }

    if (format === 'json') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(langStats));
      return;
    }

    const languages = Object.keys(langStats);
    const counts = Object.values(langStats);

    const configuration = {
      type: 'pie',
      data: {
        labels: languages,
        datasets: [
          {
            data: counts,
            backgroundColor: [
              '#3498db',
              '#e74c3c',
              '#2ecc71',
              '#f1c40f',
              '#9b59b6',
              '#1abc9c',
              '#34495e',
            ],
          },
        ],
      },
    };

    console.log('Generating chart');
    const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
    console.log('Chart generated');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(dataUrl);
  } catch (error) {
    console.error('Error in server:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
