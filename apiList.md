#DevTinder APIs List

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/:status/:userId           -status - interested, ignored
- POST /request/review/:status/:requestId      -status - accepted, rejected


## userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed - get all the profile of other users

Status :- ignored, interested, accepted, rejected
