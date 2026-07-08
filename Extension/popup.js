// Get current tab URL and analyze
let currentUrl = '';
let scanResult = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && tab.url) {
    currentUrl = tab.url;
    
    // Auto-scan current page
    if (currentUrl.startsWith('http')) {
      await analyzePage();
    } else {
      showResult({
        status: 'Info',
        score: 0,
        message: 'Cannot scan browser pages',
        color: '#888'
      });
    }
  }
  
  // Load stats
  loadStats();
});

// Analyze current page
async function analyzePage() {
  try {
    const result = analyzeURL(currentUrl);
    scanResult = result;
    
    // Save to storage
    saveToHistory(result);
    
    // Update stats
    updateStats(result);
    
    // Show result
    showResult(result);
    
    // Show alert if dangerous
    if (result.score < 58) {
      showAlert(result);
    }
    
  } catch (error) {
    console.error('Analysis error:', error);
    showError();
  }
}

// URL Analysis (same logic as main app)
function analyzeURL(url) {
  const l = url.toLowerCase();
  let score = 100;
  const flags = [];
  
  // Suspicious TLDs
  if (['.xyz', '.tk', '.ml', '.ga', '.cf', '.zip', '.click'].some(t => l.includes(t))) {
    score -= 25;
    flags.push('Suspicious TLD');
  }
  
  // Lookalike domains
  if (['paypa1', 'arnazon', 'g00gle', 'micros0ft', 'app1e', 'faceb00k', 'roblox-free', 'netflix-login', 'signin-', 'login-', 'verify-', 'secure-update'].some(t => l.includes(t))) {
    score -= 40;
    flags.push('Lookalike domain pattern');
  }
  
  // IP address
  if (/https?:\/\/\d{1,3}\.\d{1,3}/.test(l)) {
    score -= 35;
    flags.push('IP address instead of domain');
  }
  
  // Excessive subdomains
  const dom = l.replace(/https?:\/\//, '').split('/')[0];
  if (dom.split('.').length > 4) {
    score -= 20;
    flags.push('Excessive subdomains');
  }
  
  // No SSL
  if (l.startsWith('http://')) {
    score -= 20;
    flags.push('No SSL (HTTP only)');
  }
  
  // Phishing keywords
  const pw = ['login', 'verify', 'secure', 'account', 'update', 'password', 'confirm', 'suspended', 'urgent'];
  const found = pw.filter(w => l.includes(w));
  if (found.length >= 2) {
    score -= 18;
    flags.push('Phishing keywords: ' + found.slice(0, 2).join(', '));
  }
  
  // URL shorteners
  if (['bit.ly', 'tinyurl', 't.co', 'ow.ly', 'goo.gl'].some(s => l.includes(s))) {
    score -= 15;
    flags.push('URL shortener');
  }
  
  // Long URL
  if (url.length > 120) {
    score -= 12;
    flags.push('Unusually long URL');
  }
  
  // @ symbol
  if (url.includes('@') && !url.includes('mailto')) {
    score -= 20;
    flags.push('@ symbol in URL');
  }
  
  // Safe domains boost
  const safe = ['google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com', 'wikipedia.org', 'youtube.com'];
  if (safe.some(d => l.includes(d))) score = Math.max(score, 88);
  
  score = Math.max(0, Math.min(100, score));
  
  let status, color;
  if (score >= 80) { status = 'Safe'; color = '#22C55E'; }
  else if (score >= 58) { status = 'Suspicious'; color = '#f5a623'; }
  else { status = 'Malicious'; color = '#ff4d4d'; }
  
  const ssl = l.startsWith('https://');
  
  return {
    url,
    score,
    status,
    color,
    flags,
    ssl: ssl ? 'Valid' : 'None',
    reputation: score >= 80 ? 'Clean' : score >= 58 ? 'Flagged' : 'Blacklisted',
    risk: score >= 80 ? 'Low' : score >= 58 ? 'Medium' : 'High',
    date: new Date().toLocaleString()
  };
}

// Show result in popup
function showResult(result) {
  document.getElementById('status-loading').style.display = 'none';
  document.getElementById('status-result').style.display = 'flex';
  
  const icon = document.getElementById('status-icon');
  const label = document.getElementById('status-label');
  const urlEl = document.getElementById('status-url');
  const score = document.getElementById('status-score');
  
  // Status icon
  const icons = { Safe: '✓', Suspicious: '⚠', Malicious: '✗', Info: 'ℹ' };
  icon.textContent = icons[result.status] || '?';
  icon.className = 'status-icon status-' + result.status.toLowerCase();
  
  // Labels
  label.textContent = result.status;
  label.style.color = result.color;
  
  try {
    const hostname = new URL(currentUrl).hostname;
    urlEl.textContent = hostname;
  } catch {
    urlEl.textContent = currentUrl;
  }
  
  score.textContent = result.score || '-';
  score.style.color = result.color;
  
  // Details
  if (result.ssl) {
    document.getElementById('details-section').style.display = 'block';
    document.getElementById('detail-ssl').textContent = result.ssl;
    document.getElementById('detail-ssl').style.color = result.ssl === 'Valid' ? '#22C55E' : '#ff4d4d';
    document.getElementById('detail-reputation').textContent = result.reputation;
    document.getElementById('detail-risk').textContent = result.risk;
  }
  
  // Threats
  if (result.flags && result.flags.length > 0) {
    document.getElementById('threats-section').style.display = 'block';
    const list = document.getElementById('threats-list');
    list.innerHTML = result.flags.map(f => `<div class="threat-flag">${f}</div>`).join('');
  }
}

// Show error
function showError() {
  document.getElementById('status-loading').style.display = 'none';
  document.getElementById('status-result').style.display = 'flex';
  document.getElementById('status-icon').textContent = '⚠';
  document.getElementById('status-label').textContent = 'Error';
  document.getElementById('status-url').textContent = 'Could not analyze URL';
}

// Save to history
function saveToHistory(result) {
  chrome.storage.local.get(['history'], (data) => {
    const history = data.history || [];
    history.unshift(result);
    
    // Keep last 100
    if (history.length > 100) history.pop();
    
    chrome.storage.local.set({ history });
  });
}

// Update stats
function updateStats(result) {
  chrome.storage.local.get(['stats'], (data) => {
    const stats = data.stats || { total: 0, blocked: 0 };
    
    stats.total++;
    if (result.score < 80) stats.blocked++;
    
    chrome.storage.local.set({ stats });
    
    // Update display
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-blocked').textContent = stats.blocked;
  });
}

// Load stats
function loadStats() {
  chrome.storage.local.get(['stats'], (data) => {
    const stats = data.stats || { total: 0, blocked: 0 };
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-blocked').textContent = stats.blocked;
  });
}

// Show alert for dangerous sites
function showAlert(result) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: '⚠️ PhishGuard Alert',
    message: `This site is ${result.status}! Threat score: ${result.score}/100. Proceed with caution.`,
    priority: 2
  });
}

// Scan button click
function scanCurrentPage() {
  document.getElementById('status-loading').style.display = 'flex';
  document.getElementById('status-result').style.display = 'none';
  document.getElementById('details-section').style.display = 'none';
  document.getElementById('threats-section').style.display = 'none';
  
  setTimeout(analyzePage, 500);
}

// Open dashboard - redirects to website dashboard
function openDashboard() {
  // Get website URL from config
  const websiteUrl = CONFIG.WEBSITE_URL.replace(/\/$/, '');
  
  // Open website dashboard page
  chrome.tabs.create({ 
    url: websiteUrl + '#dashboard'
  });
}
