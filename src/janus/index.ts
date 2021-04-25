import { BaseIntegration } from '../base.integration'

class Janus extends BaseIntegration{
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

    getIntegrationName(): string {
        return 'Janus'
    }
}

const janusIntegration = new Janus()
// @ts-ignore
janusIntegration.initialize()
export default janusIntegration
