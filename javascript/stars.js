'use strict';

for (let i=5; i>0; i--) {
  let str = "";
  for (let j=i; j>0; j--) {
    str += "*";
  }
  console.log(str);
}

for (let i=5; i>0; i--) {
  let str = "";
  for (let j=i; j>0; j--) {
    str += " ";
  }
  for (let k = 5 - i; k >= 0; k--) {
    str += "*";
  }
  console.log(str);
}