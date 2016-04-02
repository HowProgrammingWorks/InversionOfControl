function someFunction(arg1, arg2) {
   console.log('Exported function'); 
   console.log(arg1 + ' - ' + arg2);
}

someFunction('some', 'function');

module.exports = someFunction; 

