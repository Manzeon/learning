"use strict";

/**
 * let 命令用于声明变量，变量只在他所在代码块有效
 */
{
  var _a = 10;
  var b = 1;
}

// 实例
var a = [];

var _loop = function _loop(i) {
  a[i] = function () {
    console.log(i);
  };
};

for (var i = 0; i < 10; i++) {
  _loop(i);
}
a[6](); //=> 6
