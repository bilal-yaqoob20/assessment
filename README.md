### getLatestPortfolioValueForAllTokens()

Displays the latest portfolio value for in USD for all tokens. Calculated balance of all tokens by their transactions than using API fetched the USD amount of each token and multiplied balance with USD amount to find the portfolio amount.

### getLatestPortfolioValueForToken(token)

Displays the latest portfolio value for the passed token in USD. Calculated the balance of the token by it's transactions than used API to get USD amount of that token and multiplied balance with USD amount to find the portfolio amount of that token.

### getPortfolioValueOfAllTokensOnDate(date)

Displays the portfolio value for all tokens in USD on the date passed. Date should be in "MM/DD/YYYY". Read all timestamps from CSV and convert them to date object and compare with passed date. Find balance of each token on that date and than using API fetch the data for all token on that date. Multiply the closing amount of each token with the balance to display the portfolio amount of all tokens on that date.

### getPortfolioValueOfTokenOnDate(token, date)

Displays the portfolio value of the passed token in USD on the date passed. Date should be in "MM/DD/YYYY". Read all timestamps from CSV of the token and convert them to date object and compare with passed date. Find balance of the token on that date and than using API fetch the data for that token on that date. Multiply the closing amount of the token with the balance to display the portfolio amount of that token on that date.
