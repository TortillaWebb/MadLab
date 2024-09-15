async function getData() {
    try {
        const response = await fetch('https://gutendex.com/books/');
        if (!response.ok) {
            throw new Error('Error with network response');
        }
        const rawData = await response.json();
        data = rawData.results;
        console.log(data);
        return data;
        // console.log(JSON.stringify(data)); // (Uncomment to use) JSON.stringify optional to use with JSON pretty printer online & ensure all book information included.
    } catch (error) {
        console.error(error);
    }
}

function mapToUpperCase(book) {
    let subjects = book.subjects.map(subject => subject.toUpperCase());
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
        console.log(filteredBooks);
        return filteredBooks;
        // console.log(JSON.stringify(filteredBooks)); // Optional Stringify version for data checking with pretty printer

    } catch (error) {
        console.error(error);
    }
}

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
            return await findEntry(data.next);
        }
    } catch (error) {
        console.error(error);
    }
}

async function allBooksTable(func) {
    let data = await func();
    let headings = ["id", "title", "authors", "translators", "subjects", "bookshelves", "languages", "copyright", "media_type"];
    let rows = data.map(function (book) {
        return headings.map(function (key) {
            return book[key];
        });
    });
    let table = getTable(headings, rows);
    clearDiv("resultDiv");
    htmlInsert("resultDiv", table);
}

async function searchResultTable() {
    let data = await findEntry('https://gutendex.com/books/');
    console.log(data);
    let headings = ["id", "title", "authors", "translators", "subjects", "bookshelves", "languages", "copyright", "media_type", "address"];
    let rows = data.map(function (book) {
        return headings.map(function (key) {
            return book[key];
        });
    });
    let table = getTable(headings, rows);
    clearDiv("resultDiv");
    htmlInsert("resultDiv", table);
}

function getTable(headings, rows) {
    var table = "<table border='1' class='ajaxTable'>\n" +
        getTableHeadings(headings) +
        getTableBody(rows) +
        "</table>";
    return (table);
}

function getTableHeadings(headings) {
    var firstRow = "  <tr>";
    for (var i = 0; i < headings.length; i++) {
        firstRow += "<th>" + headings[i] + "</th>";
    }
    firstRow += "</tr>\n";
    return (firstRow);
}

function getTableBody(rows) {
    var body = "";
    for(var i=0; i<rows.length; i++) {
        body += "  <tr>";
        var row = rows[i];
        for(var j=0; j<row.length; j++) {
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
    let div = document.getElementById(divID);
    div.innerHTML = "";
}

function htmlInsert(id, htmlData) {
    document.getElementById(id).innerHTML = htmlData;
}