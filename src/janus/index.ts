import { BaseIntegration } from '../base.integration'

class Janus extends BaseIntegration{
    getIntegrationName(): string {
        return 'Janus'
    }

    getCallId(): string {
        // @ts-ignore
        const callId = (typeof myroom !== 'undefined' && myroom)
        return callId
    }

    getUserId(): string {
        // @ts-ignore
        const userId = (typeof myusername !== 'undefined' && myusername)
        return userId
    }
}

const janusIntegration = new Janus()
// @ts-ignore
janusIntegration.initialize()
export default janusIntegration
