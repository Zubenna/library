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
const $submitRecord = document.querySelector('#submit-record');
let $editRecord = document.querySelector('#edit-record');
const $bookTable = document.querySelector('table');
const $formDiv = document.querySelector('#enter-book');
const $newBook = document.querySelector('#newBook');
const tableBody = document.querySelector('tbody');
const $bookTitle = document.querySelector('#book-title');
const $bookAuthor = document.querySelector('#author-name');
const $bookPageNumber = document.querySelector('#book-page');

class Book {
  constructor(title, author, pageNumber, read) {
    this.title = title;
    this.author = author;
    this.pageNumber = pageNumber;
    this.read = read;
  }
}

function hideForm() {
  $formDiv.style.display = 'none';
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
        <td><button class='edit-book'>Edit</button></td>
      </tr>
      `;
    tableBody.insertAdjacentHTML('afterbegin', htmlBook);
  });
}

render();

function updateLocalStorage() {
  localStorage.setItem('myLibraryArray', JSON.stringify(myLibraryArray));
}

function editBook(bookIndex) {
  $submitRecord.style.display = 'none';
  $editRecord.style.display = 'block';
  $formDiv.style.display = 'block';
  $bookTitle.value = myLibraryArray[bookIndex].title;
  $bookAuthor.value = myLibraryArray[bookIndex].author;
  $bookPageNumber.value = myLibraryArray[bookIndex].pageNumber;

  $editRecord = document.querySelector('#edit-record');
  $editRecord.addEventListener('click', (e) => {
    e.preventDefault();

    const readStatus = getReadValue();
    const editValue = {
      title: $bookTitle.value,
      author: $bookAuthor.value,
      pageNumber: $bookPageNumber.value,
      read: readStatus,
    };

    myLibraryArray.splice(bookIndex, 1, editValue);
    updateLocalStorage();
    render();
    hideForm();
  });
}

function changeStatus(book) {
  if (myLibraryArray[book].read === 'Read') {
    myLibraryArray[book].read = 'Not Read';
  } else myLibraryArray[book].read = 'Read';
}

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

function deleteBook(currentBookIndex) {
  myLibraryArray.splice(currentBookIndex, 1);
}

$bookTable.addEventListener('click', (e) => {
  const currentTarget = e.target.parentNode.parentNode.childNodes[1];
  if (e.target.innerHTML === 'Delete') {
    if (`are you sure you want to delete ${currentTarget.innerText}`) {
      deleteBook(findBook(myLibraryArray, currentTarget.innerText));
    }
  }
  if (e.target.innerHTML === 'Change Status') {
    const bookIndex = findBook(myLibraryArray, currentTarget.innerText);
    changeStatus(bookIndex);
  }
  if (e.target.innerHTML === 'Edit') {
    const editIndex = findBook(myLibraryArray, currentTarget.innerText);
    editBook(editIndex);
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
  if ($bookTitle.value.length === 0 || $bookAuthor.value.length === 0 || $bookPageNumber.value === '') {
    errorMsg.style.color = 'red';
    errorMsg.innerHTML = 'Please, fill all the fields';
    return;
  }
  errorMsg.innerHTML = '';
  const read = getReadValue();
  const newBook = new Book($bookTitle.value, $bookAuthor.value, $bookPageNumber.value, read);
  myLibraryArray.push(newBook);
  updateLocalStorage();
}

document.addEventListener('DOMContentLoaded', () => {
  $newBook.addEventListener('click', () => {
    $editRecord.style.display = 'none';
    $formDiv.style.display = 'block';
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
    render();
    clearForm();
    hideForm();
  });
});