const { copyFileSync } = require('node:fs')

// GitHub Pages serves 404.html for unknown paths. Copy the SPA shell so
// deep links still load the app (asset URLs are absolute under `base`).
copyFileSync('dist/index.html', 'dist/404.html')
