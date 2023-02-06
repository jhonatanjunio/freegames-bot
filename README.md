# FreeGames Discord Bot

A Discord bot that works like a free games radar!

## Features

- At every 10 minutes the bot will search for new free games and loot! It will delete the expired promotions too.
- Users can call /promocoes in order to see the current free games and loot.

## How to use

- You'll need to create a bot at [Discord Developers's user dashboard](https://discord.com/developers/applications)
- You can find proper help creating your bot by clicking [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- Certify that your bot have the right privileged gateway intent [**Server Members Intent**](https://gist.github.com/advaith1/e69bcc1cdd6d0087322734451f15aa2f#what-are-these-privileged-intents-needed-for)
- You have to add the right .env variables regarding the Discord channels. For this project purpose you'll need to add: 
  - `DISCORD_TOKEN` → Bot Token generated at Discord Developer's Portal
  - `DISCORD_GUILD_ID` → Discord server ID
  - `DISCORD_CHANNEL_ID` → Channel ID where the bot will notify users about new free game/loot
<br>
  
## TODOs
  - There is nothing done regarding the translation. Bot responses are all in Brazilian Portuguese.
  - Code documentation is poor.
  - Tests are not implemented too.
  - Visual interface for a better admin experience.

That's all!
Now you just have to run your server loccally or deploy it to somewhere you want, and you're ready to go.
Enjoy! <br/><br/>

##### Made with 💜 by [Jhonatan](https://github.com/jhonatanjunio)