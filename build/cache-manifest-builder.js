const walk = require('walk');
const path = require('path');
const fs = require('fs');

const ignores = [
  '.DS_Store',
  'sw.js'
];

const routes = [
  '/',
  '/search',
  '/settings',
  '/upload',
  '/licences',
  '/about',
  '/demo',
  new RegExp('/auth/'),
  new RegExp('/album/'),
  new RegExp('/playlist/')
];

const getResourcesList = () => {
  return new Promise((resolve, reject) => {
    const walker = walk.walk(path.resolve(__dirname, '../src'));
    const resourcesList = [];

    walker.on("file", (root, stat, next) => {
      const filename = stat.name;

      if (ignores.includes(filename)) {
        next();
      }


      root = root.replace(/^\./, '/');
      const filepath = `${root}/${filename}`;

      resourcesList.push(filepath);
    });

    walker.on('end', () => resolve(resourcesList));
  });
}

getResourcesList().then(resources => {
  const cacheManifest = `const cacheManifest = ${JSON.stringify(resources, null, 2)}`;
  return fs.writeFile(path.resolve(__dirname, '../dist/cache-manifest.js'), cacheManifest);
}).catch(err => {
  console.error(err);
});
