const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const os = require('os');


exports.AddCandidatesinBulk = (req, res, next) => {
   let csvFilePath;
  try {
   csvFilePath=path.join(os.homedir(), 'Downloads', 'samplefile.csv');
   if (!fs.existsSync(csvFilePath)) {
      console.log("CSV file not found");
      return res.status(404).json({ error: 'CSV file not found' });
    }
  } catch (error) {
   console.log("Error in selecting csv file",error);
   return res.status(404).json({ error: 'Error in selecting csv',Error:error});
  }
// Function to process each row of the CSV
function processRow(row) {
   // Extract first name and last name from the row
   const arrayFromValues = Object.values(row);

   const firstName = arrayFromValues[0];
   const lastName = arrayFromValues[1];
   const fullName = `${firstName}${lastName}`;
 
   // Search for resume file
   const resumeFileName = `${firstName}${lastName}.pdf`; // Assuming resumes are in PDF format
   const resumeFilePath = path.join(os.homedir(), 'Downloads', resumeFileName); // Replace '/path/to/resume/folder' with the actual path to your resume folder
 
   // Check if resume file exists
   fs.access(resumeFilePath, fs.constants.F_OK, (err) => {
     if (err) {
       console.error(`Resume not found for ${fullName}`);
       const apiDataWithoutResume = {
         firstName: firstName,
         lastName: lastName
         };
         console.log("Candidate without resume",apiDataWithoutResume);
      //Call external API
      //sendDataToAPI(apiDataWithoutResume, fullName);
     } else {
       // Read resume file
       fs.readFile(resumeFilePath, (err, resumeData) => {
         if (err) {
           console.error(`Error reading resume file for ${fullName}:`, err);
           return;
         }
 
         // Prepare data to send to external API
         const apiData = {
           firstName: firstName,
           lastName: lastName,
           resume: resumeData
         };
         console.log("Candidate with resume",apiData);
         // Call external API
         // sendDataToAPI(apiData, fullName);
       });
     }
   });
 }
 
 // Function to send data to external API
//  function sendDataToAPI(data, fullName) {
//    fetch('https://example.com/api', {
//      method: 'POST',
//      body: JSON.stringify(data),
//      headers: { 'Content-Type': 'application/json' }
//    })
//    .then(response => {
//      if (!response.ok) {
//        throw new Error('Failed to send data to API');
//      }
//      console.log(`Data sent successfully for ${fullName}`);
//    })
//    .catch(error => {
//      console.error(`Error sending data to API for ${fullName}:`, error);
//    });
//  }

  

   fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
     processRow(row);
  })
  .on('end', () => {
   console.log('CSV file processed successfully');
   res.status(200).json({Message:"CSV file processed successfully"});
  })
  .on('error', (err) => {
   console.error('Error reading CSV file:', err);
   res.status(200).json({Message:"Error in Api Call",Error,err});
  });

}