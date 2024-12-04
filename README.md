# A photo album management app built for a technical challenge, enabling users to organize and display their photos efficiently.

# Getting Started
The first step to run the project is to clone this git repository, to do this use the command git clone 'this repo url'

 To set up the project locally, you need to run 2 node projects. For that you need node.js and npm installed. You can learn how to do it here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](downloading-and-installing-node-js-and-npm).

 For the next step, open a terminal console in the PhotoAlbumChallenge.BFF folder, inside the git repository directory. Once inside the backend folder, run the following commands:

`npm install`
`npm run dev`

Now, move to the PhotoAlbumChallenge.Frontend folder, and run the following commands:

npm install
npm start

Now, the site should be running in [http://localhost:3000](http://localhost:3000).

## Functionality
### Frontend
Pages on the frontend:

* Login Page: Provide access to authentic users using JWTs (JSON Web Tokens). Redirects to the "My Albums" page if the login is successful.
* Register page: Allows a new user to register in the application.
* User List: Lists all users registered on the application, and provides a "See Albums" button for each user listed, redirecting to a user's album page.
* User Albums: Lists all albums submited by a user, and provides a "View Photos" button for each album, redirecting to the Album Photos page.
* My Albums: Lists all albums submited by the current user. Allow the user to create a new Album, and includes "View Photos", and "Delete" buttons for each existent Album.
* Album Photos: Lists all photos of a existent album.
* My Album Photos: Lists all photos of a user belonging album.

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

### Next steps
* Photo Upload with AWS S3: Implement the functionality for uploading photos using Amazon S3. A previous attempt to use Base64 encoding was deemed impractical due to the large payload size generated when converting the image. AWS S3 offers a more efficient solution for managing image uploads.

* Backend For Frontend (BFF) Architecture: Extend the BFF architecture across the entire backend. Currently, this structure is applied to only one controller.

* Unit Testing: Implement comprehensive unit tests for all frontend components and backend functionalities to ensure code reliability and maintainability.

* Security Headers Implementation: Introduce essential security headers, such as Content-Security Policy (CSP) and HTTP Strict Transport Security (HSTS), to enhance the application's security.

* Access Control for Photos: Provide users with stricter access control options, enabling them to specify which users can view their albums and photos.
