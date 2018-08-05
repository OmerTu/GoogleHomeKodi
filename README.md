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
"Hey Google, kodi resume [movie name]" --> will search for given movie name and pick up playback from where you left it.

### **Play a random movie:**
"Hey Google, kodi play a random movie" --> will play a random movie.  
"Hey Google, kodi play a random horror movie" --> will play a random movie of the genre "Horror".  
"Hey Google, kodi play a random movie of the year 2010" --> will play a random movie of the year 2010.  
"Hey Google, kodi play a random horror movie of the year 2010" --> will play a random movie of the genre "Horror" and of the year 2010.  

### **Play a tv show:**
**Play the next unwatched episode:** "Hey Google, kodi play tv show [tv show name]" --> will search for the given tv show and play the next unwatched episode.  
**Play a specific episode:** "Hey Google, kodi play [tv show name] season 3 episode 1" --> will search for the given tv show and play season 3 episode 1.  
**Play a random episode from a tv show:** "Hey Google, kodi shuffle [tv show name]" --> will search for the given tv show and play a random episode.  
**Play the most recently added episode:** "Hey Google, kodi play new episode" --> will play the most recently added episode to the kodi library.  
**Binge watch a tv shoe:** "Hey Google, kodi binge watch [tv show name]" --> will add all unwatched episodes to the playlist and play it.  

### **Search and play a youtube video:**
"Hey Google youtube [youtube title]" --> will search a youtube video, and play the first video.

### **Pause / Resume kodi:**
"Hey Google, pause kodi"

### **Stop kodi:**
"Hey Google, stop kodi"

### **Change volume:**
**Mute kodi:** "Hey Google, mute/unmute kodi"  
**Set volume:** "Hey Google, set kodi volume to 60"  
**Increase volume:** "Hey Google, Kodi volume up [by 10]"  --> increase the volume by the requested amount or by 20% if no amount was specified  
**Decrease volume:** "Hey Google, Kodi volume down [by 10]"  --> similar to the above

### **Play PVR channel:**
"Hey Google, switch kodi to BBC channel" or "Hey Google, switch kodi to channel 10"

### **Turn on TV:**
"Hey Google, switch to kodi" --> will turn on the TV and switch to Kodi's HDMI input

### **Control Kodi-System:**
"Hey Google, kodi shutdown"
"Hey Google, kodi hibernate"
"Hey Google, kodi reboot"
"Hey Google, kodi suspend"

### **Scan library:**
"Hey Google, kodi scan library" --> Will start a full library scan


### **Navigate kodi:**
**Navigate up:** "Hey Google, kodi navigate up [3]" --> Will navigate up the requested amount or just once if no number was specified  
**Navigate Down:** "Hey Google, kodi navigate down [3]" --> same as above for navigating down  
**Navigate Left:** "Hey Google, kodi navigate left [3]" --> same as above for navigating left  
**Navigate Right:** "Hey Google, kodi navigate right [3]" --> same as above for navigating right  
**Navigate Back:** "Hey Google, kodi go back [3]" --> Will navigate back the requested amount or just once if no number was specified  
**Navigate Select:** "Hey Google, kodi Select" --> Will select the hightlighted item  
**Navigate Context Menu:** "Hey Google, kodi open context menu" --> Will open the context menu for the selected item  
**Navigate Go Home:** "Hey Google, kodi go home" --> Will open the main menu page  

### **Show kodi windows:**
"Hey Google, kodi show favourites"  
"Hey Google, kodi show movies"  
"Hey Google, kodi show movies by title"  
"Hey Google, kodi show movies by genre"  
"Hey Google, kodi show recently added movies"  
"Hey Google, kodi show tv shows"  
"Hey Google, kodi show tv shows by title"  
"Hey Google, kodi show tv shows by genre"  
"Hey Google, kodi show recently added episodes"  
"Hey Google, kodi show video addons"  
"Hey Google, kodi show music addons"  
"Hey Google, kodi show video files"  
"Hey Google, kodi show music files"  
"Hey Google, kodi show the top 100 albums"  
"Hey Google, kodi show system settings"  
"Hey Google, kodi show file manager"  

