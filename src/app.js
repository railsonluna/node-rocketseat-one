const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (!isUuid(id) ||repositoryIndex < 0) {
    return response.status(400).json({"error": "Id Not found"});
  }

  return next();
}

function validateRepository(request, response, next) {
  const { title, techs, url } = request.body;
  
  if (!title || !(typeof title === 'string') || !url || !(typeof url === 'string') || !techs || !Array.isArray(techs)) {
    return response.status(400).json({"error": "Bad Request"});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories)
});

app.post("/repositories", validateRepository, (request, response) => {
  const { title, techs, url } = request.body;

  repository = {
    id: uuid(),
    title: title,
    url: url,
    techs : techs,
    likes: 0
  };

  repositories.push(repository);

  response.status(201).json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, techs, url } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  var repository = repositories[repositoryIndex];

  const repositoryUpdate = {
    id: repositories[repositoryIndex].id,
    title: title || repository.title,
    url: url || repository.url,
    techs: techs || repository.techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repositoryUpdate;

  return response.status(200).json(repositoryUpdate)
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repository = repositories[repositoryIndex];
  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.status(200).json({likes: repository.likes});
});

module.exports = app;
