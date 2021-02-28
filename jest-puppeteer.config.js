module.exports = {
  server: {
    command: 'npm run build && npm run start',
    port: 3000,
    launchTimeout: 90000, // Next.js server takes time (~1 minute) to build and start, so give it 1.5 mins
  },
  launch: { headless: process.env.HEADFUL ? false : true },
};
