# firebase-talk

This repo has sample projects for my talk on [Building APIs with Firebase](https://www.meetup.com/RVA-Software-Development-User-Group/events/270471310/?_xtd=gqFypzQxNDQwNjmhcKZpcGhvbmU&from=ref).

A PDF of my slides can be [reached here](slides.pdf).

The `start` folder has the initial setup for the sample project.

The `finished` folder has a final setup for the sample project.

## Project Setup

The sample API that I've built acts as a timeclock. There are endpoints for the basic functions:

- GET `/hello-world`
  - call this to verify app is running
- POST `/clock-in`
  - call this to clock in with a body that includes:

```js
{
    "project": <project_name>
}
```

- PUT `/clock-out`
  - call this to clock out
- GET `/select-all`

  - call this to get all time records

- DELETE `/delete-all`

  - call this to delete all time records

  ## Start Project

  The "start" folder has a default setup for Firebase functions. The app instance is inside the "functions" folder.

  ## Finished Project

  The "finished" folder has everytihng built out to include integration tests and a service account.

  To setup the service account and get the associated `permissions.json` file, please follow the [instructions here](https://firebase.google.com/docs/admin/setup#initialize-sdk).

- To run the finished project locally, run `npm run serve`

- To test the finished project locally, run `npm run integration-tests`

- To see logs from the firebase console, run `npm run logs`

- To deploy the project, run `npm run deploy`

## Have Questions?

Feel free to connect withme on [andrewevans.dev](https://www.andrewevans.dev).
