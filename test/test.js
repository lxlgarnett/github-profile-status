const axios = require('axios');
const { expect } = require('chai');
const { spawn } = require('child_process');

describe('API Tests', function () {
  this.timeout(60000);
  let server;

  before((done) => {
    server = spawn('node', ['api/index.js'], {
      env: { ...process.env, PORT: 3001 },
    });
    server.stdout.on('data', (data) => {
      console.log(`server: ${data}`);
      if (data.includes('Server is running on port 3001')) {
        setTimeout(done, 2000); // Wait 2 seconds for the server to be ready
      }
    });
    server.stderr.on('data', (data) => {
      console.error(`server stderr: ${data}`);
    });
  });

  after(() => {
    server.kill();
  });

  it('should return a valid data URL for a valid username', (done) => {
    axios
      .get('http://localhost:3001/lxlgarnett')
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.headers['content-type']).to.equal('text/plain');
        expect(response.data).to.include('data:image/png;base64,');
        done();
      })
      .catch((error) => {
        console.error(error);
        done(error);
      });
  });

  it('should return language statistics in JSON format, excluding forked repositories', async () => {
    const response = await axios.get(
      'http://localhost:3001/lxlgarnett?format=json'
    );
    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.include('application/json');
    expect(response.data).to.be.an('object');

    // From the previous test run, we identified 'C', 'Java', and 'Vim Script'
    // as languages present in forked repositories for user 'lxlgarnett'.
    // We assert that these languages are NOT present in the response.
    expect(response.data).to.not.have.property('C');
    expect(response.data).to.not.have.property('Java');
    expect(response.data).to.not.have.property('Vim Script');
    expect(response.data).to.have.property('Kotlin');
    expect(response.data).to.have.property('Python');
  });

  it('should return a 400 error for no username', async () => {
    try {
      await axios.get('http://localhost:3001/');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.equal('Please provide a github username');
    }
  });
});
