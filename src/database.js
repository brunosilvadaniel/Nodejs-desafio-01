import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    if (row[key] && typeof row[key] === 'string' && typeof value === 'string') {
                        return row[key].includes(value);
                    }
                    return row[key] === value;
                });
            });
        }
        console.log(search)
        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist(data)

        return data
    }

    update(table, data, id) {
        let index = this.#database[table].findIndex(row => row.id === id)

        if (index > -1) {
            const currentEntry = this.#database[table][index];
            const updatedEntry = {
                ...currentEntry,
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...{ updated_at: new Date() }
            };
            this.#database[table][index] = updatedEntry
            this.#persist()
        }

    }

    delete(table, id) {
        let index = this.#database[table].findIndex(row => row.id === id)

        if (index > -1) {
            this.#database[table].splice(index, 1)
            this.#persist()
        }
    }

    updateComplete(table, data, id) {
        let index = this.#database[table].findIndex(row => row.id === id)

        if (index > -1) {
            const currentEntry = this.#database[table][index];
            const updatedEntry = {
                ...currentEntry,
                ...(data.completed !== currentEntry.completed && { completed: data.completed }),
                ...(!data.completed ? { completed_at: null } : { completed_at: new Date() }),

            };
            this.#database[table][index] = updatedEntry
            this.#persist()
        }
    }

}