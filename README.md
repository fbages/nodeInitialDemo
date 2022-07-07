# Sprint 4.1: REST API

Per executar la REST API:
1 - Clona el repo de Github
2 - Executar npm install per instal.lar totes les dependencies
3 - Per arrancar la REST API, des del terminal: 
```
node app/app.js
o
npm start
```

## Endpoints
1 - Petició GET, que retorna un json amb el teu nom, edat i l'URL des d'on es fa la petició.
 ```
localhost:3000/user
```

2 - Peticio POST, que puja al servidor un arxiu de tipus png, jpg o gif i que retorna un missatge d'error en cas que l'extensió de l'arxiu no coincideixi amb aquestes.
 ```
localhost:3000/upload
```

3 - Petició POST que rebi com a paràmetre un JSON amb el nom d'usuari/ària i retorni un objecte JSON que contingui l'hora i data actual. Inclogui un middleware que afegeixi la capçalera Cache-control: no-cache. Habiliti CORS (Cross-Origin Resource Sharing) en les respostes, sigui mitjançant Express o mitjançant un altre middleware. i també té un middleware que retorna un HTTP Status 401 - Unauthorized si la capçalera de la petició no conté autenticació bàsica (usuari/ària i contrasenya).
 ```
localhost:3000/time
```

4 - Petició GET que rebi un número de Pokémon com Id, faci una cerca al Pokémon API i retorni el nom del Pokémon, la seva alçada i el seu pes.
 ```
localhost:3000/pokemon/:id
```
# INFO de les carpetes inicials - Node Initial Project

### Project Structure

Main structure of node.js project. Folders / files:

- <b>\_\_tests__</b>. Tests folder. See [Jest Docs](https://jestjs.io/es-ES/docs/configuration) and [Chai Docs](https://www.chaijs.com/)
- <b>app</b>:
    - <b>config</b>
    - <b>controllers</b>
    - <b>middlewares</b>
    - <b>models</b>
    - <b>routes</b>
    - <b>helpers</b>
    - <b>app.js</b>. Entry point.
- <b>package.json</b>.
- <b>.env</b>. Environment descriptor. See [dotenv doc](https://www.npmjs.com/package/dotenv).

Extras:
- <b>.eslintrc</b>. Linter JS, static code analyzer. See [EsLint Docs](https://eslint.org/docs/user-guide/configuring/configuration-files).
- <b>.prettierignore</b>. Code formatter. See [Prettier Config](https://prettier.io/docs/en/configuration.html) and [Prettier Ignore](https://prettier.io/docs/en/ignore.html).
- <b>.ecosystem.config.js</b>. Process Manage at runtime. See [PM2 Docs](https://pm2.keymetrics.io/).

### Import project for use with Visual Studio Code

Follow the steps below:
* Clone the project from the Github Platform. Execute:
  ```
  git clone [url project]
  ```
* Open the project downloaded.
  ![Open Project](img/VSC_open.png)


### Import project for use with WebStorm

Follow the steps below:
* Clone the project from the Github Platform. Execute:
  ```
  git clone [url project]
  ```
* Open the project downloaded.
![Open Project](img/webstorm_open.png)


### Utilities

* [Node Developers Guide](https://nodejs.dev/learn)
* **.gitignore file** configuration. See [Official Docs](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files).
* **Git branches**. See [Official Docs](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
