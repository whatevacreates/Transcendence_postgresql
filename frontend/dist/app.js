var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import router from "./router.js";
import api from "./shared/api/api.js";
import websocketManager from "./websocket/WebsocketManager.js";
import { updateNotifBadge, handleNotificationEvent, retrieveNotifs } from "./shared/util/notifTool.js";
let state = {
    user: null,
    unreadMessageCount: 0,
    notificationCount: 0,
    unreadByUser: {},
    activeChatPartnerId: null,
};
const notifications = [];
window.app = window.app || {};
window.app.router = router;
window.app.state = state;
window.app.notifications = notifications;
window.app.chatListenerAdded = false;
window.app.selector = {
    title1: document.querySelector("title"),
    title2: document.querySelector('[data-id="title"]'),
    navbar: document.querySelector('[data-id="navbar"]'),
    view: document.querySelector('[data-id="view"]'),
    sidebarNotification: document.querySelector('[data-id="sidebar-notification"]'),
    sidebarChat: document.querySelector('[data-id="sidebar-chat"]'),
    sidebarPeople: document.querySelector('[data-id="sidebar-people"]')
};
window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield api.getCurrentUser();
    if (window.app.state.user) {
        websocketManager.connect();
        yield retrieveNotifs();
    }
    //retrieve pending notifications from backend and listen for new notifications
    // prevent loading /login if user already logged in
    // if (window.app.state.user && location.pathname === "/login") {
    //   history.replaceState({}, "", "/");
    // }
    // --- set notification-related listeners once at entry point  ---
    window.addEventListener("notif-badge-update", (event) => {
        updateNotifBadge();
    });
    window.addEventListener("notification", handleNotificationEvent);
    router.init();
}));
