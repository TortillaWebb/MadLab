function filterByDeathDate(book) {
    let result = false;

    book.authors.forEach(author => {
        if (author.death_year !== null && author.death_year > 1824) {
            result = true;
        }
    });
    console.log(result)
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

    } catch (error) {
        console.error(error);
    }
}

retrieveFilteredArray();