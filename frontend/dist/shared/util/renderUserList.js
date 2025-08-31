var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import avatarComponent from "../../component/profile/avatarComponent.js";
import chatComponent from "../../component/chat/chatComponent.js";
import api from "../api/api.js";
import dom from "../dom.js";
function renderUsers(container, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        //test
        console.log("renderUsers...");
        //
        container.innerHTML = "";
        try {
            const currentUserId = (_c = (_b = (_a = window.app) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.id;
            const [allUsers, onlineUserIds, friends, chatPartners, sentInvitations,] = yield Promise.all([
                api.fetchUsers(),
                api.fetchOnlineUsers(),
                api.fetchFriends(),
                api.fetchChatPartners(),
                api.fetchSentInvitations(),
            ]);
            console.log("fetched all user data");
            const allBlockedUsers = yield api.fetchAllBlockedUsers();
            const blockedIds = new Set(allBlockedUsers.map((user) => user.id));
            const friendIds = new Set(friends.map((user) => user.id));
            const pendingIds = new Set();
            for (const inv of sentInvitations) {
                if (inv.type === "friendship") {
                    inv.recipientIds.forEach((id) => pendingIds.add(id));
                }
            }
            const onlineSet = new Set(onlineUserIds);
            const chatPartnerIds = new Set(chatPartners.map((user) => user.id));
            const visibleUsers = allUsers.filter((user) => {
                if (user.id === currentUserId)
                    return false;
                if (blockedIds.has(user.id))
                    return false;
                if ((options === null || options === void 0 ? void 0 : options.excludeChatPartners) && chatPartnerIds.has(user.id)) {
                    return false;
                }
                if ((options === null || options === void 0 ? void 0 : options.onlyChatPartners) && !chatPartnerIds.has(user.id)) {
                    return false;
                }
                return true;
            });
            for (const user of visibleUsers) {
                const isOnline = onlineSet.has(user.id);
                const isFriend = friendIds.has(user.id);
                const isPending = pendingIds.has(user.id);
                const avatar = avatarComponent(user, 64, {
                    clickable: true,
                    online: isOnline,
                    isFriend,
                });
                const item = dom.create(`
        <li class="flex justify-between items-center p-4 border border-accentColour border-[0.2rem] rounded-2xl hover:bg-secondary" data-id="${user.id}">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-3 relative" data-id="avatar-container">
           
          </div>
          <span class="chat-row-badge hidden absolute -top-2 -right-2 text-white text-[1rem] font-bold px-2 py-0.5 rounded-full">0</span> 
          <span class="text-lightText  font-headline group-hover:text-darkerBackground font-bold">${user.username}</span>
          </div>
          <div class="flex items-center gap-2 relative">
          <button class="text-white pr-2 hover:text-gray-200" title="Start chat" data-action="chat-${user.id}">
            
            
            
            <svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 35.62 27.27"
     width="40" height="40"
     fill="none"
     stroke="currentColor" stroke-width="3" stroke-miterlimit="10"
     aria-hidden="true" role="img">
  <path d="M34.12,11.85v-.19c0-5.61-4.55-10.16-10.16-10.16h-12.3C6.05,1.5,1.5,6.05,1.5,11.66h0c0,5.61,4.55,10.16,10.16,10.16h12.16s.06,0,.09.02l7.14,3.9c.14.08.31-.04.29-.2l-.86-5.88c0-.06.02-.13.07-.17,2.18-1.83,3.57-4.57,3.57-7.64h0Z"/>
</svg>
            
            </button>
           <!-- <button class="text-white hover:text-gray-300 px-2 py-1" data-id="options-btn-${user.id}">⋮</button> -->
            <div class="hidden absolute right-0 mt-8 w-48 bg-white border border-gray-300 rounded shadow-lg z-10" data-id="menu-${user.id}">
              <button class="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100" data-action="match-${user.id}">Invite to Match</button>
              <button class="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100" data-action="friend-${user.id}">${isFriend ? "Remove Friendship" : "Send Friend Request"}</button> 
              <button class="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100" data-action="block-${user.id}">Block user</button>
            </div>
          </div>
        </li>
      `);
                const avatarContainer = item.querySelector('[data-id="avatar-container"]');
                if (avatarContainer)
                    dom.mount(avatarContainer, avatar, false);
                const optionButton = item.querySelector(`[data-id="options-btn-${user.id}"]`);
                const menu = item.querySelector(`[data-id="menu-${user.id}"]`);
                // --- option button and drop-down menu ---
                let menuHideTimeout = undefined;
                optionButton === null || optionButton === void 0 ? void 0 : optionButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (menu === null || menu === void 0 ? void 0 : menu.classList.contains("hidden"))
                        menu.classList.remove("hidden");
                });
                menu === null || menu === void 0 ? void 0 : menu.addEventListener("mouseleave", () => {
                    menuHideTimeout = window.setTimeout(() => {
                        menu === null || menu === void 0 ? void 0 : menu.classList.add("hidden");
                    }, 100);
                });
                menu === null || menu === void 0 ? void 0 : menu.addEventListener("mouseenter", () => {
                    if (menuHideTimeout)
                        clearTimeout(menuHideTimeout);
                });
                (_d = item
                    .querySelector(`[data-action="chat-${user.id}"]`)) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    const chat = yield chatComponent(user);
                    dom.navigateTo(chat, "sidebar-chat-content");
                }));
                (_e = item
                    .querySelector(`[data-action="match-${user.id}"]`)) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    console.log(`Match invite to ${user.username}`);
                    const response = yield fetch("/api/invitations", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            senderId: String((_a = window.app.state.user) === null || _a === void 0 ? void 0 : _a.id),
                            recipientIds: [user.id],
                            type: "match",
                        }),
                    });
                    if (response.ok) {
                        alert("Match invitation sent successfully!");
                    }
                    else {
                        const error = yield response.json();
                        alert(`Failed to send invitation: ${error.message || "Unknown error"}`);
                    }
                }));
                const friendBtn = item.querySelector(`[data-action="friend-${user.id}"]`);
                friendBtn.disabled = isPending;
                if (!isFriend && !isPending) {
                    friendBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                        yield api.requestFriendship([user.id]);
                        friendBtn.textContent = "Friend Request Sent";
                        friendBtn.disabled = true;
                        friendBtn.classList.add("opacity-50", "cursor-not-allowed");
                    }));
                }
                else if (isFriend) {
                    friendBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                        yield api.removeFriendship(user.id);
                        window.dispatchEvent(new Event("friendship-status-updated"));
                    }));
                }
                (_f = item
                    .querySelector(`[data-action="block-${user.id}"]`)) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    if (confirm(`Block ${user.username}?`)) {
                        const success = yield api.blockUser(user.id);
                        if (success)
                            item.remove();
                    }
                }));
                container.appendChild(item);
            }
        }
        catch (err) {
            console.error("Error rendering user list:", err);
            container.appendChild(dom.create(`<li class="text-error">Failed to load users.</li>`));
        }
    });
}
export default renderUsers;
