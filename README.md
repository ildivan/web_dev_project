# web_dev_project
Web developement project for the Bachelor 's Degree in Computer Engineering course on web developement


1) Clone the repo
2) Write a .env file where you find .env_example files and follow them
3) Run docker compose up
4) Enter the backend container's shell and run these commands for the first startup:
    1) python src/manage.py migrate #creates the tables needed for django to function
    2) python src/manage.py createsuperuser  # Lets you create an admin user for the application
    

5) Go to http://localhost and you should be forwarded to the login page

NB: Every time you modify the database models, you should enter the backend container shell and run: python src/manage.py makemigrations
It is important in order to let django modify the structure of the database when the container runs the migrate command. 