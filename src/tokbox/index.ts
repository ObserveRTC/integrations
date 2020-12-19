// @ts-ignore
const wsServerUrl = WS_SERVER_URL || null
// @ts-ignore
const serviceUUID = SERVICE_UUID || null
// @ts-ignore
const mediaUnitId = MEDIA_UNIT_ID || null
// @ts-ignore
const statsVersion = STATS_VERSION || null

class TokBox {
    // @ts-ignore
    private readonly statsParser: ObserverRTC.StatsParser = new ObserverRTC.StatsParser()
    // @ts-ignore
    private readonly statsSender: ObserverRTC.StatsSender = new ObserverRTC.StatsSender(
        this.getWebSocketEndpoint()
    )
    private observer!: any
    public initialize() {
        this.getWebSocketEndpoint = this.getWebSocketEndpoint.bind(this)
        this.addPeerConnection = this.addPeerConnection.bind(this)
        // @ts-ignore
        this.observer = new ObserverRTC.Builder(1000)
            .attachPlugin(this.statsParser)
            .attachPlugin(this.statsSender)
            .build()
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
        // user id as stream display name
        // @ts-ignore
        const userId = publisher?.stream?.name
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
            const pc = new oldRTCPeerConnection(arguments)
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
        return _observerWsEndpoint || ObserverRTC.ParserUtil.parseWsServerUrl(wsServerUrl, serviceUUID, mediaUnitId, statsVersion)
    }
}

const tokBoxIntegration = new TokBox()
// @ts-ignore
tokBoxIntegration.initialize()
export default tokBoxIntegration
