// @ts-ignore
const wsServerUrl = WS_SERVER_URL || null
// @ts-ignore
const serviceUUID = SERVICE_UUID || null
// @ts-ignore
const mediaUnitId = MEDIA_UNIT_ID || null
// @ts-ignore
const statsVersion = STATS_VERSION || null


class Jitsi {
    // @ts-ignore
    private readonly serverURL: string = ObserverRTC.ParserUtil.parseWsServerUrl(wsServerUrl, serviceUUID, mediaUnitId, statsVersion)
    // @ts-ignore
    private readonly statsParser: ObserverRTC.StatsParser = new ObserverRTC.StatsParser()
    // @ts-ignore
    private readonly statsSender: ObserverRTC.StatsSender = new ObserverRTC.StatsSender(this.serverURL)
    private observer!: any

    public initialize(appId: any, appSecret: any, userId: any, initCallback: any) {
        // @ts-ignore
        this.observer = new ObserverRTC.Builder(1000)
            .attachPlugin(this.statsParser)
            .attachPlugin(this.statsSender)
            .build()
        if (initCallback) {
            setTimeout(() => {
                initCallback('success', 'SDK authentication successful.')
            }, 1000)
        }
        return { status: 'success'}
    }

    public addNewFabric(pc: any) {
        // @ts-ignore
        const callId = APP?.conference?.roomName
        // @ts-ignore
        const userId = APP?.conference?.getLocalDisplayName()
        try {
            this.observer.addPC(pc, callId, userId)
        } catch (e) {
            // @ts-ignore
            ObserverRTC.logger.log('addpc error', e)
        }
        return { status: 'success', message: 'success'}
    }
}

const jitsiIntegration = new Jitsi()
export default jitsiIntegration

