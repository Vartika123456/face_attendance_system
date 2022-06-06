
# Face Recognition Attendance System

The attendance of all users whose admission is given by the admin is recorded in this system. Admins may basically input and change their own information, as well as add employee details such as name, email, address, and photograph. Employees need to go to the mark attendance page, and the camera will capture the encoding of their faces and compare it to the encoding of the images uploaded by the administrator. If the encoding is correct, the attendance is correctly recorded. The administrator can then see a list of employees who have their attendance marked.



## Instructions Before Use
Make temp,user and admin folder in static/images folder

Use this command to make requirements.txt: 
 pip freeze > requirements. txt 

Command to install all libraray of requirements.txt by:pip install -r requirements.txt
## Tech Stack

Frontend:HTML,CSS,Javascript,JQuery

Framework:Flask

Backend:MySQL


## How to run
flask run

or

FLASK_APP=app.py FLASK_ENV=development flask run --port 8080