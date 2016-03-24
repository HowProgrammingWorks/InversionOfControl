console.log('From application 2  global context');

function SomeFunction(){
    console.log('Function all right');
}

module.exports ={
    SomeFunction : SomeFunction
};
