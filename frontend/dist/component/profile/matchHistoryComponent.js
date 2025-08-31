var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dom from '../../shared/dom.js';
import api from '../../shared/api/api.js';
// =============================================================================
// Component: 
// =============================================================================
function matchHistoryComponent(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchHistory = yield api.fetchMatchHistory(userId);
        const container = dom.create(`
        <div class="mt-6 w-full">
            <div class="text-lightText pb-2 font-headline text-[1.3rem] font-bold mb-2">Match History</div>
            <div data-id="match-history" class="flex flex-col gap-2">
                <!-- Matches will be injected here -->
            </div>
        </div>
    `);
        // =============================================================================
        // Query Selectors: 
        // =============================================================================
        const historyContainer = container.querySelector('[data-id="match-history"]');
        // =============================================================================
        // Data Validation & Logic
        // =============================================================================
        const validMatches = matchHistory.filter((match) => !!match &&
            !!match.userIdA &&
            !!match.userIdB &&
            !!match.userAUsername &&
            !!match.userBUsername);
        if (validMatches.length === 0) {
            historyContainer.appendChild(dom.create(`<div class="text-sm text-warning">No matches played yet.</div>`));
        }
        else {
            validMatches.forEach((match) => {
                if (!match || !match.userIdA || !match.userIdB || !match.userAUsername || !match.userBUsername) {
                    console.warn('Skipping invalid match entry:', match);
                    return;
                }
                const isWinner = match.winnerId === userId;
                const opponentName = match.userIdA === userId ? match.userBUsername : match.userAUsername;
                const datePlayed = new Date(Math.floor(match.timestamp)).toLocaleDateString();
                const matchEntry = dom.create(`
                <div class="py-2 px-4 rounded-lg flex justify-between items ${isWinner ? 'bg-greenColour' : 'bg-redColour'}">
                    <div class="text-left">
                        <div class="font-headline font-bold text-darkerBackground text-[1.3rem]">${isWinner ? 'Won' : 'Lost'} vs ${opponentName}</div>
                        <div class="font-headline font-bold text-[1.1rem] text-darkerBackground">${datePlayed}</div>
                    </div>
                    <div class="text-[1.3rem] font-headline font-bold text-darkerBackground">${match.scoreA} - ${match.scoreB}</div>
                </div>
            `);
                historyContainer.appendChild(matchEntry);
            });
        }
        return container;
    });
}
export default matchHistoryComponent;
