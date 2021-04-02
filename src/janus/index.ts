class Janus {
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
        builder.withIntegration?.('Janus')
        this.observer = builder.build()
        this.overridePeer(this)
    }

    public addPeerConnection(pc: any) {
        // @ts-ignore
        const callId = (typeof myroom !== 'undefined' && myroom)
        // @ts-ignore
        const userId = (typeof myusername !== 'undefined' && myusername)
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

const janusIntegration = new Janus()
// @ts-ignore
janusIntegration.initialize()
export default janusIntegration
