// @ts-ignore
const wsServerUrl = WS_SERVER_URL || null
// @ts-ignore
const serviceUUID = SERVICE_UUID || null
// @ts-ignore
const mediaUnitId = MEDIA_UNIT_ID || null
// @ts-ignore
const statsVersion = STATS_VERSION || null
// @ts-ignore
const poolingIntervalInMs = typeof POOLING_INTERVAL_MS === 'undefined' ? 1000 : parseInt(POOLING_INTERVAL_MS, 10)


class Jitsi {
    // @ts-ignore
    private readonly statsParser: ObserverRTC.StatsParser = new ObserverRTC.StatsParser()
    // @ts-ignore
    private readonly statsSender: ObserverRTC.StatsSender = new ObserverRTC.StatsSender(this.getWebSocketEndpoint())
    private observer!: any

    public initialize() {
        this.addPeerConnection = this.addPeerConnection.bind(this)
        this.overridePeer = this.overridePeer.bind(this)

        // @ts-ignore
        this.observer = new ObserverRTC.Builder( this.getPoolingInterval() )
            .attachPlugin(this.statsParser)
            .attachPlugin(this.statsSender)
            .build()
        this.overridePeer(this)
    }

    private getWebSocketEndpoint(): string {
        // @ts-ignore
        const _observerWsEndpoint = config?.observerWsEndpoint
        // @ts-ignore
        return _observerWsEndpoint || ObserverRTC.ParserUtil.parseWsServerUrl(wsServerUrl, serviceUUID, mediaUnitId, statsVersion)
    }

    private getPoolingInterval(): number {
        // @ts-ignore
        const _poolingIntervalInMs = config?.analytics?.rtcstatsPollInterval
        return _poolingIntervalInMs || poolingIntervalInMs
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
