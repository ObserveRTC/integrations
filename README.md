# Wobserver WebRTC Integrations
Easy integration for different RTC services



### TokBox Integration

### Install dependencies

- Make sure we have type script installed in the system
  - `npm install -g typescript`
- Install package dependencies
  - `npm ci`

### Build library with proper configuration parameter

- Goto [index.json](library.config/index.json) file.
- Change `libraryName` to `TokBox`
- Change `poolingIntervalMs` to suitable interval if needed. Recommended `1000`
- Change the `wsServer` options accordingly
  - `URL` - WebSocket server URL
  - `ServiceUUID` - An uniqueue UUID that you are going to use for your service
  - `MediaUnitID` - Media unit ID name
  - `StatsVersion` - v20200114 ( preferred to use latest version always)
- Build library. It will create a compiled JavaScript library that we will be able to use with TokBox in `dist` folder
  - Production version
    -  `npm run build-library-prod`
  - Developer version
    -  `npm run build-library-dev`

### Use the library in TokBox project

1. Include core library before including `opentok.js` file in your html page

    ```javascript 
    <script src="https://observertc.github.io/webextrapp/dist/observer.js"></script> 
   ```

2. Include the currently build tokbox integration library after adding `observer.js`

    ```javascript
   <script src="/your/server/cdn/tokbox.integration.js"></script>
    ```


An example can be found in [TokBox demo folder](__test__/tokbox/index.htm#L3-L4) . Here we build the integration library with our own configuration and you may want to use separate configuration for your integration.



### Jitsi Integration



### Build library with proper configuration parameter ( optional )

- Goto [index.json](library.config/index.json) file.

- Change `libraryName` to `Jitsi`

- Change `poolingIntervalMs` to suitable interval if needed. Recommended `1000`

- Change the `wsServer` options accordingly ( ***not mandatory since we can use jitsimeet `config.js` to pass configuration***)

  - `URL` - WebSocket server URL
  - `ServiceUUID` - An uniqueue UUID that you are going to use for your service
  - `MediaUnitID` - Media unit ID name
  - `StatsVersion` - v20200114 ( preferred to use latest version always)

- Build library. It will create a compiled JavaScript library that we will be able to use with JitsiMeet in `dist` folder

  - Production version

    -  `npm run build-library-prod`

  - Developer version

    -  `npm run build-library-dev`

      

### Use the library in Jitsi project

#### Way 1: Pass integration specific configuration using `config.js` before build the container

- Goto your jitsi-meet `settings-config.js`and add this lines

```javascript
// observer rtc related config

{{ if .Env.POOLING_INTERVAL_IN_MS -}}
config.analytics.observerPoolingIntervalInMs = '{{ .Env.OBSERVER_POOLING_INTERVAL_IN_MS }}';
{{ end -}}


{{ if .Env.OBSERVER_WS_ENDPOINT -}}
config.observerWsEndpoint = '{{ .Env.OBSERVER_WS_ENDPOINT }}';
{{ end -}}
```

- Now, if we build a new jitsi-meet container, these two environment variable will be present in `config.js` when jitsi-meet is loaded.

#### Way 2: Edit config.js in your already built jitsi-meet container 

Goto your `config.js` file from jitsi-meet `config` folder, and add these two implementation specific variable at the end of the script with your expected value

```javascript
config.analytics.observerPoolingIntervalInMs = 1000
config.observerWsEndpoint = "wss://websocket_server_url/service_uuid/media_unit_id/stats_version/json"
```



### Integrate the observerRTC library in your JitsiMeet HTML

Goto your JitsiMeet  `index.html` page, and add these two file after the line where `config.js` script is loaded

```javascript
<script src="https://observertc.github.io/webextrapp/dist/observer.js"></script>
<script src="https://observertc.github.io/integrations/dist/jitsi.integration.js"></script>
```

Reload the jitsi meet page from browser to apply changes. JitsiMeet now integrated.
