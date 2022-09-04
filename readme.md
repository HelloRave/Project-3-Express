# Project-3-Express

This is an Express server and is the backend for Ripped project
- Access demo integration with frontend [here](https://mrripped.netlify.app/)
- Access demo for owner webpage [here](https://hww-tgc18-project-03.herokuapp.com/admin/login)
- For more details, please visit the README at frontend repository [here](https://github.com/HelloRave/Project-3-React)

To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
```

```
GRANT ALL PRIVILEGES on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```
**Note:** Replace *sakila* with the name of the database you want the user to have access to
 
 ```
FLUSH PRIVILEGES;
```
