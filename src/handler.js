const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const newBooks = {id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt};
    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
};

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    if (name !== undefined) {
        const nameLowerCase = name.toLowerCase();
        const bookName = books.filter((book) => book.name.toLowerCase().includes(nameLowerCase));
        const response = h.response({
            status: 'success',
            data: {
                books: bookName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }

    if (reading !== undefined) {
        const readingBook = books.filter((book) => Number(book.reading) === Number(reading));
        const response = h.response({
            status: 'success',
            data: {
                books: readingBook.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }

    if (finished !== undefined) {
        const finishedBook = books.filter((book) => Number(book.finished) === Number(finished));
        const response = h.response({
            status: 'success',
            data: {
                books: finishedBook.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        return response;
    }

    const defaultBooks = books.slice(0, 3).map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));
    const response = h.response({
        status: 'success',
        data: {
            books: defaultBooks,
        },
    });
    response.code(200);
    return response;
};

const getBooksByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const book = books.find((book) => String(book.id) === bookId);

    if (book !== undefined) {
        const mappedBook = {
            id: book.id,
            name: book.name,
            year: book.year,
            author: book.author,
            summary: book.summary,
            publisher: book.publisher,
            pageCount: book.pageCount,
            readPage: book.readPage,
            finished: book.finished,
            reading: book.reading,
            insertedAt: book.insertedAt,
            updatedAt: book.updatedAt,
        };

        const response = h.response({
            status: 'success',
            data: {
                book: mappedBook,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};


const editBooksByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBooksByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {addBooksHandler, getAllBooksHandler, getBooksByIdHandler, editBooksByIdHandler, deleteBooksByIdHandler};
