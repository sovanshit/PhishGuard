// Background service worker for PhishGuard Extension

// Listen for tab updates (URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only check when page finishes loading
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    checkURL(tab.url, tabId);
  }
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && tab.url.startsWith('http')) {
    checkURL(tab.url, activeInfo.tabId);
  }
});

// Check URL for threats
function checkURL(url, tabId) {
  const result = analyzeURL(url);
  
  // Update badge based on status
  updateBadge(result.status, tabId);
  
  // Show notification if suspicious or malicious
  if (result.score < 58) {
    showThreatNotification(result);
  } else if (result.score < 80) {
    // Suspicious but not immediately dangerous
    console.log('Suspicious URL detected:', url, 'Score:', result.score);
  }
  
  // Save to storage
  saveToHistory(result);
}

// Analyze URL (same logic as popup)
function analyzeURL(url) {
  const l = url.toLowerCase();
  let score = 100;
  const flags = [];
  
  if (['.xyz', '.tk', '.ml', '.ga', '.cf', '.zip', '.click'].some(t => l.includes(t))) {
    score -= 25;
    flags.push('Suspicious TLD');
  }
  
  if (['paypa1', 'arnazon', 'g00gle', 'micros0ft', 'app1e', 'faceb00k', 'roblox-free', 'netflix-login', 'signin-', 'login-', 'verify-', 'secure-update'].some(t => l.includes(t))) {
    score -= 40;
    flags.push('Lookalike domain');
  }
  
  if (/https?:\/\/\d{1,3}\.\d{1,3}/.test(l)) {
    score -= 35;
    flags.push('IP address');
  }
  
  const dom = l.replace(/https?:\/\//, '').split('/')[0];
  if (dom.split('.').length > 4) {
    score -= 20;
    flags.push('Excessive subdomains');
  }
  
  if (l.startsWith('http://')) {
    score -= 20;
    flags.push('No SSL');
  }
  
  const pw = ['login', 'verify', 'secure', 'account', 'update', 'password', 'confirm', 'suspended', 'urgent'];
  const found = pw.filter(w => l.includes(w));
  if (found.length >= 2) {
    score -= 18;
    flags.push('Phishing keywords');
  }
  
  if (['bit.ly', 'tinyurl', 't.co', 'ow.ly', 'goo.gl'].some(s => l.includes(s))) {
    score -= 15;
    flags.push('URL shortener');
  }
  
  if (url.length > 120) {
    score -= 12;
    flags.push('Long URL');
  }
  
  if (url.includes('@') && !url.includes('mailto')) {
    score -= 20;
    flags.push('@ in URL');
  }
  
  const safe = ['google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com', 'wikipedia.org', 'youtube.com'];
  if (safe.some(d => l.includes(d))) score = Math.max(score, 88);
  
  score = Math.max(0, Math.min(100, score));
  
  let status;
  if (score >= 80) status = 'Safe';
  else if (score >= 58) status = 'Suspicious';
  else status = 'Malicious';
  
  return {
    url,
    score,
    status,
    flags,
    date: new Date().toLocaleString()
  };
}

// Update extension badge
function updateBadge(status, tabId) {
  const colors = {
    Safe: '#22C55E',
    Suspicious: '#f5a623',
    Malicious: '#ff4d4d'
  };
  
  const text = {
    Safe: '',
    Suspicious: '⚠',
    Malicious: '✗'
  };
  
  chrome.action.setBadgeBackgroundColor({ color: colors[status] || '#888', tabId });
  chrome.action.setBadgeText({ text: text[status] || '', tabId });
}

// Show threat notification
function showThreatNotification(result) {
  const title = result.status === 'Malicious' ? '🚨 Malicious Site Detected!' : '⚠️ Suspicious Site Detected!';
  const message = `This site scored ${result.score}/100 on our threat analysis. ${result.flags.length > 0 ? 'Issues: ' + result.flags.slice(0, 2).join(', ') : 'Proceed with caution.'}`;
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title,
    message,
    priority: 2
  });
}

// Save to history
function saveToHistory(result) {
  chrome.storage.local.get(['history', 'stats'], (data) => {
    // History
    const history = data.history || [];
    history.unshift(result);
    if (history.length > 100) history.pop();
    
    // Stats
    const stats = data.stats || { total: 0, blocked: 0 };
    stats.total++;
    if (result.score < 80) stats.blocked++;
    
    chrome.storage.local.set({ history, stats });
  });
}

// Listen for extension install
chrome.runtime.onInstalled.addListener(() => {
  console.log('PhishGuard Extension installed!');
  
  // Initialize storage
  chrome.storage.local.set({
    history: [],
    stats: { total: 0, blocked: 0 }
  });
});
