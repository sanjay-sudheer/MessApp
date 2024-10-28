const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

// Set up the API endpoint
const API_ENDPOINT = 'http://localhost:5000/api/inmate/add';  // Replace with your actual API URL

// Function to send a POST request to add an inmate
const sendPostRequest = async (inmateData) => {
  try {
    const response = await axios.post(API_ENDPOINT, inmateData);
    console.log(`Inmate ${inmateData.name} added successfully: `, response.status);
  } catch (error) {
    console.error(`Failed to add inmate ${inmateData.name}: `, error.message);
  }
};

// Function to process CSV and send POST requests
const yearMapping = {
    '1st': 1,
    '2nd': 2,
    '3rd': 3,
    '4th': 4
  };
  
  const processCSV = (csvFilePath) => {
    const inmates = [];
  
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const formattedAdmissionNumber = row['Admission Number (example - 11111-22)'].replace(/\//g, '-');
        
        const inmate = {
          admissionNumber: formattedAdmissionNumber,
          roomNumber: row['Room number '],
          name: row['Name'],
          department: row['Department '],
          year: yearMapping[row['Year']],  // Convert year to a number
          batch: row['Batch']
        };
  
        console.log('Extracted Inmate Data:', inmate);
        inmates.push(inmate);
      })
      .on('end', () => {
        console.log('CSV file successfully processed. Sending POST requests...');
        inmates.forEach(inmate => sendPostRequest(inmate));
      });
  };
  

// Run the script, specify your CSV file path
const csvFilePath = './res3.csv';  // Replace with the path to your CSV file
processCSV(csvFilePath);
