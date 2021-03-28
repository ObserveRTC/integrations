class Jitsi {
    private observer!: any

    public initialize() {
        this.addPeerConnection = this.addPeerConnection.bind(this)
        this.getWebSocketEndpoint = this.getWebSocketEndpoint.bind(this)
        this.getPoolingInterval = this.getPoolingInterval.bind(this)
        this.getMarker = this.getMarker.bind(this)
        this.getBrowserId = this.getBrowserId.bind(this)

        const wsServerURL = this.getWebSocketEndpoint()
        const poolingIntervalInMs = this.getPoolingInterval()
        const marker = this.getMarker()
        const browserId = this.getBrowserId()
        // @ts-ignore
        const builder = new ObserverRTC.Builder({
            poolingIntervalInMs,
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
        builder.withIntegration?.('Jitsi')
        this.observer = builder.build()
        this.overridePeer(this)
    }

    private getWebSocketEndpoint(): string {
        // @ts-ignore
        const _observerWsEndpoint = config?.observerWsEndPoint
        // @ts-ignore
        return _observerWsEndpoint || undefined
    }

    private getPoolingInterval(): number {
        // @ts-ignore
        const _poolingIntervalInMs = config?.analytics?.rtcstatsPollInterval
        return _poolingIntervalInMs || 1000
    }

    private getMarker(): number {
        // @ts-ignore
        const _marker = config?.observerMarker || window?.observerMarker || document?.observerMarker || (typeof observerMarker !== 'undefined' && observerMarker)
        return _marker
    }

    private getBrowserId(): number {
        // @ts-ignore
        const _browserId = window?.observerBrowserId || document?.observerBrowserId || (typeof observerBrowserId !== 'undefined' && observerBrowserId)
        return _browserId
    }

    private addPeerConnection(pc: any) {
        try {
            // @ts-ignore
            const callId = APP?.conference?.roomName
            // @ts-ignore
            const userId = APP?.conference?.getLocalDisplayName()
            this.observer.addPC(pc, callId, userId)
        } catch (e) {
            // @ts-ignore
            console.error(e)
        }
    }

    private overridePeer(that: any) {
        const origPeerConnection = window.RTCPeerConnection
        // @ts-ignore
        // tslint:disable-next-line:only-arrow-functions
        const peerConnection = function(config, constraints) {
            const pc = new origPeerConnection(config, constraints)
            that.addPeerConnection(pc)
            return pc
        }
        // @ts-ignore
        window.RTCPeerConnection = peerConnection
        window.RTCPeerConnection.prototype = origPeerConnection.prototype
    }

    updateMarker(marker: string) {
        this.observer?.updateMarker?.(marker)
    }
}

const jitsiIntegration = new Jitsi()
jitsiIntegration.initialize()
export default jitsiIntegration
