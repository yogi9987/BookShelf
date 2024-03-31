document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('inputBook')
    // const submit = document.getElementById('bookSubmit')
    const completedBook = document.getElementById('completeBookshelfList')
    const incompletedBook = document.getElementById('incompleteBookshelfList')

    let books = []

    const isThereIn = localStorage.getItem('books')
    if (isThereIn) {
        books = JSON.parse(isThereIn)
    }

    function simpanBuku() {
        localStorage.setItem('books', JSON.stringify(books))
    }

    input.addEventListener('submit', function (event) {
        event.preventDefault()

        const inputJudulBuku = document.getElementById('inputBookTitle').value
        const inputPenciptaBuku = document.getElementById('inputBookAuthor').value
        const inputTahunBuku = Number(document.getElementById('inputBookYear').value)
        const inputTelahDibaca = document.getElementById('inputBookIsComplete').checked
        const isSame = books.some(book => book.title === inputJudulBuku)

        if (isSame) {
            alert('Udah ada buku yang sama bro, kgk bisa')
        } else {
            const book = {
                id: new Date().getTime(),
                title: inputJudulBuku,
                author: inputPenciptaBuku,
                year: inputTahunBuku,
                isComplete: inputTelahDibaca
            }

            books.push(book)
            simpanBuku()

            updateBuku()

            document.getElementById('inputBookTitle').value = ''
            document.getElementById('inputBookAuthor').value = ''
            document.getElementById('inputBookYear').value = ''
            document.getElementById('inputBookIsComplete').checked = false
        }
    })

    function updateBuku() {
        incompletedBook.innerHTML = ''
        completedBook.innerHTML = ''

        for (const book of books) {
            const bookItem = createBookItem(book)
            if (book.isComplete) {
                completedBook.appendChild(bookItem)
            } else {
                incompletedBook.appendChild(bookItem)
            }
        }
    }

    function hapusBuku(id) {
        const index = books.findIndex(book => book.id === id)
        if (index !== -1) {
            books.splice(index, 1)
            simpanBuku()
            updateBuku()
        }
    }

    function toggleIsCompleted(id) {
        const index = books.findIndex(book => book.id === id)
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete
            simpanBuku()
            updateBuku()
        }
    }

    const cariBuku = document.getElementById('searchBook')
    const cariJudulBuku = document.getElementById('searchBookTitle')

    cariBuku.addEventListener('submit', function (event) {
        event.preventDefault()

        const query = cariJudulBuku.value.toLowerCase().trim()

        const searchResult = books.filter(book => {
            return (
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.year.toString().includes(query)
            )
        })

        updatePencarian(searchResult)
    })

    function updatePencarian(results) {
        incompletedBook.innerHTML = ''
        completedBook.innerHTML = ''

        for (const book of results) {
            const bookItem = createBookItem(book)
            if (book.isComplete) {
                completedBook.appendChild(bookItem)
            } else {
                incompletedBook.appendChild(bookItem)
            }
        }
    }

    function createBookItem(book) {
        const bookItem = document.createElement('article');
        bookItem.className = 'book_item';
        bookItem.style.margin = '10px';

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action';

        const title = document.createElement('h3');
        title.textContent = book.title;
        title.style.color = 'black';
        title.style.marginBottom = '10px';

        const author = document.createElement('p');
        author.textContent = 'Penulis: ' + book.author;
        author.style.color = 'black';
        author.style.marginBottom = '10px';

        const year = document.createElement('p');
        year.textContent = 'Tahun: ' + book.year;
        year.style.color = 'black';
        year.style.marginBottom = '10px';

        const removeButton = createActionButton('Hapus buku', 'red', function () {
            hapusBuku(book.id);
        });

        let toggleButton;
        if (book.isComplete) {
            toggleButton = createActionButton('Belum selesai di Baca', 'yellow', function () {
                toggleIsCompleted(book.id);
            });
        } else {
            toggleButton = createActionButton('Selesai dibaca', 'green', function () {
                toggleIsCompleted(book.id);
            });
        }

        removeButton.style.padding = '10px';
        removeButton.style.margin = '10px';
        removeButton.style.borderRadius = '10px';
        removeButton.style.border = '0';
        removeButton.style.backgroundColor = 'cornflowerblue';
        removeButton.style.color = 'black';
        removeButton.style.fontWeight = 'bold';

        toggleButton.style.padding = '10px';
        toggleButton.style.borderRadius = '10px';
        toggleButton.style.border = '0';
        toggleButton.style.backgroundColor = 'cornflowerblue';
        toggleButton.style.color = 'black';
        toggleButton.style.fontWeight = 'bold';

        actionButtons.appendChild(toggleButton);
        actionButtons.appendChild(removeButton);

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(actionButtons);

        return bookItem;
    }

    function createActionButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener('click', clickHandler);
        return button;
    }

    updateBuku();
})
