var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dom from "../../shared/dom.js";
import blockedUsersComponent from "../chat/blockedUsersComponent.js";
import currentPeopleComponent from "./currentPeopleComponent.js";
import renderUsers from "../../shared/util/renderUserList.js";
// =============================================================================
// Component
// =============================================================================
function newPeopleComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = dom.create(`
    <div class="max-w-md mx-auto p-4 space-y-4">
      <div class="flex justify-between items-center">
        <button data-id="back-button" class="text-accent hover:underline text-sm">← Back to current chats</button>
        <button data-id="blocked-users" class="text-sm text-accent hover:underline">Blocked Users</button>
      </div>
      
      <div class="flex items-center space-x-2">
        <h2 class="text-[1rem] text-primary font-semibold">Your friends</h2>
      </div>
      
      <div data-id="user-list" class="space-y-2"></div>
    </div>
    `);
        // =============================================================================
        // Query Selectors
        // =============================================================================
        const userList = container.querySelector('[data-id="user-list"]');
        const backButton = container.querySelector('[data-id="back-button"]');
        const blockedButton = container.querySelector('[data-id="blocked-users"]');
        // =============================================================================
        // Event Listeners
        // =============================================================================
        backButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const backView = yield currentPeopleComponent();
            dom.navigateTo(backView, "sidebar-people-content");
        }));
        blockedButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const blockedView = yield blockedUsersComponent(`Back to people list`);
            dom.navigateTo(blockedView, "sidebar-people-content");
        }));
        yield renderUsers(userList);
        return container;
    });
}
export default newPeopleComponent;
