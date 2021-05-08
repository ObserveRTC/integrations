import { BaseIntegration } from '../base.integration'

class TokBox extends BaseIntegration {
   /*
   * Every Vonage Video API video chat occurs within a session.
   * You can think of a session as a “room” where clients can interact with one another in real-time.
   * Sessions are hosted on the Vonage Video API cloud and manage user connections, audio-video streams,
   * and user events (such as a new user joining). Each session is associated with a unique session ID.
   * To allow multiple clients to chat with one another, you would simply have them connect to the same session (using the same session ID).
   */
    getIntegrationName(): string {
        return 'TokBox'
    }

    getCallId(): string {
        // @ts-ignore
        const publisher = OT?.publishers?.find()
        // @ts-ignore
        return publisher?.session?.id
    }

    getUserId(): string {
        // @ts-ignore
        const publisher = OT?.publishers?.find()
        const userId = publisher?.stream?.name || publisher?.streamId
        return userId
    }
}

const tokBoxIntegration = new TokBox()
// @ts-ignore
tokBoxIntegration.initialize()
export default tokBoxIntegration
