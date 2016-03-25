//console.log('From application2 global context');
function superFunction() {
    console.log('All fine');
}	
module.exports = {
    superFunction : superFunction
};