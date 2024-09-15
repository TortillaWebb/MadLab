function filterByDeathDate(book) {
    let result = false;

    book.authors.forEach(author => {
        // Assuming that we want results if ALL authors have been alive since 1824, not just some.
        if (author.death_year !== null && author.death_year > 1824) {
            result = true;
        }
    });
    return result;
}

async function retrieveFilteredArray() {
    try {
        const response = await fetch('https://gutendex.com/books/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const books = data.results;
        const filteredBooks = books.filter(filterByDeathDate);
        console.log(filteredBooks)
       // console.log(JSON.stringify(filteredBooks)); // Optional Stringify version for data checking with pretty printer

    } catch (error) {
        console.error(error);
    }
}

retrieveFilteredArray();