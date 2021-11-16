## ABOUT
 
This is a project to demonstrate custom jwt authentication in a nextjs app.
Here, frontend is a common nextjs app and backend is a simple web api written in python/flask web framework.
 
## HOW TO RUN
 
`docker-compose up`
 
## MOTIVATION
 
I was looking for how to properly handle user authentication in single page applications. I was particularly curious about the best way to store session secrets on client-side.
 
To my surprise there was not an easy and agreed-upon method for this task. And I think this is why paid services like Auth0 have emerged.
 
Most of the traditional (server rendered) web frameworks offer turnkey solutions for session management and they heavily rely on browser cookies under the hood. And this was also my experience as a web developer.
 
For a personal side project I wanted to build a modern web application as a client-side single page app which exchanges information with a backend api via rest api calls. For this project I wanted to implement user authentication from scratch (which has always been abstracted away from me while developing traditional web applications like asp.net mvc).
 
After digging up a little bit, it was clear to me that storing sensitive information in browser features such as cookies or local storage is dangerous as cookies are prone to different kinds of attack vectors like XSS, CSRF etc. and local storage is accessible from any script running on your page (any third-party script running on your page can read your local storage!).
 
So in the end I was convinced to use access/refresh token pattern. In this pattern a client app stores an access token as an in-memory variable and uses it in api calls. When this access token expires the client can get a new one if it has a valid refresh token.
 
To illustrate, after a successful login request, the client is issued an access token, and in the same response web server sets an http-only cookie containing a refresh token (so that it cannot be read by client scripts). The access token is stored as an in-memory variable on client-side to be used in authorization header of the future api calls. This access token has a short life time with its expiration date. When an access token expires the client is expected to detect this (from server response) and seamlessly call refresh-token endpoint to get a new access token and then retry the original request. Server issues a new access token (and sets a new refresh token cookie) if and only if a valid refresh-token value is present in the current request's cookies.
 
When a user makes a browser level page refresh (or opens the app for the first time), obviously our in-memory access token will be missing. So the client app is expected to try to get a valid access token on application initialization stage. If a previously set refresh token cookie is present, server will issue a new access token without a problem. If not, user should be treated as a guest and redirected to login page if a protected resource is requested.
 
 
## KNOWN ISSUES
 
Here, the most important bit of information is the refresh token which is set as an http-only cookie in order to prevent script level access. If a threat actor somehow obtains this information it is possible to obtain valid access tokens indefinitely. To circumvent this situation Auth0 team suggests an advanced refresh token management approach, details of which can be found at [here][refresh-token-rotation].
 
This approach is not implemented in this simple demonstration project.
 
 
## MAIN FEATURES
 
backend:
 
- simple rest api implementation in flask
- users are managed in an sqlite database
- protected resources are secured with authentication middleware
- after successful login clients are issued access tokens as a signed jwt and an http-only refresh-token cookie is set by web server
- when an access token is expired, refresh-token endpoint can be used to get a new one (provided a valid refresh token cookie is present)
 
frontend:
 
- on app initialization, tries to get a new access token via calling refresh-token endpoint
- uses redux toolkit to store logged in user's info in client state (access token is a part of this)
- automatically adds access token to authorization header of api requests
- seamlessly refreshes access token when expired
- prevents protected pages from rendering for unauthenticated requests and redirects to login
 
[refresh-token-rotation]: https://auth0.com/docs/security/tokens/refresh-tokens/refresh-token-rotation