Control Kodi through your Google Home / Google Assistant
=========================
## Table of contents:
- [What it can do](#what-it-can-do)
- [How to setup](#how-to-setup)
- [Full table with available actions](#full-table-with-available-actions)
- [How to update to the latest version](#how-to-update-to-the-latest-version)
- [Troubleshooting](#troubleshooting)

------------
## What it can do

Follow these steps to easily control your kodi using simple voice commands with your Google Home or Google assistant:

### **Play a movie:**
"Hey Google, kodi play [movie name]" --> will search for the given movie name and play it.

### **Search and play a youtube video:**
"Hey Google youtube [youtube title]" --> will search a youtube video, and play the first video.

### **Play the next unwatched episode:**
"Hey Google, kodi play tv show [tv show name]" --> will search for the given tv show and play the next unwatched episode.

### **Play a specific episode:**
"Hey Google, kodi play [tv show name] season 3 episode 1" --> will search for the given tv show and play season 3 episode 1.

### **Play a random episode for a tv show:**
"Hey Google, kodi shuffle [tv show name]" --> will search for the given tv show and play a random episode.

### **Pause / Resume kodi:**
"Hey Google, pause kodi"

### **Stop kodi:**
"Hey Google, stop kodi"

### **Mute kodi:**
"Hey Google, mute/unmute kodi"

### **Set volume:**
"Hey Google, set kodi volume to 60"

### **Play PVR channel:**
"Hey Google, switch kodi to BBC channel" or "Hey Google, switch kodi to channel 10"

### **Turn on TV:**
"Hey Google, switch to kodi" --> will turn on the TV and switch to Kodi's HDMI input

### **Shutdown Kodi:**
"Hey Google, kodi shutdown"

### **Scan library:**
"Hey Google, kodi scan library" --> Will start a full library scan

### **Navigate Up:**
"Hey Google, kodi navigate up 3" --> Will navigate up the requested amount

### **Navigate Down:**
"Hey Google, kodi navigate down 3" --> Will navigate down the requested amount

### **Navigate Left:**
"Hey Google, kodi navigate left 3" --> Will navigate left the requested amount

### **Navigate Right:**
"Hey Google, kodi navigate right 3" --> Will navigate right the requested amount

### **Navigate Back:**
"Hey Google, kodi go back 3" --> Will navigate back requested amount

### **Navigate Select:**
"Hey Google, kodi Select" --> Will select the hightlighted item

### **Navigate Context Menu:**
"Hey Google, kodi open context menu" --> Will open the context menu for the selected item

### **Navigate Go Home:**
"Hey Google, kodi go home" --> Will open the main menu page

### **Whats Playing:**
"Hey Google, kodi Whats Playing" --> Will show whats playing information

### **Change Subtitles:**
"Hey Google, kodi subtitles on/off/previous/next" --> Will change subtitle settings

### **Change Subtitles direct select:**
"Hey Google, kodi change subtitle to track 3" --> Will change subtitle track to a specific track

### **Change Audiostream(Language):**
"Hey Google, kodi audiostream previous/next" --> Will change audiostream settings

### **Change Audiostream(Language) direct select:**
"Hey Google, kodi change audiostream to track 3" --> Will change audiostream settings

### **Seek forward x minutes:**
"Hey Google, kodi go forward 30 minutes"

### **Seek backwards x minutes:**
"Hey Google, kodi go backward 30 minutes"

### **Seek to x minutes:**
"Hey Google, kodi jump to 30 minutes"

### **Play a song:**
"Hey Google, kodi play the song [song name]" --> will search for the given song name and play it.

### **Play an album:**
"Hey Google, kodi play the album [album name]" --> will search for the given album name and play it.

### **Play an artist:**
"Hey Google, kodi play songs by the artist [music artist name]" --> will search for the given music artist name and play it.

### **Playlist Control:**
"Hey Google, kodi playlist previous/next/list item number" --> This will go forward/backward or select an item on the playlist #.

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
4. Change Glitch project settings to private (under *share* > *Make private*)
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

### **B.2) [OPTIONAL] Set up a local webserver to control your kodi**
As an alternative to (B), it's possible to run a local node.js server in stead of running it on Glitch.com. The benifit of this is that you don't need to expose your kodi Api.
Additional using the hodi-hosts.config.js file, you can set up and control multiple kodi installations.
<details>
  <summary>Click to expand (B.2) instructions</summary>

1. After cloning the repo, create a copy of the `kodi-hosts.config.js.dist` file and rename it to `kodi-hosts.config.js`.
2. Edit the file and make sure the kodiConfig and globalConfig sections match your environment.
3. You should now be able to start the node server by running: `node server.js`.

Here is a systemd init config. To run it as a daemon.
On a debian dist save it as `/etc/systemd/system/kodiassistant.service`.

Don't forget to run: sudo systemctl enable `sudo systemctl enable kodiassistant.service` to start the deamon on startup.

```
[Unit]
Description=Node.js Google Home Kodi Interface

[Service]
ExecStart=/usr/bin/node /opt/GoogleHomeKodi/server.js
# Required on some systems
WorkingDirectory=/opt/GoogleHomeKodi
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodejs-example

[Install]
WantedBy=multi-user.target
```
Note: you server should run Node.js 6.10 or above (8 preferred)

</details>

### **B.3) [OPTIONAL] controlling multiple kodi instances**
Setting up the local node server, will allow you to utilize the kodi-hosts.config.js configuration.
This configuration will allow you to address multiple kodi installations (e.g. "Hey Google, kodi play [movie name] in the bedroom")

<details>
  <summary>Click to expand (B.3) instructions</summary>

For this you will need to extend the list. Like in this example:

```
exports.kodiConfig = [{
    id: 'kodi', // For now leave the first set to kodi.
    // YOUR_KODI_IP_ADDRESS
    kodiIp: '192.168.178.10',
    // YOUR_KODI_PORT
    kodiPort: '8080',
    // YOUR_KODI_USER_NAME
    kodiUser: 'kodi',
    // YOUR_KODI_PASSWORD
    kodiPassword: 'myKodiPass'
},
    // You can use this to specify additonal kodi installation, that you'd like to control.
    // For example alternate kodi destination 1:   
{
    id: 'bedroom',
    // YOUR_KODI_IP_ADDRESS
    kodiIp: '192.168.1.11',
    // YOUR_KODI_PORT
    kodiPort: '8080',
    // YOUR_KODI_USER_NAME
    kodiUser: 'kodi',
    // YOUR_KODI_PASSWORD
    kodiPassword: 'myKodiPass'
},
    // You can use this to specify additonal kodi installation, that you'd like to control.
    // For example alternate kodi destination 2:   
{
    id: 'kitchen',
    // YOUR_KODI_IP_ADDRESS
    kodiIp: '192.168.1.12',
    // YOUR_KODI_PORT
    kodiPort: '8080',
    // YOUR_KODI_USER_NAME
    kodiUser: 'kodi',
    // YOUR_KODI_PASSWORD
    kodiPassword: 'myKodiPass'
}
];
```

The `id` will match your kodi instance with a spoken keyword.
For every command / kodi destination you will need to add a new IFTTT applet.
You'll only real change here, is the `body`. As up until now you have been using a body like: `{"token":"*YOUR_CONNECTION_PASSWORD*"}`.
Now you will need to add the `kodiid` attribute to it, matching the id of your configuration.

**Example scan library**
If you normally would use a sentence like: `"Hey Google, kodi scan library" --> Will start a full library scan`.
For running this command on your second kodi instance, you could copy the applet, and change it to:
`"Hey Google, kodi scan library in the bedroom"`.

In this new applet, you will need to make sure it will recognize this new sentence, and add the attribute `kodiid` to the body.
For example: `{"token":"*YOUR_CONNECTION_PASSWORD*", "kodiid":"bedroom"}`
</details>


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
    
    8. Method: *POST*
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
  >YOUR_GLITCH_SERVER_ADDRESS/volume?q={{NumberField}}
  
  To **Seek forward** the play by x seconds use "Say a phrase with a number" and the URL:
  >YOUR_GLITCH_SERVER_ADDRESS/seekforward?q={{NumberField}}
  
For **PVR TV support - Set channel by name**, follow all the steps in **C**, except these changes: 
  * Choose a different phrase (e.g. "switch kodi to $ channel")
  * Use this URL:
    >YOUR_GLITCH_SERVER_ADDRESS/playpvrchannelbyname?q={{TextField}}

For **PVR TV support - Set channel by number**, use "Say a phrase with a number" and the URL:

  >YOUR_GLITCH_SERVER_ADDRESS/playpvrchannelbynumber?q={{NumberField}}


## Full table with available actions
| Type of phrase                                        | phrase                          | url                                                                       |
|-------------------------------------------------------|---------------------------------|---------------------------------------------------------------------------|
| Say a phrase with a text ingredient                   | Kodi play $                     | YOUR_GLITCH_SERVER_ADDRESS/playmovie?q={{TextField}}                      |
| Say a phrase with a text ingredient                   | Kodi play an episode of $       | YOUR_GLITCH_SERVER_ADDRESS/playtvshow?q={{TextField}}                     |
| Say a phrase with both a number and a text ingredient | Kodi play $ episode #           | YOUR_GLITCH_SERVER_ADDRESS/playepisode?q={{TextField}}&e= {{NumberField}} |
| Say a simple phrase                                   | Kodi pause                      | YOUR_GLITCH_SERVER_ADDRESS/playpause                                      |
| Say a simple phrase                                   | Kodi stop                       | YOUR_GLITCH_SERVER_ADDRESS/stop                                           |
| Say a simple phrase                                   | Kodi mute                       | YOUR_GLITCH_SERVER_ADDRESS/mute                                           |
| Say a phrase with a number                            | Kodi set volume #               | YOUR_GLITCH_SERVER_ADDRESS/volume?q={{NumberField}}                       |
| Say a phrase with a text ingredient                   | switch kodi to $ channel        | YOUR_GLITCH_SERVER_ADDRESS/playpvrchannelbyname?q={{TextField}}           |
| Say a phrase with a number                            | switch kodi to channel number # | YOUR_GLITCH_SERVER_ADDRESS/playpvrchannelbynumber?q={{NumberField}}       |
| Say a simple phrase                                   | Kodi shutdown                   | YOUR_GLITCH_SERVER_ADDRESS/shutdown                                       |
| Say a phrase with a text ingredient                   | Kodi shuffle $                  | YOUR_GLITCH_SERVER_ADDRESS/shuffleepisode?q={{TextField}}                 |
| Say a phrase with a text ingredient                   | Kodi youtube play $             | YOUR_GLITCH_SERVER_ADDRESS/playyoutube?q={{TextField}}                   |
| Say a simple phrase                                   | Kodi scan library               | YOUR_GLITCH_SERVER_ADDRESS/scanlibrary                                       |
| Say a phrase with a number                            | Kodi Navigate up #              | YOUR_GLITCH_SERVER_ADDRESS/navup?q={{NumberField}}                 |
| Say a phrase with a number                            | Kodi Navigate down #            | YOUR_GLITCH_SERVER_ADDRESS/navdown?q={{NumberField}}                 |
| Say a phrase with a number                            | Kodi Navigate left #            | YOUR_GLITCH_SERVER_ADDRESS/navleft?q={{NumberField}}                 |
| Say a phrase with a number                            | Kodi Navigate right #           | YOUR_GLITCH_SERVER_ADDRESS/navright?q={{NumberField}}                 |
| Say a phrase with a number                            | Kodi Navigate back #            | YOUR_GLITCH_SERVER_ADDRESS/navback?q={{NumberField}}                 |
| Say a simple phrase                                   | Kodi select                     | YOUR_GLITCH_SERVER_ADDRESS/navselect                                         |
| Say a simple phrase                                   | Kodi show context menu          | YOUR_GLITCH_SERVER_ADDRESS/navcontextmenu                                   |
| Say a simple phrase                                   | Kodi go home                    | YOUR_GLITCH_SERVER_ADDRESS/navhome                                           |
| Say a simple phrase                                   | Kodi whats playing              | YOUR_GLITCH_SERVER_ADDRESS/displayinfo                                       |
| Say a phrase with a text ingredient                   | Kodi subtitles $                | YOUR_GLITCH_SERVER_ADDRESS/setsubtitles?q={{TextField}}                   |
| Say a phrase with a number                            | Kodi subtitles direct select #  | YOUR_GLITCH_SERVER_ADDRESS/setsubtitlesdirect?q={{NumberField}}                 |
| Say a phrase with a text ingredient                   | Kodi audio stream $             | YOUR_GLITCH_SERVER_ADDRESS/setaudio?q={{TextField}}                   |
| Say a phrase with a number                            | Kodi audio stream direct select #| YOUR_GLITCH_SERVER_ADDRESS/setaudiodirect?q={{NumberField}}  
| Say a phrase with a number                            | Kodi seek forward x minutes #   | YOUR_GLITCH_SERVER_ADDRESS/seekforwardminutes?q={{NumberField}}                       |
| Say a phrase with a number                            | Kodi seek backward x minutes #  | YOUR_GLITCH_SERVER_ADDRESS/seekbackwardminutes?q={{NumberField}}                       |
| Say a phrase with a number                            | Kodi seek to x minutes #        | YOUR_GLITCH_SERVER_ADDRESS/seektominutes?q={{NumberField}}                       |
| Say a phrase with a text ingredient                   | Kodi play the song $            | YOUR_GLITCH_SERVER_ADDRESS/playsong?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi play the album $           | YOUR_GLITCH_SERVER_ADDRESS/playalbum?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi play the artist $          | YOUR_GLITCH_SERVER_ADDRESS/playartist?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi playlist $                 | YOUR_GLITCH_SERVER_ADDRESS/playercontrol?q={{TextField}}                   |

To **Turn on the TV and switch to Kodi's HDMI input** 
  * This requires Kodi 17 (Krypton) and above
  * This also requires that both your kodi device and TV support CEC commands
  * You need to install [this script.json-cec](https://github.com/joshjowen/script.json-cec/raw/master/script.json-cec.zip) add-on: Download and move it to your kodi device and then in Kodi choose Settings>Add-ons>Install from zip file > choose the zip your just downloaded.
  * Finally you can use this in 2 ways:
    * Add another command: follow the same instructions as *pause* but use this URL:
    >YOUR_GLITCH_SERVER_ADDRESS/activatetv
    
    *  Add the following line to your .env file (see step B-5 above) and kodi will automaticly turn on the tv and switch the HDMI input everytime your trigger the main playing actions (play a move / tv show / episode / pvr channel)
    >ACTIVATE_TV="true"

    
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
Thanks for everyone who contributed to this projects: [p0psicles](https://github.com/p0psicles), [Keljian](https://github.com/Keljian) and [Lunatixz](https://github.com/Lunatixz)

I also used some code from these 3 projects:
[MarvinSchenkel/HomeyKodi](https://github.com/MarvinSchenkel/HomeyKodi)
[Jephuff/kodi-rpc](https://github.com/Jephuff/kodi-rpc)
[joshjowen/script.json-cec](https://github.com/joshjowen/script.json-cec)


And this wonderful website makes setting this up super easy -  [Glitch](https://glitch.com/about)


-----------------
Made by Omer Turgeman
-----------------
I hope you find this helpful!
If you'd like, you can give me a cup of coffee :) 

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7KPWVMH4T5UTJ&lc=US&item_name=Kodi%20control%20project&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)
