# GitHub Profile Status

[![Node.js CI](https://github.com/lxlgarnett/github-profile-status/actions/workflows/node.js.yml/badge.svg)](https://github.com/lxlgarnett/github-profile-status/actions/workflows/node.js.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) ![GitHub last commit](https://img.shields.io/github/last-commit/lxlgarnett/github-profile-status) ![GitHub issues](https://img.shields.io/github/issues/lxlgarnett/github-profile-status) ![GitHub pull requests](https://img.shields.io/github/issues-pr/lxlgarnett/github-profile-status)

This project provides a simple API to generate a pie chart visualizing the most used programming languages for a given GitHub user. It analyzes the user's public, non-forked repositories to aggregate language statistics.

## Features

- **Visual Pie Chart:** Generates a PNG or JPG image of language distribution.
- **JSON Data:** Option to retrieve raw language statistics in JSON format.
- **Fork Filtering:** Automatically excludes forked repositories to reflect the user's actual contributions.

## Prerequisites

- Node.js
- (Optional) A GitHub Personal Access Token

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
   Create a `.env` file in the root directory to store your environment variables. The `GITHUB_TOKEN` entry is optional—include it only if you have a personal access token to raise rate limits.

   ```env
   # Optional: include only if you have a token
   GITHUB_TOKEN=your_github_personal_access_token

   # Optional: defaults to 3000
   PORT=3000
   ```
   *If `GITHUB_TOKEN` is omitted or left blank, the server will **not** send an Authorization header, and GitHub will treat requests as unauthenticated (60 requests/hour limit).* 

4. **Start the server:**
   ```bash
   npm start
   ```

## Usage

Once the server is running (default port 3000), you can access the API via your browser or HTTP client.

### Generate Image
Navigate to:
`http://localhost:3000/{username}`

This generates a PNG image by default. You can specify the format using the `format` query parameter.

**Supported Formats:** `png` (default), `jpg` (or `jpeg`). Formats are case-insensitive; unsupported formats return `400 Bad Request`.

**Examples:**
- Default (PNG): `http://localhost:3000/lxlgarnett`
- JPG: `http://localhost:3000/lxlgarnett?format=jpg`

### Customize Theme
You can change the color theme using the `theme` query parameter.

**Supported Themes:**
- `warm_dark` (default)
- `github_dark`
- `cool_light`

**Example:**
`http://localhost:3000/lxlgarnett?theme=github_dark`

### Get JSON Data
Add the `?format=json` query parameter to get the raw byte counts per language:
`http://localhost:3000/{username}?format=json`

**Example:**
`http://localhost:3000/lxlgarnett?format=json`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.