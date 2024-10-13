import { parse } from 'csv-parse';
import { Database } from "../database.js"
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'

const database = new Database();

(async () => {
    const readableStream = fs.createReadStream('../tasks.csv');
    readableStream
        .pipe(parse({
            columns: true,
            delimiter: ',',
        }))
        .on('data', (row) => {
            const task = {
                id: randomUUID(),
                title: row.title,
                description: row.description,
                completed_at: null,
                created_at: new Date(),
                updated_at: null,
                completed: false
            };
            database.insert('tasks', task);
        })
        .on('end', () => {
            console.log('Arquivo lido com sucesso');
        })
        .on('error', (err) => {
            console.error('Erro ao ler arquivo CSV', err);
        });
})(); // <-- This is the correct way to invoke an IIFE