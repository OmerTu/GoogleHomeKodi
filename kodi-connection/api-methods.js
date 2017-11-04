module.exports = [
    {
        name: 'Addons',
        methods: ['ExecuteAddon', 'GetAddonDetails', 'GetAddons', 'SetAddonEnabled']
    },
    {
        name: 'Application',
        methods: ['GetProperties', 'Quit', 'SetMute', 'SetVolume']
    },
    {
        name: 'AudioLibrary',
        methods: ['Clean', 'Export', 'GetAlbumDetails', 'GetAlbums', 'GetArtistDetails', 'GetArtists', 'GetGenres', 'GetRecentlyAddedAlbums', 'GetRecentlyAddedSongs', 'GetRecentlyPlayedAlbums', 'GetRecentlyPlayedSongs', 'GetSongDetails', 'GetSongs', 'Scan', 'SetAlbumDetails', 'SetArtistDetails', 'SetSongDetails']
    },
    {
        name: 'Files',
        methods: ['Download', 'GetDirectory', 'GetFileDetails', 'GetSources', 'PrepareDownload']
    },
    {
        name: 'GUI',
        methods: ['ActivateWindow', 'GetProperties', 'SetFullscreen', 'ShowNotification']
    },
    {
        name: 'Input',
        methods: ['Back', 'ContextMenu', 'Down', 'ExecuteAction', 'Home', 'Info', 'Left', 'Right', 'Select', 'SendText', 'ShowCodec', 'ShowOSD', 'Up']
    },
    {
        name: 'JSONRPC',
        methods: ['GetConfiguration', 'Introspect', 'NotifyAll', 'Permission', 'Ping', 'SetConfiguration', 'Version']
    },
    {
        name: 'PVR',
        methods: ['GetChannelDetails', 'GetChannelGroupDetails', 'GetChannelGroups', 'GetChannels', 'GetProperties', 'Record', 'Scan']
    },
    {
        name: 'Player',
        methods: ['GetActivePlayers', 'GetItem', 'GetProperties', 'GoTo', 'Move', 'Open', 'PlayPause', 'Rotate', 'Seek', 'SetAudioStream', 'SetPartymode', 'SetRepeat', 'SetShuffle', 'SetSpeed', 'SetSubtitle', 'Stop', 'Zoom', 't', 't.Add', 't.Clear', 't.GetItems', 't.GetPlaylists', 't.GetProperties', 't.Insert', 't.Remove', 't.Swap']
    },
    {
        name: 'System',
        methods: ['EjectOpticalDrive', 'GetProperties', 'Hibernate', 'Reboot', 'Shutdown', 'Suspend']
    },
    {
        name: 'VideoLibrary',
        methods: ['Clean', 'Export', 'GetEpisodeDetails', 'GetEpisodes', 'GetGenres', 'GetMovieDetails', 'GetMovieSetDetails', 'GetMovieSets', 'GetMovies', 'GetMusicVideoDetails', 'GetMusicVideos', 'GetRecentlyAddedEpisodes', 'GetRecentlyAddedMovies', 'GetRecentlyAddedMusicVideos', 'GetSeasons', 'GetTVShowDetails', 'GetTVShows', 'RemoveEpisode', 'RemoveMovie', 'RemoveMusicVideo', 'RemoveTVShow', 'Scan', 'SetEpisodeDetails', 'SetMovieDetails', 'SetMusicVideoDetails', 'SetTVShowDetails']
    },
    {
        name: 'XBMC',
        methods: ['GetInfoBooleans', 'GetInfoLabels']
    }
];
