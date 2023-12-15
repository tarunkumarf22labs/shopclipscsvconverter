const fs = require("fs");
const XLSX = require("xlsx");

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function convertExcelToJSON(filePath) {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const result = {};

  let currentPath = null;

  jsonData.forEach((entry) => {
    if (entry.length === 2) {
      currentPath = entry[1];
      result[currentPath] = result[currentPath] || [];
    } else if (entry.length > 2) {
      const category = {
        id: generateUUID(),
        image: entry[3],
        name: entry[2],
        childstories: [],
      };

      if (result[currentPath]) {
        result[currentPath].push(category);
      }

      const addDots = (substory, productNames) => {
        productNames.forEach((productName) => {
          substory.dots.push({
            id: generateUUID(),
            productname: productName.trim(),
          });
        });
      };

      for (let i = 4; i < entry.length; i += 2) {
        if (entry[i]) {
          const substory = {
            id: generateUUID(),
            storiescontnet: entry[i],
            dots: [],
          };
          addDots(substory, entry[i + 1].split(","));
          category.childstories.push(substory);
        }
      }
    }
  });

  const json = {
    data: result,
    properties: {
      bg: "#ffff"
    }
  }


  // Please change the shopName as per the client
  const shopName = 'ekkatha'
  const fileName = `${shopName}.json`

  fs.writeFile(
    fileName,
    JSON.stringify(json, null, 2),
    function (err) {
      if (err) throw err;
      console.log(`Saved as ${fileName} file`);
    }
  );

  return json;
}

const filePath = "./kadamhaat.csv";
convertExcelToJSON(filePath);

