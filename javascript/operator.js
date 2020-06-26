'use strict';

//1. String concatenation 

console.log('my' + ' cat');
console.log('1 ' + 2);
console.log(
  `string literals:
  
  
  ''''
  1 + 2 = ${1+2}`
);

console.log("ellie's \n\tbook");

//2. Numeric operators
console.log(1 + 1);
console.log(1 - 1);
console.log(1 / 1);
console.log(1 * 1);
console.log(5 % 2);// remainder
console.log(2 ** 3);// exponentiation 2^3

//3. Increment & decrement operators
let counter = 2;

const preIncrement = ++counter;
// counter + 1;
//preIncrement = counter;
console.log(`preIncrement: ${preIncrement}, counter: ${counter}`);

const postIncrement = counter++;
//preIncrement = counter;
// counter + 1;
console.log(`postIncrement: ${preIncrement}, counter: ${counter}`);

const preDecrement = --counter;
console.log(`preDecrement: ${preDecrement}, counter: ${counter}`);
const postDecrement = counter--;
console.log(`preDecrement: ${postDecrement}, counter: ${counter}`);

//4. Assignment operators
let x = 3;
let y = 6;
x += y;//x = x + y;
x -= y;
x *= y;
x /= y;

//5. comparison operators
console.log(10<6);
console.log(10 <= 6);
console.log(10 > 6);
console.log(10 >= 6);

//6. Logical operators: ||(or), &&(and), !(not)

const value1 = false;//true 로 바꾸면 oOo 출력 x!
const value2 = 4 < 2;

function check() {
  for (let i = 0; i < 10; i++){
    //wasting time
    console.log('oOo');
  }
  return true;
}

console.log(`or: ${value1 || value2 || check()}`);// 개중 하나라도 true면 true
console.log(`and: ${value1 && value2 && check()}`);// 개중 하나라도 false면 false
// 그러므로 둘 다 가장 가벼운 연산부터 적는 것이 효율적!

//and는 null 체크할 때도 사용됨. 
//nullableOb && nullableObt.something
//=> nullableOb가 null이 아니면 something을 가져오세요

console.log(`value: ${!value1}`);

//7. Equality
const strFive = '5';
const numFive = 5;

//loose equality, with type conversion
console.log(strFive == numFive); 
console.log(strFive != numFive); 

//strict equality, with type conversion *권장됨*
console.log(strFive === numFive); 
console.log(strFive !== numFive); 

// object equality by reference 
const dana1 = { name: 'dana'};
const dana2 = { name: 'dana'};
const dana3 = dana1;

//!레퍼런스 값을 비교합니다
console.log(dana1 == dana2);//f
console.log(dana1 === dana2);//f
console.log(dana1 === dana3);//t

//quiz
console.log(0 == false);//t
console.log(0 === false);//f
console.log('' == false);//t
console.log('' === false);//f
console.log(null == undefined);//t
console.log(null === undefined);//f

//8. conditional operators: if
//if, else if, else
const name = 'ellie';
if (name === 'ellie') {
  console.log('Welcome, Ellie!');
} else if (name === 'coder') {
  console.log('you amazing');
} else {
  console.log('unknown');
}

//9. Ternary operator : ? *논리가 간단할 때 사용*
console.log(name === 'ellie' ? 'yes' : 'no');
//name === ellie니? 맞으면 앞 틀리면 뒤

//10. Switch
const browser = 'IE';
switch (browser) {
  case 'IE':
    console.log('go away!');
    break;
  case 'Chrome':
  case 'Firefox':
    console.log('love you');
    break;
  default:
    console.log('sameall');
    break;
}

//11. Loops
//while
let i = 3;
while (i > 0) {
  console.log(`while: ${i}`);
  i--;
}

//i==0;

//do while
do {
  console.log(`while: ${i}`);
  i--;
} while (i > 0);

//for
for (i = 3; i > 0; i--) {
  console.log(`for: ${i}`);
}

for (let i = 3; i > 0; i -= 2) {
  console.log(`inline variable declaration for: ${i}`);
}

//nested loops *cpu에 좋지 않아요*
for (let i = 0; i < 2; i++) { 
  for (let j = 0; j < 2; j++) { 
    console.log(`i: ${i}, j:${j}`);
  }
}

//break : 루프에서 나감
//continue : 이번 스텝 종료
//Q1. 짝수만 출력

for (let i=0; i <= 10; i++) {
  if(i % 2 === 1){continue};
  console.log(i);
}

//Q2. 10번 돌라던 중 8이면 그만
for (let i=0; i <= 10; i++) {
  if(i  === 8){break;};
  console.log(i);
}