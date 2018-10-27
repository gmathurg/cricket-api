Cricket Api

Current Matches
  GET http://localhost:8008/api/cricket/matches
  
Player Search
  GET http://localhost:8008/api/cricket/search?name=Sachin
  
Player Details (player ID)
  GET http://localhost:8008/api/cricket/player/35320
  
Cricket News
  GET http://localhost:8008/api/cricket/news/?country=india
  
Fantasy Cricket

Login using Google
  GET http://localhost:8008/api/auth/google
  
User Players
  GET http://localhost:8008/api/fantasy/userPlayers
  
Add Player  
  POST http://localhost:8008/api/fantasy/player/35320
  
Delete Player  
  DELETE http://localhost:8008/api/fantasy/player/35320
  
Get Match Squads
  GET http://localhost:8008/api/fantasy/squad/1157374
