const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length !=5) {
    console.log('How to use the database:\n Add a person to the DB - node mongo.js <DB_password> <person_name> <person_number>\n See persons in DB - node mongo.js <DB_password>')  
    process.exit(1)
}

const DB_name = 'phoneBookApp'
const password = process.argv[2]

const url = `mongodb+srv://davidgr:${password}@cluster0.vbakrtx.mongodb.net/${DB_name}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if(process.argv.length == 3){
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}

const name = process.argv[3] 
const number = process.argv[4] 



if(process.argv.length == 5){
    const person = new Person({
        name: name ,
        number: number ,
    })

    person.save().then(result => {
        console.log(`Added ${person} to phonebook`)
        mongoose.connection.close()
    })
}
