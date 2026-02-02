require('dotenv').config();
const http = require('http');
const { URL } = require('url');
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const { themes } = require('./theme');

const axiosInstance = axios.create({ proxy: false });

const width = 400;
const height = 400;

const statsCache = new Map();
const CACHE_TTL = 3600 * 1000 * 24; // 24 hours

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  plugins: {
    modern: [ChartDataLabels],
  },
});

/**
 * Normalizes the GitHub token by trimming whitespace and checking for 'undefined' or 'null' strings.
 *
 * @param {string} token - The GitHub token from environment variables.
 * @returns {string} The normalized token or an empty string if invalid.
 */
const normalizeToken = (token) => {
  if (!token) return '';
  const trimmed = token.trim();
  const lowered = trimmed.toLowerCase();

  return trimmed && lowered !== 'undefined' && lowered !== 'null'
    ? trimmed
    : '';
};

/**
 * The HTTP server request handler.
 * Handles incoming requests to generate GitHub language usage charts.
 *
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 */
const server = http.createServer(async (req, res) => {
  console.log(`Request received for URL: ${req.url}`);

  const port = process.env.PORT || 3000;
  console.log(`App is running on port: ${port}`);

  const githubToken = normalizeToken(process.env.GITHUB_TOKEN);
  if (githubToken) {
    console.log(
      `GITHUB_TOKEN is set. Token starts with: ${githubToken.substring(0, 4)}...`
    );
  } else {
    console.log(
      'GITHUB_TOKEN is NOT set. Using unauthenticated GitHub API access.'
    );
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  if (reqUrl.pathname === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  const username = reqUrl.pathname.slice(1);
  const format = (reqUrl.searchParams.get('format') || 'png').toLowerCase();
  const themeName = (
    reqUrl.searchParams.get('theme') || 'warm_dark'
  ).toLowerCase();
  const selectedTheme = themes[themeName] || themes['warm_dark'];

  if (!username) {
    console.log('No username provided');
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Please provide a github username');
    return;
  }

  const githubUsernameRegex =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  if (!githubUsernameRegex.test(username)) {
    console.log(`Invalid username format: ${username}`);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid github username');
    return;
  }

  try {
    console.log('Entering try block...');
    
    let sortedLangStats;
    const now = Date.now();

    if (statsCache.has(username)) {
      const { data, timestamp } = statsCache.get(username);
      if (now - timestamp < CACHE_TTL) {
        console.log(`Serving cached data for ${username}`);
        sortedLangStats = data;
      }
    }

    if (!sortedLangStats) {
      const headers = githubToken
        ? {
            Authorization: `token ${githubToken}`,
          }
        : {};

      const langStats = {};

      if (githubToken) {
        console.log('Using GraphQL API for data fetching');
        const query = `
          query userInfo($login: String!) {
            user(login: $login) {
              repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
                nodes {
                  name
                  languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                    edges {
                      size
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const graphqlResponse = await axiosInstance.post(
          'https://api.github.com/graphql',
          {
            query,
            variables: { login: username },
          },
          { headers }
        );

        if (graphqlResponse.data.errors) {
            console.error('GraphQL Errors:', graphqlResponse.data.errors);
            throw new Error('GraphQL Error');
        }

        const nodes = graphqlResponse.data.data.user.repositories.nodes;
        
        nodes.forEach(repo => {
            if (repo.languages && repo.languages.edges) {
                repo.languages.edges.forEach(edge => {
                    const langName = edge.node.name;
                    const langSize = edge.size;
                    if (langStats[langName]) {
                        langStats[langName] += langSize;
                    } else {
                        langStats[langName] = langSize;
                    }
                });
            }
        });

      } else {
        console.log('Using REST API for data fetching (No Token)');
        console.log(`Fetching repos for ${username}`);
        const repos = await axiosInstance.get(
          `https://api.github.com/users/${username}/repos`,
          { headers }
        );
        console.log('Repos fetched');

        const nonForkRepos = repos.data.filter((repo) => !repo.fork);

        const langPromises = nonForkRepos.map((repo) =>
          axiosInstance.get(
            `https://api.github.com/repos/${repo.full_name}/languages`,
            {
              headers,
            }
          )
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
      }

      sortedLangStats = Object.entries(langStats)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

      statsCache.set(username, { data: sortedLangStats, timestamp: now });
    }

    console.log('Languages lines info:');
    for (const [lang, lines] of Object.entries(sortedLangStats)) {
      console.log(`${lang}: ${lines}`);
    }

    if (!['png', 'jpg', 'jpeg', 'json'].includes(format)) {
      console.log(`Unsupported format requested: ${format}`);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Unsupported format. Use png, jpg, jpeg, or json.');
      return;
    }

    if (format === 'json') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sortedLangStats));
      return;
    }

    const languages = Object.keys(sortedLangStats);
    const counts = Object.values(sortedLangStats);

    const configuration = {
      type: 'pie',
      data: {
        labels: languages,
        datasets: [
          {
            data: counts,
            backgroundColor: selectedTheme.datasetColors,
            borderColor: selectedTheme.borderColor,
            borderWidth: 1,
          },
        ],
      },
      plugins: [
        {
          id: 'custom_canvas_background_color',
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = selectedTheme.backgroundColour;
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          },
        },
      ],
      options: {
        plugins: {
          legend: {
            labels: {
              color: selectedTheme.labelColor,
              font: {
                family: 'sans-serif',
              },
            },
          },
          datalabels: {
            color: selectedTheme.labelColor,
            font: {
              family: 'sans-serif',
            },
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

    console.log(`Generating chart in ${format} format`);
    let imageBuffer;
    let contentType;

    if (format === 'jpg' || format === 'jpeg') {
      contentType = 'image/jpeg';
      imageBuffer = await chartJSNodeCanvas.renderToBuffer(
        configuration,
        'image/jpeg'
      );
    } else {
      contentType = 'image/png';
      imageBuffer = await chartJSNodeCanvas.renderToBuffer(
        configuration,
        'image/png'
      );
    }

    console.log('Chart generated');
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': imageBuffer.length,
    });
    res.end(imageBuffer);
  } catch (error) {
    console.error('Error in server:', error.stack);
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
