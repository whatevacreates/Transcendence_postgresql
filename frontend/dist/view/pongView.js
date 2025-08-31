var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dom from "../shared/dom.js";
import api from "../shared/api/api.js";
import validate from "../shared/util/validate.js";
// --- Websocket ---
import websocketManager from "../websocket/WebsocketManager.js";
import { MatchPackets } from "../websocket/WsPacket.js";
// --- Components ---
import pongComponent from "../component/pong/pongComponent.js";
import scoreboardComponent from "../component/pong/scoreboardComponent.js";
import tournamentComponent from "../component/pong/tournamentComponent.js";
// --- Generate random funny aliases ---
const generateRandomAlias = () => {
    const adjectives = ["Silly", "Fast", "Slow", "Crazy", "Epic", "Lazy", "Fierce", "Sneaky", "Blind"];
    const nouns = ["Panda", "Ninja", "Coder", "Wizard", "Banana", "Potato", "Cat", "Pirate", "Turtle"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
};
function PongView() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const pongView = dom.create(`
    <main data-page="pong" class="w-full w-6lg text-black">
      <div data-id="pong-area" class="justify-items-center">
        <div data-id="pong-scoreboard" class="w-full"><!-- Scoreboard --></div>
        <div data-id="pong-tournament-scoreboard"><!-- Tournament scoreboard --></div>
        <div class="flex justify-center gap-6 mb-8 mt-6">
  <button data-id="pong-start-ai"
    class="text-[1.1rem] animationBtn border-4 border-secondary inline-flex justify-center items-center rounded-full bg-transparent font-headline px-3 py-3 font-bold text-lightText min-w-[300px]">
    <span class="fill-bg"></span>
    <span class="button-content">Play vs AI</span>
  </button>

  <button data-id="pong-start-local"
    class="text-[1.1rem] animationBtn border-4 border-secondary inline-flex justify-center items-center rounded-full bg-transparent font-headline px-3 py-3 font-bold text-lightText min-w-[300px]">
    <span class="fill-bg"></span>
    <span class="button-content">Play vs Local</span>
  </button>
</div>

        <div data-id="pong-game"><!-- Pong --></div>

      </div>
    </main>
  `);
        const selectors = {
            pongScoreboard: pongView.querySelector('[data-id="pong-scoreboard"]'),
            pongTournamentScoreboard: pongView.querySelector('[data-id="pong-tournament-scoreboard"]'),
            pongGame: pongView.querySelector('[data-id="pong-game"]'),
            pongStartAi: pongView.querySelector('[data-id="pong-start-ai"]'),
            pongStartLocal: pongView.querySelector('[data-id="pong-start-local"]'),
        };
        let pongController = null;
        let scoreboardController = null;
        let tournamentController = null;
        let keyDownCleanup = null;
        let keyUpCleanup = null;
        let config = null;
        let gameState = null;
        let matchId = null;
        let playerId = (_c = (_b = (_a = window.app) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.id;
        let currentMatchType = null;
        let matchOverHandled = false;
        // Alias input state
        let aliasInputActive = false;
        let aliasInputTimeout = null;
        // Temp memory of last packets for missed-mount replay
        let lastMatchInitPacket = null;
        let lastTournamentUpdatePacket = null;
        // Store last tournament data for re-rendering
        let lastTournamentData = null;
        // Add these variables at the top of PongView
        let aliasGenerated = false;
        let randomAlias = null;
        // --- Fetch config from backend ---
        try {
            const res = yield fetch("/api/match/config");
            config = yield res.json();
        }
        catch (err) {
            console.error("Failed to load Pong config:", err);
        }
        // --- Rejoin ---
        if (playerId) {
            websocketManager.send(MatchPackets.rejoin(playerId));
        }
        const fetchPlayerDetails = (userId, matchType) => __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                return "You are playing againts ai";
            try {
                const username = yield api.fetchUsername(userId);
                if (matchType === "tournament") {
                    const alias = yield api.fetchAlias(userId);
                    return alias ? `${username} (${alias})` : username;
                }
                return username;
            }
            catch (err) {
                console.error(`Failed to fetch player details for user ${userId}:`, err);
                return "Unknown";
            }
        });
        const sendMove = (direction, paddleIndex) => {
            if (!matchId || playerId == null || aliasInputActive)
                return;
            const action = direction === "up"
                ? "move-paddle-up"
                : direction === "down"
                    ? "move-paddle-down"
                    : "move-paddle-stop";
            websocketManager.send(MatchPackets.control(matchId, playerId, action, paddleIndex));
        };
        const handleKeyDown = (e) => {
            // Prevent arrow keys from scrolling the page
            if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(e.key)) {
                e.preventDefault();
            }
            // If alias input is active, focus the input
            if (aliasInputActive && e.key !== "Escape") {
                const input = document.querySelector('[data-id="alias-input"]');
                if (input) {
                    input.focus();
                    return;
                }
            }
            // Handle game controls
            switch (e.key) {
                case "ArrowUp":
                    sendMove("up", currentMatchType === "local" ? 1 : undefined);
                    break;
                case "ArrowDown":
                    sendMove("down", currentMatchType === "local" ? 1 : undefined);
                    break;
                case "w":
                case "W":
                    sendMove("up");
                    break;
                case "s":
                case "S":
                    sendMove("down");
                    break;
            }
        };
        const handleKeyUp = (e) => {
            switch (e.key) {
                case "ArrowUp":
                case "ArrowDown":
                case "w":
                case "W":
                case "s":
                case "S":
                    sendMove("stop");
                    break;
            }
        };
        dom.registerEvent(selectors.pongStartAi, "click", () => {
            if (!playerId)
                return alert("Missing player ID");
            selectors.pongStartAi.classList.add('hidden');
            selectors.pongStartLocal.classList.add('hidden');
            websocketManager.send(MatchPackets.start("ai", playerId));
        });
        dom.registerEvent(selectors.pongStartLocal, "click", () => {
            if (!playerId)
                return alert("Missing player ID");
            selectors.pongStartAi.classList.add('hidden');
            selectors.pongStartLocal.classList.add('hidden');
            websocketManager.send(MatchPackets.start("local", playerId));
        });
        const matchPacketHandlers = {
            "match-init": (data) => __awaiter(this, void 0, void 0, function* () {
                selectors.pongStartAi.classList.add('hidden');
                selectors.pongStartLocal.classList.add('hidden');
                lastMatchInitPacket = { type: "match-init", data };
                matchId = data.matchId;
                currentMatchType = data.matchType;
                matchOverHandled = false;
                keyDownCleanup === null || keyDownCleanup === void 0 ? void 0 : keyDownCleanup();
                keyUpCleanup === null || keyUpCleanup === void 0 ? void 0 : keyUpCleanup();
                try {
                    const [userA, userB] = yield Promise.all([
                        fetchPlayerDetails(data.userIdA, data.matchType),
                        fetchPlayerDetails(data.userIdB, data.matchType),
                    ]);
                    scoreboardController = scoreboardComponent(data.userIdA, data.userIdB, userA, userB, 0, 0);
                    dom.mount(selectors.pongScoreboard, scoreboardController.element);
                }
                catch (err) {
                    console.error("Failed to init scoreboard:", err);
                }
                keyDownCleanup = dom.registerEvent(document, "keydown", handleKeyDown);
                keyUpCleanup = dom.registerEvent(document, "keyup", handleKeyUp);
            }),
            "match-redirect": (data) => {
                return;
            },
            "match-countdown": (data) => {
                if (!pongController)
                    return;
                pongController.drawOverlayText(String(data));
                if (data === 0) {
                    setTimeout(() => {
                        pongController === null || pongController === void 0 ? void 0 : pongController.clearOverlayText();
                    }, 1000);
                }
            },
            "match-update": (data) => {
                var _a, _b, _c, _d;
                gameState = data.game;
                if (scoreboardController) {
                    scoreboardController.update({
                        scoreA: (_b = (_a = gameState.scores) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0,
                        scoreB: (_d = (_c = gameState.scores) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 0
                    });
                }
                pongController === null || pongController === void 0 ? void 0 : pongController.update({
                    ball: data.ball,
                    paddles: data.paddles
                });
            },
            "match-over": (data) => __awaiter(this, void 0, void 0, function* () {
                matchId = null;
                keyDownCleanup === null || keyDownCleanup === void 0 ? void 0 : keyDownCleanup();
                keyUpCleanup === null || keyUpCleanup === void 0 ? void 0 : keyUpCleanup();
                keyDownCleanup = keyUpCleanup = null;
                selectors.pongStartLocal.classList.remove('hidden');
                selectors.pongStartAi.classList.remove('hidden');
                if (!matchOverHandled) {
                    matchOverHandled = true;
                    const winner = yield fetchPlayerDetails(data.winnerId, currentMatchType);
                    alert(`The winner is *${winner}*!`);
                }
            }),
            "tournament-update": (data) => __awaiter(this, void 0, void 0, function* () {
                lastTournamentData = data; // Store for re-rendering
                const transformMatch = (match) => __awaiter(this, void 0, void 0, function* () {
                    const [p1, p2] = yield Promise.all([
                        fetchPlayerDetails(match.players[0], "tournament"),
                        fetchPlayerDetails(match.players[1], "tournament")
                    ]);
                    return { players: [p1, p2], scores: match.scores };
                });
                try {
                    const semiFinals = yield Promise.all(data.semiFinals.map(transformMatch));
                    const final = data.final ? yield transformMatch(data.final) : null;
                    const tournamentData = { semiFinals, final };
                    // Always re-render tournament component
                    tournamentController = tournamentComponent(tournamentData);
                    dom.mount(selectors.pongTournamentScoreboard, tournamentController.element);
                }
                catch (err) {
                    console.error("Error processing tournament data:", err);
                }
            }),
            // Then modify the tournament-alias handler
            "tournament-alias": () => __awaiter(this, void 0, void 0, function* () {
                if (!playerId || aliasGenerated)
                    return; // Prevent re-generation
                // Clear any existing timeout
                if (aliasInputTimeout) {
                    clearTimeout(aliasInputTimeout);
                    aliasInputTimeout = null;
                }
                // Generate alias only once
                if (!randomAlias) {
                    randomAlias = generateRandomAlias();
                }
                aliasGenerated = true;
                aliasInputActive = true;
                // Show input on canvas
                pongController === null || pongController === void 0 ? void 0 : pongController.showAliasInput(randomAlias, (alias) => {
                    aliasInputActive = false;
                    const result = validate.validateAlias(alias);
                    if (result.valid) {
                        websocketManager.send(MatchPackets.alias(playerId, alias));
                    }
                    else {
                        console.warn(`Alias validation failed: ${result.error}`);
                        websocketManager.send(MatchPackets.alias(playerId, randomAlias));
                    }
                }, 10 // 10 second timeout
                );
            })
        };
        dom.registerEvent(window, "game", (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                const packet = event.detail;
                if (packet.type in matchPacketHandlers) {
                    const handler = matchPacketHandlers[packet.type];
                    yield handler(packet.data);
                }
                else {
                    console.warn(`Unknown packet type received: ${packet.type}`);
                }
            }
            catch (err) {
                console.error("Error handling match packet:", err);
            }
        }));
        pongController = pongComponent({
            width: window.innerWidth,
            height: window.innerWidth * (9 / 16),
            config
        });
        dom.mount(selectors.pongGame, pongController.element);
        // Render tournament component if data exists
        if (lastTournamentData) {
            yield matchPacketHandlers["tournament-update"](lastTournamentData);
        }
        return pongView;
    });
}
export default PongView;
