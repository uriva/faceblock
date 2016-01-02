var key = '1d01ed71e9c6b2027bee46ae53094e24';

var recognize = function(file_id) {
  var url = 'http://api.newocr.com/v1/ocr';
  $.get(url, {key: key, file_id: file_id, lang: eng, psm: 3},
        function(data) {console.log(data, data.text);})
};

var upload = function(image) {
  var url = 'http://api.newocr.com/v1/upload?key=' + key;
  var formData = new FormData();
  formData.append('file', image);
  var request = new XMLHttpRequest();
  request.open('POST', url);
  request.setRequestHeader('Content-type', 'multipart/form-data');
  request.send(formData);
};


var capture = function() {
  chrome.tabs.captureVisibleTab(null, {'format': 'png'}, function(image) {
    console.log('image taken', image);
    upload(image);
  });
};

// Listens when new request
chrome.webRequest.onHeadersReceived.addListener(function(details) {
  for (i = 0; i < details.responseHeaders.length; i++) { 
    if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
      var csp = details.responseHeaders[i].value;
      console.log(csp);
      csp = csp.replace(
          'script-src',
          'script-src https://cdn.firebase.com https://*.firebaseio.com');
      console.log(csp);
      details.responseHeaders[i].value = csp;
    }
  }
  return { // Return the new HTTP header
    responseHeaders: details.responseHeaders
  };
}, {
  urls: ['https://*.facebook.com/*'],
  types: ["main_frame"]
}, ['blocking', 'responseHeaders']);
 
 
function isCSPHeader(headerName) {
  return (headerName == 'CONTENT-SECURITY-POLICY') ||
         (headerName == 'X-WEBKIT-CSP');
}

// Stuff for saving.

var myFirebaseRef = new Firebase(localStorage['firebase']);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request arrived', request, sender);
  if (request.method == 'save') {
    console.log('saving to firebase');
    myFirebaseRef.push(request.data);
  }
});

// On extension button click.

chrome.browserAction.onClicked.addListener(function(activeTab) {
  chrome.tabs.executeScript(null, {file: 'jquery.min.js'});
  chrome.tabs.executeScript(null, {file: 'visibility.min.js'});
  chrome.tabs.executeScript(null, {file: 'index_page.js'});
});