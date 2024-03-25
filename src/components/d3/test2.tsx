import React, { useEffect, useState } from "react";

// Define a type for the CSV records that includes only the first 5 columns
type HdbRecord = {
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
};

const CsvToJsonExample: React.FC = () => {
  const [data, setData] = useState<HdbRecord[]>([]);

  useEffect(() => {
    // The URL to your CSV file
    const csvUrl = "/hdb_complete.csv";

    fetch(csvUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((csvText) => {
        // Convert CSV text to JSON
        const jsonData = csvToJson(csvText);
        setData(jsonData.slice(0, 5)); // Set only the first 5 records for display
      })
      .catch((error) => console.error("Error loading or parsing CSV:", error));
  }, []);

  // A simple CSV to JSON conversion function that only takes the first 5 columns
  const csvToJson = (csvText: string): HdbRecord[] => {
    const lines = csvText.split("\n").filter((line) => line.trim());
    const result: HdbRecord[] = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      
      const currentline = lines[i].split(",");

      for (let j = 0; j < 5; j++) {
        // Only take the first 5 columns
        obj[headers[j]] = currentline[j];
      }

      result.push(obj as HdbRecord);
    }

    return result;
  };

  return (
    <div>
      {/* Render the first 5 columns of your data */}
      {data.map((record, index) => (
        <div key={index}>
          <p>Month: {record.month}</p>
          <p>Town: {record.town}</p>
          <p>Flat Type: {record.flat_type}</p>
          <p>Block: {record.block}</p>
          <p>Street Name: {record.street_name}</p>
        </div>
      ))}
    </div>
  );
};

export default CsvToJsonExample;

// import React, { useEffect, useState } from "react";

// // Define your data type
// type HdbRecord = {
//   month: string;
//   town: string;
//   flat_type: string;
//   // Add more fields as needed
// };

// const CsvToJsonExample: React.FC = () => {
//   const [data, setData] = useState<HdbRecord[]>([]);

//   useEffect(() => {
//     // The URL to your CSV file
//     const csvUrl = "/hdb_complete.csv";

//     fetch(csvUrl)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok.');
//         }
//         return response.text();
//       })
//       .then((csvText) => {
//         // Convert CSV text to JSON
//         const jsonData = csvToJson(csvText);
//         setData(jsonData);
//       })
//       .catch((error) => console.error("Error loading or parsing CSV:", error));
//   }, []);

//   // A simple CSV to JSON conversion function
//   const csvToJson = (csvText: string): HdbRecord[] => {
//     const lines = csvText.split("\n").filter((line) => line.trim());
//     const result: HdbRecord[] = [];
//     const headers = lines[0].split(",");

//     for (let i = 1; i < lines.length; i++) {
//       const obj: any = {};
//       const currentline = lines[i].split(",");

//       for (let j = 0; j < headers.length; j++) {
//         obj[headers[j]] = currentline[j];
//       }

//       result.push(obj as HdbRecord);
//     }

//     return result;
//   };

//   return (
//     <div>
//       {/* Display only the first 5 records from the data */}
//       {data.slice(0, 5).map((record, index) => (
//         <div key={index}>
//           {record.month} - {record.town} - {record.flat_type}
//           {/* Display more fields as needed */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CsvToJsonExample;
