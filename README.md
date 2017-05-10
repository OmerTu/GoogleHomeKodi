Control Kodi through your Google Home / Google Assistant
=========================

------------
## What it can do

Eventually, this let you to easily control your kodi using simple voice commands.

### **Play a movie:**
"Hey Google, kodi play movie [movie name]" --> will search for the given movie name and play it.

### **Play next unwatched episode:**
"Hey Google, kodi play tv show [tv show name]" --> will search for the given tv show and play the next unwatched episode.

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


### **B) Setup a Google assistance to kodi webserver in Glitch**
1. Go to [Glitch.com](https://glitch.com) and sign in with your github user
2. Create a new Glitch project and under *advance settings* choose *Import from GitHub*
3. Enter this project *OmerTu/GoogleHomeKodi*
4. Change Glitch project settings to private (under *advance settings*)
5. Edit the *.env* file in your Glitch project with the following settings:
```
KODI_IP="[YOUR_EXTERNAL_IP_ADDRESS]"
KODI_PORT="[YOUR_KODI_PORT]"
KODI_USER="[YOUR_KODI_USER_NAME]"
KODI_PASSWORD="[YOUR_KODI_PASSWORD]"
AUTH_TOKEN="[YOUR_CONNECTION_PASSWORD]"
```
*[YOUR_CONNECTION_PASSWORD]* can be anything you want.

6. Check your Glitch server address by choosing 'Show Live' on the top left. A new tab with your server will open. Note your server address in the address bar.


### C) Set up IFTTT with your Google Home

1. Go to [IFTTT](https://ifttt.com)
2. Create a new applet: if *This* then *That*
3. For *This* choose: *Google Assistance*
    1. Choose *Say a phrase with a text ingredient*
    2. In *What do you want to say?* enter something like:
    > Kodi play movie $
    3. In *What do you want the Assistant to say in response?* enter something like:
    > ok playing $ movie
4. For *That* choose: *Maker Webhooks*
    1. Choose *Make a web request*
    2. In *URL* enter:
    >[YOUR_GLITCH_SERVER_ADDRESS]/playmovie?q= {{TextField}}
    
    For example, if your glitch server address is 'green-icecream.glitch.me', your should enter:
    >https://green-icecream.glitch.me/playmovie?q= {{TextField}}
    
    8. Method: *Get*
    9. Content Type: *application/json*
    10. Body:
    >{"token":"*[YOUR_CONNECTION_PASSWORD]*"}


Now every time you say "Hey Google, Kodi play movie bla bla", it should play bla bla on your kodi.

**Note:** If your external IP changes, this will stop working (consider getting a static IP address)

For **Tv show support**, follow all the steps in **C**, except choose a different phrase (e.g. "Kodi play an episode of $") and use this URL:
>[YOUR_GLITCH_SERVER_ADDRESS]/playtvshow?q= {{TextField}}

To **pause or resume** kodi follow the instructions in **C** but choose "*Say a simple phrase*" in step 3 and use this URL:
>[YOUR_GLITCH_SERVER_ADDRESS]/playpause

To **Stop** kodi, follow the same instructions as *pause* but use this URL:
>[YOUR_GLITCH_SERVER_ADDRESS]/stop


------------
## Credits ##
I used some code from these 2 projects:
https://github.com/MarvinSchenkel/HomeyKodi
https://github.com/Jephuff/kodi-rpc

And this wonderful website makes setting this up super easy -  Glitch (https://glitch.com/about)


-----------------
Made by Omer Turgeman
-----------------
