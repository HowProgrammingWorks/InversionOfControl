console.log('From application 2  global context');

function SomeFunction(){
    console.log('Function all right');
};

module.exports ={
    SomeFunction : SomeFunction
};

module.exports.print = function(text) {

    for(i=0; i<=3;i++){
        console.log(text);
    }

}

module.exports.variable = 42;
module.exports.word = 'inversion';


