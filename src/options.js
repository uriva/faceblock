// Saves options to localStorage.
function saveOptions() {
	localStorage['firebase'] = document.getElementById('firebase').value; 
  // Update status to let user know options were saved.
  var status = document.getElementById('status');
  status.innerHTML = 'Saved.';
  setTimeout(function() {
    status.innerHTML = '';
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restoreOptions() {
	document.getElementById('firebase').value = localStorage['firebase'];
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);