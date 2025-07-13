# THE CRUSADER
A Discord bot which pings moderators when a banned word is said, made by request.

Functionality includes:
- Pinging a role whenever someone says a disallowed word
- Autotimeout whenever someone says a disallowed word (toggleable)
- Creating a log of pinned messages
- Logging whenever someone says a disallowed word
- Autodeleting and logging discord invites
- French.

# Bot commands

### /register
Registers the server to the bot. The bot will create a template json file in the guilds folder specifically for the server, allowing custom settings for each server the bot is in.

### /setlogchannel
Sets the current channel as the log, and any moderation activities will be logged there.

### /setpinlogchannel
Sets the current channel as the pin log. Anytime a new message is pinned within the server, it will be logged in the channel.

### /settimeouttime
Sets how long to timeout each user when a slur is detected, in milliseconds.

### /setpingroleid 
Sets the role to ping whenever a slur is detected. Note that it must be the role ID, not the role itself.

### /ping
Pings the bot, returns pong if online.

#### Uncomprehensive



# Setup instructions
Prereqs: [node.js](https://nodejs.org/), linux server preferred

Navagate to the appropriate folder, and then start a new node project with `npm init`.

Install discord.js to your new project, `npm install discord.js`.

Then, import all the files from this repo. Edit the secrets.json and config.json files to include the appropriate information. Run `screen node index.js` to run the bot in a screen, so that you can close your terminal window. 






