TRANSCENDENCE




GIT 

Create a pull request with only the "frontend" folder from the frontend branch into dev branch (can be applied to backend as well)

# 1. Checkout dev branch and make sure it's up to date
git checkout dev
git pull origin dev

# 2. Create and switch to a new branch from dev
git checkout -b frontend-into-dev

# 3. Bring in ONLY the 'frontend/' folder from the frontend branch
git checkout frontend -- frontend/

# 4. Stage the changes
git add frontend/

# 5. Commit the changes
git commit -m "Add frontend folder from frontend branch"

# 6. Push the new branch to remote
git push origin frontend-into-dev



# Moving to production: 
- Create an ssl certificate: 

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout privkey.pem \
    -out cert.pem \
    -subj "/CN=localhost"



# Commands for using the CLI for interacting with the Match Context: 

curl -X POST http://localhost:3000/api/match \
    -H 'Content-Type: application/json' \
    -d '{"matchType":"ai","userIdA":1}'

curl -X POST http://localhost:3000/api/match/<MATCH_ID>/control \
    -H 'Content-Type: application/json' \
    -d '{"userId":1,"control":"move-paddle-up"}'

curl -X GET http://localhost:3000/api/match/<MATCH_ID>/state

# API testing

The file `test/api/api.http` uses placeholders for the base URL and authentication token.

- Replace `@baseUrl` with the URL of your deployed service (for example, `https://<cloud-run-service-url>`) or configure it via an environment variable supported by your HTTP client.
- Run the **Login** request to store the JWT from the response cookies; subsequent requests automatically include `Cookie: token={{token}}`.

