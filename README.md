# TriviaGame
Trivia game, developed over the weekend. Assuming a windows environment, for the time being.

##General Steps to Install
Install node.js<br />
Install express<br />
Install mongodb<br />
-mkdir C:/data and C:/data/db<br />
-run mongodb from the bin directory<br />
run "npm start" inside the code/server directory<br />


Configure the database IP/port/collection at code/server/routes/index.js (default to localhost for now)<br />
Configure the server IP at code/client/js/server_interface (default to localhost for now)<br />


Seed the database by uncommenting line 13 in /code/client/js/mod_screen and running the HTML once.<br />
Then, recomment the line and reload.
``` javascript
// testInsert( db );
```

OPTIMIZATIONS:<br />
-Remove Categories<br />
-Remove Questions<br />
-Remove Answers<br />
-check cross browser issues<br />
-only insert if unique<br />
-use GET over POST for GETTING data<br />
-update data<br />
-remove data<br />
-check on mobile device<br />
