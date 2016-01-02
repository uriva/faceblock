var allDescendants = function(node, callback) {
  for (var i = 0; i < node.childNodes.length; i++) {
    if (callback(node)) allDescendants(node.childNodes[i], callback);
  }
};

var getSelectionText = function() {
  var text = '';
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != 'Control') {
    text = document.selection.createRange().text;
  }
  return text;
}

var isElementInViewport = function(el) {
  var rect = el.getBoundingClientRect();
  return (rect.top >= 0) && (rect.left >= 0) &&
         (rect.bottom <= window.innerHeight) &&
         (rect.right <= window.innerWidth);
};

var isElementOutsideOfViewport = function(el) {
  var rect = el.getBoundingClientRect();
  return (rect.bottom < 0) || (rect.left > window.innerWidth) ||
          (rect.top > window.innerHeight) || (rect.right < 0);
};

var indexHelper = function(node) {
  var all = [];
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (node.nodeType == 3) {
      all.push(node);
    } 
    if (node.nodeType == 1) {
      if (!isElementOutsideOfViewport(node) && node.tagName != 'SCRIPT' &&
          node.tagName != 'STYLE')
        all = all.concat(indexHelper(node));
    }
  }
  return all;
};

var index = function() {
  return indexHelper(document.body)
      .map(node => node.nodeValue.trim())
      .filter(text => text);
};

var indexAndSave = function() {
  var data = {
    text: index().join('\n'),
    location: window.location.href,
    time: Date.now()
  };
  console.log('indexed and saving', data);
  chrome.runtime.sendMessage({method: 'save', data: data}, () => {});
};

indexAndSave();



// Grabs snapshot every 5 seconds.
// Visibility.every(5 * 1000, indexAndLoad);