There are many more windows to choose from, a full list can be found [here](http://kodi.wiki/view/Opening_Windows_and_Dialogs).

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
"Hey Google, kodi go forward 30 minutes" --> will seek forward [the requested number] of minutes or just 1 minute if no number was specified

### **Seek backwards x minutes:**
"Hey Google, kodi go backward 30 minutes" --> same as above just seeking backward

### **Seek to x minutes:**
"Hey Google, kodi jump to 30 minutes"

### **Play music:**
"Hey Google, kodi play the **song** [song name]" --> will search for the given song name and play it.  
"Hey Google, kodi play the **album** [album name]" --> will search for the given album name and play it.  
"Hey Google, kodi play songs by the **artist** [music artist name]" --> will search for the given music artist name and play it.  
"Hey Google, kodi play some [**genre** name] music" --> will play shuffled songs of that genre.  
"Hey Google, kodi toggle **party mode**" --> starts the kodi party mode.

### **Playlist Control:**
"Hey Google, kodi playlist previous/next/list item number" --> This will go forward/backward or select an item on the playlist #.

------------
## How to setup

Disclaimer: Use on your own risk and choose complex username & password in the below steps.

### **A) Enable webserver access in kodi**
1. In Kodi, go to *Settings* >> *Web server*
2. Set *Allow remote contorl via HTTP* to On
3. Choose a port number (e.g. 8080).
4. Choose a username and password (Important!)
5. Configure your router to forward the port you selected to your kodi device  
   _Note:_ Not needed if you decide to go with a local node webserver (B.2)
6. Find your external IP address (i.e. Google 'what's my ip?')

### **B) Set up a nodejs-webserver to control your kodi**
We currently support three methods of how this app can be hosted.
1. Hosting it in Glitch, a 3rd-party web-hosting service
2. Hosting it yourself
3. Hosting it yourself with Docker

The first method is very easy to set up and to maintain and also free of charge.
The second method is for advanced users. You have to setup and maintain the nodejs environment yourself. But it supports multiple Kodi instances, greatly reduces latency and does not expose your kodi-webservice to the internet directly.
The third method is also for advanced users. After installing docker, you can simply run our prebuilt docker images.

<details>
  <summary><b>B.1 Set up a webserver in Glitch</b> (Click to expand instructions)</summary><p />


1. Go to [Glitch.com](https://glitch.com) and sign in with your github user
2. Create a new Glitch project and under *advance settings* choose *Import from GitHub*
3. Enter this project *OmerTu/GoogleHomeKodi*
4. Change Glitch project settings to private (under *share* > *Make private*)
5. Edit the *.env* file in your Glitch project with the following settings:  (**see [this example](examples/env_file_example.png)**)


```ini
KODI_PROTOCOL="http"
KODI_IP="YOUR_EXTERNAL_IP_ADDRESS"
KODI_PORT="YOUR_KODI_PORT"
KODI_USER="YOUR_KODI_USER_NAME"
KODI_PASSWORD="YOUR_KODI_PASSWORD"
AUTH_TOKEN="YOUR_CONNECTION_PASSWORD"
```
*YOUR_CONNECTION_PASSWORD* can be anything you want.

6. Check your Glitch server address by choosing 'Show Live' on the top left. A new tab with your server will open. Note your server address in the address bar, you will need that later. We will refer to this address as _YOUR_NODE_SERVER_. (i.e. https://green-icecream.glitch.me)
</details>

<details>
  <summary><b>B.2 Set up local webserver</b> (Click to expand instructions)</summary><p />


1. Install the [Node.js](https://nodejs.org/en/download/) application server on your target computer  
   _Note:_ Required Version is **6.10 or above** (8 preferred)
2. Choose a location, where your app will live (i.e `C:\node\`)
3. Clone this repo with git or simply download and unzip the sourcecode (green button on the top-right)
4. You now should have a folder with a bunch of files in it (i.e. here `C:\node\GoogleHomeKodi`)
5. Install this app
```batch
cd C:\node\GoogleHomeKodi
npm install
```
6. Create a copy of the `kodi-hosts.config.js.dist` file and name it `kodi-hosts.config.js`.
7. Edit the file and make sure the kodiConfig and globalConfig sections match your environment.
9. Set up your router to forward the port you just configured.  
   _Default:_ globalConfig.listenerPort: '8099'
8. You should now be able to start the node server by running: `node server.js`.
9. Find your external IP address (i.e. Google 'what's my ip?')  
   _Hint:_ It is strongly recommended to setup a dynDNS service of your choice. (i.e. selfhost.me)
10. The address of your self hosted node server now consists of the port of step 9 and the ip/host of step 10.  
    We will refer to this address later as _YOUR_NODE_SERVER_. (i.e. http://omertu.selfhost.me:8099)

_For Linux-Users only:_ Here is a systemd init config. To run it as a daemon.
On a debian dist save it as `/etc/systemd/system/kodiassistant.service`.
Don't forget to run: sudo systemctl enable `sudo systemctl enable kodiassistant.service` to start the deamon on startup.

```ini
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

</details>

<details>
  <summary><b>B.3 Set up local webserver using Docker</b> (Click to expand instructions)</summary><p />

As an alternative to (B.2), it's possible to use a pre-built [Docker image](https://hub.docker.com/r/sinedied/googlehomekodi/) to run a local instance.

You can use either *environment variables* or a `kodi-hosts.config.js` inside a folder mapped to the `/config` volume to configure your instance.

1. Install the Docker engine
   - If you want to run it on a LibreELEC system  
     You can simply install the offical service addon `Docker`
   - For all other systems please consult the offical documentation  
     [Docker Installation](https://docs.docker.com/engine/installation/)
1. Download or build the docker image
   - For 64bit-Systems you can download out prebuilt docker-image
     ```
     docker pull sinedied/googlehomekodi
     ```
   - For all other systems you currently have to build the image yourself.
     - Clone this repo with git or simply download and unzip the sourcecode (green button on the top-right)
     - You now should have a folder with a bunch of files in it (i.e. here `C:\node\GoogleHomeKodi`)
     - Build the image
     ```
     cd C:\node\GoogleHomeKodi
     docker build -t sinedied/googlehomekodi .
     ```
2. Run the docker image
   - with the use of environment variables:
     ```sh
     docker run -d -p 8099:8099 \
                --restart always \
                -e KODI_PROTOCOL="http" \
                -e KODI_IP="YOUR_EXTERNAL_IP_ADDRESS" \
                -e KODI_PORT="YOUR_KODI_PORT" \
                -e KODI_USER="YOUR_KODI_USER_NAME" \
                -e KODI_PASSWORD="YOUR_KODI_PASSWORD" \
                -e AUTH_TOKEN="YOUR_CONNECTION_PASSWORD" \
                --name googlehomekodi \
                sinedied/googlehomekodi
     ```
   - or with the use of the config file:
     - Create a copy of the `kodi-hosts.config.js.dist` file and name it `kodi-hosts.config.js`.
     - Edit the file and make sure the kodiConfig and globalConfig sections match your environment.
     - Run it  
       ```sh
       docker run -d -p 8099:8099 \
                  --restart always \
                  -v YOUR_CONFIG_DIR:/config \
                  --name googlehomekodi \
                  sinedied/googlehomekodi
       ```

3. In case you need to update to a newer version later, just repeat steps 2 and 3 after executing:
   ```
   docker stop googlehomekodi
   docker rm sinedied/googlehomekodi
   ```
</details>

### **C) [OPTIONAL] controlling multiple kodi instances**
There are two ways of implementing the scenario of multiple kodi instances (i.e one in the living room and another in the bedroom).
For both methods you will need two IFTTT-Applets with different phrases, due to the text-parameter limitation of IFTTT.
1. Having two node servers. Each targeting one instance. _(Recommended when hosting with glitch)_    
   i.e. the phrase `living room kodi play...` could target `https://mylivingroom.glitch.com/playpause`  
   and the phrase `bedroom kodi play...` could target `https://bedroom.glitch.com/playpause`. 
   - _Note:_ Behind a single external IP the kodi instances need still to be distinguishable. 
     This can be achieved in two ways:
     - Configuring both kodi instances with different ports  
       (i.e. _8080_ and _8090_)  
       _or_
     - Mapping with your routers port forwarding two different ports to the same port on different hosts  
       (i.e. _8080 -> 192.168.100.1:8080_ and 8090 -> 192.168.100.2:8080)
2. Having one node server targeting both kodi instances. _(Recommended when hosting yourself)_  
   The utilization of the _kodi-hosts.config.js_ allows you to name your instances and target them individually.  
   i.e. the phrase `living room kodi play...` could target `http://192.168.100.1:8080/playpause`  
   and the phrase `bedroom kodi play...` could target `http://192.168.100.2:8080/playpause`).

<details>
  <summary><b>C.2 utilize the kodi-hosts.config.js</b> (Click to expand instructions)</summary>

For this you will need to extend the list of configured kodi instances. Like in this example:

```javascript
exports.kodiConfig = [
  {
      id: 'kodi', // Give your main instance here any name you want
      // YOUR_KODI_PROTOCOL (http or https)
      kodiProtocol: 'http',
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
      // YOUR_2ND_KODI_PROTOCOL (http or https)
      kodiProtocol: 'http',
      // YOUR_2ND_KODI_IP_ADDRESS
      kodiIp: '192.168.1.11',
      // YOUR_2ND_KODI_PORT
      kodiPort: '8080',
      // YOUR_2ND_KODI_USER_NAME
      kodiUser: 'kodi',
      // YOUR_2ND_KODI_PASSWORD
      kodiPassword: 'myKodiPass'
  },
      // You can use this to specify additonal kodi installation, that you'd like to control.
      // For example alternate kodi destination 2:
  {
      id: 'kitchen',
      // YOUR_3RD_KODI_PROTOCOL (http or https)
      kodiProtocol: 'http',
      // YOUR_3RD_KODI_IP_ADDRESS
      kodiIp: '192.168.1.12',
      // YOUR_3RD_KODI_PORT
      kodiPort: '8080',
      // YOUR_3RD_KODI_USER_NAME
      kodiUser: 'kodi',
      // YOUR_3RD_KODI_PASSWORD
      kodiPassword: 'myKodiPass'
  }
];
```

The `id` (a name you can choose freely) will match your kodi instance with a spoken keyword.
For every command / kodi destination you will need to add a new IFTTT applet.
The only difference is found in the `body`. As up until now you have been using a body only with a token attribute like: `{"token":"*YOUR_CONNECTION_PASSWORD*"}`.
Now you will need to add the `kodiid` attribute to it, matching the `id` of your configuration.

**Example scan library**
If you normally would use a sentence like: `"Hey Google, kodi scan library" --> Will start a full library scan`.
For running this command on your second kodi instance, you could copy the applet, and change it to:
`"Hey Google, kodi scan library in the bedroom"`.

In this new applet, you will need to make sure it will recognize this new sentence, and add the attribute `kodiid` to the body.
For example: `{"token":"*YOUR_CONNECTION_PASSWORD*", "kodiid":"bedroom"}`
</details>

### D) Set up IFTTT with your Google Home

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
      >_YOUR_NODE_SERVER_/playmovie?q={{TextField}}
    
    For example, if your node server address is 'green-icecream.glitch.me', your should enter:
      >https\://green-icecream.glitch.me/playmovie?q={{TextField}}
    
    8. Method: *POST*
    9. Content Type: *application/json*
    10. Body:
      >{"token":"*YOUR_CONNECTION_PASSWORD*"}

**Check out [this example](examples/IFTTT_settings_example.png) to make sure your settings are correct**


Now every time you say "Hey Google, Kodi play movie bla bla", it should play bla bla on your kodi.<br>
**Note:** If your external IP changes, this will stop working (consider getting a static IP address)


### Setting up other actions: ###

For **Tv show support - Next unwatched episode**, follow all the steps in **D**, except these changes: 
  * Choose a different phrase (e.g. "Kodi play an episode of $")
  * Use this URL:
    >_YOUR_NODE_SERVER_/playtvshow?q={{TextField}}

For **Tv show support - Specific episode**, follow all the steps in **D**, except these changes:
  * Choose "*Say a phrase with both a number and a text ingredient*" in step 3
  * Choose a different phrase (e.g. "Kodi play $ episode #"). 
  
  
  For this to work, when you talk to your GoogleHome, the $ part must be in the format of *"[TV_SHOW_NAME] season [SEASON_NUMBER]"*. Meaning the word "Season" has to be said, the tv show name must be said before it and the season number must be said after it (i.e. "okay google kodi play bla season 4 episode 1")
  * Use this URL:
    >_YOUR_NODE_SERVER_/playepisode?q={{TextField}}&e={{NumberField}}

To **pause or resume** kodi follow the instructions in **D**, except these changes:
  * Choose "*Say a simple phrase*" in step 3
  * Use this URL:
    >_YOUR_NODE_SERVER_/playpause

To **Stop** kodi, follow the same instructions as *pause* but use this URL:
  >_YOUR_NODE_SERVER_/stop

To **Mute** kodi, follow the same instructions as *pause* but use this URL:
  >_YOUR_NODE_SERVER_/mute
  
To **Set Volume** on kodi use "Say a phrase with a number" and the URL:
  >_YOUR_NODE_SERVER_/volume?q={{NumberField}}
  
  To **Seek forward** by x minutes use "Say a phrase with a number" and the URL:
  >_YOUR_NODE_SERVER_/seekforwardminutes?q={{NumberField}}
  
For **PVR TV support - Set channel by name**, follow all the steps in **D**, except these changes: 
  * Choose a different phrase (e.g. "switch kodi to $ channel")
  * Use this URL:
    >_YOUR_NODE_SERVER_/playpvrchannelbyname?q={{TextField}}

For **PVR TV support - Set channel by number**, use "Say a phrase with a number" and the URL:

  >_YOUR_NODE_SERVER_/playpvrchannelbynumber?q={{NumberField}}


## Full table with available actions
| Type of phrase                                        | phrase                          | url                                                                       |
|-------------------------------------------------------|---------------------------------|---------------------------------------------------------------------------|
| Say a phrase with a text ingredient                   | Kodi play $                     | _YOUR_NODE_SERVER_/playmovie?q={{TextField}}                      |
| Say a phrase with a text ingredient                   | Kodi resume $                   | _YOUR_NODE_SERVER_/resumemovie?q={{TextField}}                    |
| Say a phrase with a text ingredient                   | Kodi play a random [$] movie [of year #]| _YOUR_NODE_SERVER_/playrandommovie?genre={{TextField}}&year={{NumberField}} |
| Say a phrase with a text ingredient                   | Kodi play an episode of $       | _YOUR_NODE_SERVER_/playtvshow?q={{TextField}}                     |
| Say a phrase with a text ingredient                   | Kodi resume an episode of $     | _YOUR_NODE_SERVER_/resumetvshow?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi binge watch $              | _YOUR_NODE_SERVER_/bingewatchtvshow?q={{TextField}}               |
| Say a phrase with both a number and a text ingredient | Kodi play $ episode #           | _YOUR_NODE_SERVER_/playepisode?q={{TextField}}&e= {{NumberField}} |
| Say a simple phrase                                   | Kodi play new episode           | _YOUR_NODE_SERVER_/playrecentepisode                              |
| Say a simple phrase                                   | Kodi pause                      | _YOUR_NODE_SERVER_/playpause                                      |
| Say a simple phrase                                   | Kodi stop                       | _YOUR_NODE_SERVER_/stop                                           |
| Say a simple phrase                                   | Kodi mute                       | _YOUR_NODE_SERVER_/mute                                           |
| Say a phrase with a number                            | Kodi set volume #               | _YOUR_NODE_SERVER_/volume?q={{NumberField}}                       |
| Say a phrase with a number <br> Say a simple phrase   | Kodi volume up by # <br> Kodi volume up | _YOUR_NODE_SERVER_/volumeup?q={{NumberField}} <br> _YOUR_NODE_SERVER_/volumeup                       |
| Say a phrase with a number <br> Say a simple phrase   | Kodi volume down by # <br> Kodi volume down | _YOUR_NODE_SERVER_/volumedown?q={{NumberField}} <br> _YOUR_NODE_SERVER_/volumedown                       |
| Say a phrase with a text ingredient                   | Kodi switch to $ channel        | _YOUR_NODE_SERVER_/playpvrchannelbyname?q={{TextField}}           |
| Say a phrase with a number                            | Kodi switch to channel number # | _YOUR_NODE_SERVER_/playpvrchannelbynumber?q={{NumberField}}       |
| Say a simple phrase                                   | Kodi activate                   | _YOUR_NODE_SERVER_/activatetv                                       |
| Say a simple phrase                                   | Kodi standby                    | _YOUR_NODE_SERVER_/standbytv                                       |
| Say a simple phrase                                   | Kodi shutdown                   | _YOUR_NODE_SERVER_/shutdown                                        |
| Say a simple phrase                                   | Kodi hibernate                  | _YOUR_NODE_SERVER_/hibernate                                       |
| Say a simple phrase                                   | Kodi reboot                     | _YOUR_NODE_SERVER_/reboot                                          |
| Say a simple phrase                                   | Kodi suspend                    | _YOUR_NODE_SERVER_/suspend                                         |
| Say a phrase with a text ingredient                   | Kodi shuffle $                  | _YOUR_NODE_SERVER_/shuffleepisode?q={{TextField}}                 |
| Say a phrase with a text ingredient                   | Kodi youtube play $             | _YOUR_NODE_SERVER_/playyoutube?q={{TextField}}                   |
| Say a simple phrase                                   | Kodi scan library               | _YOUR_NODE_SERVER_/scanlibrary                                       |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate up # <br> Kodi Navigate up | _YOUR_NODE_SERVER_/navup?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navup                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate down # <br> Kodi Navigate down | _YOUR_NODE_SERVER_/navdown?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navdown                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate left # <br> Kodi Navigate left | _YOUR_NODE_SERVER_/navleft?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navleft                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate right # <br> Kodi Navigate right | _YOUR_NODE_SERVER_/navright?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navright                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate back # <br> Kodi Navigate back | _YOUR_NODE_SERVER_/navback?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navback                 |                 |
| Say a simple phrase                                   | Kodi select                     | _YOUR_NODE_SERVER_/navselect                                         |
| Say a simple phrase                                   | Kodi show context menu          | _YOUR_NODE_SERVER_/navcontextmenu                                   |
| Say a simple phrase                                   | Kodi go home                    | _YOUR_NODE_SERVER_/navhome                                           |
| Say a simple phrase                                   | Kodi whats playing              | _YOUR_NODE_SERVER_/displayinfo                                       |
| Say a phrase with a text ingredient                   | Kodi show $                     | _YOUR_NODE_SERVER_/showWindow?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi execute addon $            | _YOUR_NODE_SERVER_/executeAddon?q={{TextField}}                 |
| Say a phrase with a text ingredient                   | Kodi subtitles $                | _YOUR_NODE_SERVER_/setsubtitles?q={{TextField}}                   |
| Say a phrase with a number                            | Kodi subtitles direct select #  | _YOUR_NODE_SERVER_/setsubtitlesdirect?q={{NumberField}}                 |
| Say a phrase with a text ingredient                   | Kodi audio stream $             | _YOUR_NODE_SERVER_/setaudio?q={{TextField}}                   |
| Say a phrase with a number                            | Kodi audio stream direct select #| _YOUR_NODE_SERVER_/setaudiodirect?q={{NumberField}}                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi seek forward # minutes <br> Kodi seek forward | _YOUR_NODE_SERVER_/seekforwardminutes?q={{NumberField}} <br> _YOUR_NODE_SERVER_/seekforwardminutes                       |
| Say a phrase with a number <br> Say a simple phrase   | Kodi seek backward # minutes <br> Kodi seek backward | _YOUR_NODE_SERVER_/seekbackwardminutes?q={{NumberField}} <br> _YOUR_NODE_SERVER_/seekbackwardminutes                       |
| Say a phrase with a number                            | Kodi seek to # minutes        | _YOUR_NODE_SERVER_/seektominutes?q={{NumberField}}                       |
| Say a phrase with a text ingredient                   | Kodi play the song $            | _YOUR_NODE_SERVER_/playsong?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi play the album $           | _YOUR_NODE_SERVER_/playalbum?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi play the artist $          | _YOUR_NODE_SERVER_/playartist?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi play the music genre $     | _YOUR_NODE_SERVER_/playgenre?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi playlist $                 | _YOUR_NODE_SERVER_/playercontrol?q={{TextField}}                   |
| Say a simple phrase                                   | Kodi toggle party mode          | _YOUR_NODE_SERVER_/togglePartymode                                 |


To **Turn on/off the TV and switch Kodi's HDMI input** 
  * This requires Kodi 17 (Krypton) and above
  * This also requires that both your kodi device and TV support CEC commands
  * You need to install [this script.json-cec](https://github.com/joshjowen/script.json-cec/raw/master/script.json-cec.zip) add-on: Download and move it to your kodi device and then in Kodi choose Settings>Add-ons>Install from zip file > choose the zip your just downloaded.
  * Finally you can use this in 2 ways:
    * Turn on: Add another command: follow the same instructions as *pause* but use this URL:
    >_YOUR_NODE_SERVER_/activatetv
    
    *  If host your server on Glitch, add the following line to your .env file (see step B.1 - (5) above) and kodi will automaticly turn on the tv and switch the HDMI input everytime your trigger the main playing actions (play a move / tv show / episode / pvr channel)
    >ACTIVATE_TV="true"
    
    *  If you host your server yourself (see step B.2 - (7) above), then add the following line at the end of your kodi-hosts.config.js file instead
    >process.env['ACTIVATE_TV'] = 'true';

    * Turn off: Add another command: follow the same instructions as pause but use this URL:
    >_YOUR_NODE_SERVER_/standbytv

    
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
Thanks for everyone who contributed to this projects: [p0psicles](https://github.com/p0psicles), [keydon](https://github.com/keydon), [Keljian](https://github.com/Keljian) and [Lunatixz](https://github.com/Lunatixz)

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
