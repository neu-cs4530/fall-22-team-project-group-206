# Covey.Town

Covey.Town provides a virtual meeting space where different groups of people can have simultaneous video calls, allowing participants to drift between different conversations, just like in real life.
Covey.Town was built for Northeastern's [Spring 2021 software engineering course](https://neu-se.github.io/CS4530-CS5500-Spring-2021/), and is designed to be reused across semesters.
You can view our reference deployment of the app at [app.covey.town](https://app.covey.town/), and our project showcase ([Spring 2022](https://neu-se.github.io/CS4530-Spring-2022/assignments/project-showcase), [Spring 2021](https://neu-se.github.io/CS4530-CS5500-Spring-2021/project-showcase)) highlight select student projects.

![Covey.Town Architecture](docs/covey-town-architecture.png)

The figure above depicts the high-level architecture of Covey.Town.
The frontend client (in the `frontend` directory of this repository) uses the [PhaserJS Game Library](https://phaser.io) to create a 2D game interface, using tilemaps and sprites.
The frontend implements video chat using the [Twilio Programmable Video](https://www.twilio.com/docs/video) API, and that aspect of the interface relies heavily on [Twilio's React Starter App](https://github.com/twilio/twilio-video-app-react). Twilio's React Starter App is packaged and reused under the Apache License, 2.0.

A backend service (in the `townService` directory) implements the application logic: tracking which "towns" are available to be joined, and the state of each of those towns.

## Running this app locally

Running the application locally entails running both the backend service and a frontend.

### Setting up the backend

To run the backend, you will need a Twilio account. Twilio provides new accounts with $15 of credit, which is more than enough to get started.
To create an account and configure your local environment:

1. Go to [Twilio](https://www.twilio.com/) and create an account. You do not need to provide a credit card to create a trial account.
2. Create an API key and secret (select "API Keys" on the left under "Settings")
3. Create a `.env` file in the `townService` directory, setting the values as follows:

| Config Value            | Description                               |
| ----------------------- | ----------------------------------------- |
| `TWILIO_ACCOUNT_SID`    | Visible on your twilio account dashboard. |
| `TWILIO_API_KEY_SID`    | The SID of the new API key you created.   |
| `TWILIO_API_KEY_SECRET` | The secret for the API key you created.   |
| `TWILIO_API_AUTH_TOKEN` | Visible on your twilio account dashboard. |

### Starting the backend

Once your backend is configured, you can start it by running `npm start` in the `townService` directory (the first time you run it, you will also need to run `npm install`).
The backend will automatically restart if you change any of the files in the `townService/src` directory.

## Manual Testing for backend

To manually test the endpoints, simply start up the server and visit PORT/endpoints. Then you will be able to see all the swagger doc and can do the following testing actions. Do these in order to ensure reproducible results. The best way to gaurantee this is if you spin up the service locally, that way a fresh database is gauranteed. If you insert enough uniquely named teams, then send a request along the lines of /towns/scores/5, the results should be a status 200 and list of the 5 highest scores without using a hint (if there are less than 5 that did not use a hint, than some with a hint might be shown). Regardless of time, if a team uses a hint, they are bumped below a team that did not.

| Endpoint                                      | Expected Behaviour                                                                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| /towns/scores/5                               | returns ScoreFindResponse with status 200 and an empty list                                                                             |
| /towns/scores/0                               | returns ScoreFindResponse with status 400 and an invalid parameter error                                                                |
| /towns/scores/11                              | returns ScoreFindResponse with status 400 and an invalid parameter error                                                                |
| /towns/scores/zero                            | returns ScoreFindResponse with status 400 and an invalid parameter error                                                                |
| /towns/scores/teams/test                      | returns TeamInUseResponse with status 200 and boolean value of false                                                                    |
| /towns/score (with preset example for body)   | returns ScoreModifyResponse with status 201 and scoreModel that matches the input                                                       |
| /towns/scores/teams/test                      | returns TeamInUseResponse with status 200 and boolean value of true                                                                     |
| /towns/scores/teams/test1                     | returns TeamInUseResponse with status 200 and boolean value of false                                                                    |
| /towns/scores/5                               | returns ScoreFindResponse with status 200 and a list populated solely by the inserted score                                             |
| /towns/score (with preset example for body)   | returns ScoreModifyResponse with status 400 and MongoServerError error with message that reads along the lines of "name already exists" |
| /towns/score (change name of preset to test1) | returns ScoreModifyResponse with status 201 and scoreModel that matches the input                                                       |
| /towns/scores/5                               | returns ScoreFindResponse with status 200 and a list with score models that have the names "test" and "test1"                           |

### Configuring the frontend

Create a `.env` file in the `frontend` directory, with the line: `REACT_APP_TOWNS_SERVICE_URL=http://localhost:8081` (if you deploy the towns service to another location, put that location here instead)

### Running the frontend

In the `frontend` directory, run `npm start` (again, you'll need to run `npm install` the very first time). After several moments (or minutes, depending on the speed of your machine), a browser will open with the frontend running locally.
The frontend will automatically re-compile and reload in your browser if you change any files in the `frontend/src` directory.

## Manual Testing For Frontend

| Action                                                      | Expected Behaviour                                                                                                                                                                                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Player enter crossword puzzle area                          | instruction of entering the area should pop up --- press `space` to enter the area                                                                                                                                                                             |
| Player press `space` when entered crossword puzzle area     | A modal should pop up requesting `groupName`                                                                                                                                                                                                                   |
| Player enter a unique `groupName`                           | Another modal should pop up which contains title of current crossword puzzle, crossword puzzle grid and a toolbar with timer, check button, rebus button, leaderboard button and avatar for current player in area. A toast `Crossword Created!` would pop up. |
| Player enter a duplicate `groupName`                        | An error toast `Team name already in use; Please select a different name` would pop up                                                                                                                                                                         |
| When Crossword Puzzle Grid Modal is open `Timer`            | timer should start ticking                                                                                                                                                                                                                                     |
| When Crossword Puzzle Grid Modal is open `Timer`            | time display should be the same for all players                                                                                                                                                                                                                |
| When Crossword Puzzle Grid Modal is open `OccupantsDisplay` | player avatart should be dynamic with first letter of their user name -- when one player leave, its avatar should disappear                                                                                                                                    |
| When Crossword Puzzle Grid Modal is open `OccupantsDisplay` | when the number of player exceed 3, the last avatar would show the number of players that are not displayer                                                                                                                                                    |
| When Crossword Puzzle Grid Modal is open                    | clues with `down` and `across` will be next to the crossword grid                                                                                                                                                                                              |
| When `Help` button is clicked                               | a new tab would open with the information on how to complete the crossword puzzle                                                                                                                                                                              |
| Click `Leaderboard` button                                  | leaderboard modal would pop up with either `the leaderboard is empty `                                                                                                                                                                                         |
| Click an entry in `leaderboard`                             | a score modal would pop up with team members name and `disabled` checkbox for `usedHint`                                                                                                                                                                       |
| Fill cells in the grid                                      | the grid would be updated to everyone in the area                                                                                                                                                                                                              |
| Click on the cell                                           | the clicked cell would be highlighted yellow and the according word would be highlighted blue                                                                                                                                                                  |
| Double-Click on the cell                                    | the highlighted word would switch between `across` and `down`                                                                                                                                                                                                  |
| Exit the area                                               | `startTime`, `puzzle` would be cleared and the game would not be saved                                                                                                                                                                                         |
| Finish and complete the crossword puzzle                    | a toast with the time will pop up, `timer` would freeze                                                                                                                                                                                                        |
| Check a letter/word/puzzle                                  | the cell that is checked will highlighted red                                                                                                                                                                                                                  |
| Close the crossword puzzle modal                            | the game will keep going on unless everyone exit the area                                                                                                                                                                                                      |
