/**
 * 字符串的扩展
 */

/**
 * 字符的Unicode表示法
 * JavaScript 允许采用\uxxxx形式表示一个字符，其中xxxx表示字符的 Unicode 码点。
 * 但是，这种表示法只限于码点在\u0000~\uFFFF之间的字符。超出这个范围的字符，必须用两个双字节的形式表示。
 */
"\u0061" // "a"
"\uD842\uDFB7" // "𠮷"
"\u20BB7" // " 7"

// ES6中，只要将码点放入大括号，就能正确读该字符
"\u{20BB7}" // "𠮷"
"\u{41}\u{42}\u{43}" // "ABC"

let hello = 123;
hell\u{6F} // 123

'\u{1F680}' === '\uD83D\uDE80' // true

// JavaScript中6种表示字符的方法
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true

/**
 * codePointAt()
 * 能够正确处理4个字节储存的字符，返回一个字符的码点
 */
var s = "𠮷"; // 码点0x20BB7
s.length // 2
s.charAt(0) // '' charAt方法无法读取整个字符
s.charAt(1) // ''
s.charCodeAt(0) // 55362 charCodeAt方法只能分别返回前两个字节和后两个字节的值
s.charCodeAt(1) // 57271

let s = '𠮷a';
s.codePointAt(0) // 134071(0x20BB7),正确地识别了“𠮷”
s.codePointAt(1) // 57271,“𠮷”的后两个字节
s.codePointAt(2) // 97,字符“a”
// 对于那些两个字节存储的常规字符，他返回结构与charCodeAt方法相同
// codePointAt方法的参数仍然不正确，使用for...of循环，他就会正确识别32位的UTF-16字符
let s = '𠮷a';
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));
}
// 20bb7
// 61

// codePointAt方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}
is32Bit("𠮷") // true
is32Bit("a") // false


/**
 * String.fromCodePoint()
 * ES5提供String.fromCharCode方法，用于从码点返回对应字符串，但不能识别32位的UTF-16字符
 * ES6提供String.fromCodePoint方法，可用于识别大于0xFFFF的字符，弥补上述方法的不足。
 */
String.fromCharCode(0x20BB7)// "ஷ"，最高位2被舍弃
String.fromCodePoint(0x20BB7) // "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y' // true，左边合并成一个字符串返回=>"x🚀y"

/**
 * 字符串的遍历器接口
 * ES6为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历。
 */
for (let codePoint of 'foo') {
	console.log(codePoint)
}
// "f"
// "o"
// "o"

let text = String.fromCodePoint(0x20BB7);
for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "
for (let i of text) {
  console.log(i);
}
// "𠮷"


/**
 * at()
 * ES5中charAt()返回字符串给定位置的字符，该方法不能识别码点大于0xFFFF的字符
 * 目前有提案，字符串实例at方法，可以识别Unicode编号大于0xFFFF的字符，返回正确的字符。
 * 现在可以通过垫片库实现：https://github.com/es-shims/String.prototype.at
 */
'abc'.at(0) // "a"
'𠮷'.at(0) // "𠮷"


/**
 * includes(),startsWith(),endsWidth()
 * 传统上只有indexOf方法，可以用来确定字符串是否包含在另一个字符串中
 * ES6提供了三种新方法
 * includes(): 返回布尔值，表示是否找到参数字符串
 * startsWith(): 返回布尔值，表示参数字符串是否在原字符串的头部
 * endsWith(): 返回布尔值，表示参数字符串是否在原字符串的尾部
 */
let s = 'Hello world!';
s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

// 这三个方法都支持第二个参数，表示开始搜索的位置。
let s = 'Hello world!';
s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true, 针对前n个字符
s.includes('Hello', 6) // false

/**
 * repeat()
 * 返回一个新字符串，表示原字符串重复几次
 */
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""

'na'.repeat(2.9) // "nana" 小数取整
'na'.repeat(Infinity) // RangeError 报错
'na'.repeat(-1) // RangeError 报错
'na'.repeat(-0.9) // "" 但是，如果参数是0到-1之间的小数，则等同于0，这是因为会先进行取整运算。0到-1之间的小数，取整以后等于-0，repeat视同为0。
'na'.repeat(NaN) // "" 参数NaN等同于0。

'na'.repeat('na') // "" 如果repeat的参数是字符串，则会先转换成数字。
'na'.repeat('3') // "nanana"


/**
 * padStart(), padEnd()
 * ES2017 引入字符串补全长度的功能
 * 字符不够指定长度时，会在头部或者尾部补全
 * 第一个参数用来指定字符串最少长度，第二个参数时用来补全的字符串
 */
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'

// 等于或者大于指定最小长度，则返回原字符串
'xxx'.padStart(2, 'ab') // 'xxx'

// 两者长度之和超过了指定的最小长度，则会截取超出位数的补全字符串
'abc'.padStart(10, '0123456789') // '0123456abc'

// 如果省略第二个参数，默认使用空格补全长度。
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '

// 用途：补全指定位数、提示字符串格式
'12'.padStart(10, '0') // "0000000012"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"


/**
 * 模板字符串
 * 用反引号(`)标识
 * 如果在模板字符串中需要使用反引号，则前面要用反斜杠转义
 */
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

// 字符串中嵌入变量，需要将变量名写在${}之中，变量没有声明会报错
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`

//如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。
$('#list').html(`
<ul>
  <li>first</li>
  <li>second</li>
</ul>
`);
// 要想去掉ul前面的换行，可以用trim方法消除它。
$('#list').html(`
<ul>
  <li>first</li>
  <li>second</li>
