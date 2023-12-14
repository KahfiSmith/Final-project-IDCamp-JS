function submitForm() {
    var judul = document.getElementById('judul').value;
    var penulis = document.getElementById('penulis').value;
    var tahun = document.getElementById('tahun').value;
    var isComplete = document.getElementById('checkbox').checked;

    if (!isValidYear(tahun)) {
        alert('Mohon masukkan tahun dengan panjang 4 digit.');
        return;
    }

    if (!judul || !penulis || !tahun) {
        alert('Mohon isi semua input sebelum menambahkan buku.');
        return;
    }

    var bookData = {
        id: generateUniqueId(),
        title: judul,
        author: penulis,
        year: parseInt(tahun),
        isComplete: isComplete
    };

    var books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(bookData);
    localStorage.setItem('books', JSON.stringify(books));

    moveBookToContainer(bookData);
    clearForm();

    alert('Buku berhasil ditambahkan!');
}

function isValidYear(tahun) {
    return /^\d{4}$/.test(tahun);
}

function moveBookToContainer(bookData) {
    var containerId = bookData.isComplete ? 'selesaiDibaca' : 'belumSelesaiDibaca';
    var container = document.getElementById(containerId);

    var bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.innerHTML = '<p style="font-size: 26px; font-weight: 550;">' + bookData.title + '</p>' +
                            '<p><strong>Penulis :</strong> ' + bookData.author + '</p>' +
                            '<p><strong>Tahun :</strong> ' + bookData.year + '</p>' +
                            '<button class="button-delete" onclick="deleteBook(\'' + bookData.id + '\')">Hapus Buku</button>';

    var toggleButton = document.createElement('button');
    toggleButton.classList.add('button-toggle');
    toggleButton.textContent = bookData.isComplete ? 'Belum Selesai Dibaca' : 'Sudah Selesai Dibaca';
    toggleButton.onclick = function() {
        toggleReadStatus(bookData.id);
    };
    
    bookElement.appendChild(toggleButton);

    bookElement.style.color = 'rgb(203, 213, 225)';
    bookElement.style.backgroundColor = '#2b3749';
    bookElement.style.borderRadius = '5px';
    bookElement.style.padding = '5px 15px 15px 15px';
    bookElement.style.border = '2px solid rgb(76, 90, 110)';
    bookElement.style.textAlign = 'start';
    bookElement.style.marginBottom = '15px';

    container.appendChild(bookElement);
}

function clearForm() {
    document.getElementById('judul').value = '';
    document.getElementById('penulis').value = '';
    document.getElementById('tahun').value = '';
    document.getElementById('checkbox').checked = false;
}

function displayStoredBooks() {
    var books = JSON.parse(localStorage.getItem('books')) || [];

    var containers = document.querySelectorAll('.container-item');
    containers.forEach(function(container) {
        container.innerHTML = '';
    });

    books.forEach(function(book) {
        moveBookToContainer(book);
    });
}

function deleteBook(id) {
    var books = JSON.parse(localStorage.getItem('books')) || [];

    var index = books.findIndex(function(book) {
        return book.id === id;
    });

    if (index !== -1) {
        var isConfirmed = confirm('Yakin ingin menghapus buku dengan ID "' + id + '"?');

        if (!isConfirmed) {
            return;
        }
        
        var deletedBook = books.splice(index, 1)[0];
        localStorage.setItem('books', JSON.stringify(books));

        var containerId = deletedBook.isComplete ? 'selesaiDibaca' : 'belumSelesaiDibaca';
        var container = document.getElementById(containerId);
        var bookElement = Array.from(container.getElementsByClassName('book')).find(function(element) {
            return element.getElementsByTagName('p')[0].innerText === deletedBook.title;
        });

        if (bookElement) {
            container.removeChild(bookElement);
        }
    }
}

function toggleReadStatus(id) {
    var books = JSON.parse(localStorage.getItem('books')) || [];

    var index = books.findIndex(function(book) {
        return book.id === id;
    });

    if (index !== -1) {
        var toggledBook = books[index];
        toggledBook.isComplete = !toggledBook.isComplete;

        localStorage.setItem('books', JSON.stringify(books));

        var currentContainerId = toggledBook.isComplete ? 'belumSelesaiDibaca' : 'selesaiDibaca';
        var currentContainer = document.getElementById(currentContainerId);
        var currentBookElement = Array.from(currentContainer.getElementsByClassName('book')).find(function(element) {
            return element.getElementsByTagName('p')[0].innerText === toggledBook.title;
        });

        if (currentBookElement) {
            currentContainer.removeChild(currentBookElement);
        }

        moveBookToContainer(toggledBook);
    }
}

document.getElementById('searchButton').addEventListener('click', function () {
    var keyword = document.getElementById('search').value.toLowerCase();
    searchBooks(keyword);
});

function searchBooks(keyword) {
    var books = JSON.parse(localStorage.getItem('books')) || [];

    function displayBooksInContainer(books, containerId) {
        var container = document.getElementById(containerId);
        container.innerHTML = ''; 

        books.forEach(function (book) {
            if (!isBookAlreadyDisplayed(book.title, container)) {
                moveBookToContainer(book);
            }
        });
    }

    function isBookAlreadyDisplayed(title, container) {
        var bookElements = container.getElementsByClassName('book');
        for (var i = 0; i < bookElements.length; i++) {
            if (bookElements[i].getElementsByTagName('p')[0].innerText === title) {
                return true; 
            }
        }
        return false; 
    }

    var incompleteBooks = books.filter(function (book) {
        return !book.isComplete;
    });

    var completeBooks = books.filter(function (book) {
        return book.isComplete;
    });

    if (!keyword.trim()) {
        displayBooksInContainer(incompleteBooks, 'belumSelesaiDibaca');
        displayBooksInContainer(completeBooks, 'selesaiDibaca');
        return; 
    }

    var filteredIncompleteBooks = incompleteBooks.filter(function (book) {
        return book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword) ||
            book.year.toString().includes(keyword);
    });
    displayBooksInContainer(filteredIncompleteBooks, 'belumSelesaiDibaca');

    var filteredCompleteBooks = completeBooks.filter(function (book) {
        return book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword) ||
            book.year.toString().includes(keyword);
    });
    displayBooksInContainer(filteredCompleteBooks, 'selesaiDibaca');
}

function generateUniqueId() {
    var timestamp = new Date().getTime();
    return 'book_' + timestamp; 
}

displayStoredBooks();
