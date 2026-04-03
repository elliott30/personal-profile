import https from 'https';

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode, location: res.headers.location });
    }).on('error', (e) => {
      resolve({ url, error: e.message });
    });
  });
}

async function main() {
  const urls = [
    'https://cal.eu/embed/embed.js',
    'https://app.cal.eu/embed/embed.js',
    'https://cal.com/embed/embed.js',
    'https://app.cal.com/embed/embed.js'
  ];
  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(res);
  }
}

main();
