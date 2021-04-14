class MediaSoup {
    private observer!: any
    public initialize() {
        this.addPeerConnection = this.addPeerConnection.bind(this)
        this.getWebSocketEndpoint = this.getWebSocketEndpoint.bind(this)
        this.getRoomId = this.getRoomId.bind(this)
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
        builder.withIntegration?.('Mediasoup')
        this.observer = builder.build()
        this.overridePeer(this)
    }

    public addPeerConnection(pc: any) {
        // @ts-ignore
        // @ts-ignore
        const callId = this.getRoomId()
        // user id as stream display name
        // @ts-ignore
        const userId = window.CLIENT?._displayName
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

    private getRoomId(): string | null {
        // roomId for eduMeet
        // @ts-ignore
        const roomId = window.CLIENT?._roomId
        if (roomId) return roomId
        
        const url = window.location.href
        const match = url.match('[?&]' + 'roomId' + '=([^&]+)')
        return match ? match[1] : null
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

const mediaSoupIntegration = new MediaSoup()
// @ts-ignore
mediaSoupIntegration.initialize()
export default mediaSoupIntegration
