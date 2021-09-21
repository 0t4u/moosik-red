# Moosik-Red
Dumb music bot that I'm finally making open source since my other git repo was lost in a hard drive failure.

## Usage
~~You can invite the hosted version here~~

OR

You can self host:
1. Download repo as a zip
2. Install all deps using `npm i`
3. Edit config files (instructions in next section)
3. Run it using `node index.js`

## Configurations
### config.json
```json
{
    "token": "DISCORD_API_TOKEN", <- Change this in config file to your bot token
    "ytapikey": "YOUTUBE_API_TOKEN", <- Get this from the Google developer portal
    "scapikey": "YUKXoArFcqrlQn9tfNHvvyfnDISj04zk", <- Completely ignore this
    "prefix": "m." <- Bot prefix
}
```
### nodes.json
```json
[   
    {
        "host": "localhost", <- Lavalink hostname
        "port": "3003", <- Lavalink port
        "password": "youshallnotpass", <- Same password from Lavalink config
        "retries": 5 <- Number of connection tries in case of fail
    }
]
```
