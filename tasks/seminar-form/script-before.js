'use strict';

// 1) 200자 제한
const titleInput = document.querySelector('input[name="title"]');
const titleLengthSpan = titleInput.nextElementSibling;

titleInput.oninput = function(){
  const titleLength = getTitleLength(titleInput.value);

  if(titleLength > 200) {
    titleLengthSpan.style.color = 'red';
    titleLengthSpan.style.fontWeight = 'bold';
  } else {
    titleLengthSpan.style.color = '';
    titleLengthSpan.style.fontWeight = '';
  }
  titleLengthSpan.textContent = `( ${titleLength} / 200 )`;
};

// string title의 길이를 반환합니다.
// 글자의 utf-16 코드를 정수로 변환한 값이 0~127인 경우 1, 그 외 2로 계산합니다.
function getTitleLength(title) {
  let length = 0;
  let i;
  for(i=0; i<title.length; i++){
    if(0 <= title.charCodeAt(i) && title.charCodeAt(i) <= 127) length++;
    else length += 2;
  }
  return length;
}

// file
const fileNameDiv = document.querySelector('.attached');
const fileInput = document.querySelector('input[type="file"]');
let deleteFileA = document.querySelector('.ico-trash');

fileInput.onchange = function (){
  if(fileInput.files.length != 0) {
    fileNameDiv.innerHTML = '<a class="ico-trash"></a>' + fileInput.files[0].name;
    deleteFileA = document.querySelector('.ico-trash');
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
const radios = document.querySelectorAll('input[type="radio"]');
const locationSelect = document.querySelector('select');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function checkRequired() {
  if( titleInput.value == "" ) {
    alert("주제를 입력하세요!");
    titleInput.focus();
    return false;
  } else if(getTitleLength(titleInput.value) > 200){
    alert("주제를 200자 이하로 입력하세요!");
    titleInput.focus();
  } else if( !checkedElem(radios) ) {
    alert("참가비를 선택하세요!");
    return false;
  } else if( locationSelect.value == "" ) {
    alert("지역을 선택하세요!");
    locationSelect.focus();
    return false;
  } else if( !checkedElem(checkboxes) ) {
    alert("직책을 선택하세요!");
    return false;
  }
  return true;
}

// 3) 세미나 추가
const submitDiv = document.querySelector('.btn-group');

submitDiv.onclick = function() {
  if( !checkRequired() ) return;

  const title = titleInput.value;
  const cost = checkedElem(radios).nextElementSibling.innerHTML;
  const location = locationSelect.value;

  let position = "";
  for(let checkbox of checkboxes){
    if( checkbox.checked == true ){ 
      position += checkbox.nextElementSibling.innerHTML + ", ";
    }
  }
  position = position.slice(0,position.length-2);

  let file = false;
  if(fileInput.files[0] != undefined) file = true;

  addSeminar(title, cost, location, position, file);
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

// 4) 행 삭제
seminarsTbody.onclick = function(event) {
  const target = event.target;
  if(target.classList[0] != 'ico-trash') return;

  target.closest('tr').remove();
  
  if(seminarsTbody.children.length == 0) tableDiv.style.display = 'none';
};
