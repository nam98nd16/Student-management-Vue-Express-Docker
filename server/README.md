# Student-management-expess.js

API documents (swagger): http://localhost:3000/api-docs

Known bug: Unable to invalidate a token after a user had logged out, which essentially means users can literally do everything even after logging out provided that he/she got a copy of that token as long as it has not expired yet. The token will expire in a preset amount of time (1200 secs). A possible solution is to 'blacklist' all tokens that has not expired yet after users log out.
