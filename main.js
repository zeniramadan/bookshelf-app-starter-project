document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    const bookFormSubmit = document.getElementById("bookFormSubmit");
    const bookFormIsComplete = document.getElementById("bookFormIsComplete");
    const searchBookForm = document.getElementById("searchBook");
    const searchBookTitle = document.getElementById("searchBookTitle");
    const STORAGE_KEY = "BOOKSHELF_APP";
  
    let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  
    function saveBooks() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  
    function renderBooks(filter = "") {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      books.forEach((book) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
          const bookElement = createBookElement(book);
          if (book.isComplete) {
            completeBookList.prepend(bookElement);
          } else {
            incompleteBookList.prepend(bookElement);
          }
        }
      });
    }
  
    function createBookElement(book) {
      const bookContainer = document.createElement("div");
      bookContainer.setAttribute("data-bookid", book.id);
      bookContainer.setAttribute("data-testid", "bookItem");
      bookContainer.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
          <button data-testid="bookItemEditButton">Edit</button>
          <button data-testid="bookItemDeleteButton">Hapus</button>
        </div>
      `;
  
      bookContainer.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", function () {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
      });
  
      bookContainer.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", function () {
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        bookFormIsComplete.checked = book.isComplete;
        bookFormSubmit.innerText = "Update Buku";
        
        bookForm.onsubmit = function (event) {
          event.preventDefault();
          book.title = document.getElementById("bookFormTitle").value;
          book.author = document.getElementById("bookFormAuthor").value;
          book.year = parseInt(document.getElementById("bookFormYear").value);
          book.isComplete = bookFormIsComplete.checked;
          saveBooks();
          renderBooks();
          bookForm.reset();
          bookFormSubmit.innerText = "Masukkan Buku ke rak ";
          bookForm.onsubmit = addBook;
        };
      });
  
      bookContainer.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", function () {
        books = books.filter((b) => b.id !== book.id);
        saveBooks();
        renderBooks();
      });
  
      return bookContainer;
    }
  
    function addBook(event) {
      event.preventDefault();
      const title = document.getElementById("bookFormTitle").value;
      const author = document.getElementById("bookFormAuthor").value;
      const year = parseInt(document.getElementById("bookFormYear").value);
      const isComplete = bookFormIsComplete.checked;
      const id = new Date().getTime();
  
      books.push({ id, title, author, year, isComplete });
      saveBooks();
      renderBooks();
      bookForm.reset();
      bookFormSubmit.querySelector("span").innerText = "Belum selesai dibaca";
    }
  
    bookForm.onsubmit = addBook;
  
    bookFormIsComplete.addEventListener("change", function () {
      bookFormSubmit.querySelector("span").innerText = bookFormIsComplete.checked ? "selesai dibaca" : "belum selesai dibaca";
    });
  
    searchBookForm.addEventListener("submit", function (event) {
      event.preventDefault();
      renderBooks(searchBookTitle.value);
    });
  
    renderBooks();
  });
  