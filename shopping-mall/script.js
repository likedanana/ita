'use strict';

class Cloth{
  constructor(type, color, gender, size){
    this.type = type;
    this.color = color;
    this.gender = gender;
    this.size = size;
  }
  
  getLi(){
    let itemLi = document.createElement('li');
    itemLi.innerHTML = 
    `<img src="imgs/${this.color}_${this.type[0]}.png" alt="${this.color} ${this.type}">${this.gender}, ${this.size} size`;
    return itemLi;  
  }
}

function addClothesToUl( ul, clothArr ){
  clothArr.forEach(cloth => ul.append( cloth.getLi() ));
}

let clothes = [];
clothes.push(new Cloth('tshirt', 'pink', 'female', 'small'));
clothes.push(new Cloth('skirt', 'blue', 'male', 'large'));
clothes.push(new Cloth('tshirt', 'yellow', 'female', 'large'));
clothes.push(new Cloth('pants', 'yellow', 'female', 'small'));
clothes.push(new Cloth('pants', 'blue', 'male', 'large'));
clothes.push(new Cloth('skirt', 'pink', 'female', 'small'));
clothes.push(new Cloth('tshirt', 'blue', 'male', 'small'));
clothes.push(new Cloth('skirt', 'yellow', 'male', 'small'));
clothes.push(new Cloth('tshirt', 'pink', 'female', 'large'));
clothes.push(new Cloth('pants', 'blue', 'male', 'small'));
clothes.push(new Cloth('pants', 'pink', 'male', 'large'));
clothes.push(new Cloth('skirt', 'yellow', 'female', 'large'));
clothes.push(new Cloth('skirt', 'pink', 'female', 'small'));
clothes.push(new Cloth('tshirt', 'blue', 'male', 'large'));
clothes.push(new Cloth('skirt', 'yellow', 'male', 'small'));
clothes.push(new Cloth('tshirt', 'pink', 'female', 'large'));
clothes.push(new Cloth('pants', 'blue', 'male', 'small'));
clothes.push(new Cloth('pants', 'pink', 'male', 'large'));
clothes.push(new Cloth('skirt', 'yellow', 'female', 'small'));

const itemsUl = document.querySelector(".items");
addClothesToUl( itemsUl, clothes );

const categoryUl = document.querySelector(".category");
categoryUl.onclick = function(event) {
  itemsUl.innerHTML="";

  let key = event.target.dataset.key;
  let clicked = event.target.dataset.clicked;

  let filteredClothes = clothes.filter( cloth => cloth[key] == clicked );
  addClothesToUl( itemsUl, filteredClothes );
}
