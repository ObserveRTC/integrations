class Jitsi {
    private observer!: any

    public initialize() {
        this.addPeerConnection = this.addPeerConnection.bind(this)
        this.overridePeer = this.overridePeer.bind(this)
        this.getWebSocketEndpoint = this.getWebSocketEndpoint.bind(this)
        this.getPoolingInterval = this.getPoolingInterval.bind(this)

        const wsServerURL = this.getWebSocketEndpoint()
        const poolingIntervalInMs = this.getPoolingInterval()
        // @ts-ignore
        this.observer = new ObserverRTC.Builder(wsServerURL, poolingIntervalInMs)
            .build()
        this.overridePeer(this)
    }

    private getWebSocketEndpoint(): string {
        // @ts-ignore
        const _observerWsEndpoint = config?.observerWsEndPoint
        // @ts-ignore
        return _observerWsEndpoint || ObserverRTC.ParserUtil.parseWsServerUrl(wsServerUrl, serviceUUID, mediaUnitId, statsVersion)
    }

    private getPoolingInterval(): number {
        // @ts-ignore
        const _poolingIntervalInMs = config?.analytics?.rtcstatsPollInterval
        return _poolingIntervalInMs || 1000
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
}

const jitsiIntegration = new Jitsi()
jitsiIntegration.initialize()
export default jitsiIntegration
