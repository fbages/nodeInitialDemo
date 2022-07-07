# Sprint 4.2: REST API DB JWT

Per executar la REST API:  
1 - Clona el repo de Github  
2 - Executar npm install per instal.lar totes les dependencies  
3 - Per arrancar la REST API, des del terminal:   
```
node app/app.js
o
npm start
```

## Variables d'entorn
Per canviar de base de dades de Mysql a MongoDB, s'ha de modificar la varialbe DATABASE.
S'ha de crear un fitxer .env dins la carpeta app i hauria de tenir les següents variables:

### ### database connection mysql
DATABASE_HOST=localhost  
DATABASE_PORT=3306  
DATABASE_USER=root  
DATABASE_PASSWORD=ITAcademy  
DATABASE_NAME=dados_db  

### ### database connection mongodb
DATABASEMONGO_HOST=localhost  
DATABASEMONGO_PORT=27017  
DATABASEMONGO_USER=root  
DATABASEMONGO_PASSWORD=ITAcademy  
DATABASEMONGO_NAME=dados_db  

### ### run options ( mysql, mongodb)
DATABASE=mysql  

### ### credencials administrator
ADMINNAME=administrator  
ADMINPASSWORD=ITAcademy  

### ### server listening
PORT=3000  

### ### TOKEN JWT
SECRET=STRING_SECRET_ITAcademy  


## Endpoints
POST /players: crea un jugador/a.  
PUT /players/{id}: modifica el nom del jugador/a.  
GET /players: retorna el llistat de tots els jugadors/es del sistema amb el seu percentatge d’èxits.  
POST /games/{id}: un jugador/a específic realitza una tirada.  
DELETE /games/{id}: elimina les tirades del jugador/a.  
GET /games/{id}: retorna el llistat de jugades per un jugador/a.  
GET /ranking: retorna un ranking de jugadors/es ordenat per percentatge d'èxits i el percentatge d’èxits mig del conjunt de tots els jugadors/es.  
GET /ranking/loser: retorna el jugador/a amb pitjor percentatge d’èxit.  
GET /ranking/winner: retorna el jugador/a amb millor percentatge d’èxit.  
POST /login: Body: {"adminName" : "administrator", "adminPassword":"ITAcademy"} retorna token JWT a inserir en la resta peticions
