
## Mediasoup Integration

You can either [build and integrate the package yourself](#build)
or use our [Mediasoup QuickStart](#quickstart) where you simply load the observer
libraries from GitHub's CDN and initialize by populating the `observerWsEndPoint` global variable using the
`ObserverRTC.ParserUtil.parseWsServerUrl` helper function.

### Build the package yourself <a name="build"></a>

Follow the steps below to build the package from scratch.


#### Install dependencies

- Make sure we have type script installed in the system
    - `npm install -g typescript`
- Install package dependencies
    - `npm ci`

#### Build library with proper configuration parameter

- Build library.
    - It will create compiled JavaScript libraries in `dist` folder that we will be able to use with JitsiMeet.
        -  `npm run build-mediasoup`

    
See the quickstart methodology below for adding this library to your web app.


### Mediasoup Quickstart <a name="quickstart"></a>

1. Include core library before including `antiglobal.js` and mediasoup javascript library file in your html page.
   We have a public version hosted on GitHub you can use as shown below,
   or use the library you built from the [build and integrate the package yourself](#build) instructions.
   
  - Production version
    ```html 
    <script src="https://observertc.github.io/observer-js/dist/v0.4.0/observer.min.js"></script>
    ```
  - Developer version
    ```html 
    <script src="https://observertc.github.io/observer-js/dist/v0.4.0/observer.js"></script>
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

3. Include the integration library

    You can also use the prebuilt libraries hosted on our GitHub links.
    We recommend the minified version. The unminified version includes extra console logging for debugging purposes.

    - Minified version (recommended):
    ```html 
    <script src="https://observertc.github.io/integrations/dist/v0.1.0/mediasoup.integration.min.js"></script>
    ```

    - OR Non-minified version:
    ```html 
    <script src="https://observertc.github.io/integrations/dist/v0.1.0/mediasoup.integration.js"></script>
    ```

    - In the end it might look similiar to this
        ```html
        <html>
        <body>
      <!--  
      .....
      .....
      -->      
        <script src="https://observertc.github.io/observer-js/dist/v0.4.0/observer.js"></script>
        <script>
            let observerWsEndPoint = ObserverRTC.ParserUtil.parseWsServerUrl(
                "ws://localhost:8088/",           // observerURL
                {{ServiceUUID}},                  // Add a unique ServiceUUID here
                "mediasoup-demo",                   // MediaUnitID
                "v20200114"                       // StatsVersion
            );
        </script>
        <script src='http://localhost:9090/dist/v0.1.0/mediasoup.integration.js'></script>
        <script src='/resources/js/antiglobal.js'></script>
        <script>
        window.localStorage.setItem('debug', '* -engine* -socket* -RIE* *WARN* *ERROR*');
        
        if (window.antiglobal) {
            window.antiglobal('___browserSync___oldSocketIo', 'io', '___browserSync___', '__core-js_shared__');
            setInterval(window.antiglobal, 180000);
        }
        </script>
        <script async src='/mediasoup-demo-app.js?v=foo2'></script>
      
      ```
    
