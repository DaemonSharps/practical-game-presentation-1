import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'vite';

function findHtmlFiles(directory) {
  const result = [];
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) result.push(...findHtmlFiles(absolute));
    else if (entry.endsWith('.html')) result.push(absolute);
  }
  return result;
}

const htmlInputs = findHtmlFiles(resolve('presentations'));

export default defineConfig({
  build: {
    rollupOptions: {
      input: [resolve('index.html'), ...htmlInputs],
    },
  },
});
