import { BaseIntegration } from '../base.integration'


class PeerJs extends BaseIntegration {
    private callId?: string
    private userId?: string
    constructor() {
        super()
        this.overridePeerJS(this)
    }

    getIntegrationName(): string {
        return 'PeerJS'
    }

    // my own id - id of the caller
    getCallId(): string {
        // @ts-ignore
        return this.callId
    }

    // my own id
    getUserId(): string {
        // @ts-ignore
        return this.userId
    }

    overridePeerJS(instance: PeerJs) {
        // @ts-ignore
        const oldAddConnection = Peer.prototype._addConnection
        // @ts-ignore
        Peer.prototype._addConnection = function() {
            const userId = arguments[0] // user id
            const { peer} = arguments[1] // connection
            instance.userId = userId
            instance.callId = `${this.id}<=>${peer}` // connection.connectionId; //
            oldAddConnection.apply(this, arguments)
        }
    }
}

const peerJsIntegration = new PeerJs()
// @ts-ignore
peerJsIntegration.initialize()
export default peerJsIntegration
