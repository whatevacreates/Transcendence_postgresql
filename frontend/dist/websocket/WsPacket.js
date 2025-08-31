export class WsPacket {
}
// =============================================================================
// Chat
// =============================================================================
export class ChatPacket extends WsPacket {
    constructor(type, data) {
        super();
        this.type = type;
        this.data = data;
        this.domain = "chat";
    }
}
export const MatchPackets = {
    // --- Frontend to Backend ---
    start: (matchType, userId) => ({
        type: "init-and-start-match",
        domain: "game",
        data: { matchType, userId }
    }),
    control: (matchId, userId, control, paddleIndex) => ({
        type: "control-match",
        domain: "game",
        data: Object.assign({ matchId, userId, control }, (paddleIndex !== undefined && { paddleIndex }))
    }),
    rejoin: (userId) => ({
        type: "match-rejoin",
        domain: "game",
        data: { userId }
    }),
    // --- Backend to Frontend ---
    init: (matchId, userIdA, userIdB) => ({
        type: "match-init",
        domain: "game",
        data: { matchId, userIdA, userIdB }
    }),
    countdown: (count) => ({
        type: "match-countdown",
        domain: "game",
        data: count
    }),
    update: (game, ball, paddles) => ({
        type: "match-update",
        domain: "game",
        data: { game, ball, paddles }
    }),
    over: (matchId, winnerId, loserId) => ({
        type: "match-over",
        domain: "game",
        data: { matchId, winnerId, loserId }
    }),
    tournament: (userIds, score) => ({
        type: "tournament-update",
        domain: "game",
        data: { userIds, score }
    }),
    alias: (userId, alias) => ({
        type: "tournament-alias",
        domain: "game",
        data: { userId, alias }
    })
};
// =============================================================================
// Invitation
// =============================================================================
//@changed added invitation packet, we need the opponentId which we dont need later on
export class InvitationPacket extends WsPacket {
    constructor(type, data) {
        super();
        this.type = type;
        this.data = data;
        this.domain = "game";
    }
}
// =============================================================================
// Notification
// =============================================================================
export class NotificationPacket extends WsPacket {
    constructor(type, data) {
        super();
        this.type = type;
        this.data = data;
        this.domain = "notification";
    }
}
