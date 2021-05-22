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
        Peer.prototype._addConnection = function(peerId: string, connection: any) {
            instance.userId = peerId // user id
            instance.callId = `${this.id}<=>${peerId}` // connection.connectionId; //
            if (!connection.peerConnection) {
                setTimeout(() => {
                    instance.addPeerConnection(connection?.peerConnection)
                }, 0)
            }else {
                instance.addPeerConnection(connection?.peerConnection)
            }
            oldAddConnection.apply(this, [peerId, connection])
        }
    }
}

const peerJsIntegration = new PeerJs()
// @ts-ignore
peerJsIntegration.initialize()
export default peerJsIntegration
