Control Kodi through your Google Home / Google Assistant
=========================
## Table of contents:
- [What it can do](#what-it-can-do)
- [How to setup and update](#how-to-setup-and-update)
- [Full table with available actions](#full-table-with-available-actions)
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
**Binge watch a tv show:** "Hey Google, kodi binge watch [tv show name]" --> will add all unwatched episodes to the playlist and play it.  

### **Search and play a youtube video:**
"Hey Google, kodi play youtube [youtube title]" --> will search a youtube video, and play the first video.  
"Hey Google, kodi search youtube [youtube title]" --> will search youtube and show you the results on the kodi screen.  

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

### **Scan/Clean library:**
"Hey Google, kodi scan library" --> Will start a full library scan
"Hey Google, kodi clean library" --> Will cleanup your library


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
"Hey Google, kodi show new YouTube videos"  
"Hey Google, kodi show YouTube watch later"  
"Hey Google, kodi show YouTube history"  
"Hey Google, kodi show YouTube recommendations"  
"Hey Google, kodi show YouTube subscriptions"  
"Hey Google, kodi show YouTube settings"  
"Hey Google, kodi show Spotify" (Spotify Kodi-Addon required)  
"Hey Google, kodi show Spotify featured playlists" (Spotify Kodi-Addon required)  

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

"Hey Google, kodi play playlist [playlistname]" --> This will look for a playlist with that name and play it. Smart and regular playlist supported.  
"Hey Google, kodi playlist previous/next/[list item number]" --> This will go forward/backward or select an item on the currently playing playlist #.  

------------
## How to setup and update

Disclaimer: Use on your own risk and choose complex username & password in the below steps.

### **A) Enable webserver access in kodi**
1. In Kodi, go to *Settings* > *Services* > *Web server*
2. Set *Allow remote contorl via HTTP* to On
3. Choose a port number (e.g. 8080). We will refer to that port as *YOUR_KODI_PORT*
4. Choose a username and password (Important!). We will refer to those values as *YOUR_KODI_USER_NAME* and *YOUR_KODI_PASSWORD*


### **B) Set up a nodejs-webserver to control your kodi**
We currently support three methods of how this app can be hosted.   
~~1. Hosting it in Glitch, a 3rd-party web-hosting service~~ **(No longer usable)**   
2. Hosting it yourself   
3. Hosting it yourself with Docker   
4. Hosting it with Google Cloud Run   

The first method is very easy to set up and to maintain and also free of charge.
The second method is for advanced users. You have to setup and maintain the nodejs environment yourself. But it supports multiple Kodi instances, greatly reduces latency and does not expose your kodi-webservice to the internet directly.
The third method is also for advanced users. After installing docker, you can simply run our app as a production ready _docker container_. This is the recommended method for LibreELEC users.

<details>
  <summary><b>B.1 Set up a webserver in Glitch</b> (Click to expand instructions)</summary><p />
  
  **Please note, this method is no longer usable, due to Glitch's new policy regarding IFTTT and other pinging services like it. This section is left here for historic reasons. See #305 for more details.**

1. Configure your router to forward *YOUR_KODI_PORT*.  
   _Note:_ This is needed, so your kodi can be contacted from the internet. 
2. Find your external IP address (i.e. google for 'what's my ip?'). We will refer to that as *YOUR_EXTERNAL_IP_ADDRESS* later.  
   _Hint:_ It is strongly recommended to setup a dynDNS service of your choice. (i.e. selfhost.me)
3. Go to [Glitch.com](https://glitch.com) and sign in with your github user
4. Create a new Glitch project and under *advance settings* choose *Import from GitHub*
5. Enter this project *OmerTu/GoogleHomeKodi*
6. Change Glitch project settings to private (under *share* > *Make private*)
7. Edit the *.env* file in your Glitch project with the following settings:  (**see [this example](examples/env_file_example.png)**)


```ini
KODI_PROTOCOL="http"
KODI_IP="YOUR_EXTERNAL_IP_ADDRESS"
KODI_PORT="YOUR_KODI_PORT"
KODI_USER="YOUR_KODI_USER_NAME"
KODI_PASSWORD="YOUR_KODI_PASSWORD"
AUTH_TOKEN="YOUR_CONNECTION_PASSWORD"
```
*YOUR_CONNECTION_PASSWORD* can be anything you want.

8. Check your Glitch server address by choosing 'Show Live' on the top left. A new tab with your server will open. Note your server address in the address bar, you will need that later. We will refer to this address as _YOUR_NODE_SERVER_. (i.e. https://green-icecream.glitch.me)

------------
## How to update to the latest version
1. Go to [Glitch.com](https://glitch.com) and sign in with your github user
2. Select your Glitch project and under *advance settings* choose *Import from GitHub*
3. Enter this project *OmerTu/GoogleHomeKodi*
</details>

<details>
  <summary><b>B.2 Set up local webserver</b> (Click to expand instructions)</summary><p />


1. Install the [Node.js](https://nodejs.org/en/download/) application server on your target computer  
   _Note:_ Minimum required Version is **6.10** (but 10 or higher for the broker feature)
2. Choose a location, where your app will live (i.e `C:\node\`)
3. Clone this repo with git (recommended) or simply download and unzip the sourcecode (green button on the top-right)
4. You now should have a folder with a bunch of files in it (i.e. here `C:\node\GoogleHomeKodi`)
5. Install this app  
  ```batch
  cd C:\node\GoogleHomeKodi
  npm install
  ```
6. Create a copy of the `kodi-hosts.config.js.dist` file and name it `kodi-hosts.config.js`.
7. Edit the file and make sure the kodiConfig and globalConfig sections match your environment.
8. Set up your router to forward the port you just configured.  
   _Default:_ globalConfig.listenerPort: '8099'
9. You should now be able to start the node server by running: `node server.js`.  
10. Determine the *internal IP-Address* or the *hostname* of the machine running this node server.  
    (i.e. by executing `ipconfig`/`ifconfig`)
    We refer to that as *YOUR_INTERNAL_NODE_IP*.  
11. Configure your router to forward the port from step 8 to *YOUR_INTERNAL_NODE_IP*.  
   _Note:_ This is needed, so your kodi can be contacted from the internet.
12. Find your external IP address (i.e. Google 'what's my ip?')  
   _Hint:_ It is strongly recommended to setup a dynDNS service of your choice. (i.e. selfhost.me)
13. The address of your self hosted node server now consists of the port of step 8 and the ip/host of step 12.  
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

------------
## How to update to the latest version
a. If you cloned the repo, just do `git pull --autostash && npm install`  
b. If you downloaded and unzipped, backup your configuration, redownload and unzip, followed by `npm install`. Finally reapply your config.

</details>

<details>
  <summary><b>B.3 Set up local webserver using Docker</b> (Click to expand instructions)</summary><p />

As an alternative to (B.2), it's possible to use a *Docker container* to run a local instance.

You can configure your instance simply through *environment variables* or a `kodi-hosts.config.js` inside a folder mapped to the container-file-path `/config`.

1. Install the Docker engine
   - If you want to run it on a LibreELEC system  
     You can simply install the offical service addon `Docker`  
     _Note:_ Enable the feature _Wait for network before starting kodi_ under *Settings* > *LibreELEC* > *Network*
   - For all other systems please see the offical documentation  
     [Docker Installation](https://docs.docker.com/engine/installation/)
2. Get the latest *GoogleHomeKodi* docker image  
     ```
     docker pull omertu/googlehomekodi
     ```
3. Now just run the production-ready docker image
   - with the use of environment variables:
     ```sh
     docker run \
        --detach \
        --publish 8099:8099 \
        --restart always \
        -e KODI_PROTOCOL="http" \
        -e KODI_IP="YOUR_INTERNAL_KODI_IP_ADDRESS" \
        -e KODI_PORT="YOUR_KODI_PORT" \
        -e KODI_USER="YOUR_KODI_USER_NAME" \
        -e KODI_PASSWORD="YOUR_KODI_PASSWORD" \
        -e AUTH_TOKEN="YOUR_CONNECTION_PASSWORD" \
        --name googlehomekodi \
        omertu/googlehomekodi
     ```
   - with the use of docker-compose:  
     create a file named `docker-compose.yml` with the following contents:  
     ```
      version: '3'
      services:
        googlehomekodi:
          image: omertu/googlehomekodi
          ports:
            - "8099:8099"
          environment:
            - KODI_PROTOCOL=http
            - KODI_IP=YOUR_INTERNAL_KODI_IP_ADDRESS
            - KODI_PORT=YOUR_KODI_PORT
            - KODI_USER=YOUR_KODI_USER_NAME
            - KODI_PASSWORD=YOUR_KODI_PASSWORD
            - AUTH_TOKEN=YOUR_CONNECTION_PASSWORD
          restart: always
     ```  
     and then just fire it up with  
     ```sh
     docker-compose up --detach
     ``` 
   - or with the use of the config file:
     - Create a copy of the `kodi-hosts.config.js.dist` file and name it `kodi-hosts.config.js`.
     - Edit the file and make sure the kodiConfig and globalConfig sections match your environment.
     - Run it  
       ```sh
       docker run \
          --detach \
          --publish 8099:8099 \
          --restart always \
          -v YOUR_CONFIG_DIR:/config \
          --name googlehomekodi \
          omertu/googlehomekodi
       ```
4. Determine the *internal IP-Address* or the *hostname* of the machine running the docker container.  
   We refer to that as *YOUR_INTERNAL_NODE_IP*.  
   _Hint:_ When running the docker container on the same LibreELEC-host just use the hostname `libreelec` as the IP-Address of your node server.
5. Configure your router to forward the port from the step 3 (8099 is the default) to *YOUR_INTERNAL_NODE_IP*.  
   _Note:_ This is needed, so your kodi can be contacted from the internet.
6. Find your external IP address (i.e. Google 'what's my ip?')  
   _Hint:_ It is strongly recommended to setup a dynDNS service of your choice. (i.e. selfhost.me)
7. The address of your self hosted node server now consists of the port of step 5 and the ip/host of step 6.  
   We will refer to this address later as _YOUR_NODE_SERVER_. (i.e. http://omertu.selfhost.me:8099)

------------
## How to update to the latest version
Execute:
   ```
   docker rmi --force omertu/googlehomekodi
   ```
then just repeat steps 2 and 3 of the installation above.
</details>

<details>
  <summary><b>B.4 Google Cloud Run</b> (Click to expand instructions)</summary><p />
  
1. Just click here:  
  [![Run on Google Cloud](https://storage.googleapis.com/cloudrun/button.svg)](https://console.cloud.google.com/cloudshell/editor?shellonly=true&cloudshell_image=gcr.io/cloudrun/button&cloudshell_git_repo=https://github.com/omertu/googlehomekodi.git)

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
**Note:** If your external IP changes, this will stop working (consider getting a static IP address)<br>
**Tip:** If you don't want define action for every phrase separatelly, you can use [Phrase broker](#phrase-broker)


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

For **PVR TV/radio support - Set channel by name**, follow all the steps in **D**, except these changes:
  * Choose a different phrase (e.g. "switch kodi to $ channel")
  * Use this URL:
    >_YOUR_NODE_SERVER_/playtvchannelbyname?q={{TextField}}
    >_YOUR_NODE_SERVER_/playradiochannelbyname?q={{TextField}}

For **PVR TV/radio support - Set channel by number**, use "Say a phrase with a number" and the URL:

  >_YOUR_NODE_SERVER_/playtvchannelbynumber?q={{NumberField}}
  >_YOUR_NODE_SERVER_/playradiochannelbynumber?q={{NumberField}}

### Phrase broker: ###
 Instead of defining each phrase separately on IFTTT, you can use built-in phrase broker, which will parse phrase on node server.
 It uses regular expression for matching phrases, so it is more powerful than IFTTT's $ and #.
 For setup phrase broker you need to define on IFTTT one single action (for example "Kodi $") and direct that action to the broker URL:
 >_YOUR_NODE_SERVER_/broker?phrase={{TextField}}

 If you want to use other language than english, just lang parameter to that URL:
 >_YOUR_NODE_SERVER_/broker?phrase={{TextField}}&lang=<lang_code>

 where <lang_code> is name of json file in app's _broker_ folder without json extension (so for example "lang=en")

 If there is not your language in _broker_ folder yet, it is easy to add a new language. Just copy en.json and name it with your language's code.
 Then edit that new file and change language text in second column to your language.
 You can also create your variant of default language, just copy required json file, name it with your name (f.e. "en.json" -> "en_my.json") and change texts on your own.
 Don't forget to set new language code in your action (so for our example it would be "_YOUR_NODE_SERVER_/broker?phrase={{TextField}}&lang=en_my").
 Format of one lanuage's json file record is simple:
 >"&lt;HelperHandlerName&gt;": "&lt;regular expression to match and extract parameters&gt;"

 For more variants of single handler just use suffix ":&lt;whatever_unique&gt;", so in case of second variant of kodiPlayMovie handler it would be "kodiPlayMovie:1", for third "kodiPlayMovie:2" and so on.
 Don't forget, that records on the top of file have greater priority than on the bottom. If broker finds match on the top, it does not continue to the bottom.


## Full table with available actions
| Type of phrase                                        | phrase                          | url                                                                       |
|-------------------------------------------------------|---------------------------------|---------------------------------------------------------------------------|
| Say a phrase with a text ingredient                   | Kodi play $                     | _YOUR_NODE_SERVER_/playmovie?q={{TextField}}  *delay                                        |
| Say a phrase with a text ingredient                   | Kodi resume $                   | _YOUR_NODE_SERVER_/resumemovie?q={{TextField}}  *delay                                      |
| Say a simple phrase                                   | Kodi play file                  | _YOUR_NODE_SERVER_/playfile?q=path/to/file  *delay                                          |
| Say a phrase with a text ingredient                   | Kodi play a random [$] movie [of year #]| _YOUR_NODE_SERVER_/playrandommovie?genre={{TextField}}&year={{NumberField}}  *delay |
| Say a phrase with a text ingredient                   | Kodi play an episode of $       | _YOUR_NODE_SERVER_/playtvshow?q={{TextField}}  *delay                                       |
| Say a phrase with a text ingredient                   | Kodi resume an episode of $     | _YOUR_NODE_SERVER_/resumetvshow?q={{TextField}}  *delay                                     |
| Say a phrase with a text ingredient                   | Kodi binge watch $              | _YOUR_NODE_SERVER_/bingewatchtvshow?q={{TextField}}               |
| Say a phrase with both a number and a text ingredient | Kodi play $ episode #           | _YOUR_NODE_SERVER_/playepisode?q={{TextField}}&e= {{NumberField}} |
| Say a simple phrase                                   | Kodi play new episode           | _YOUR_NODE_SERVER_/playrecentepisode                              |
| Say a simple phrase                                   | Kodi pause                      | _YOUR_NODE_SERVER_/playpause                                      |
| Say a simple phrase                                   | Kodi unpause                    | _YOUR_NODE_SERVER_/playpause                                      |
| Say a simple phrase                                   | Kodi stop                       | _YOUR_NODE_SERVER_/stop                                           |
| Say a simple phrase                                   | Kodi mute                       | _YOUR_NODE_SERVER_/mute                                           |
| Say a simple phrase                                   | Kodi unmute                     | _YOUR_NODE_SERVER_/mute                                           |
| Say a phrase with a number                            | Kodi set volume #               | _YOUR_NODE_SERVER_/volume?q={{NumberField}}                       |
| Say a phrase with a number <br> Say a simple phrase   | Kodi volume up by # <br> Kodi volume up | _YOUR_NODE_SERVER_/volumeup?q={{NumberField}} <br> _YOUR_NODE_SERVER_/volumeup                       |
| Say a phrase with a number <br> Say a simple phrase   | Kodi volume down by # <br> Kodi volume down | _YOUR_NODE_SERVER_/volumedown?q={{NumberField}} <br> _YOUR_NODE_SERVER_/volumedown                       |
| Say a phrase with a text ingredient                   | Kodi switch to $ channel        | _YOUR_NODE_SERVER_/playtvchannelbyname?q={{TextField}}             |
| Say a phrase with a number                            | Kodi switch to channel number # | _YOUR_NODE_SERVER_/playtvchannelbynumber?q={{NumberField}}         |
| Say a phrase with a text ingredient                   | Kodi switch to $ radio channel        | _YOUR_NODE_SERVER_/playradiochannelbyname?q={{TextField}}    |
| Say a phrase with a number                            | Kodi switch to radio channel number # | _YOUR_NODE_SERVER_/playradiochannelbynumber?q={{NumberField}} |
| Say a simple phrase                                   | Kodi activate                   | _YOUR_NODE_SERVER_/activatetv                                      |
| Say a simple phrase                                   | Kodi standby                    | _YOUR_NODE_SERVER_/standbytv                                       |
| Say a simple phrase                                   | Kodi shutdown                   | _YOUR_NODE_SERVER_/shutdown                                        |
| Say a simple phrase                                   | Kodi hibernate                  | _YOUR_NODE_SERVER_/hibernate                                       |
| Say a simple phrase                                   | Kodi reboot                     | _YOUR_NODE_SERVER_/reboot                                          |
| Say a simple phrase                                   | Kodi suspend                    | _YOUR_NODE_SERVER_/suspend                                         |
| Say a phrase with a text ingredient                   | Kodi shuffle $                  | _YOUR_NODE_SERVER_/shuffleepisode?q={{TextField}}                  |
| Say a phrase with a text ingredient                   | Kodi play youtube $             | _YOUR_NODE_SERVER_/playyoutube?q={{TextField}}&max=15              |
| Say a phrase with a text ingredient                   | Kodi search youtube $           | _YOUR_NODE_SERVER_/searchyoutube?q={{TextField}}                   |
| Say a simple phrase                                   | Kodi scan library               | _YOUR_NODE_SERVER_/scanlibrary                                     |
| Say a simple phrase                                   | Kodi clean library              | _YOUR_NODE_SERVER_/cleanlibrary                                    |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate up # <br> Kodi Navigate up | _YOUR_NODE_SERVER_/navup?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navup                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate down # <br> Kodi Navigate down | _YOUR_NODE_SERVER_/navdown?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navdown                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate left # <br> Kodi Navigate left | _YOUR_NODE_SERVER_/navleft?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navleft                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate right # <br> Kodi Navigate right | _YOUR_NODE_SERVER_/navright?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navright                 |
| Say a phrase with a number <br> Say a simple phrase   | Kodi Navigate back # <br> Kodi Navigate back | _YOUR_NODE_SERVER_/navback?q={{NumberField}} <br> _YOUR_NODE_SERVER_/navback                 |                 |
| Say a simple phrase                                   | Kodi select                     | _YOUR_NODE_SERVER_/navselect                                       |
| Say a simple phrase                                   | Kodi show context menu          | _YOUR_NODE_SERVER_/navcontextmenu                                  |
| Say a simple phrase                                   | Kodi go home                    | _YOUR_NODE_SERVER_/navhome                                         |
| Say a simple phrase                                   | Kodi whats playing              | _YOUR_NODE_SERVER_/displayinfo                                     |
| Say a phrase with a text ingredient                   | Kodi show $                     | _YOUR_NODE_SERVER_/showWindow?q={{TextField}}                      |
| Say a phrase with a text ingredient                   | Kodi show movie genre $         | _YOUR_NODE_SERVER_/showMovieGenre?q={{TextField}}                  |
| Say a phrase with a text ingredient                   | Kodi execute addon $            | _YOUR_NODE_SERVER_/executeAddon?q={{TextField}}                    |
| Say a phrase with a text ingredient                   | Kodi subtitles $                | _YOUR_NODE_SERVER_/setsubtitles?q={{TextField}}                    |
| Say a phrase with a number                            | Kodi subtitles direct select #  | _YOUR_NODE_SERVER_/setsubtitlesdirect?q={{NumberField}}            |
| Say a phrase with a text ingredient                   | Kodi audio stream $             | _YOUR_NODE_SERVER_/setaudio?q={{TextField}}                        |
| Say a phrase with a number                            | Kodi audio stream direct select #| _YOUR_NODE_SERVER_/setaudiodirect?q={{NumberField}}               |
| Say a phrase with a number <br> Say a simple phrase   | Kodi seek forward # minutes <br> Kodi seek forward   | _YOUR_NODE_SERVER_/seekforwardminutes?q={{NumberField}} <br> _YOUR_NODE_SERVER_/seekforwardminutes   |
| Say a phrase with both a number and a text ingredient | Kodi seek forward $ hour and # minutes               | _YOUR_NODE_SERVER_/seekforwardminutes?q={{NumberField}}&hours={{TextField}}                          |
| Say a phrase with a number <br> Say a simple phrase   | Kodi seek backward # minutes <br> Kodi seek backward | _YOUR_NODE_SERVER_/seekbackwardminutes?q={{NumberField}} <br> _YOUR_NODE_SERVER_/seekbackwardminutes |
| Say a phrase with both a number and a text ingredient | Kodi seek backward $ hour and # minutes              | _YOUR_NODE_SERVER_/seekbackwardminutes?q={{NumberField}}&hours={{TextField}}                         |
| Say a phrase with a number                            | Kodi seek to # minutes          | _YOUR_NODE_SERVER_/seektominutes?q={{NumberField}}                 |
| Say a phrase with a text ingredient                   | Kodi play the song $            | _YOUR_NODE_SERVER_/playsong?q={{TextField}}                        |
| Say a phrase with a text ingredient                   | Kodi play the album $           | _YOUR_NODE_SERVER_/playalbum?q={{TextField}}                       |
| Say a phrase with a text ingredient                   | Kodi play the artist $          | _YOUR_NODE_SERVER_/playartist?q={{TextField}}                      |
| Say a phrase with a text ingredient                   | Kodi play the music genre $     | _YOUR_NODE_SERVER_/playgenre?q={{TextField}}                       |
| Say a phrase with a text ingredient                   | Kodi play playlist $            | _YOUR_NODE_SERVER_/playplaylist?q={{TextField}}                    |
| Say a phrase with a text ingredient                   | Kodi playlist $                 | _YOUR_NODE_SERVER_/playercontrol?q={{TextField}}                   |
| Say a simple phrase                                   | Kodi toggle party mode          | _YOUR_NODE_SERVER_/togglePartymode                                 |
| Say a phrase with a text ingredient                   | Kodi open $ from my favourites  | _YOUR_NODE_SERVER_/playfavourite?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi open $ from my tvshows     | _YOUR_NODE_SERVER_/opentvshow?q={{TextField}}                   |
| Say a phrase with a text ingredient                   | Kodi open $ from my movies      | _YOUR_NODE_SERVER_/openmovie?q={{TextField}}                   |
| Say a simple phrase                                   | Kodi toggle fullscreen          | _YOUR_NODE_SERVER_/togglefullscreen                                |
| Say a phrase with a text ingredient			| Kodi load profile $		  | _YOUR_NODE_SERVER_/loadProfile                                     |

To **Start/resume a movie/tv episode with a delay**
  The commands marked with *delay (above) take an optional delay parameter to delay startup of the media by the specified number of seconds.

  For example:  
YOUR_NODE_SERVER_/playmovie?q=Deadpool&delay=10

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
## Troubleshooting
If your can't preform a simple action like pausing a video, try to narrow down to problem.
Execute the following tests in their listed order! Since early errors can make all following tests fail.

1. Try getting your current kodi volume by entering this in your browser:  
   `http://YOUR_INTERNAL_KODI_IP:PORT/jsonrpc?request={"jsonrpc":"2.0","method":"Application.GetProperties","params":{"properties":["volume"]},"id":1}`  
    - If you get prompt to enter username and password choose the ones you set in Kodi (also known as *YOUR_KODI_USER_NAME* and *YOUR_KODI_PASSWORD*).  
    - If that doesn't work, repeat/check all steps in section A!

2. **For hosting-scenario B.1 only** Try getting your current kodi volume by entering this in your browser with your external IP:
   _Note:_ This test is only meaningful, if done from _outside_ of your home network! 
   (i.e. Smartphone with disabled Wifi!)  
   `http://YOUR_EXTERNAL_IP:PORT/jsonrpc?request={"jsonrpc":"2.0","method":"Application.GetProperties","params":{"properties":["volume"]},"id":1}`  
   - If that doesn't work you probably have a problem with your router port forwarding configuration.
     Check the internet on how to properly forward a port from a local host to the internet for your router model.

3. **For hosting-scenarios B.2 & B.3 only** Open the following URL in your browser on your local home network:  
   `http://YOUR_INTERNAL_NODE_IP:8099/`  
   - Does a page load asking for your token? (aka *YOUR_CONNECTION_PASSWORD*)  
   - If the page doesn't load, your node server is currently not running or is not reachable.  
     Repeat/check all the steps in section B!
     
4. Open the YOUR_NODE_SERVER Url in a browser.  
   _Note:_ This test is only meaningful, if done from _outside_ of your home network! 
   (i.e. Smartphone with disabled Wifi!)  
   i.e. `http://omertu.selfhost.me:8099/`  
   - Does a page load asking for your token? (aka *YOUR_CONNECTION_PASSWORD*)
   - If that doesn't work you probably have a problem with your router port forwarding configuration.
     Check the internet on how to properly forward a port from a local host to the internet for your router model.

5. Open the YOUR_NODE_SERVER Url in a browser **and** provide the token (aka *YOUR_CONNECTION_PASSWORD*).  
   i.e. `http://omertu.selfhost.me:8099/`  
   Ensure `/koditestconnection` is set as the route to test.  
   Click *Execute*!
   - If a popup appears on your kodi box, all went well.
   - If not try make sense of the red error message. But its most likely a configuration error in the node app.  
     So check if the kodi- username, password, ip and port are correctly configured.  
     If you cannot find the error open an issue on _github_. Tell us there your choosen hosting scenario (B.1, B.2 or B.3) and attach the console output of the node app, after fully completing the execution the test-route.
   
6. If all tests were successful so far, the problem is probably the configuration of the *IFTTT-Applet* itself.  
   - Ensure the body is `json`
   - Ensure the method is `POST`
   - Ensure the token is in regular quotes `"` (iphones tend to mess them up, use a PC then)  
   - If you cannot find the error open an issue on _github_. Tell us there your choosen hosting scenario (B.1, B.2 or B.3) and attach the console output of the node app, after fully completing the execution the applet.

7. Whaat? How did you manage to pass all previous tests and yet still have trouble?  
   Go to _github_, open an issue and explain yourself!

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
