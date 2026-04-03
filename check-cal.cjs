const https = require('https');

https.get('https://cal.eu/embed/embed.js', (res) => {
  console.log('cal.eu status:', res.statusCode);
  if (res.statusCode >= 300 && res.statusCode < 400) {
    console.log('cal.eu redirect:', res.headers.location);
  }
});

https.get('https://app.cal.eu/embed/embed.js', (res) => {
  console.log('app.cal.eu status:', res.statusCode);
  if (res.statusCode >= 300 && res.statusCode < 400) {
    console.log('app.cal.eu redirect:', res.headers.location);
  }
});
