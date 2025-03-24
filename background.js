// Debug logging function
function log(message) {
  console.log(`[Background] ${message}`);
}

// Convert cookies to Netscape format
function convertToNetscapeFormat(cookies) {
  log('Converting cookies to Netscape format');
  return cookies.map(cookie => {
    const secure = cookie.secure ? 'TRUE' : 'FALSE';
    const httpOnly = cookie.httpOnly ? 'TRUE' : 'FALSE';
    const path = cookie.path || '/';
    const expires = cookie.expirationDate 
      ? new Date(cookie.expirationDate * 1000).toISOString()
      : 'FALSE';
    
    return `${cookie.domain}\tTRUE\t${path}\t${secure}\t${expires}\t${cookie.name}\t${cookie.value}`;
  }).join('\n');
}

// Extract cookies from LinkedIn
async function extractLinkedInCookies(profileUrls, useOnlyProfiles, minLikes, numUsers, postsPerUser) {
  try {
    log('Starting cookie extraction');
    log('Profile URLs to process:', profileUrls);
    log('Use only profiles:', useOnlyProfiles);
    log('Parameters:', { minLikes, numUsers, postsPerUser });
    
    // Get all cookies from LinkedIn domains
    const cookies = await chrome.cookies.getAll({
      domain: 'linkedin.com'
    });
    
    log(`Found ${cookies.length} cookies`);
    
    // Convert to Netscape format
    const netscapeFormat = convertToNetscapeFormat(cookies);
    log('Cookies converted to Netscape format');
    log('Sample of converted cookies:');
    log(netscapeFormat.split('\n').slice(0, 3).join('\n')); // Log first 3 cookies for debugging
    
    // TODO: Replace with your actual backend API endpoint
    const API_ENDPOINT = 'http://localhost:8000/scrape-user-posts';
    
    // Send to backend
    log('Sending cookies to backend');
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        cookies: netscapeFormat,
        users: profileUrls,
        useOnlyInputProfiles: useOnlyProfiles,
        minLikes: minLikes,
        numUsers: numUsers,
        postsPerUser: postsPerUser
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    log('Received response from backend');
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    log(`Error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log(`Received message: ${request.action}`);
  
  if (request.action === 'extractCookies') {
    log('Starting cookie extraction process');
    // Handle the extraction asynchronously
    extractLinkedInCookies(
      request.profileUrls,
      request.useOnlyProfiles,
      request.minLikes,
      request.numUsers,
      request.postsPerUser
    )
      .then(response => {
        log('Sending response back to popup');
        sendResponse(response);
      })
      .catch(error => {
        log(`Error during extraction: ${error.message}`);
        sendResponse({
          success: false,
          error: error.message
        });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});   