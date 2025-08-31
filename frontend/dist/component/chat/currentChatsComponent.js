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
import newChatComponent from './newChatComponent.js';
import blockedUsersComponent from './blockedUsersComponent.js';
import renderUsers from '../../shared/util/renderUserList.js';
// =============================================================================
// Component
// =============================================================================
function currentChatsComponent() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const container = dom.create(`
        <div class="max-w-md mx-auto p-4 space-y-4">
            <div class="flex justify-end items-center">
                <button data-id="blocked-users" class="text-[0.9rem] text-redColour hover:underline">Blocked Users</button>
            </div>
            <h2 class="text-[1.1rem] text-secondaryText font-headline font-bold">Your Conversations</h2>
                <ul data-id="chat-list" class="space-y-2">
                <!-- Chat items will be injected here -->
                </ul>
            <button 
            type="submit" 
            class="animationBtn border-8 border-secondary flex w-full justify-center rounded-full bg-transparent font-headline px-3 py-3 font-bold text-sm/6 text-lightText focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span class="fill-bg"></span>
            <span class="button-content">Start New Chat</span>
          </button>
        </div>
    `);
        // =============================================================================
        // Query Selectors
        // =============================================================================
        const chatList = container.querySelector('[data-id="chat-list"]');
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
            const badge = row.querySelector(".chat-row-badge");
            badge.classList.add("hidden");
        };
        const unreadListener = (ev) => {
            const { partnerId, unread } = ev.detail;
            const row = chatList.querySelector(`[data-id="${partnerId}"]`);
            if (!row)
                return;
            unread > 0 ? showRowUnread(row, unread) : clearRowUnread(row);
        };
        // =============================================================================
        // Event Listeners
        // =============================================================================
        window.addEventListener("unread-update", unreadListener);
        blockedButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const blockedView = yield blockedUsersComponent(`Back to chats`);
            dom.navigateTo(blockedView, "sidebar-chat-content");
        }));
        container.querySelectorAll('.animationBtn').forEach(btn => {
            btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                btn.classList.add('clicked');
                const newChat = yield newChatComponent();
                dom.navigateTo(newChat, "sidebar-chat-content");
            }));
        });
        // =============================================================================
        // Render Users: 
        // =============================================================================
        try {
            yield renderUsers(chatList, { onlyChatPartners: true });
        }
        catch (err) {
            console.error("Failed to render chat user list:", err);
            chatList.appendChild(dom.create(`<li class="text-error">Failed to load conversations.</li>`));
        }
        try {
            for (const userId in (_c = (_b = (_a = window.app) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.unreadByUser) !== null && _c !== void 0 ? _c : {}) {
                const row = chatList.querySelector(`[data-id="${userId}"]`);
                if (row)
                    showRowUnread(row, window.app.state.unreadByUser[userId]);
            }
        }
        catch (err) {
            console.warn("Unread badge rendering failed:", err);
        }
        return container;
    });
}
export default currentChatsComponent;
