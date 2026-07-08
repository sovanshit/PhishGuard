// PhishGuard Extension Configuration
// Update the WEBSITE_URL to match your deployed website

const CONFIG = {
  // IMPORTANT: Update this URL after deploying your website
  // Examples:
  // - Local testing: 'http://localhost/PhishGuard_mine/index.html'
  // - Netlify: 'https://your-site.netlify.app'
  // - Custom domain: 'https://phishguard.com'
  // - Firebase: 'https://your-project.web.app'
  
  WEBSITE_URL: 'http://localhost/PhishGuard_mine/index.html',
  
  // Extension settings
  AUTO_SCAN: true,
  SHOW_NOTIFICATIONS: true,
  SCAN_DELAY: 500 // milliseconds
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
