class TokBox {
    private observer!: any
    public initialize() {
        this.addPeerConnection = this.addPeerConnection.bind(this)
        this.getWebSocketEndpoint = this.getWebSocketEndpoint.bind(this)
        this.getMarker = this.getMarker.bind(this)
        this.getBrowserId = this.getBrowserId.bind(this)

        const wsServerURL = this.getWebSocketEndpoint()
        const marker = this.getMarker()
        const browserId = this.getBrowserId()
        // @ts-ignore
        const builder = new ObserverRTC.Builder({
            poolingIntervalInMs: 1000,
            wsAddress: wsServerURL,
        })
        // add marker if there is any otherwise just ignore
        if (marker) {
            builder.withMarker?.(marker)
        }
        // set browser id if there is any otherwise just ignore
        // Also, please note when you ignore setting browser id, it will try to fingerprinting the browser
        // so if you don't want that please provide a browser id
        if (browserId) {
            builder.withBrowserId?.(browserId)
        }
        // add integration
        builder.withIntegration?.('TokBox')
        this.observer = builder.build()
        this.overridePeer(this)
    }

    public addPeerConnection(pc: any) {
        /*
        * Every Vonage Video API video chat occurs within a session.
        * You can think of a session as a “room” where clients can interact with one another in real-time.
        * Sessions are hosted on the Vonage Video API cloud and manage user connections, audio-video streams,
        * and user events (such as a new user joining). Each session is associated with a unique session ID.
        * To allow multiple clients to chat with one another, you would simply have them connect to the same session (using the same session ID).
        */
        // @ts-ignore
        const publisher = OT?.publishers?.find()
        // @ts-ignore
        const callId = publisher?.session?.id
        // user id as stream display name.
        // first check stream.name and if it is not available then check streamId
        // @ts-ignore
        const userId = publisher?.stream?.name || publisher?.streamId
        try {
            this.observer.addPC(pc, callId, userId)
        } catch (e) {
            // @ts-ignore
            ObserverRTC.logger.error(e)
        }
    }

    private overridePeer(that: any) {
        if (!window.RTCPeerConnection) return
        const oldRTCPeerConnection = window.RTCPeerConnection
        // @ts-ignore
        // tslint:disable-next-line:only-arrow-functions
        window.RTCPeerConnection = function() {
            // @ts-ignore
            const pc = new oldRTCPeerConnection(...arguments)
            that?.addPeerConnection(pc)
            return pc
        }
        for (const key of Object.keys(oldRTCPeerConnection)) {
            // @ts-ignore
            window.RTCPeerConnection[key] = oldRTCPeerConnection[key]
        }
        // @ts-ignore
        window.RTCPeerConnection.prototype = oldRTCPeerConnection.prototype
    }

    private getWebSocketEndpoint(): string {
        // @ts-ignore
        const _observerWsEndpoint = window?.observerWsEndPoint || document?.observerWsEndPoint || (typeof observerWsEndPoint !== 'undefined' && observerWsEndPoint)
        // @ts-ignore
        return _observerWsEndpoint
    }

    private getMarker(): number {
        // @ts-ignore
        const _marker = window?.observerMarker || document?.observerMarker || (typeof observerMarker !== 'undefined' && observerMarker)
        return _marker
    }

    private getBrowserId(): number {
        // @ts-ignore
        const _browserId = window?.observerBrowserId || document?.observerBrowserId || (typeof observerBrowserId !== 'undefined' && observerBrowserId)
        return _browserId
    }

    updateMarker(marker: string) {
        this.observer?.updateMarker?.(marker)
    }
}

const tokBoxIntegration = new TokBox()
// @ts-ignore
tokBoxIntegration.initialize()
export default tokBoxIntegration
