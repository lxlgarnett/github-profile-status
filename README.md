# GitHub Profile Status

This project provides a simple API to generate a pie chart visualizing the most used programming languages for a given GitHub user. It analyzes the user's public, non-forked repositories to aggregate language statistics.

## Features

- **Visual Pie Chart:** Generates a PNG image of language distribution.
- **JSON Data:** Option to retrieve raw language statistics in JSON format.
- **Fork Filtering:** Automatically excludes forked repositories to reflect the user's actual contributions.

## Prerequisites

- Node.js
- A GitHub Personal Access Token (required)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lxlgarnett/github-profile-status.git
   cd github-profile-status
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configuration:**
   Create a `.env` file in the root directory to store your environment variables:

   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   PORT=3000
   ```
   *Note: A `GITHUB_TOKEN` is required. Without it, requests will fail with a 401 Unauthorized error. Authentication also increases the API rate limit to 5,000 requests/hour.*

4. **Start the server:**
   ```bash
   npm start
   ```

## Usage

Once the server is running (default port 3000), you can access the API via your browser or HTTP client.

### Generate Image
Navigate to:
`http://localhost:3000/{username}`

**Example:**
`http://localhost:3000/lxlgarnett`

### Get JSON Data
Add the `?format=json` query parameter to get the raw byte counts per language:
`http://localhost:3000/{username}?format=json`

**Example:**
`http://localhost:3000/lxlgarnett?format=json`

## License

ISC