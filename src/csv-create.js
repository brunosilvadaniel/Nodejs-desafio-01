import { stringify } from 'csv-stringify'
import fs from 'node:fs'

const records = [
    ['Task 01', 'Descrição da Task 01'],
    ['Task 02', 'Descrição da Task 02'],
    ['Task 03', 'Descrição da Task 03'],
    ['Task 04', 'Descrição da Task 04'],
    ['Task 05', 'Descrição da Task 05']
];

const writableStream = fs.createWriteStream('tasks.csv');

stringify(
    records,
    {
        header: true, // Include the header row
        columns: ['title', 'description'] // Define column names
    },
    (err, output) => {
        if (err) {
            console.error('Error generating CSV:', err);
            return;
        }
        // Write the CSV output to the file
        writableStream.write(output);
        writableStream.end();
        console.log('CSV file generated successfully!');
    }
);