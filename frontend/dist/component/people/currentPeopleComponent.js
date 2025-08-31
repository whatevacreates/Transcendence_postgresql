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
import blockedUsersComponent from '../chat/blockedUsersComponent.js';
import renderUsers from '../../shared/util/renderConnectionsList.js';
// =============================================================================
// Component
// =============================================================================
function currentPeopleComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const container = dom.create(`
        <div class="max-w-md mx-auto p-4 space-y-4">
            <div class="flex justify-end items-center">
                <button data-id="blocked-users" class="text-[0.9rem] text-redColour hover:underline">Blocked Users</button>
            </div>
            <h2 class="text-[1.1rem] text-secondaryText font-headline font-bold">Manage Connections</h2>
                

            <div data-id="people-list" class="space-y-2"></div>
        </div>
    `);
        // =============================================================================
        // Query Selectors
        // =============================================================================
        const peopleList = container.querySelector('[data-id="people-list"]');
        const startNewPeopleButton = container.querySelector('[data-id="start-new-people"]');
        const blockedButton = container.querySelector('[data-id="blocked-users"]');
        // =============================================================================
        // Unread message logic
        // =============================================================================
        const showRowUnread = (row, count) => {
            const badge = row.querySelector(".chat-row-badge");
            if (count <= 0) {
                // Hide if nothing unread
                row.classList.remove("bg-red-100");
                badge.classList.add("hidden");
                return;
            }
            row.classList.add("bg-red-100");
            badge.textContent = String(count);
            badge.classList.remove("hidden");
        };
        const clearRowUnread = (row) => {
            row.classList.remove("bg-red-100");
            const badge = row.querySelector(".people-row-badge");
            badge.classList.add("hidden");
        };
        const unreadListener = (ev) => {
            const { partnerId, unread } = ev.detail;
            const row = peopleList.querySelector(`[data-id="${partnerId}"]`);
            if (!row)
                return;
            unread > 0 ? showRowUnread(row, unread) : clearRowUnread(row);
        };
        // =============================================================================
        // Event Listeners
        // =============================================================================
        window.addEventListener("unread-update", unreadListener);
        blockedButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const blockedView = yield blockedUsersComponent(`Back to people list`);
            dom.navigateTo(blockedView, "sidebar-people-content");
        }));
        /*startNewChatButton.addEventListener("click", async () => {
            const newChat = await newChatComponent();
            dom.navigateTo(newChat, "sidebar-chat-content");
        });*/
        // =============================================================================
        // Render Users: 
        // =============================================================================
        try {
            yield renderUsers(peopleList, { onlyChatPartners: true });
        }
        catch (err) {
            console.error("Failed to render people user list:", err);
            peopleList.appendChild(dom.create(`<li class="text-error">Failed to load conversations.</li>`));
        }
        try {
            for (const userId in (_c = (_b = (_a = window.app) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.unreadByUser) !== null && _c !== void 0 ? _c : {}) {
                const row = peopleList.querySelector(`[data-id="${userId}"]`);
                if (row)
                    showRowUnread(row, window.app.state.unreadByUser[userId]);
            }
        }
        catch (err) {
            console.warn("Unread badge rendering failed:", err);
        }
        yield renderUsers(peopleList, { excludeChatPartners: false });
        return container;
    });
}
export default currentPeopleComponent;
