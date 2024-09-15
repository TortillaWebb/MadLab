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

    } catch (error) {
      console.error(error);
    }
  }

  retrieveUpperCaseArray();