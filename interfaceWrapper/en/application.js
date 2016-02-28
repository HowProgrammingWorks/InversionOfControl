// Print from the global context of application module
console.log('From application global context');

// Declare function for timer event
function timerEvent() {
  console.log('From application timer event');
}

// Set function to timer event for 1sec
setTimeout(timerEvent, 1000);
