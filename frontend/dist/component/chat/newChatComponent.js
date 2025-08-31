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
import blockedUsersComponent from "./blockedUsersComponent.js";
import currentChatsComponent from "./currentChatsComponent.js";
import renderUsers from "../../shared/util/renderUserList.js";
// =============================================================================
// Component
// =============================================================================
function newChatComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = dom.create(`
    <div class="max-w-md mx-auto p-4 space-y-4">
      <div class="flex justify-between items-center">
        <button data-id="back-button" class="text-accentColour font-bold font-headline hover:underline text-[0.9rem]">← Back to current chats</button>
        <button data-id="blocked-users" class="text-redColour text-[0.9rem] hover:underline">Blocked Users</button>
      </div>
      
      <div class="flex items-center space-x-2">
        <h2 class="text-xl text-primary font-semibold">Start a New Chat</h2>
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
            const backView = yield currentChatsComponent();
            dom.navigateTo(backView, "sidebar-chat-content");
        }));
        blockedButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const blockedView = yield blockedUsersComponent(`Back to chats`);
            dom.navigateTo(blockedView, "sidebar-chat-content");
        }));
        yield renderUsers(userList, { excludeChatPartners: true });
        return container;
    });
}
export default newChatComponent;
