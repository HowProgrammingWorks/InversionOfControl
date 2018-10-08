'use strict';

const moduleName = {};
module.exports = moduleName;

const privateProperty = 'Privat variable value in Module2';

const privateFunction = s => {
  console.log('Output from private function of Module2');
  console.log(s);
};

privateFunction(privateProperty);

moduleName.publicProperty = 'Public property value in Module2';

moduleName.publicFunction = () => {
  console.log('Output from public function of Module2');
};
