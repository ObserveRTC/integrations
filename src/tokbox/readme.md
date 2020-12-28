
## Vonage OpenTok Integration

You can either [build and integrate the package yourself](#opentok-build)
or use our [OpenTok QuickStart](#opentok-quickstart) where you simply load the observer
libraries from GitHub's CDN and initialize by populating the `observerWsEndPoint` global variable using the
`ObserverRTC.ParserUtil.parseWsServerUrl` helper function.

### Build the package yourself <a name="opentok-build"></a>

Follow the steps below to build the package from scratch.

#### Install dependencies

- Make sure we have type script installed in the system
    - `npm install -g typescript`
- Install package dependencies
    - `npm ci`

#### Build library with proper configuration parameter

- Goto [index.json](../../library.config/index.json) file.
- Change `libraryName` to `TokBox`
- Build library. 
  - It will create a compiled JavaScript library that we will be able to use with OpenTok in `dist` folder
    - Production version
        -  `npm run build-library-prod`
    - Developer version
        -  `npm run build-library-dev`


See the quickstart methodology below for adding this library to your web app.


### OpenTok Quickstart <a name="opentok-quickstart"></a>

1. Include core library before including `opentok.js` file in your html page.
   We have a public version hosted on GitHub you can use as shown below,
   or use the library you built from the [build and integrate the package yourself](#opentok-build) instructions.
   
    - Old version
      - Production version
        ```html 
        <script src="https://observertc.github.io/webextrapp/dist/observer.min.js"></script> 
        ```
      - Developer version
        ```html 
        <script src="https://observertc.github.io/webextrapp/dist/observer.js"></script> 
        ```
    
    - New version. _**It's recommend using this version**_
      - Production version
        ```html 
        <script src="https://observertc.github.io/webextrapp/dist/v0.3.4/observer.min.js"></script>
        ```
      - Developer version
        ```html 
        <script src="https://observertc.github.io/webextrapp/dist/v0.3.4/observer.js"></script>
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

    You can also use the prebuilt libraries hosted on our GitHub.io links.
    We recommend the minified version. The unminified version includes extra console logging for debugging purposes.
    - Old version
      
        - Minified version (recommended):
        ```html
        <script src="https://observertc.github.io/integrations/dist/tokbox.integration.min.js"></script>
        ```
      
        - OR Non-minified version:
        ```html
        <script src="https://observertc.github.io/integrations/dist/tokbox.integration.js"></script>
        ```
        
    - New version _**It's recommend using this version**_
      
        - Production version
        ```html 
        <script src="https://observertc.github.io/integrations/dist/v0.0.2/tokbox.integration.min.js"></script>
        ```
      
        - Developer version
        ```html 
        <script src="https://observertc.github.io/integrations/dist/v0.0.2/tokbox.integration.js"></script>
        ```

An example can be found in [OpenTok demo folder](../../__test__/tokbox/index.html).
