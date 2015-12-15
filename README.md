# slackish-chat-fe

## Run locally
vagrant up

vagrant ssh

heroku local

## Push to server
heroku login

heroku create

git push heroku master

## ENV & DB
heroku run rake db:create

heroku run rake db:migrate

heroku config:set REST_API_URL=https://slackish-chat-be.com

heroku config:set WEBSOCKET_URL=wss://slackish-chat-fe.com/websocket
