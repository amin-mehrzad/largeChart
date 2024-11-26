// Import the fs module
const fs = require("fs");

// File path
const filePath = "data.json";

// Generate the data array dynamically
const generateData = () => {
  const dataArray = [];
  const totalDeciseconds = 1000000; // From 00:00:00:00 to 01:00:00:00 inclusive

  for (let i = 0; i <= totalDeciseconds; i++) {
    // Calculate hours, minutes, seconds, and deciseconds
    const hours = Math.floor(i / 360000);
    const minutes = Math.floor((i % 360000) / 6000);
    const seconds = Math.floor((i % 6000) / 100);
    const deciseconds = i % 100;

    // Format time as HH:MM:SS:DD
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${deciseconds
      .toString()
      .padStart(2, "0")}`;

    // Determine the left digit of deciseconds
    const leftDigit = Math.floor(deciseconds / 10);
    const maxRandom = leftDigit * 8;

    // Generate random data between 0 and maxRandom - 1
    const randomData = Math.floor(Math.random() * maxRandom);

    // Add the object to the array
    dataArray.push({ time, data: randomData });
  }
  return dataArray;
};

// Create the array
const dataArray = generateData();

// Convert the array to a JSON string
const fileContent = JSON.stringify(dataArray, null, 2);

// Write the array to a file
fs.writeFile(filePath, fileContent, (err) => {
  if (err) {
    console.error("Error creating the file:", err);
  } else {
    console.log(`File '${filePath}' created successfully!`);
  }
});
