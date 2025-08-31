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
import avatarComponent from './avatarComponent.js';
import api from '../../shared/api/api.js';
import matchHistoryComponent from './matchHistoryComponent.js';
// =============================================================================
// Component:
// =============================================================================
function profileComponent(user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("rendering profile Component");
        yield api.getCurrentUser();
        const stats = yield api.fetchUserStats(user.id);
        const container = dom.create(`
    <div class="flex  flex-col md:flex-row items-center gap-8 p-6 w-full max-w-4xl mx-auto text-gray-100" data-id="profile-container">
  <!-- User Info -->
  <div class="flex flex-col gap-4 w-full items-center text-center" data-id="info-container">
    <div class="flex justify-center" data-id="avatar-container"></div>

    <div class="text-[1.3rem] font-headline font-bold text-lightText tracking-tight" data-id="username"></div>

    <!-- Centered stats block -->
    <div class="flex flex-col gap-3 font-headline font-bold text-[1.1rem] text-lightText mt-4 w-full max-w-sm mx-auto">
      <div class="flex justify-between  border-b border-secondary pb-2" data-id="matches-played">
        <span>Matches Played</span>
        <span class="text-lightText" data-id="value-matches-played">0</span>
      </div>
      <div class="flex justify-between border-b border-secondary pb-2" data-id="matches-won">
        <span>Matches Won</span>
        <span class="text-greenColour" data-id="value-matches-won">0</span>
      </div>
      <div class="flex justify-between border-b border-secondary pb-2" data-id="matches-lost">
        <span>Matches Lost/Forfeited</span>
        <span class="text-redColour" data-id="value-matches-lost">0</span>
      </div>
      <div class="flex justify-between border-b border-secondary pb-2" data-id="win-rate">
        <span>Win Rate</span>
        <span class="text-green-300" data-id="value-win-rate">0%</span>
      </div>
      <div class="flex justify-between border-b border-secondary pb-2" data-id="lose-rate">
        <span>Lose Rate</span>
        <span class="text-red-300" data-id="value-lose-rate">0%</span>
      </div>
    </div>

    <!-- Keep history full-width -->
    <div class="mt-6 w-full" data-id="match-history-section"></div>
  </div>
</div>

`);
        //Inject Avatar
        const avatar = avatarComponent(user);
        const avatarContainer = container.querySelector('[data-id="avatar-container"]');
        dom.mount(avatarContainer, avatar);
        // =============================================================================
        // Query Selectors: 
        // =============================================================================
        const usernameElement = container.querySelector('[data-id="username"]');
        const matchesPlayedElement = container.querySelector('[data-id="value-matches-played"]');
        const matchesWonElement = container.querySelector('[data-id="value-matches-won"]');
        const matchesLostElement = container.querySelector('[data-id="value-matches-lost"]');
        const winRateElement = container.querySelector('[data-id="value-win-rate"]');
        const loseRateElement = container.querySelector('[data-id="value-lose-rate"]');
        const matchHistory = yield matchHistoryComponent(user.id);
        const matchHistoryContainer = container.querySelector('[data-id="match-history-section"]');
        dom.mount(matchHistoryContainer, matchHistory);
        if (usernameElement) {
            usernameElement.textContent = user.username;
        }
        if (matchesPlayedElement) {
            matchesPlayedElement.textContent = `${stats.matchesPlayed}`;
        }
        if (matchesWonElement) {
            matchesWonElement.textContent = `${stats.matchesWon}`;
        }
        if (matchesLostElement) {
            matchesLostElement.textContent = `${stats.matchesLost}`;
        }
        if (winRateElement) {
            winRateElement.textContent = `${stats.winRate.toFixed(1)}%`;
        }
        if (loseRateElement) {
            loseRateElement.textContent = `${stats.loseRate.toFixed(1)}%`;
        }
        return container;
    });
}
export default profileComponent;
