const processCSV = (csvFilePath) => {
    const inmates = [];
  
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Transform the data if necessary (replace "/" with "-" in admission number)
        const formattedAdmissionNumber = row['Admission Number (example - 11111-22)'].replace(/\//g, '-');
        
        const inmate = {
          admissionNumber: formattedAdmissionNumber,
          roomNumber: row['Room number '],
          name: row['Name'],
          department: row['Department '],
          year: row['Year'],
          batch: row['Batch']
        };
  
        // Log the inmate data to verify it's being extracted correctly
        console.log('Extracted Inmate Data:', inmate);
        
        inmates.push(inmate);
      })
      .on('end', () => {
        console.log('CSV file successfully processed. Sending POST requests...');
        
        // Send POST requests for each inmate
        inmates.forEach(inmate => {
          sendPostRequest(inmate);
        });
      });
  };
  