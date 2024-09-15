function findAuthor(author) {
    let result = false;
    if (author.name.toLowerCase() === "dostoyevsky, fyodor") {
        result = true;
    }
    return result;
}

let address = 'https://gutendex.com/books/';

async function findEntry(address) {
    try {
        const response = await fetch(address);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const books = data.results;
        let authorFound = false;

        books.forEach(book => {

            if (book.title != null && book.title.toLowerCase() === "short stories") {
                let matchingAuthorArray = book.authors.filter(findAuthor);

                if (matchingAuthorArray != null) {
                    authorFound = true;
                }
            }});

        if (authorFound === true) {
            console.log("Entry found on page", address);
        } else {
            console.log("Entry not found on page", address, ". Checking next page of entries...");
            await findEntry(data.next);
        }
    } catch (error) {
        console.error(error);
    }
}
findEntry(address);