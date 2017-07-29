Control Kodi through your Google Home / Google Assistant
=========================

------------
## What it can do

Follow these steps to easily control your kodi using simple voice commands with your Google Home or Google assistant:

### **Play a movie:**
"Hey Google, kodi play [movie name]" --> will search for the given movie name and play it.

### **Play the next unwatched episode:**
"Hey Google, kodi play tv show [tv show name]" --> will search for the given tv show and play the next unwatched episode.

### **Play a specific episode:**
"Hey Google, kodi play [tv show name] season 3 episode 1" --> will search for the given tv show and play season 3 episode 1.

### **Pause / Resume kodi:**
"Hey Google, pause kodi"

### **Stop kodi:**
"Hey Google, stop kodi"

------------
## How to setup

Disclaimer: Use on your own risk and choose complex username & password in the below steps.

### **A) Enable webserver access in kodi**
1. In Kodi, go to *Settings* >> *Web server*
2. Set *Allow remote contorl via HTTP* to On
3. Choose a port number (e.g. 8080)
4. Choose a username and password (Important!)
5. Configure your router to forward the port your selected to your kodi device
6. Find your external IP address (i.e. Google 'what's my ip?')


### **B) Set up a webserver in Glitch to control your kodi**
1. Go to [Glitch.com](https://glitch.com) and sign in with your github user
2. Create a new Glitch project and under *advance settings* choose *Import from GitHub*
3. Enter this project *OmerTu/GoogleHomeKodi*
4. Change Glitch project settings to private (under *advance settings*)
5. Edit the *.env* file in your Glitch project with the following settings:
```
KODI_IP="YOUR_EXTERNAL_IP_ADDRESS"
KODI_PORT="YOUR_KODI_PORT"
KODI_USER="YOUR_KODI_USER_NAME"
KODI_PASSWORD="YOUR_KODI_PASSWORD"
AUTH_TOKEN="YOUR_CONNECTION_PASSWORD"
```
*YOUR_CONNECTION_PASSWORD* can be anything you want.

6. Check your Glitch server address by choosing 'Show Live' on the top left. A new tab with your server will open. Note your server address in the address bar.


### C) Set up IFTTT with your Google Home

1. Go to [IFTTT](https://ifttt.com)
2. Create a new applet: if *This* then *That*
3. For *This* choose: *Google Assistance*
    1. Choose *Say a phrase with a text ingredient*
    2. In *What do you want to say?* enter something like:
      > Kodi play $
    3. In *What do you want the Assistant to say in response?* enter something like:
      > ok playing $ movie
4. For *That* choose: *Maker Webhooks*
    1. Choose *Make a web request*
    2. In *URL* enter:
      >YOUR_GLITCH_SERVER_ADDRESS/playmovie?q= {{TextField}}
    
    For example, if your glitch server address is 'green-icecream.glitch.me', your should enter:
      >https://green-icecream.glitch.me/playmovie?q= {{TextField}}
    
    8. Method: *Get*
    9. Content Type: *application/json*
    10. Body:
      >{"token":"*YOUR_CONNECTION_PASSWORD*"}



Now every time you say "Hey Google, Kodi play movie bla bla", it should play bla bla on your kodi.

**Note:** If your external IP changes, this will stop working (consider getting a static IP address)


### Setting up other actions: ###

For **Tv show support - Next unwatched episode**, follow all the steps in **C**, except these changes: 
  * Choose a different phrase (e.g. "Kodi play an episode of $")
  * Use this URL:
    >YOUR_GLITCH_SERVER_ADDRESS/playtvshow?q= {{TextField}}

For **Tv show support - Specific episode**, follow all the steps in **C**, except these changes:
  * Choose "*Say a phrase with both a number and a text ingredient*" in step 3
  * Choose a different phrase (e.g. "Kodi play $ episode #"). 
  
  
  For this to work, when you talk to your GoogleHome, the $ part must be in the format of *"[TV_SHOW_NAME] season [SEASON_NUMBER]"*. Meaning the word "Season" has to be said, the tv show name must be said before it and the season number must be said after it (i.e. "okay google kodi play bla season 4 episode 1")
  * Use this URL:
    >YOUR_GLITCH_SERVER_ADDRESS/playepisode?q= {{TextField}}&e= {{NumberField}}

To **pause or resume** kodi follow the instructions in **C**, except these changes:
  * Choose "*Say a simple phrase*" in step 3
  * Use this URL:
    >YOUR_GLITCH_SERVER_ADDRESS/playpause

To **Stop** kodi, follow the same instructions as *pause* but use this URL:
  >YOUR_GLITCH_SERVER_ADDRESS/stop

To **Mute** kodi, follow the same instructions as *pause* but use this URL:
  >YOUR_GLITCH_SERVER_ADDRESS/mute
  
To **Set Volume** on kodi use "Say a phrase with a number" and the URL:
  >YOUR_GLITCH_SERVER_ADDRESS/volume?q= {{NumberField}}

------------
## How to update to the latest version
1. Go to [Glitch.com](https://glitch.com) and sign in with your github user
2. Select your Glitch project and under *advance settings* choose *Import from GitHub*
3. Enter this project *OmerTu/GoogleHomeKodi*

------------
## Troubleshooting
If your can't preform a simple action like pausing a video, try to narrow down to problem:

1. While a video is being played in Kodi, try pausing it by entering this in your browser:
>http://YOUR_INTERNAL_KODI_IP:PORT/jsonrpc?request={"jsonrpc":"2.0","id":1,"method":"Player.playpause","params":{"playerid":1}}

If you get prompt to enter username and password choose the ones you set in Kodi (step A above).
If that doesn't work, you probably have a problem with your kodi setup.

2. If that works, try pausing a video using your external IP:
>http://YOUR_EXTERNAL_IP:PORT/jsonrpc?request={"jsonrpc":"2.0","id":1,"method":"Player.playpause","params":{"playerid":1}}

If that doesn't work you probably have a problem with your router configuration.

3. If it does work, there might be something wrong in your glich or IFTTT settings.

------------
## Credits ##
I used some code from these 2 projects:
https://github.com/MarvinSchenkel/HomeyKodi
https://github.com/Jephuff/kodi-rpc

And this wonderful website makes setting this up super easy -  Glitch (https://glitch.com/about)


-----------------
Made by Omer Turgeman
-----------------
I hope you find this helpful!
If you'd like, you can give me a cup of coffee :) 

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7KPWVMH4T5UTJ&lc=US&item_name=Kodi%20control%20project&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)