</ul>
`.trim());

// 大括号内部可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性。
let x = 1;
let y = 2;
`${x} + ${y} = ${x + y}` // "1 + 2 = 3"

let obj = {x: 1, y: 2};
`${obj.x + obj.y}` // "3"

// 模板字符串之中还能调用函数。
function fn() {
  return "Hello World";
}
`foo ${fn()} bar` // foo Hello World bar

// 大括号内部是一个字符串时，原样输出。
`Hello ${'World'}` // "Hello World"

// 模板字符串的嵌套
const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
const data = [
    { first: '<Jane>', last: 'Bond' },
    { first: 'Lars', last: '<Croft>' },
];
console.log(tmpl(data));

// 如果需要引用模板字符串本身，在需要时执行，可以像下面这样写。
// 写法一
let str = 'return ' + '`Hello ${name}!`';
let func = new Function('name', str);
func('Jack') // "Hello Jack!"
// 写法二
let str = '(name) => `Hello ${name}!`';
let func = eval.call(null, str);
func('Jack') // "Hello Jack!"


/**
 * 标签模板
 * 紧跟在一个函数名后面，该函数将调用来处理这个模板的字符串。
 * 标签模板其实不是模板，而是函数调用的一种特殊形式。
 * “标签”指的就是函数，紧跟在后面的模板字符串就是它的参数。
 */
alert`123`
// 等同于
alert(123)

// 模板字符里面有变量，是会将模板字符串先处理成多个参数，再调用函数。
let a = 5;
let b = 10;
function tag(s, v1, v2) {
  console.log(s[0]);
  console.log(s[1]);
  console.log(s[2]);
  console.log(v1);
  console.log(v2);

  return "OK";
}
// 第一个参数是数组，该数组的成员是模板字符串中那些没有变量替换的部分
// 其他参数都是模板字符串变量被替换后的值
tag`Hello ${ a + b } world ${ a * b}`;
// tag(['Hello ', ' world', ''], 15, 50);
// "Hello "
// " world "
// ""
// 15
// 50
// "OK"

let total = 30;
let msg = passthru`The total is ${total} (${total*1.05} with tax)`;
function passthru(literals) {
  let result = '';
  let i = 0;
  while (i < literals.length) {
    result += literals[i++];
    if (i < arguments.length) {
      result += arguments[i];
    }
  }
  return result;
}
msg // "The total is 30 (31.5 with tax)"

// 采用rest参数的写法
function passthru(literals, ...values) {
  let output = "";
  for (let index = 0; index < values.length; index++) {
    output += literals[index] + values[index];
  }

  output += literals[index]
  return output;
}

// 过滤HTML字符串
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;
function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);
    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}

// 模板处理函数的第一个参数（模板字符串数组），还有一个raw属性。
// 保存的是转义后的原字符串。
console.log`123`
// ["123", raw: Array[1]]


/**
 * String.raw()
 * ES6为原生的String对象提供raw方法
 * 一般用来充当模板字符串的处理函数，返回一个斜杠都被转义的字符串，对应于替换变量后的模板字符串
 */
// String.raw代码如下
String.raw = function (strings, ...values) {
  let output = "";
  for (let index = 0; index < values.length; index++) {
    output += strings.raw[index] + values[index];
  }
  output += strings.raw[index]
  return output;
}

String.raw`Hi\n${2+3}!`; // "Hi\\n5!"
String.raw`Hi\u000A!`; // 'Hi\\u000A!'

String.raw`Hi\\n` // "Hi\\n" 如果原字符串的斜杠已经转义，那么String.raw不会做任何处理。

// String.raw方法也可以作为正常的函数使用。
// 这时，它的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该是一个数组。
String.raw({ raw: 'test' }, 0, 1, 2); // 't0e1s2t'
// 等同于
String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);


/**
 * 模板字符串的限制
 * 
 */
// 前面提到标签模板里面，可以内嵌其他语言。但是，模板字符串默认会将字符串转义，导致无法嵌入其他语言。
//举例来说，标签模板里面可以嵌入 LaTEX 语言。
function latex(strings) {
  // ...
}

let document = latex`
\newcommand{\fun}{\textbf{Fun!}}  // 正常工作
\newcommand{\unicode}{\textbf{Unicode!}} // 报错
\newcommand{\xerxes}{\textbf{King!}} // 报错

Breve over the h goes \u{h}ere // 报错
`
// 上面代码中，变量document内嵌的模板字符串，对于 LaTEX 语言来说完全是合法的，但是 JavaScript 引擎会报错。原因就在于字符串的转义。

// 模板字符串会将\u00FF和\u{42}当作 Unicode 字符进行转义，所以\unicode解析时报错；而\x56会被当作十六进制字符串转义，所以\xerxes会报错。也就是说，\u和\x在 LaTEX 里面有特殊含义，但是 JavaScript 将它们转义了。

// 为了解决这个问题，现在有一个提案，放松对标签模板里面的字符串转义的限制。如果遇到不合法的字符串转义，就返回undefined，而不是报错，并且从raw属性上面可以得到原始字符串。

function tag(strs) {
  strs[0] === undefined
  strs.raw[0] === "\\unicode and \\u{55}";
}
tag`\unicode and \u{55}`
// 上面代码中，模板字符串原本是应该报错的，但是由于放松了对字符串转义的限制，所以不报错了，JavaScript引擎将第一个字符设置为undefined，但是raw属性依然可以得到原始字符串，因此tag函数还是可以对原字符串进行处理。

// 注意，这种对字符串转义的放松，只在标签模板解析字符串时生效，不是标签模板的场合，依然会报错。
let bad = `bad escape sequence: \unicode`; // 报错
