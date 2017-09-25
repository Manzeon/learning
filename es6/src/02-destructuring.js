/**
 * ES6允许按一定模式，从数组和对象中提取值，对变量进行赋值，称为解构
 */

/**
 * 数组的解构赋值
 * 如果等号的右边不是数组（或者严格地说，不是可遍历的结构），那么将会报错。
 */
let [a, b, c] = [1, 2, 3];
//表示可以从数组中取值，按对应位置赋值给变量

let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz //3

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined，解析不成功，变量值就等于undefined
z // []

let [a, [b], d] = [1, [2, 3], 4]; // 不完全解构
a // 1
b // 2
d // 4

// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

// 对于Set解构，也可以使用数组的解构赋值。
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"

// 事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5

/**
 * 默认值：解构赋值允许制定默认值
 */
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x = 'a', y = 'b'
// ES6内部使用严格相等运算符（===），判断一个位置是否有值
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
// 如果一个数组成员不严格等于undefined，默认值是不会生效的
let [x = 1] = [undefined];
x // 1
let [x = 1] = [null];
x // null

//如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。
function f() {
  console.log('aaa');
}
let [x = f()] = [1]; // x能取值1，所以函数f不会执行。

//默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError


/**
 * 对象的解构赋值
 * 因对象的属性没有次序，变量必须与属性名同名，才能取到正确的值
 * 无同属性名则取值undefined
 */
let { bar, foo } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: "aaa", bar: "bbb" };
baz // undefined

// 如果变量名与属性名不一致，必须写成下面这样。
var { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

// 这实际上说明，对象的解构赋值是下面形式的简写
//也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。
let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };


// 嵌套
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};
let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"

var node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};
var { loc, loc: { start }, loc: { start: { line }} } = node;
line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}
// 上面代码有三次解构赋值，分别是对loc、start、line三个属性的解构赋值。注意，最后一次对line属性的解构赋值之中，只有line是变量，loc和start都是模式，不是变量。

// 嵌套赋值
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
obj // {prop:123}
arr // [true]

// 对象解构制定默认值
var {x, y = 5} = {x: 1};
x // 1
y // 5
var {x: y = 3} = {x: 5};
y // 5

// 同样，默认值生效的条件是，对象的属性值严格等于undefined。
var {x = 3} = {x: undefined};
x // 3
var {x = 3} = {x: null};
x // null

// 果解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错。
let {foo: {bar}} = {baz: 'baz'}; // 报错

// 已声明变量用于解构赋值小心报错，如
let x;
{x} = {x: 1}; // SyntaxError: syntax error
// 因为JavaScript引擎将{x}理解成一个代码块，从而发生语法错误。
({x} = {x: 1}); // 正确的写法

// 对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量，以方便使用,，如Math对象中的方法：
let { log, sin, cos } = Math;

// 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3


/**
 * 字符串的解构赋值：字符串被转换成了一个类似数组的对象
 */
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
//类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。
let {length : len} = 'hello';
len // 5


/**
 * 数值、布尔值的解构赋值
 * 解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。
 */
// 解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。
let {toString: s} = 123;
s === Number.prototype.toString // true
let {toString: s} = true;
s === Boolean.prototype.toString // true

// 由于undefined和null无法转为对象，所以会报错】
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError


/**
 * 函数参数的解构赋值
 */
function add([x, y]){
	return x + y;
}
add([1, 2]); // 3

[[1, 2], [3, 4]].map(([a, b]) => a + b); // [ 3, 7 ]

// 函数参数的解构也可以使用默认值，为x和y指定默认值
function move({x = 0, y = 0} = {}) {
	return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

// 不一样的写法，为move的参数指定默认值
function move({x, y} = { x: 0, y: 0 }) {
	return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]

// undefined就会触发函数参数的默认值。
[1, undefined, 3].map((x = 'yes') => x);
// [ 1, 'yes', 3 ]

/**
 * ES6 的规则是，只要有可能导致解构的歧义，就不得使用圆括号。
 * 但是，这条规则实际上不那么容易辨别，处理起来相当麻烦。
 * 因此，建议只要有可能，就不要在模式中放置圆括号。
 */
[(b)] = [3]; // 正确
({ p: (d) } = {}); // 正确
[(parseInt.prop)] = [3]; // 正确
// 上面三行语句都可以正确执行，因为首先它们都是赋值语句，而不是声明语句；
// 其次它们的圆括号都不属于模式的一部分。
// 第一行语句中，模式是取数组的第一个成员，跟圆括号无关；
// 第二行语句中，模式是p，而不是d；
// 第三行语句与第一行语句的性质一致。


/**
 * 变量的解构赋值用途
 */
// 交换变量的值
let x = 1;
let y = 2;
[x, y] = [y, x]; // x = 2, y = 1;

// 从函数返回多个值
// 返回一个数组
function example() {
	return [1, 2, 3];
}
let [a, b, c] = example();
// 返回一个对象
function example() {
	return {
		foo: 1,
		bar: 2
	};
}
let { foo, bar } = example();

// 函数参数的定义
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);
// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});

// 提取JSON数据
let jsonData = {
	id: 42,
	status: "OK",
	data: [867, 5309]
};
let { id, status, data: number } = jsonData;
console.log(id, status, number);
// 42, "OK", [867, 5309]

// 函数参数的默认值
jQuery.ajax = function (url, {
	async = true,
	beforeSend = function () {},
	cache = true,
	complete = function () {},
	crossDomain = false,
	global = true,
	// ... more config
}) {
	// ... do stuff
};

// 遍历Map解构
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');
for (let [key, value] of map) {
  console.log(key + ' is ' + value);
}
// first is hello
// second is world

// 输入模块的指定方法
const {SourceMapConsumer, SourceNode} = require('source-map');