class MediaSoup {
    private observer!: any
    public initialize() {
        this.addPeerConnection = this.addPeerConnection.bind(this)
        this.getWebSocketEndpoint = this.getWebSocketEndpoint.bind(this)
        this.getRoomId = this.getRoomId.bind(this)
        this.getMarker = this.getMarker.bind(this)

        const wsServerURL = this.getWebSocketEndpoint()
        const marker = this.getMarker()
        // @ts-ignore
        this.observer = new ObserverRTC.Builder({
            poolingIntervalInMs: 1000,
            wsAddress: wsServerURL,
        })
            .withIntegration('Mediasoup')
            ?.withMarker?.(marker)
            .build()

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
        const _observerWsEndpoint = window?.observerWsEndPoint || document?.observerWsEndPoint || observerWsEndPoint
        // @ts-ignore
        return _observerWsEndpoint
    }

    private getRoomId(): string | null {
        const url = window.location.href
        const match = url.match('[?&]' + 'roomId' + '=([^&]+)')
        return match ? match[1] : null
    }

    private getMarker(): number {
        // @ts-ignore
        const _marker = window?.observerMarker || document?.observerMarker || observerMarker
        return _marker || 'mediasoup-integration'
    }

    updateMarker(marker: string) {
        this.observer?.updateMarker?.(marker)
    }
}

const mediaSoupIntegration = new MediaSoup()
// @ts-ignore
mediaSoupIntegration.initialize()
export default mediaSoupIntegration
