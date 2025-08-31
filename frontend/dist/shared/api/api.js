var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchWithLog(input, init) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = typeof input === "string" ? input : input.url;
        const method = (init === null || init === void 0 ? void 0 : init.method) || "GET";
        console.log("[FETCH]", method, url);
        const response = yield fetch(input, init);
        if (!response.ok) {
            const status = response.status;
            const logMethod = status >= 400 && status < 600 ? console.warn : console.error;
            // Try to extract error message for clarity
            let message = '';
            try {
                const data = yield response.clone().json();
                message = (data === null || data === void 0 ? void 0 : data.message) || (data === null || data === void 0 ? void 0 : data.error) || '';
            }
            catch (_a) {
                message = response.statusText;
            }
            logMethod(`[FETCH WARNING] ${status} ${method} ${url} - ${message}`);
        }
        return response;
    });
}
// =============================================================================
// User Context:
// =============================================================================
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/user/all-users");
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        return response.json();
    });
}
function fetchOnlineUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/user/online-users", {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch online users");
        }
        return response.json();
    });
}
function register(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.error || "Registration failed");
        }
        return data;
    });
}
function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/user/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.error || data.message || "Login failed");
        }
        return data;
    });
}
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/user/logout", {
            method: "POST",
            credentials: "include",
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.error || "Logout has failed");
        }
        return data;
    });
}
// api.ts
function updateUser(userId, key, newValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog(`/api/user/${userId}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ [key]: newValue }),
        });
        let data;
        try {
            data = yield response.json();
        }
        catch (_a) {
            data = {};
        }
        if (!response.ok) {
            // Don't throw — let caller handle
            return { ok: false, status: response.status, message: data.message || "Update failed" };
        }
        return { ok: true, data };
    });
}
function getCurrentUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog("/api/user/current-user", {
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("Not logged in");
            const user = yield response.json();
            window.app.state.user = user !== null && user !== void 0 ? user : null;
        }
        catch (_a) {
            console.warn("No logged-in user found");
            window.app.state.user = null;
        }
    });
}
function fetchUserStats(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog(`/api/match/stats/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.error || `Failed to get match stats for user ${userId}`);
        }
        return data;
    });
}
function fetchUsername(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog(`/api/user/username/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                console.error(`fetchUsername: Failed to fetch username for ${userId}`);
                return null;
            }
            const data = yield response.json();
            console.log(`fetchUsername: Successfully fetched username for ${userId}: ${data.username}`);
            return data.username;
        }
        catch (error) {
            console.error("fetchUsername: Error fetching username: ", error);
            return null;
        }
    });
}
function fetchAlias(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog(`/api/tournament/alias/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                console.error(`fetchAlias: Failed to fetch alias for ${userId}`);
                return null;
            }
            const data = yield response.json();
            console.log(`fetchAlias: Successfully fetched alias for ${userId}: ${data.alias}`);
            return data.alias;
        }
        catch (error) {
            console.error("fetchAlias: Error fetching alias: ", error);
            return null;
        }
    });
}
function uploadAvatar(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = yield fetchWithLog("/api/user/avatar", {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to upload avatar");
        }
        return data;
    });
}
// =============================================================================
// Chat Context:
// =============================================================================
function fetchChatHistory(recipientId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog(`/api/chat/private-messages/${recipientId}`);
        if (!response.ok) {
            throw new Error("Failed to fetchChatHistory");
        }
        return response.json();
    });
}
function fetchChatPartners() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/chat/conversations", {
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetchChatPartners");
        }
        return response.json();
    });
}
// =============================================================================
// Friendship Context:
// =============================================================================
function requestFriendship(recipientIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/invitations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ recipientIds, type: "friendship" }),
        });
        console.log("sending friendship request, recipient id passed to requestFriendship: ", recipientIds);
        let data;
        try {
            data = yield response.json();
        }
        catch (e) {
            console.error("Error parsing JSON from server:", e);
            throw new Error("Failed to parse server response.");
        }
        if (!response.ok && !data.status) {
            throw new Error(data.message || "Failed to send friend request");
        }
        return data;
    });
}
function removeFriendship(user2Id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/friendship/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ user2Id: user2Id }),
        });
        if (!response.ok) {
            let errorMessage = "Failed to remove friendship";
            try {
                const errorData = yield response.json();
                errorMessage = errorData.message || errorMessage;
            }
            catch (e) {
                console.error("Error parsing error response", e);
            }
            throw new Error(errorMessage);
        }
        const data = yield response.json();
        return data;
    });
}
function acceptInvitation(invitationId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetchWithLog(`/api/invitations/${invitationId}/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ recipientId: String((_a = window.app.state.user) === null || _a === void 0 ? void 0 : _a.id) }),
        });
        if (!response.ok) {
            const errorData = yield response.json();
            throw {
                status: response.status,
                message: errorData.error || "Failed to accept invitation",
            };
        }
        const data = yield response.json();
        return data;
    });
}
function declineInvitation(invitationId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetchWithLog(`/api/invitations/${invitationId}/decline`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ recipientId: String((_a = window.app.state.user) === null || _a === void 0 ? void 0 : _a.id) }),
        });
        if (!response.ok) {
            const errorData = yield response.json();
            throw {
                status: response.status,
                message: errorData.error || "Failed to accept invitation",
            };
        }
        const data = yield response.json();
        return data;
    });
}
function fetchFriends() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/friends", { credentials: "include" });
        if (!response.ok)
            throw new Error("Failed to fetch friends");
        return response.json();
    });
}
function fetchSentInvitations() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog("/api/invitations/user", { credentials: "include" });
        if (!response.ok)
            throw new Error("Failed to fetch invitations");
        return response.json();
    });
}
// =============================================================================
// Match Context:
// =============================================================================
function fetchMatchHistory(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetchWithLog(`/api/match/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.error || `Failed to get match history for user ${userId}`);
        }
        return data;
    });
}
// =============================================================================
// Block Context:
// =============================================================================
function blockUser(blockedId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog(`/api/block/blockUser/${blockedId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                console.error(`Failed to block user ${blockedId}`);
                return false;
            }
            console.log("blocking user ", blockedId);
            return true;
        }
        catch (error) {
            console.error("Failed to block user: ", error);
            return false;
        }
    });
}
function unblockUser(blockedId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog(`/api/block/unblockUser/${blockedId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                console.error(`Failed to unblock user ${blockedId}`);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error("Failed to unblock user: ", error);
            return false;
        }
    });
}
function fetchBlockedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog(`/api/block/fetchBlockedUsers`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                console.error(`Failed to get blocked users: api response not ok`);
                console.log(response);
                return [];
            }
            const data = yield response.json();
            console.log("🚀🚀🚀🚀🚀 fetch blocked usersdata", data);
            return data;
        }
        catch (error) {
            console.error("Failed to get blocked users");
            return [];
        }
    });
}
function fetchAllBlockedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog(`/api/block/fetchAllBlockedUsers`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                console.error(`Failed to get all blocked users: api response not ok`);
                console.log(response);
                return [];
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Failed to get all blocked users");
            return [];
        }
    });
}
function isBlocked(blockedId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithLog(`/api/block/isBlocked/${blockedId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                console.error(`Failed to see if user ${blockedId} is blocked`);
                return false;
            }
            const data = yield response.json();
            return data.isBlocked === true;
        }
        catch (error) {
            console.error("Failed to check if isBlocked: ", error);
            return false;
        }
    });
}
// =============================================================================
// Notification Context:
// =============================================================================
function deleteNotifForMutualInvitation(currentUserId, otherUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/api/notifications/delete/mutual-invitation`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userAId: currentUserId, userBId: otherUserId }),
            });
            if (!response.ok) {
                console.error(`Failed to delete handled-invitation-related notifications`);
                return false;
            }
            //const data = await response.json();
            return true;
        }
        catch (error) {
            console.error("Failed to delete handled-invitation-related notifications ", error);
            return false;
        }
    });
}
function deleteMutualInvitation(currentUserId, otherUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/api/invitations/delete/mutual-invitation`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userAId: currentUserId, userBId: otherUserId }),
            });
            if (!response.ok) {
                console.error(`Failed to delete mutual invitation`);
                return false;
            }
            const data = yield response.json();
        }
        catch (error) {
            console.error("Failed to delete mutual invitation", error);
            return false;
        }
    });
}
function deleteHandledNotif(notifId, currentUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!notifId)
            return;
        try {
            const response = yield fetch(`/api/notifications/delete/handled`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ notifId: notifId, recipientId: currentUserId }),
            });
            if (!response.ok) {
                console.error(`Failed to delete handled notifications`);
                return false;
            }
            //const data = await response.json();
        }
        catch (error) {
            console.error("Failed to delete handled notifications ", error);
            return false;
        }
    });
}
// =============================================================================
// Exports:
// =============================================================================
const api = {
    fetchUsers,
    fetchAlias,
    fetchOnlineUsers,
    register,
    requestFriendship,
    removeFriendship,
    fetchFriends,
    fetchSentInvitations,
    login,
    logout,
    fetchChatHistory,
    fetchChatPartners,
    updateUser,
    getCurrentUser,
    fetchUserStats,
    fetchMatchHistory,
    fetchUsername,
    blockUser,
    unblockUser,
    fetchBlockedUsers,
    fetchAllBlockedUsers,
    isBlocked,
    uploadAvatar,
    acceptInvitation,
    declineInvitation,
    deleteNotifForMutualInvitation,
    deleteMutualInvitation,
    deleteHandledNotif,
};
export default api;
