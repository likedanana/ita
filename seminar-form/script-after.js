'use strict';

// 1) 200자 제한
const titleInput = document.querySelector('input[name="title"]');
const titleLengthSpan = titleInput.nextElementSibling;

// !!수정사항!! 
// 주제가 200자까지만 입력되도록 수정했습니다.
// maxlength에 대해 알려주셨는데 적용하지 못해 아쉬워요.
// maxlength를 사용해 특정 상황(199자일 때 2자인 문자 입력)을 처리하기가 어려워??????????????????
// Javascript로 글자수를 제한하는 방법을 사용했습니다.

titleInput.oninput = function(){
  let title = titleInput.value;
  let length = 0;
  let lastCharIndex=0;
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
      lastCharIndex = i-1;
      length = length-2;
      titleInput.value = title.slice(0, lastCharIndex + 1);
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
  if(fileInput.files.length != 0) {
    fileNameDiv.innerHTML = '<a class="ico-trash"></a>' + fileInput.files[0].name;
    let deleteFileA = document.querySelector('.ico-trash');
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
// !!수정사항!! 
// if 문을 사용해 미입력 값이 여러개인 경우 모두 알려주도록 수정했습니다. 
const radios = document.querySelectorAll('input[type="radio"]');
const locationSelect = document.querySelector('select');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
/*
function checkRequired() {
  let checked = true;

  if( titleInput.value == '' ) {
    alert('주제를 입력하세요!');
    checked = false;
  }
  if( !checkedElem(radios) ) {
    alert('참가비를 선택하세요!');
    checked = false;
  }
  if( locationSelect.value == '' ) {
    alert('지역을 선택하세요!');
    checked = false;
  }
  if( !checkedElem(checkboxes) ) {
    alert('직책을 선택하세요!');
    checked = false;
  }

  if( !checkedElem(checkboxes) ) checkboxes[0].focus();
  if( locationSelect.value == "" )locationSelect.focus();
  if( !checkedElem(radios) ) radios[0].focus();
  if( titleInput.value == "" ) titleInput.focus();

  return checked;
}
*/
// 혹은 아래처럼 alert 창을 하나만 띄워도 좋을 것 같습니다.

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
// 체크된 요소가 하나라도 있으면 true, 없으면 false 반환합니다. 
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
  const tr = document.createElement('tr');
  
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


// !!수정사항!!
// 행이 등록된 경우 input을 리셋했습니다.
function resetForm() {
  titleInput.value = '';
  for(let radio of radios) radio.checked = false;
  locationSelect.selectedIndex = 0;
  for(let checkbox of checkboxes) checkbox.checked = false;
  deleteFile();
}

// 4) 행 삭제
seminarsTbody.onclick = function(event) {
  const target = event.target;
  if(target.classList[0] != 'ico-trash') return;

  target.closest('tr').remove();
  
  if(seminarsTbody.children.length == 0) tableDiv.style.display = 'none';
}