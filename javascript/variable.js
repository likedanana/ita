//1. Use strict
//엄격한 기준 사용
//오류 방지 & 효율성 증대
'use strict';

//2. Variable, rw(read/write)
//let(ES6)
let globalName = 'global name';
{
  let name = 'dana';
  console.log(name);
  name = 'hello';
  console.log(name);
  console.log(globalName);
}
console.log(name);
console.log(globalName);

//[참고]
// let 이전에 사용하던 var을 더이상 사용하면 안되는 이유
// 1) 선언하지 않고도 사용 가능(var hoisting)
// 어디에서 선언했냐에 상관없이 항상 선언을 
// 제일 위로 끌어올려주는 것 
// 2) blockscope 무시

//3. Constant, r(read only)
//변경할 수 없는 immutable 데이터 타입
//변경할 다른 이유가 없다면, const 사용!
//보안상의 이유, 스레드 안정성, 실수 최소화
const daysInWeek = 7;
const maxNumber = 5;

//immutable data types : premitive types, frozen objrcts
//mutable data types : 모든 object는 mutable이 default


//4. Variable types
//* 숫자 : number

const count = 17;
const size = 17.1;
console.log(`value: ${count}, type: ${typeof count}`);
console.log(`value: ${size}, type: ${typeof size}`);

//무한, -무한, not a number
//유효한 값인지 확인!
const infinity = 1/0;
const negativeInfinity = -1/0;
const nAn = 'not a number' / 2;

console.log(infinity);
console.log(negativeInfinity);
console.log(nAn);

//bigInt (최근에 추가됨 / 크롬, 파이어폭스만 지원)
//number의 범위 : -2*53 ~ 2*53
//범위 밖 숫자 : n을 붙여 bigint 타입 사용
const number= 123456890123456789012345678901234567890;
const bigInt= 123456890123456789012345678901234567890n;
console.log(`value: ${number}, type : ${typeof number}`);
console.log(`value: ${bigInt}, type : ${typeof bigInt}`);

//* 문자 : string
//한 글자, 여러 글자 모두

const char = 'c';
const brendan = 'brendan';
const greeting = 'hello '+brendan;
console.log(`value: ${greeting}, type: ${typeof greeting}`);
//template literals `${변수이름}`
//백탭`안에 ${}에 변수를 넣으면 문자로 출력됨
const hiBrendan = `hi ${brendan}`;
console.log(`value: ${hiBrendan}, type: ${typeof hiBrendan}`);
//template literals 없다면...
console.log('value: ' + hiBrendan + ', type: ' + typeof hiBrendan);

//* 참, 거짓 : boolean
//false : 0, null, undefined, NaN, ''
//true : 그 외
const canRead = true;
const test = 3 < 1;//false
console.log(`value: ${canRead}, type: ${typeof canRead}`);
console.log(`value: ${test}, type: ${typeof test}`);

let nothing = null;
console.log(`value: ${nothing}, type: ${typeof nothing}`);

let x;
let y = undefined;
console.log(`value: ${x}, type: ${typeof x}`);
console.log(`value: ${y}, type: ${typeof y}`);

//* symbol
//고유한 식별자를 주고 싶을 때, 우선순위를 주고 싶을 때

const name1 = 'dana';
const name2 = 'dana';
console.log(name1==name2);

const symbol1 = Symbol('id');
const symbol2 = Symbol('id');
console.log(symbol1==symbol2);

//같은 문자열에 같은 심볼을 주고 싶을 때 : for
const gSymbol1 = Symbol.for('id');
const gSymbol2 = Symbol.for('id');
console.log(gSymbol1==gSymbol2);
//console.log(`value: ${symbol1}, type: ${typeof symbol1}`); //오류
console.log(`value: ${symbol1.description}, type: ${typeof symbol1}`);

//object 
//const로 선언해도 안의 값은 변경가능mutable
const dana = {name: 'dana', age: 20};
console.log(`value: ${dana.age}, type: ${typeof dana.age}`);
dana.age = 21;
console.log(`value: ${dana.age}, type: ${typeof dana.age}`);

//5. Dynamic Typing
//프로그램이 동작할 때, 할당된 값에 따라 타입 변경됨
let text = 'hello';
console.log(text.charAt(0));//h
console.log(`value: ${text}, type: ${typeof text}`);
text = 1;
console.log(`value: ${text}, type: ${typeof text}`);
text = 1 + '5';
console.log(`value: ${text}, type: ${typeof text}`);
text = 4 / '2';
console.log(`value: ${text}, type: ${typeof text}`);
// console.log(text.charAt(0));//error

//typescript = js + type
