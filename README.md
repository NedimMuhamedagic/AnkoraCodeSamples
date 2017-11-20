### AnkoraINC Code samples
This is a collection of code samples from recent AnkoraINC projects. Per our non-disclosure agreements, we are limited from displaying code bases of the projects so we have extracted some of the most interesting pieces of code from each project.

## React Native projects
# Project 1 - React Native/Node.js
This project included creating a Node.js server that will power a React Native app and a React frontend.

The React Native application enabled the user to create email templates, automatically fill them with user data and send the emails via Gmail. Node server handles all the logic for the emails and templates. This included properly handling the OAuth2 authorization with Google access and refresh tokens. The user would log in with Google which we handled with node passport.

After the user is logged in, we would issue a JWT token back to the user which was used to authenticate the user for every other call to our API. Regarding the refresh/access token logic required for OAuth2, we created a custom module which would check the access token and if neccessary, generate a new one using the refresh token.

On the mobile app side, we combined an Expo React Native app with Redux (and Redux Thunk) for state management. We used `react-navigation` to handle the app navigation. The project is still in development but some interesting code regarding the usage of Higher-order components linked to the Redux store is provided.
