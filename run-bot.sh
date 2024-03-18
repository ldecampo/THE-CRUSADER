#!/bin/bash

#This file exists purely to keep the bot up. To get it working, run "chmod +x ./run-bot.sh"
#To run the bot, run "screen ./run-bot.sh"
#This is because, for some unknown reason, the bot doesn't stay online when "screen node index.js" is done. This script will continuously loop the command to start the bot,
#and when an error appears, it'll simply run the bot again. My theory is that there's some random error stopping the bot,
#but that error is not critical, and the bot still has total functionality. If anyone gets an error message, knows why it's happening, or can fix it, please let me know. Thanks!

for (( ; ; ))
do 
 screen node index.js
 sleep 1
done

    
