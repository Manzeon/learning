/**
 * let 命令用于声明变量，变量只在他所在代码块有效
 */
{
  let a = 10;
  var b = 1;
}

// 实例
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6]();//=> 6
