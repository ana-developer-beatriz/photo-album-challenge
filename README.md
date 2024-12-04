### A photo album management app built for a technical challenge, enabling users to organize and display their photos efficiently.

## Getting Started
 The first step to run the project is to clone this git repository, to do this use the command git clone 'repo_url'

 To set up the project locally, you need to run 2 node projects. For that you need node.js and npm installed. You can learn how to do it here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](downloading-and-installing-node-js-and-npm).

 For the next step, open a terminal console in the backend folder, inside the git repository directory. Once inside the backend folder, run the following commands:

```npm install```
```npm run dev```

Now, move to the src folder, and run the following commands:

```npm install```
```npm start```

Now, the site should be running in [http://localhost:3000](http://localhost:3000).

## What was implemented
### Backend
The Backend consists in 11 endpoints:

* /createPhotos -> Submit a new photo 

* /photo/getPhotos -> List all existent photos

* /photo/getPhotosById -> Return an existent photo by it's Id
* /photo/updatePhotos -> Updates an existent photo by it's Id
* /signup -> Handles user registration
* /login ->  Provide JWTs for authentic users
* /album/createAlbum ->  Create a new Album object
* /album/getAlbumById/:id -> Return an existent Album by it's Id
* /album/updateAlbum/:id -> Updates an existent Album by it's Id
* /album/deleteAlbum/:id -> Deletes an existent Album by it's Id

### Frontend
There is two pages on the frontend:
* Login Page: Provide JWTs (JSON Web Tokens) to authentic users.
* Register page: Allows a new user to register in the application.

## Next steps
1. Create an Add Photo button, allowing the user to use the existent endpoint.
2. Create the "My users" endpoint, allowing the user to visualize detailed information about other users.
3. Create the "My user albums" endpoint, allowing the authorized users to visualize their previously submited albums.
4. Create the "My album photos" endpoint, displaying all the photos of a selected album.
