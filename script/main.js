let myLibraryArray;
const DEFAULT_DATA = [
  {
    title: 'Things Fall Appart',
    author: 'Chinua Achebe',
    pageNumber: 2341,
    read: 'Not Read',
  },
];

const errorMsg = document.querySelector('#errorMsg');
const $bookTable = document.querySelector('table');
const $formDiv = document.querySelector('#enter-book');
const $newBook = document.querySelector('#newBook');
const tableBody = document.querySelector('tbody');
const $bookTitle = document.querySelector('#book-title');
const $bookAuthor = document.querySelector('#author-name');
const $bookPageNumber = document.querySelector('#book-page');

const book = (title, author, pageNumber, read) => ({
  title, author, pageNumber, read 
});

function findBook(libraryArray, name) {
  let index = '';
  if (libraryArray.length === 0 || libraryArray === null) {
    return;
  }

  libraryArray.forEach((book) => {
    if (book.title === name) {
      index = libraryArray.indexOf(book);
    }
  });
  return index;
}

function isBookInputsValid() {
  let checkInput = '';
  if ($bookTitle.value.length === 0 || $bookAuthor.value.length === 0 || $bookPageNumber.value === '') {
    checkInput = false;
  } else {
    checkInput = true;
  }
  return checkInput;
}

function checkForm() {
  let checkValid = 'x';
  if ((isBookInputsValid() === true) && (findBook(myLibraryArray, $bookTitle.value) === '')) {
    checkValid = true;
  } else {
    errorMsg.style.color = 'red';
    errorMsg.innerHTML = 'Empty field or Book Title Already exist';
    checkValid = false;
  }
  return checkValid;
}


function hideForm() {
  $formDiv.style.display = 'none';
}

function deleteBook(currentBookIndex) {
  myLibraryArray.splice(currentBookIndex, 1);
}

const getReadValue = () => {
  let status = '';
  if (document.querySelector('input[name="read-status"]:checked').value === 'Yes') {
    status = 'Read';
  }
  if (document.querySelector('input[name="read-status"]:checked').value === 'No') {
    status = 'Not Read';
  }
  return status;
};

function checkLocalStorage() {
  if (localStorage.getItem('myLibraryArray')) {
    myLibraryArray = JSON.parse(localStorage.getItem('myLibraryArray'));
  } else {
    myLibraryArray = DEFAULT_DATA;
  }
}

function render() {
  checkLocalStorage();
  tableBody.innerHTML = '';
  myLibraryArray.forEach((book) => {
    const htmlBook = `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pageNumber}</td>
        <td>${book.read}</td>
        <td><button class='change-status'>Change Status</button></td>
        <td><button class='delete-book'>Delete</button></td>
      </tr>
      `;
    tableBody.insertAdjacentHTML('afterbegin', htmlBook);
  });
}

function updateLocalStorage() {
  localStorage.setItem('myLibraryArray', JSON.stringify(myLibraryArray));
}

function changeStatus(book) {
  if (myLibraryArray[book].read === 'Read') {
    myLibraryArray[book].read = 'Not Read';
  } else myLibraryArray[book].read = 'Read';
}

$bookTable.addEventListener('click', (e) => {
  const currentTarget = e.target.parentNode.parentNode.childNodes[1];
  if (e.target.innerHTML === 'Delete') {
    deleteBook(findBook(myLibraryArray, currentTarget.innerText));
  }
  if (e.target.innerHTML === 'Change Status') {
    const bookIndex = findBook(myLibraryArray, currentTarget.innerText);
    changeStatus(bookIndex);
  }
  updateLocalStorage();
  render();
});

function clearForm() {
  $bookTitle.value = '';
  $bookAuthor.value = '';
  $bookPageNumber.value = '';
}

function addBook() {
  if ((checkForm() === true) || (myLibraryArray.length === 0)) {
    const read = getReadValue();
    const newBook = book($bookTitle.value, $bookAuthor.value, $bookPageNumber.value, read);
    myLibraryArray.push(newBook);
    updateLocalStorage();
    errorMsg.innerHTML = '';
    clearForm();
    hideForm();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $newBook.addEventListener('click', () => {
    $formDiv.style.display = 'block';
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
    render();
  });

  document.querySelector('#formReset').addEventListener('click', () => {
    document.querySelector('#form').reset();
  });

  render();
});