async function getData() {
    try {
      const response = await fetch('https://gutendex.com/books/');
      if (!response.ok) {
        throw new Error('Error with network response');
      }
      const data = await response.json();
      console.log(JSON.stringify(data)); // JSON.stringify optional to use with JSON pretty printer online & ensure all book information included.
    } catch (error) {
      console.error(error);
    }
  }
  getData();