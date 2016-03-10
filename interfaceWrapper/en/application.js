// Print something
console.log('From application global context');

// Declare function for timer event
function timerEvent() {
  console.log('From application timer event');
}

// Create timer
setTimeout(timerEvent, 1000);
