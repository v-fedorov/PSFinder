# PSFinder
Pings Amazon, Target, PlayStation Direct, and BestBuy every 20 seconds to see if PS5 Digital Edition is available.

### Initial Setup
```npm install```
&
Create a `.env` file with the following key value pairs:

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
FROM_PHONE_NUMBER=
TO_PHONE_NUMBER=
BEST_BUY_API_KEY=
TARGET_API_KEY=ff457966e64d5e877fdbad070f276d18ecec4a01
ZIP_CODE=
```

- BestBuy API Key can be generated [here](https://developer.bestbuy.com/).
- [Twilio](https://www.twilio.com/) account required to receive text messages and phone calls.
- *Make sure phone numbers follow Twilio's format `+18675309` in the .env*
- Requires [Node](https://nodejs.org/en/download/) to be globally installed.
- Zip Code is required for Target checks ATM

### How to Run
```npm start```


### Notes
[This](https://www.zoolert.com/videogames/consoles/playstation5/) also exists.
