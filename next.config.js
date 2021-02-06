const withTM = require('next-transpile-modules')([
  'next-auth',
  'react-wordcloud',
  'd3-array',
  'd3-cloud',
  'd3-color',
  'd3-dispatch',
  'd3-ease',
  'd3-format',
  'd3-interpolate',
  'd3-scale',
  'd3-scale-chromatic',
  'd3-selection',
  'd3-time',
  'd3-time-format',
  'd3-timer',
  'd3-transition',
]);

module.exports = withTM();
