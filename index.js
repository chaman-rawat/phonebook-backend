const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const app = express();

morgan.token('request-body', (request, response) => {
  return JSON.stringify(request.body);
});

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'));

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`);
});

app.get('/api/persons', (request, response) => {
  response.send(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    response.send(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const person = request.body;
  if (Object.hasOwn(person, 'name') === false || Object.hasOwn(person, 'number') === false) {
    response.status(400).json({
      error: 'name or number is missing'
    });
    return;
  }

  if (persons.find(p => p.name === person.name)) {
    response.status(400).json({
      error: 'name must be unique'
    });
    return;
  }
  person.id = Math.floor(Math.random() * 1000000);
  persons.push(person);

  response.json(person);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})