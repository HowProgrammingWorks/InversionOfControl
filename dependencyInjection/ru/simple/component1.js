var moduleName = {};
module.exports = moduleName;

var privateProperty = 'Privat variable value in Module1';

var privateFunction = function() {
  console.log('Output from private function of Module1');
};

function localFunction() {
  console.log('Output from local function of Module1');
};

moduleName.publicProperty = 'Public property value in Module1';

moduleName.publicFunction = function() {
  console.log('Output from public function of Module1');
};
