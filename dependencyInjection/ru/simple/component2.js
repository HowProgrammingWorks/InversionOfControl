var moduleName = {};
module.exports = moduleName;

var privateProperty = 'Privat variable value in Module2';

var privateFunction = function() {
  console.log('Output from private function of Module2');
};

function localFunction() {
  console.log('Output from local function of Module2');
};

moduleName.publicProperty = 'Public property value in Module2';

moduleName.publicFunction = function() {
  console.log('Output from public function of Module2');
};
