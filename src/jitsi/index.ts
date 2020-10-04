// @ts-ignore
const wsServerUrl = WS_SERVER_URL || null
// @ts-ignore
const serviceUUID = SERVICE_UUID || null
// @ts-ignore
const mediaUnitId = MEDIA_UNIT_ID || null
// @ts-ignore
const statsVersion = STATS_VERSION || null

class Jitsi {
    private readonly serverURL: string = ParserUtil.parseWsServerUrl(wsServerUrl, serviceUUID, mediaUnitId, statsVersion)
    private readonly statsParser: StatsParser = new StatsParser()
    private readonly statsSender: StatsSender = new StatsSender(this.serverURL)
    private observer!: Observer

    public initialize(appId: any, appSecret: any, userId: any, initCallback: any) {
        this.observer = new ObserverBuilder()
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
            logger.log('******** addpc error', e)
        }
        return { status: 'success', message: 'success++'}
    }
}

export default Jitsi
