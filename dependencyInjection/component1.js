'use strict';

const moduleName = {};
module.exports = moduleName;

const privateProperty = 'Privat variable value in Module1';

const privateFunction = () => {
  console.log('Output from private function of Module1');
};

privateFunction(privateProperty);

moduleName.publicProperty = 'Public property value in Module1';

moduleName.publicFunction = () => {
  console.log('Output from public function of Module1');
};
