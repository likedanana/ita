'use strict';

// !!수정!!
// let 과 const 사용
// before : 기본적으로 const를 사용하고 값이 변경되는 경우에만 let 사용(prefer-const)
// after : 기본적으로 let을 사용하고 값이 변경되지 않음을 명시할 경우에만 const 사용

// 1) 200자 제한
const titleInput = document.querySelector('input[name="title"]');
const titleLengthSpan = titleInput.nextElementSibling;

// !!수정!! 
// 주제가 200자까지만 입력되도록 수정했습니다.
// maxlength에 대해 알려주셨는데 적용하지 못해 아쉬워요.
// maxlength와 글자 수를 세는 방식이 다르다보니 글자수를 의도대로 제한하기가 어려워서 
// 이 부분은 방법을 더 찾아보고 있습니다.
// 일단은 Javascript로 글자수를 제한하는 방법을 사용했습니다. ^^
titleInput.oninput = function(){
  let title = titleInput.value;
  let length = 0;
  let lastCharIndex = 0;
  let wasAdded;

  for(let i=0; i<title.length; i++){
    // 주제 길이 계산
    if( 0 <= title.charCodeAt(i) && title.charCodeAt(i) <= 127 ) {
      length++;
      wasAdded = 1;
    } else {
      length += 2;
      wasAdded = 2;
    }

    // 200자 제한
    if( length == 201 && wasAdded == 2){
      lastCharIndex = i;
      length -= 2;
      titleInput.value = title.slice(0, lastCharIndex);
      break;
    }
    if( length >= 200 ) { 
      lastCharIndex = i;
      titleInput.value = title.slice(0, lastCharIndex + 1);
      break;
    }
  }

  titleLengthSpan.textContent = `( ${ length } / 200 )`;
};

// file
const fileNameDiv = document.querySelector('.attached');
const fileInput = document.querySelector('input[type="file"]');

fileInput.onchange = function (){
  if( fileInput.files.length != 0 ) {
    fileNameDiv.innerHTML = '<a class="ico-trash"></a>' + fileInput.files[0].name;
    const deleteFileA = document.querySelector('.ico-trash');
    deleteFileA.onclick = deleteFile;
  } else {
    deleteFile();
  }
}

function deleteFile() {
  fileNameDiv.innerHTML = '파일첨부';
  fileInput.value='';
}

// 2) 필수 입력 값 확인
// !!수정!! 
// if 문을 사용해 미입력 값이 여러 개인 경우 모두 알려주도록 수정했습니다. 
const radios = document.querySelectorAll('input[type="radio"]');
const locationSelect = document.querySelector('select');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function checkRequired() {
  let guide = '필수 입력 값(*)을 모두 입력하세요! \n(';
  let checked = true;

  if( titleInput.value == '' ) {
    guide += '주제, '
    checked = false;
  }
  if( !checkedElem(radios) ) {
    guide += '참가비, '
    checked = false;
  }
  if( locationSelect.value == '' ) {
    guide += '지역, '
    checked = false;
  }
  if( !checkedElem(checkboxes) ) {
    guide += '직책, '
    checked = false;
  }
  guide = guide.slice(0, -2);
  guide += ' 미입력)';

  if( !checked ) alert(guide);

  if( !checkedElem(checkboxes) ) checkboxes[0].focus();
  if( locationSelect.value == "" )locationSelect.focus();
  if( !checkedElem(radios) ) radios[0].focus();
  if( titleInput.value == "" ) titleInput.focus();

  return checked;
}

// 3) 세미나 추가
// !!수정!!
// 직책을 문자열로 만들 때 join을 사용하도록 수정했습니다.
const submitDiv = document.querySelector('.btn-group');

submitDiv.onclick = function() {
  if( !checkRequired() ) return;

  let title = titleInput.value;
  let cost = checkedElem(radios).nextElementSibling.innerHTML;
  let location = locationSelect.value;
  let position = Array.from(checkboxes)
  .filter(checkbox => checkbox.checked)
  .map(checkbox => checkbox.nextElementSibling.innerHTML)
  .join(', ');

  let file = false;
  if(fileInput.files[0] != undefined) file = true;

  addSeminar(title, cost, location, position, file);

  resetForm();
}

// 요소 배열을 받아 체크된 요소가 있는지 확인합니다.
// 체크된 요소가 있으면 해당 요소를, 없으면 false 반환합니다. 
function checkedElem(elems) {
  for(let elem of elems) {
    if( elem.checked ) return elem;
  }
  return false;
}

// 행을 삽입합니다.
const tableDiv = document.querySelector('.table-responsive');
const seminarsTbody = document.querySelector('tbody');
tableDiv.style.display = 'none';

function addSeminar(title, cost, location, position, file) {
  let tr = document.createElement('tr');
  
  tr.insertAdjacentHTML( 'beforeend' , '<td class="title">' + title + '</td>');
  tr.insertAdjacentHTML( 'beforeend' , '<td>' + position + '</td>');
  tr.insertAdjacentHTML( 'beforeend' , '<td>' + location + '</td>');
  tr.insertAdjacentHTML( 'beforeend' , '<td>' + cost + '</td>')
  tr.insertAdjacentHTML( 'beforeend' , '<td></td>');
  tr.insertAdjacentHTML( 'beforeend' , '<td><a class="ico-trash" href="#"></a></td>');
  if( file ) tr.children[4].innerHTML = '<a class="ico-down" href="#"></a>';

  seminarsTbody.append(tr);

  tableDiv.style.display = '';
}

// !!수정!!
// 행이 등록된 경우 input이 초기화되도록 수정했습니다.
function resetForm() {
  titleInput.value = '';
  for(let radio of radios) radio.checked = false;
  locationSelect.selectedIndex = 0;
  for(let checkbox of checkboxes) checkbox.checked = false;
  deleteFile();
}

// 4) 행 삭제
seminarsTbody.onclick = function(event) {
  let target = event.target;
  if( target.classList[0] != 'ico-trash' ) return;

  target.closest('tr').remove();
  
  if( seminarsTbody.children.length == 0 ) tableDiv.style.display = 'none';
}