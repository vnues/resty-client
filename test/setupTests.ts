import JasmineCore from 'jasmine-core';
// @ts-ignore
import('jasmine-ajax');
global.getJasmineRequireObj = function () {
  return JasmineCore;
};
