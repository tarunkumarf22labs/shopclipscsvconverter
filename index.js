const fs = require('fs');
const XLSX = require('xlsx');

function convertExcelToJSON(filePath) {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const headers = jsonData[0];
  const jsonResult = {};
  let Route;
  
  for (let i = 1; i < jsonData.length; i++) {
    const values = jsonData[i];
    const row = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = values[j];

      if (header && value) {
        row[header] = value;
      }
    }
    
    if (row?.pathname) {
      console.log("sahi");
      Route = row?.pathname;
      if (!jsonResult[Route]) {
        jsonResult[Route] = []; // Initialize as an empty array if it doesn't exist
      }
    }

    const Thumbnail = row?.['Thumbnail'];
    const storyname = row?.['storyname'];
    const collection = {
      id: Date.now(),
      image: Thumbnail,
      name: storyname,
      childstories: [],
    };

    for (let k = 1; k <= 5; k++) {
      if (Thumbnail) {
        const StoryIDKey = `substory${k}`;
        const productIDKey = `product${k}`;
        const storiescontnet = row?.[StoryIDKey];
        const productIDValue = row?.[productIDKey];

        // Check if productIDValue is defined
        if (productIDValue !== undefined) {
          // Check if productIDValue contains a comma
          if (productIDValue.includes(',')) {
            const productNames = productIDValue.split(',');

            // Loop through product names and add them to the collection
            productNames.forEach((productName) => {
              collection.childstories.push({
                id: Date.now(),
                storiescontnet: storiescontnet,
                dots: [{ id: Date.now(), productname: productName.trim() }],
              });
            });
          } else {
            // If there's no comma, treat it as a single product
            collection.childstories.push({
              id: Date.now(),
              storiescontnet: storiescontnet,
              dots: [{ id: Date.now(), productname: productIDValue }],
            });
          }
        }
      }
    }

    if (Thumbnail) {
      console.log(Thumbnail, "Thumbnail");
      jsonResult[Route].push(collection);
    }
  }
  
  console.log(jsonResult, "jsonResult");
  
  fs.writeFile('shopclips.json', JSON.stringify(jsonResult, null, 2), function (err) {
    if (err) throw err;
    console.log('Saved as JSON file');
  });
  
  return jsonResult;
}

const filePath = './Memara shopclips data - Sheet1.csv';
const jsonResult = convertExcelToJSON(filePath);


