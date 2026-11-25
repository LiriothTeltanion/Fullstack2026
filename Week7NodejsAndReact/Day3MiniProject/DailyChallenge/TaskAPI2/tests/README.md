# User API regression tests

Run `npm test` from the TaskAPI2 folder. Tests create temporary JSON stores and listen on a temporary local port.

The suite exercises form delivery, registration validation, bcrypt persistence, duplicate usernames/passwords, concurrent registration, login, public profile responses, updates, invalid JSON, storage errors and recovery. It also exercises the retained task CRUD routes.
