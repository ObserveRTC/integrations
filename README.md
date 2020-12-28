# Wobserver WebRTC Integrations
Easy integration for different RTC services. We provide options for simply integrating our JavaScript libraries with options for building the package yourself.

Currently we support integrations with:
* [Vonage OpenTok](https://www.vonage.com/communications-apis/video/)
* [Jitsi Meet](https://jitsi.org)



## TokBox Integration

Currently we do not have a method for configuring `observer.js` outside of a custom build. 
You will need to build the package yourself.

### Build the package yourself

Follow the steps below to build the package from scratch.

#### Install dependencies

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


### Add to your OpenTok web app

1. Include core library before including `opentok.js` file in your html page

```html 
    <script src="https://observertc.github.io/webextrapp/dist/observer.js"></script> 
```

2. Define server endpoint in global( window ) scope 
```html
<script>
    let observerWsEndPoint = ObserverRTC.ParserUtil.parseWsServerUrl(
        "wss://webrtc-observer.org/",           // observerURL
        {{ServiceUUID}},                        // Add a unique ServiceUUID here
        "opentok-demo",                         // MediaUnitID
        "v20200114"                             // StatsVersion
    );
</script>
`````

3. There are two ways to include the integration library

    - Build it by yourself, and include the currently build tokbox integration library after adding `observer.js`

    ```javascript
       <script src="/your/server/cdn/tokbox.integration.js"></script>
    ```
   
    - Or you can also use the prebuilt library from this link. It has both minified and non minified version

      - Non minified version
        ```html
          <script src="https://observertc.github.io/integrations/dist/tokbox.integration.js"></script>
        ```
      - Minified version
        ```html
          <script src="https://observertc.github.io/integrations/dist/tokbox.integration.min.js"></script>
        ```

An example can be found in [TokBox demo folder](https://github.com/ObserveRTC/integrations/blob/main/__test__/tokbox/index.html#L3).


## Jitsi Integration

### Build the package yourself

#### Build library with proper configuration parameter ( optional )

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

      

#### Use the library in Jitsi project

For existing installations and typical deployments you can simply add a few lines to the end of the `meet-[your-domain]-config.js` configuration file. 
This is usually located under `/etc/jitsi/meet` in the Debian installation.

#### Edit config.js in your already installed jitsi-meet 

Goto your `config.js` file from jitsi-meet `config` folder.  

```$xslt
nano /etc/jitsi/meet/meet.my.domain-config.js
```

And add these two implementation specific variable at the very end of the file.

```javascript
config.analytics.observerPoolingIntervalInMs = 1000
config.observerWsEndpoint = "wss://websocket_server_url/service_uuid/media_unit_id/stats_version/json"
```

Make sure to specify your `service_uuid` and a unique string for `media_unit_id` to indentify this specific Jitsi Meet instance .

#### Docker builds

Do the following if you are building from Docker. 

You will need to pass the integration specific configuration using `config.js` before building the container. Goto your jitsi-meet `settings-config.js`and add the following:

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


### Integrate the observerRTC library in your Jitsi Meet HTML

To load the observerRTC library, we need to edit the Jitsi Meet webpage. 

Goto your JitsiMeet  `index.html` page:

```$xslt
nano /usr/share/jitsi-meet/index.html
```

Add these two file after the line where `config.js` script is loaded:
```javascript
<script src="https://observertc.github.io/webextrapp/dist/observer.min.js"></script>
<script src="https://observertc.github.io/integrations/dist/jitsi.integration.min.js"></script>
```

This should look something like:
```$html
    <!--... --> 
    <!--#include virtual="static/settingsToolbarAdditionalContent.html" -->

    <!-- Added manually as part of Observe RTC installation; using minified versions -->
    <script src="https://observertc.github.io/webextrapp/dist/observer.min.js"></script>
    <script src="https://observertc.github.io/integrations/dist/jitsi.integration.min.js"></script>

  </head>
  <body>
    <!--#include virtual="body.html" -->
    <div id="react"></div>
  </body>
</html>

```

Reload the Jitsi Meet page from browser to apply changes. Jitsi Meet now integrated. 
