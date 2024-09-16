async function getData() {
    try {
        const response = await fetch('https://gutendex.com/books/');
        if (response.status === 400) {
            throw new error('Bad request.')

        } else if (response.status === 404) {
            throw new error('Page not found.')

        } else if (response.status === 500) {
            throw new error('Internal server error.')

        } else if (!response.ok) {
            throw new Error('Error with network response. Response status code =', response.status);
        }

        const rawData = await response.json();
        const data = rawData.results;
        console.log(data);
        return data;
        // console.log(JSON.stringify(data)); // (Uncomment to use) JSON.stringify optional to use with JSON pretty printer online & ensure all book information included.
    } catch (error) {
        console.error(error);
    }
}

async function getDataAscendingOrder() {
    try {
        const response = await fetch('https://gutendex.com/books/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const bookArray = data.results;
        const bookArrayAscending = bookArray.sort((a, b) => a.id - b.id);
        console.log("Retrieved books by ID in ascending order", bookArrayAscending);
        return bookArrayAscending;
    } catch (error) {
        console.error(error);
    }
}

function mapToUpperCase(book) {
    const subjects = book.subjects.map(subject => subject.toUpperCase());
    return {...book, subjects:subjects};
}

async function retrieveUpperCaseArray() {
    try {
        const response = await fetch('https://gutendex.com/books/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const bookArray = data.results;
        const upperCaseArray = bookArray.map(mapToUpperCase);
        console.log("Retrieved books with upper case subject", upperCaseArray);
        //  console.log("Retrieved books with upper case subject", JSON.stringify(upperCaseArray)); // Optional JSON.stringify version for data checking
        return upperCaseArray;
    } catch (error) {
        console.error(error);
    }
}

function filterByDeathDate(book) {
    let result = false;

    book.authors.forEach(author => {
        if (author.death_year !== null && author.death_year > 1824) {
            result = true;
        }
    });
    return result;
}
//Task 3: I am making the assumption that if ANY of the authors died before 1824 that the book should not be included in the filtered results.

async function retrieveFilteredArray() {
    try {
        const response = await fetch('https://gutendex.com/books/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const books = data.results;
        const filteredBooks = books.filter(filterByDeathDate);
        console.log(filteredBooks);
        return filteredBooks;
        // console.log(JSON.stringify(filteredBooks)); // Optional Stringify version for data checking with pretty printer

    } catch (error) {
        console.error(error);
    }
}

// Task 4: I am making the assumption that Fyodor = Theodore.

function findAuthor(author) {

    let result = false;
    if (author.name.toLowerCase() === "dostoyevsky, fyodor") {
        result = true;
    }
    return result;
}
// I considered making this function not recursive, as if the entry was found on a high page number there is the
// possibility of a stack overflow. With less time constraints and after conducting unit testing I would likely
// change this to some form of a loop instead.

async function findEntry(address) {
    try {
        const response = await fetch(address);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const books = data.results;
        let authorFound = false;
        let foundBook;

        books.forEach(book => {

            if (book.title != null && book.title.toLowerCase() === "short stories") {
                 let matchingAuthorArray = book.authors.filter(findAuthor);

                if (matchingAuthorArray != null) {
                    authorFound = true;
                    foundBook = book;
                }
            }});

        if (authorFound === true) {
            console.log("Entry found on page", address);
            foundBook.address = address;
            return [foundBook];
        } else {
            console.log("Entry not found on page", address, ". Checking next page of entries...");
            document.getElementById("resultDiv").innerHTML = "<p>Entry not found on page" + address + ". Checking next page of entries...</p>";
            return await findEntry(data.next);
        }
    } catch (error) {
        console.error(error);
    }
}

async function allBooksTable(func) {
    const data = await func();
    const headings = ["id", "title", "authors", "translators", "subjects", "bookshelves", "languages", "copyright", "media_type"];
   renderTable(data, headings)
}

async function searchResultTable() {
    const data = await findEntry('https://gutendex.com/books/');
    const headings = ["id", "title", "authors", "translators", "subjects", "bookshelves", "languages", "copyright", "media_type", "address"];
    renderTable(data, headings)
}

function renderTable(data, headings) {
    const rows = data.map(function (book) {
        return headings.map(function (key) {
            return book[key];
        });
    });
    const table = getTable(headings, rows);
    clearDiv("resultDiv");
    htmlInsert("resultDiv", table);
}

function getTable(headings, rows) {
    const table = "<table border='1' class='table table-dark table-striped'>\n" +
        getTableHeadings(headings) +
        getTableBody(rows) +
        "</table>";
    return (table);
}

function getTableHeadings(headings) {
    let firstRow = "  <tr>";
    for (let i = 0; i < headings.length; i++) {
        firstRow += "<th>" + headings[i] + "</th>";
    }
    firstRow += "</tr>\n";
    return (firstRow);
}

function getTableBody(rows) {
    let body = "";
    for(let i=0; i<rows.length; i++) {
        body += "  <tr>";
        const row = rows[i];
        for(let j=0; j<row.length; j++) {
            if (typeof(row[j]) == "number"){
                body += "<td>" + row[j] + "</td>";
            } else if (typeof(row[j]) == "string"){
                body += "<td>" + row[j] + "</td>";
            } else if (typeof row[j] == "object" && Array.isArray(row[j]) && row[j].length > 0 && typeof(row[j][0]) === "string") {
                let stringData = "";
                row[j].forEach(string => {
                    stringData += "<p>" + string + "</p>"
                });
                body += "<td>" + stringData + "</td>";

            } else if (typeof row[j] == "object" && Array.isArray(row[j]) && row[j].length > 0 && row[j][0].hasOwnProperty('name')) {
                let personData = "";
                row[j].forEach((person) => {

                    let temp = "<p> Name: " + person.name + "</p>"
                    + "<p> Birth Year: " + person.birth_year + "</p>"
                    + "<p> Death Year : " + person.death_year + "</p>"

                    personData += temp
                });
                body += "<td>" + personData + "</td>";
            } else {
                body += "<td>" + row[j] + "</td>";
            }
        }

        body += "</tr>\n";
    }
    return(body);
}

function clearDiv(divID) {
    document.getElementById(divID).innerHTML = "";
}

function htmlInsert(id, htmlData) {
    document.getElementById(id).innerHTML = htmlData;
}