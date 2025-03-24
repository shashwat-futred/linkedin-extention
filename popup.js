// Debug logging function
function log(message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(`[Popup] ${message}`, data || '');
  
  const debugLog = document.getElementById('debugLog');
  const logEntry = document.createElement('div');
  logEntry.textContent = logMessage;
  if (data) {
    const dataEntry = document.createElement('pre');
    dataEntry.textContent = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    logEntry.appendChild(dataEntry);
  }
  debugLog.insertBefore(logEntry, debugLog.firstChild);
}

// Show status message
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = isError ? 'error' : 'success';
  status.style.display = 'block';
  log(message);
}

// Display generated posts
function displayGeneratedPosts(posts) {
  const postsContainer = document.getElementById('generatedPosts');
  postsContainer.textContent = posts;
  postsContainer.style.display = 'block';
}

// Parse profile URLs from input
function parseProfileUrls(input) {
  
  const urls = input.split(',').map(url => url.trim());
  
  // Validate URLs
  const validUrls = urls.filter(url => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('linkedin.com');
    } catch {
      return false;
    }
  });
  
  
  return validUrls;
}

// Validate number inputs
function validateNumberInputs() {
  const minLikes = parseInt(document.getElementById('minLikes').value);
  const numUsers = parseInt(document.getElementById('numUsers').value);
  const postsPerUser = parseInt(document.getElementById('postsPerUser').value);

  if (isNaN(minLikes) || minLikes < 0) {
    throw new Error('Minimum likes must be a non-negative number');
  }
  if (isNaN(numUsers) || numUsers < 1) {
    throw new Error('Number of users must be at least 1');
  }
  if (isNaN(postsPerUser) || postsPerUser < 1) {
    throw new Error('Posts per user must be at least 1');
  }

  return { minLikes, numUsers, postsPerUser };
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  log('Popup initialized');
  
  const extractButton = document.getElementById('extractCookies');
  const profileUrlsInput = document.getElementById('profileUrls');
  const useOnlyProfilesCheckbox = document.getElementById('useOnlyProfiles');
  
  extractButton.addEventListener('click', async () => {
    try {
      log('Extract button clicked');
      extractButton.disabled = true;
      showStatus('Extracting cookies...');
      
      // Parse and validate URLs
      const profileUrls = parseProfileUrls(profileUrlsInput.value);
      log('Parsed profile URLs:', profileUrls);
      
      // Get checkbox state
      const useOnlyProfiles = useOnlyProfilesCheckbox.checked;
      log('Use only profiles:', useOnlyProfiles);

      // Validate and get number inputs
      const { minLikes, numUsers, postsPerUser } = validateNumberInputs();
      log('Number inputs:', { minLikes, numUsers, postsPerUser });
      
      // Send message to background script
      log('Sending message to background script');
      const response = await chrome.runtime.sendMessage({ 
        action: 'extractCookies',
        profileUrls: profileUrls,
        useOnlyProfiles: useOnlyProfiles,
        minLikes: minLikes,
        numUsers: numUsers,
        postsPerUser: postsPerUser
      });
      log('Received response from background script', response);
      
      if (response.success) {
        showStatus('Cookies extracted successfully!');
        if (response.data && response.data.generated_posts) {
          displayGeneratedPosts(response.data.generated_posts);
        }
      } else {
        throw new Error(response.error || 'Failed to extract cookies');
      }
    } catch (error) {
      log(`Error: ${error.message}`);
      showStatus(error.message, true);
    } finally {
      extractButton.disabled = false;
    }
  });
}); 