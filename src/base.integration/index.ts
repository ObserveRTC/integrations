class BaseIntegration {
    protected observer!: any
    public initialize(): void {
        this.getCallId = this.getCallId.bind(this)
        this.getUserId = this.getUserId.bind(this)
        this.getAccessToken = this.getAccessToken.bind(this)
        this.addPeerConnection = this.addPeerConnection.bind(this)
        this.overridePeer = this.overridePeer.bind(this)
        const wsServerURL = this.getWebSocketEndpoint()
        const marker = this.getMarker()
        const browserId = this.getBrowserId()
        const integrationName = this.getIntegrationName()
        const accessToken = this.getAccessToken()
        // @ts-ignore
        const builder = new ObserverRTC.Builder({
            poolingIntervalInMs: 1000,
            wsAddress: wsServerURL,
        })
        // add access token if there is any
        if (accessToken) {
            builder.withAccessToken(accessToken)
        }
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
        builder.withIntegration?.(integrationName)
        this.observer = builder.build()
    }

    public getMarker(): number {
        // @ts-ignore
        const _marker = (typeof config !== 'undefined' && config?.observerMarker) || window?.observerMarker || document?.observerMarker || (typeof observerMarker !== 'undefined' && observerMarker)
        return _marker
    }

    public getBrowserId(): number {
        // @ts-ignore
        const _browserId = window?.observerBrowserId || document?.observerBrowserId || (typeof observerBrowserId !== 'undefined' && observerBrowserId)
        return _browserId
    }

    public updateMarker(marker: string) {
        this.observer?.updateMarker?.(marker)
    }

    public getCallId(): string {
        throw new Error('implements me')
    }

    public getUserId(): string {
        throw new Error('implements me')
    }

    public getWebSocketEndpoint(): string {
        // @ts-ignore
        const _observerWsEndpoint = (typeof config !== 'undefined' && config?.observerWsEndPoint) || window?.observerWsEndPoint || document?.observerWsEndPoint || (typeof observerWsEndPoint !== 'undefined' && observerWsEndPoint)
        // @ts-ignore
        return _observerWsEndpoint
    }

    public getPoolingIntervalInMs(): number {
        // @ts-ignore
        const _poolingIntervalInMs = (typeof config !== 'undefined' && config?.analytics?.rtcstatsPollInterval) || window?.observerPollIntervalInMs || document?.observerPollIntervalInMs || (typeof observerPollIntervalInMs !== 'undefined' && observerPollIntervalInMs)
        return _poolingIntervalInMs || 1000
    }

    public getIntegrationName(): string {
        throw new Error('implement me')
    }

    protected addPeerConnection(pc: any) {
    public getAccessToken(): (() => string) | string {
        // @ts-ignore
        const _observerAccessToken = (typeof config !== 'undefined' && config?.observerAccessToken) || window?.observerAccessToken || document?.observerAccessToken || (typeof observerAccessToken !== 'undefined' && observerAccessToken)
        return _observerAccessToken
    }

    protected addPeerConnection(pc: any) {
        // @ts-ignore
        const callId = this.getCallId()
        // @ts-ignore
        const userId = this.getUserId()
        try {
            this.observer.addPC(pc, callId, userId)
        } catch (e) {
            // @ts-ignore
            ObserverRTC.logger.error(e)
        }
    }

    protected overridePeer(that: any): void {
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
}

export { BaseIntegration }
