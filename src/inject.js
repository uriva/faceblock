var getFeed = function() {
  return jQuery('#contentArea');
};


var createInput = function() {
  var input = jQuery('<button onclick="getFeed().toggle()">I want to be distracted</button>');
  var toolbar = jQuery('#pagelet_bluebar');
  input.appendTo(toolbar);
}

var wrapper = function() {
  console.log(getFeed());
  console.log('hiding')
  getFeed().hide();
  createInput();
};

//setTimeout(wrapper, 3000);