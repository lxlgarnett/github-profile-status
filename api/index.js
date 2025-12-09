require('dotenv').config();
const http = require('http');
const { URL } = require('url');
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');

const width = 400;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: '#22272e',
  plugins: {
    modern: [ChartDataLabels],
  },
});

const server = http.createServer(async (req, res) => {
  console.log(`Request received for URL: ${req.url}`);

  const port = process.env.PORT || 3000;
  console.log(`App is running on port: ${port}`);

  const githubToken = process.env.GITHUB_TOKEN;
  if (githubToken) {
    console.log(`GITHUB_TOKEN is set. Token starts with: ${githubToken.substring(0, 4)}...`);
  } else {
    console.log('GITHUB_TOKEN is NOT set.');
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const username = reqUrl.pathname.slice(1);
  const format = reqUrl.searchParams.get('format');

  if (!username) {
    console.log('No username provided');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Please provide a github username');
    return;
  }

  try {
    console.log('Entering try block...');
    const headers = {
      Authorization: `token ${githubToken}`,
    };

    console.log(`Fetching repos for ${username}`);
    const repos = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      { headers }
    );
    console.log('Repos fetched');

    const nonForkRepos = repos.data.filter((repo) => !repo.fork);

    const langStats = {};
    const langPromises = nonForkRepos.map((repo) =>
      axios.get(`https://api.github.com/repos/${repo.full_name}/languages`, {
        headers,
      })
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
            borderColor: '#22272e',
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
            },
          },
          datalabels: {
            color: '#ffffff',
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map((data) => {
                sum += data;
              });
              let percentage = ((value * 100) / sum).toFixed(1) + '%';
              return percentage;
            },
          },
        },
      },
    };

    console.log('Generating chart');
    const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration, 'image/png');
    const base64Image = dataUrl.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    console.log('Chart generated');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': imageBuffer.length,
    });
    res.end(imageBuffer);
  } catch (error) {
    console.error('Error in server:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    }
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = server;
