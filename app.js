 //all the methods are static so that you don't have to instantiate the UI class

 //Book Class: Represent a Book
 //everytime we create a book, it is going to create a book object
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author= author;
        this.isbn= isbn;
    }
}



 //UI Class: Handles UI tasks
 //anything on the UI interface like when a book displays
 //when you delete a book or an alert on the UI
class UI{
    //this class is going to have a few methods
    //it includes display books, add books, remove a book, show alert
    static displayBooks(){
        
        const books = Store.getBooks();
        // we want to loop through this array using forEach and call a method to add book to list
        books.forEach((book)=> UI.addBookToList(book));

    }
    //create addBookToList method
    static addBookToList(book){
        //get the tbody element
        const list = document.querySelector('#book-list');
        //create a table row element <tr> inside the tbody
        const row = document.createElement('tr');
        //to create the columns 
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href = "#" class ="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row)
    }

    //pass in whatever target element is (el)
    static deleteBook(el){
        //to get the delete link, we use the class list, 
        // if what we click contains the class delete, it should delete the parent element parent element which is the entire row
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }

    }

    static showAlert(message, className){
        //we are building the div from the scratch
        const div = document.createElement('div');
        //add classes inside the div
        div.className = `alert alert-${className}`;
        //add the text inside the div using the textNode
        div.appendChild(document.createTextNode(message))
        //placing the div between the <h1> and <form>
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        //insert the alert div before the form
        container.insertBefore(div, form);
        //vanish the alert after three seconds
        setTimeout(()=> document.querySelector('.alert').remove(), 3000)
    }

    static clearFields(){
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }

     
}




 //Store Class: Handles storage. Local storage
//store in local storage and retrieving and removing
class Store{
    //its going to have three methods
    static getBooks(){
        //local storages stores key value pairs 
        //books is a string version of our entire array of books 
        //you can't store objects in local storage, it has to be a string
        //before we store into local storage we have to stringify it, and before we pull it out we have to parse it
        let books;
        //to check if there is any current item in the local storage
        if(localStorage.getItem('books')== null){
            //if it is empty, then set books to an empty array 
            books= []
        }else{
            //then it is stored as a string using JSON.parse method
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        //to add a book, first to get the book from the local storage
        const books = Store.getBooks();
        // push on the new book that is added to the array of books
        books.push(book);
        //then we need to reset it to local storage
        //books is in strings, while books is in array of object so it needs to be stringify
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        //to remove the book from the local storage using ISBN
        //first we have to get the book
        const books = Store.getBooks();
        //we have to loop through them using forEach method
        books.forEach((book, index) =>{
            //condition to check and see if the current book that is being looped through if the isbn matches the isbn that is deleted on the UI
            if(book.isbn == isn){
                books.splice(index, 1)
            }
        });
        //now we want to set the local storage we the book removed
        localStorage.setItem('books', JSON.stringify(books));  


    }

}


 //Event: Disply Books
 document.addEventListener('DomContentLoaded', UI.displayBooks())

 
 //Event: Add a book
 document.querySelector('#book-form').addEventListener('submit', (e)=>{
     //prevent actual submit

     e.preventDefault()
     //get the values of the form
     const title = document.querySelector('#title').value;
     const author = document.querySelector('#author').value;
     const isbn = document.querySelector('#isbn').value;

     //validate the form
     if(title== ""|| author=="" || isbn== ""){
        UI.showAlert("Fill all the fields", 'danger')
     }else{
         //instantiate a book form Book class
        const book = new Book(title, author, isbn)

     //Add Book to UI
     UI.addBookToList(book);

     //Add book to store
     Store.addBook(book)
     UI.showAlert("Book Added", 'success')

     //clear Fields
     UI.clearFields()

     }
    });


 //Event: Remove a book
 document.querySelector('#book-list').addEventListener('click', (e) => {
     UI.deleteBook(e.target)

     //delete book from store
     //the remove book method takes in the isbn
     //but the event listener is targeting the delete button
     //so we reverse the DOM so we can get to the ISBN from the delete button
     Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

     UI.showAlert("Book Removed", 'success')

 });
