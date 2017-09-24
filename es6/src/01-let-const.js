/**
 * let 命令用于声明变量，变量只在他所在代码块有效
 */
{
	let a = 10;
	var b = 1;
}

/**
 * 实例：i 只对本轮循环有效，所以每次循环，i其实都是一个新的变量
 * 循环时JavaScript引擎内部会记住上一轮循环的值，初始化本轮标量i时，就会在上一轮循环的基础上的进行计算
 */
var a = [];
for (let i = 0; i < 10; i++) {
	a[i] = function() {
		console.log(i);
	};
}
a[6](); //=> 6

/**
 * 特别地：for循环中，设置环境变量那部分是一个父作用域，而循环体内部是一个单独的子作用域。
 * 以下会连续输出三次'abc'。
 * 但转码为ES5代码时，只会将let转为var，不会达到同样的效果。
 * 即转码后只输出一次'abc'。
 */
for (let i = 0; i < 3; i++) {
	let i = 'abc';
	console.log(i);
}

/**
 * 不存在变量提升
 * 以下代码会报错ReferenceError
 */
console.log(bar);
let bar = 2;

/**
 * 暂时性死区 - Temporal Dead Zone
 * 只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。
 * 以下代码会报错。
 * ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。
 * 凡是在声明之前就使用这些变量，就会报错。
 */
var tmp = 123;
if (true) {
	tmp = 'abc'; // ReferenceError
	let tmp;
}

// 暂时性死区对typeof的影响
typeof x; // ReferenceError
let x;
typeof undeclared_variable; // undefined

// 隐蔽的死区
function bar(x = y, y = 2) {
	return [x, y];
}
bar(); // x默认值等于未声明的y会报错，两个参数位置换过来就不会报错

var x = x; // 不报错
let x = x; // ReferenceError

/**
 * let不允许在相同作用域内，重复声明同一个变量
 */
// 报错
function func() {
	let a = 10;
	var a = 1;
}

// 报错
function func() {
	let a = 10;
	let a = 1;
}

function func(arg) {
	let arg; // 报错
}

function func(arg) {
	{
		let arg; // 不报错
	}
}

/**
 * 没有块级作用域带来的不合理
 */
var tmp = new Date();
function f() {
	console.log(tmp);
	if (false) {
		var tmp = 'hello world';
	}
}
f();// undefined，var导致变量提升，覆盖了外层的tmp。

var s = 'hello';
for (var i = 0; i < s.length; i++) {
	console.log(s[i]);
}
console.log(i); // 5 i只用来控制循环的，但循环结束后没有消失，泄露成了全局变量

/**
 * ES6的块级作用域
 * let实际上为 JavaScript 新增了块级作用域。
 * ES6允许块级作用域的任意嵌套
 * 块级作用域的出现，实际上使得获得广泛应用的立即执行函数表达式（IIFE）不再必要了。如下
 */
// IIFE 写法
(function () {
	var tmp = 1;
	//...
})();

// 块级作用域写法
{
	let tmp = 1;
	//...
}

/**
 * 块级作用域与函数声明
 * ES5规定函数只能在顶层作用域和函数作用域中声明，不能在块级作用域声明，不过很多浏览器没有遵守这个规定，以兼容以前的旧代码。
 * ES6明确允许在块级作用域中声明函数，且块级作用域之外不可引用。
 */
function f() {
	console.log('I am outside!');
}
(function () {
	if (false) {
		// 重复声明一次函数f
		function f() {
			console.log('I am inside!');
		}
	}
	f();
})();// 在ES5中，函数f会被提升到函数的头部，所以最后会输出"I am inside!"

// 而在ES6中，会直接报错，在符合ES6的浏览器中，实际运行如下
function f() {
	console.log('I am outside!');
}
(function () {
	var f = undefined;
	if (false) {
		function f() {
			console.log('I am inside!');
		}
	}
	f();
})();
// Uncaught TypeError: f is not a function

// 考虑环境导致的差异太大，应该避免块级作用域内声明函数，如确实需要，应写成函数表达式，而不是声明语句。
// 函数声明
{
	let a = 'secret';
	function f() {
		return a;
	}
}
// 函数表达式
{
	let a = 'secret';
	let f = function() {
		return a;
	};
}
// 注意：ES6的块级作用域允许声明函数的规则只在使用大括号的情况下成立，如果没有使用大括号，就会报错。
// 报错
'use strict';
if (true)
	function f() {}

/**
 * const 命令
 * 声明一个只读的常量，重新赋值会报错，且不能重复声明，所以声明的时候必须要赋值，否则就会报错。
 * const作用域与let相同，只在块级作用域内有效。
 * const声明的常量也是不提升的，同样存在暂时性死区。
 */
const PI = 3.1415；
var message = "Hello!";
let age = 25;

// 以下两行都会报错
const message = "Goodbye!";
const age = 30;

/**
 * const 本质
 * 实际上并不是变量的值不能改变，而是变量指向的地址不得改动。
 * 对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
 * 但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指针，const只能保证这个指针是固定的。
 */
const foo = {};
// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only

const a = [];
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = ['Dave'];    // 报错

// 如果想冻结对象，应该使用object.freeze方法
const foo = Object.freeze({});
foo.prop = 123;// 常规模式下，不起作用；严格模式下报错。
// 但是除了将对象本身冻结，还需要对对象的属性冻结，下面是一个将对象彻底冻结的函数。
var constantize = (obj) => {
	Object.freeze(obj);
	Object.keys(obj).forEach((key, i) => {
		if (typeof obj[key] === 'Object') {
			constantize(obj[key]);
		}
	})
}

/**
 * 顶层对象的属性
 * 在浏览器中指window对象，在node指的是global
 * ES5中，顶层对象的属性与全局变量是等价的
 * ES6为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从ES6开始，全局变量将逐步与顶层对象的属性脱钩。
 */
var a = 1;
// 如果在Node的REPL环境，可以写成global.a
// 或者采用通用方法，写成this.a
window.a // 1
let b = 1;
window.b // undefined

/**
 * 获取顶层对象
 * 浏览器里面，顶层对象是window，但Node和WebWorker没有window。
 * 浏览器和WebWorker里面，self也指向顶层对象，但是Node 没有self。
 * Node里面，顶层对象是global，但其他环境都不支持。
 *
 * this局限性
 * 全局环境中，this会返回顶层对象。但是，Node 模块和 ES6 模块中，this返回的是当前模块。
 * 函数里面的this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，严格模式下，这时this会返回undefined。
 * 不管是严格模式，还是普通模式，new Function('return this')()，总是会返回全局对象。但是，如果浏览器用了CSP（Content Security Policy，内容安全政策），那么eval、new Function这些方法都可能无法使用。
 */
// 获取顶层对象方法一
(typeof window !== 'undefined' ? window	: (typeof process === 'object' &&	typeof require === 'function' && typeof global === 'object') ? global : this);

// 方法二
var getGlobal = function () {
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
};
