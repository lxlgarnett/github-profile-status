const warmDarkTheme = {
  backgroundColour: '#181a1b',
  borderColor: '#181A1B',
  labelColor: '#E6E1D6',
  datasetColors: [
    '#F2B705',
    '#E07A2F',
    '#3FA7A3',
    '#8AAE5D',
    '#C45A4A',
    '#7FB7BE',
  ],
};

const githubDarkTheme = {
  backgroundColour: '#0D1117',
  borderColor: '#30363D',
  labelColor: '#C9D1D9',
  datasetColors: [
    '#58A6FF',
    '#3FB950',
    '#D29922',
    '#F85149',
    '#A371F7',
    '#39C5CF',
  ],
};

const coolLightTheme = {
  backgroundColour: '#ffffff',
  borderColor: '#ffffff',
  labelColor: '#333333',
  datasetColors: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
  ],
};

const themes = {
  warm_dark: warmDarkTheme,
  github_dark: githubDarkTheme,
  cool_light: coolLightTheme,
};

module.exports = { themes };
