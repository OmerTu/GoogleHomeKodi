/*

	This file is based on http://kodi.wiki/view/Opening_Windows_and_Dialogs

	With some additional handpicked values found in this kodi-rpc-request:
	{
		"jsonrpc":"2.0",
		"method":"JSONRPC.Introspect",
		"id":1
		"params": {
	    	"getmetadata": true,
	    	"filter":{
	        	"getreferences":true,
	        	"id":"GUI.Window",
	        	"type":"type"
	        }
	    }
	}

*/

const KodiWindows = [
    { 'Videos': [
        { '': 'library://video/' },
        { 'Movies': 'videodb://movies/' },
        { 'Movie Genres': 'videodb://movies/genres/' },
        { 'Movie Titles': 'videodb://movies/titles/' },
        { 'Movie Years': 'videodb://movies/years/' },
        { 'Movie Actors': 'videodb://movies/actors/' },
        { 'Movie Directors': 'videodb://movies/directors/' },
        { 'Movie Studios': 'videodb://movies/studios/' },
        { 'Movie Sets': 'videodb://movies/sets/' },
        { 'Movie Countries': 'videodb://movies/countries/ ' },
        { 'Movie Tags': 'videodb://movies/tags/' },
        { 'Recently Added Movies': 'videodb://recentlyaddedmovies/' },
        { 'Recent Movies': 'videodb://recentlyaddedmovies/' },
        { 'Newest Movies': 'videodb://recentlyaddedmovies/' },
        { 'Latest Movies': 'videodb://recentlyaddedmovies/' },
        { 'TvShows': 'videodb://tvshows/' },
        { 'TvShow Genres': 'videodb://tvshows/genres/' },
        { 'TvShow Titles': 'videodb://tvshows/titles/' },
        { 'TvShow Years': 'videodb://tvshows/years/' },
        { 'TvShow Actors': 'videodb://tvshows/actors/' },
        { 'TvShow Studios': 'videodb://tvshows/studios/' },
        { 'Recently Added Episodes': 'videodb://recentlyaddedepisodes/' },
        { 'Recent Episodes': 'videodb://recentlyaddedepisodes/' },
        { 'Newest Episodes': 'videodb://recentlyaddedepisodes/' },
        { 'Latest Episodes': 'videodb://recentlyaddedepisodes/' },
        { 'In Progress Tv Shows': 'videodb://inprogresstvshows' },
        { 'Music Videos': 'videodb://musicvideos/' },
        { 'MusicVideo Genres': 'videodb://musicvideos/genres/' },
        { 'MusicVideo Titles': 'videodb://musicvideos/titles/' },
        { 'MusicVideo Years': 'videodb://musicvideos/years/' },
        { 'MusicVideo Artists': 'videodb://musicvideos/artists/' },
        { 'MusicVideo Albums': 'videodb://musicvideos/albums/' },
        { 'MusicVideo Directors': 'videodb://musicvideos/directors/' },
        { 'MusicVideo Studios': 'videodb://musicvideos/studios/' },
        { 'Recently Added Music Videos': 'videodb://recentlyaddedmusicvideos/' },
        { 'Playlists': 'special://videoplaylists/' },
        { 'Video Add-ons': 'addons://sources/video/' },
        { 'Files': 'sources://video/' }
    ] },
    { 'Music': [
        { '': 'library://music/' },
        { 'Genres': 'musicdb://genres/' },
        { 'Artists': 'musicdb://artists/' },
        { 'Albums': 'musicdb://albums/' },
        { 'Song': 'musicdb://songs/' },
        { 'Top 100': 'musicdb://top100/' },
        { 'Top 100 Songs': 'musicdb://top100/songs/' },
        { 'Top 100 Albums': 'musicdb://top100/albums/' },
        { 'Recently Added Albums': 'musicdb://recentlyaddedalbums/' },
        { 'Recently Played Albums': 'musicdb://recentlyplayedalbums/' },
        { 'Compilations': 'musicdb://compilations/' },
        { 'Years': 'musicdb://years/' },
        { 'Singles': 'musicdb://singles/' },
        { 'Files': 'sources://music/' },
        { 'Playlists': 'special://musicplaylists/' },
        { 'Music Add-ons': 'addons://sources/audio/' }
    ] },
    { 'Programs': [
        { 'Addons': 'addons://sources/executable/' },
        { 'Android Apps': 'androidapp://sources/apps/' }
    ] },
    { 'AddonBrowser': [
        { 'Update available': 'addons://outdated/' },
        { 'Currently downloading add-ons': 'addons://downloading/' },
        { 'Recently updated': 'addons://recently_updated/' },
        { 'Install from repository': 'addons://repos/' },
        { 'Install from zip': 'addons://install/' },
        { 'Search': 'addons://search/' }
    ] },
    { 'PVR': [
        { 'TV channels': 'pvr://channels/tv/*' },
        { 'Active TV recordings': 'pvr://recordings/tv/active ' },
        { 'Deleted TV recordings': 'pvr://recordings/tv/deleted' },
        { 'TV timers': 'pvr://timers/tv/timers' },
        { 'TV timer rules': 'pvr://timers/tv/rules' },
        { 'Radio channels': 'pvr://channels/radio/*' },
        { 'Active Radio recordings': 'pvr://recordings/radio/active' },
        { 'Deleted Radio recordings': 'pvr://recordings/radio/deleted' },
        { 'Radio timers': 'pvr://timers/radio/timers' },
        { 'Radio timer rules': 'pvr://timers/radio/rules' }
    ] },
    { 'settings': [{ 'settings': 'settings' }] },
    { 'systemsettings': [{ 'system settings': 'systemsettings' }] },
    { 'servicesettings': [{ 'service settings': 'servicesettings' }] },
    { 'playersettings': [{ 'player settings': 'playersettings' }] },
    { 'mediasettings': [{ 'media settings': 'mediasettings' }] },
    { 'interfacesettings': [{ 'interface settings': 'interfacesettings' }] },
    { 'appearancesettings': [{ 'appearance settings': 'appearancesettings' }] },
    { 'profilesettings': [{ 'profile settings': 'profilesettings' }] },
    { 'skinsettings': [{ 'skin settings': 'skinsettings' }] },
    { 'filemanager': [{ 'file manager': 'filemanager' }] },
    { 'systeminfo': [{ 'system info': 'systeminfo' }] },
    { 'favourites': [{ '': 'favourites' }] },
    { 'eventlog': [{ 'event log': 'eventlog' }] },
    { 'screensaver': [{ 'screen saver': 'screensaver' }] },
    { 'subtitlesearch': [{ 'subtitle download': 'subtitlesearch' }] }
];

module.exports = function() {
    let flatWindows = [];

    KodiWindows.map((windowsSection) => {
        let sectionName = Object.keys(windowsSection)[0];
        let sectionPaths = windowsSection[sectionName];

        sectionPaths.map((pair) => {
            let subSectionName = Object.keys(pair)[0];
            let path = pair[subSectionName];

            flatWindows.push({
                'section': sectionName,
                'sub-section': subSectionName,
                'path': path,
                'label': `${sectionName} ${subSectionName}`
            });
        });
    });

    return flatWindows;
};
