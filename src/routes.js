import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [{
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
        const { search } = req.query
        const dto = search ? {
            title: search,
            description: search
        } : null
        const tasks = database.select('tasks', dto)
        return res.writeHead('200').end(JSON.stringify(tasks))
    }
}, {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
        const { title, description } = req.body

        const task = {
            id: randomUUID(),
            title: title,
            description: description,
            completed_at: null,
            created_at: new Date(),
            updated_at: null,
            completed: false
        }
        database.insert('tasks', task)
        return res.writeHead('200').end()
    }
}, {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
        const { title, description } = req.body

        const task = {
            title: title,
            description: description,
            updated_at: new Date(),
            completed: false
        }

        database.update('tasks', task, req.params.id)

        res.writeHead('200').end()
    }
}, {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
        database.delete('tasks', req.params.id)
        res.writeHead('200').end()
    }
}, {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
        const { completed } = req.body
        const task = {
            completed: completed
        }
        database.updateComplete('tasks', task, req.params.id)

        res.writeHead('200').end()
    }
}]