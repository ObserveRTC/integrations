import { BaseIntegration } from '../base.integration'

class MediaSoup extends BaseIntegration{
    constructor() {
        super()
        this.overridePeer(this)
    }
    getIntegrationName(): string {
        return 'Mediasoup'
    }

    getCallId(): string {
        // roomId for eduMeet
        // @ts-ignore
        const roomId = window.CLIENT?._roomId
        if (roomId) return roomId

        const url = window.location.href
        const match = url.match('[?&]' + 'roomId' + '=([^&]+)')
        return match ? match[1] : ''
    }

    getUserId(): string {
        // user id as stream display name
        // @ts-ignore
        const userId = window.CLIENT?._displayName
        return userId
    }
}

const mediaSoupIntegration = new MediaSoup()
// @ts-ignore
mediaSoupIntegration.initialize()
export default mediaSoupIntegration
