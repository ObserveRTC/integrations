class PeerJs{
    getIntegrationName(): string {
        return 'PeerJS'
    }

    // id of the caller
    getCallId(): string {
        // @ts-ignore
        const callId = (typeof myroom !== 'undefined' && myroom)
        return callId
    }

    // my own id
    getUserId(): string {
        // @ts-ignore
        const userId = (typeof myusername !== 'undefined' && myusername)
        return userId
    }
}

const peerJsIntegration = new PeerJs()
// @ts-ignore
peerJsIntegration.initialize()
export default peerJsIntegration
