const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Note = require('../models/note')

const api = supertest(app)

// beforeEach(async () => {
//   await Note.deleteMany({})

//   const noteObjects = helper.initialNotes.map(note => new Note(note))
//   const promiseArray = noteObjects.map(note => note.save())
//   await Promise.all(promiseArray)
// }) Promise.all executes the promises it receives in parallel

// beforeEach(async () => {
//   await Note.deleteMany({})
//   await Note.insertMany(helper.initialNotes)
// }) Mongoose's built-in method

beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  for(const note of helper.initialNotes){
    const noteObject = new Note(note)
    await noteObject.save()
    console.log(`Note "${note.content}" saved`)
  }
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')

  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  console.log('entered test')

  const response = await api.get('/api/notes')


  assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  console.log('entered test')

  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added ', async () => {
  console.log('entered test')

  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const notesAtEnd = await helper.notesInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)


  const contents = notesAtEnd.map(n => n.content)
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content is not added', async () => {
  console.log('entered test')

  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)


  const notesAtEnd = await helper.notesInDb()


  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
  console.log('entered test')

  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]


  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async () => {
  console.log('entered test')

  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]


  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  const contents = notesAtEnd.map(n => n.content)
  assert(!contents.includes(noteToDelete.content))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})