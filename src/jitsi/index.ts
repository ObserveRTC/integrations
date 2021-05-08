import { BaseIntegration } from '../base.integration'

class Jitsi extends BaseIntegration{
    getWebSocketEndpoint(): string {
        // @ts-ignore
        return config?.observerWsEndpoint || super.getWebSocketEndpoint()
    }

    getIntegrationName(): string {
        return 'Jitsi'
    }

    getCallId(): string {
        // @ts-ignore
        const callId = APP?.conference?.roomName
        return callId
    }

    getUserId(): string {
        // @ts-ignore
        const userId = APP?.conference?.getLocalDisplayName()
        return userId
    }
}

const jitsiIntegration = new Jitsi()
jitsiIntegration.initialize()
export default jitsiIntegration
