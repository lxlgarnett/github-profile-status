const axios = require('axios');
const { expect } = require('chai');
const nock = require('nock');
const server = require('../api/index');

describe('API Tests', function () {
  this.timeout(5000); // Reduced timeout since we are mocking
  let serverInstance;
  const PORT = 3001;

  before((done) => {
    // Set a dummy token for testing
    process.env.GITHUB_TOKEN = 'dummy-token';
    
    serverInstance = server.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      done();
    });
  });

  after((done) => {
    nock.cleanAll();
    serverInstance.close(done);
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  const mockGithubResponse = () => {
    // Mock user repos
    nock('https://api.github.com')
      .get('/users/lxlgarnett/repos')
      .reply(200, [
        {
          full_name: 'lxlgarnett/kotlin-repo',
          fork: false,
        },
        {
          full_name: 'lxlgarnett/python-repo',
          fork: false,
        },
        {
          full_name: 'lxlgarnett/forked-repo',
          fork: true,
        },
      ]);

    // Mock languages for kotlin-repo
    nock('https://api.github.com')
      .get('/repos/lxlgarnett/kotlin-repo/languages')
      .reply(200, {
        Kotlin: 1000,
      });

    // Mock languages for python-repo
    nock('https://api.github.com')
      .get('/repos/lxlgarnett/python-repo/languages')
      .reply(200, {
        Python: 2000,
      });
  };

  it('should return a valid PNG image for a valid username', async () => {
    mockGithubResponse();

    const response = await axios.get(`http://localhost:${PORT}/lxlgarnett`, {
      responseType: 'arraybuffer',
    });

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.equal('image/png');
    
    // Check for PNG magic numbers
    const magicNumbers = response.data.slice(0, 8);
    const pngSignature = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    expect(Buffer.compare(Buffer.from(magicNumbers), pngSignature)).to.equal(0);
  });

  it('should return a valid JPG image for a valid username with format=jpg', async () => {
    mockGithubResponse();

    const response = await axios.get(`http://localhost:${PORT}/lxlgarnett?format=jpg`, {
      responseType: 'arraybuffer',
    });

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.equal('image/jpeg');

    const magicNumbers = response.data.slice(0, 3);
    const jpgSignature = Buffer.from([0xff, 0xd8, 0xff]);
    expect(Buffer.compare(Buffer.from(magicNumbers), jpgSignature)).to.equal(0);
  });

  it('should return language statistics in JSON format, excluding forked repositories', async () => {
    mockGithubResponse();

    const response = await axios.get(
      `http://localhost:${PORT}/lxlgarnett?format=json`
    );

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.include('application/json');
    expect(response.data).to.be.an('object');

    // Verify correct stats based on mock data
    expect(response.data).to.have.property('Kotlin', 1000);
    expect(response.data).to.have.property('Python', 2000);
    
    // Verify forked repo languages are NOT present (we didn't even mock the call, 
    // so if it tried to fetch it would fail or return 404/error from nock if strict)
    expect(response.data).to.not.have.property('Java');
  });

  it('should return a 400 error for no username', async () => {
    try {
      await axios.get(`http://localhost:${PORT}/`);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.equal('Please provide a github username');
    }
  });
});