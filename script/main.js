let myLibraryArray;
const DEFAULT_DATA = [
     {
     title: "THings Fall Appart",
     author: "Chinua Achebe",
     pageNumber: 2341,
     read: "Not Read"
    }
 ];

   const $bookTable = document.querySelector('table');
   const $formDiv = document.querySelector("#enter-book");
   const $newBook = document.querySelector("#newBook")
   const tableBody = document.querySelector('tbody')
   const $bookTitle = document.querySelector("#book-title");
   const $bookAuthor = document.querySelector("#author-name");
   const $bookPageNumber = document.querySelector("#book-page");
   const $bookForm = document.querySelector("form").addEventListener('submit', (e) => {
    e.preventDefault();
     addBook();
     render();
     hideForm();
  //  clearForm();
 });

class Book {
  constructor(title, author, pageNumber, read) {
    this.title = title;
    this.author = author;
    this.pageNumber = pageNumber;
    this.read = read;
  }
}

// $target = document.querySelector("#tbody-row").childNodes[0].innerHTML
$bookTable.addEventListener("click", (e) => {
  const currentTarget = e.target.parentNode.parentNode.childNodes[1];
  console.log(currentTarget)
  if (e.target.innerHTML == "Delete") {
    if (confirm(`are you sure you want to delete ${currentTarget.innerText}`))
      deleteBook(findBook(myLibraryArray, currentTarget.innerText));
  }
  if (e.target.innerHTML == "Change Status") {
    changeStatus(findBook(myLibraryArray, currentTarget.innerText));
  }
  updateLocalStorage();
  render();
});

function deleteBook(currentBookIndex) {
  myLibraryArray.splice(currentBookIndex, 1);
}

function findBook(libraryArray, name) {
  if (libraryArray.length === 0 || libraryArray === null) {
    return;
  }
  for (book of libraryArray)
    if (book.title === name) {
      return libraryArray.indexOf(book);
    }
}

function changeStatus(book){
  if (myLibraryArray[book].read === "Read") {
    myLibraryArray[book].read = "Not Read";
  } else myLibraryArray[book].read = "Read";
}

function hideForm(){
  $formDiv.style['display'] = 'none';
}

function addBook() {
  if ($bookTitle.value.length === 0 || $bookAuthor.value.length === 0 || $bookPageNumber.value == "" ) {
    alert("Please, fill all the fields");
    return;
  }
    read = getReadValue();
    const newBook = new Book($bookTitle.value, $bookAuthor.value, $bookPageNumber.value, read);
    myLibraryArray.push(newBook);
    updateLocalStorage();
};

const getReadValue = () => {
  if(document.querySelector('input[name="read-status"]:checked').value == 'Yes') return 'Read';
  else return 'Not Read';
}

function checkLocalStorage() {
  if (localStorage.getItem("myLibraryArray")) {
    myLibraryArray = JSON.parse(localStorage.getItem("myLibraryArray"));
  } else {
    myLibraryArray = DEFAULT_DATA;
  }
}

function updateLocalStorage() {
    localStorage.setItem('myLibraryArray', JSON.stringify(myLibraryArray));
}

function render() {
   checkLocalStorage();
   tableBody.innerHTML = "";
   myLibraryArray.forEach((book) => {
     const htmlBook = `
       <tr>
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.pageNumber}</td>
         <td>${book.read}</td>
         <td><button class="delete">Change Status</button></td>
         <td><button class="delete">Delete</button></td>
       </tr>
       `;
     tableBody.insertAdjacentHTML("afterbegin", htmlBook);
  });
}

render();

document.addEventListener('DOMContentLoaded', function(){
  $newBook.addEventListener('click', function(){
    $formDiv.style['display'] = 'block';
  });
});
  
