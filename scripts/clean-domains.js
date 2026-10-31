import fs from 'node:fs';
import path from 'node:path';

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace full domain with /
  content = content.replace(/https?:\/\/sriwijayagrafika\.co\.id\/wp-content\//g, '/wp-content/');
  content = content.replace(/https?:\/\/sriwijayagrafika\.co\.id\//g, '/');
  content = content.replace(/https?:\/\/sriwijayagrafika\.co\.id(?=["'\s>])/g, '/');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned: ${filePath}`);
}

cleanFile(path.resolve('src/data/normalized_posts.json'));
cleanFile(path.resolve('src/data/normalized_pages.json'));
