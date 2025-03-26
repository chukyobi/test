first of all make sure your input tags are well set as it is in this code.. you do not need to change your design.. maintain your design only change your input data.. 

make sure all the form validations are as it is in the signup page of this project.

install axios in the frontend.. that means make sure you have cd into your project folder and do "npm install axios"

after installing adjust your code in all the pages (signup login and verification page by importing axios as it in the pages of this project)

once your front end pages are well structured using this project as a guideline create a database using mysql

create a new terminal and write this command (mysql -u root -p ) and click enter : put your password if requiered

then create a new database using this command (CREATE DATABASE my_database_name;) and click enter

check if the database was created successfuly by writing the command (SHOW DATABASES;).. if the name of your database is there you have successfuly create a new database.

now in your project folder create a new folder and name it backend 

open a new terminal and cd into backend

inside your backend terminal write the commnd (npm init -y) and click enter

then install the following dependecies using this command "npm install express mysql2 sequelize cors dotenv nodemailer bcrypt jsonwebtoken axios body-parser" and click enter
add --force in you have an error.

after that install the types for these dependencies using the following command "npm i --save-dev @types/cors" "npm i --save-dev @types/bcrypt" "npm i --save-dev @types/jsonwebtoken" "npm i --save-dev @types/nodemailer "

in the backend folder create 2 folders named config and models and a file named server.js

in the config folder create a file and name it database.js or db.js and  you can copy the code in this project in db.js and paste in yours // this file is making the connection between your backend server to your database you created above.

create a .env file in your backend folder and add these information there 

"
DB_NAME=my_database_name
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

"
adjust the information at the right after the = sign with the correct your own correct information

in the models folder create a file named User.js and create the schema for all the data on your signup form using sequelize // you can use the User.js in this project as a guide.

then in your server.js create your api routes and logic use the code in the server.js file in this project as guideline.. 
\
make sure the api links you created in your server.js as the same you re consuming in your front pages.

add this to your .env file "JWT_SECRET=your_jwt_secret"

make sure that the data you are sending from the front end is exactly the same in your users model except the otp and otp expires wihich you will add in the signup api..

to test your code go to the frontend terminal and write "npm run dev" and click enter 

and the backend terminal and write "node server.js" and click enter

