var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import notificationComponent from "../../component/notification/notificationComponent.js";
import dom from "../dom.js";
function retrieveNotifs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/notifications", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const pastNotifs = yield response.json();
                window.app.state.notificationCount = pastNotifs.length;
                window.dispatchEvent(new Event("notif-badge-update"));
                //test
                console.log("retrived unread notifications");
                console.log("pastNotifs: ", pastNotifs);
                //
                window.app.notifications = [];
                window.app.notifications.push(...pastNotifs);
            }
        }
        catch (err) {
            console.error("Failed to load notifications");
        }
    });
}
function renderNotifs() {
    const notificationElement = notificationComponent(window.app.notifications);
    const sidebarNotificationContent = document.querySelector('[data-id="sidebar-notification-content"]');
    if (sidebarNotificationContent) {
        sidebarNotificationContent.innerHTML = "";
        //test
        console.log("ready to mount notification component");
        if (window.app.notifications.length === 0) {
            console.log("no past notifs to render");
            sidebarNotificationContent.innerHTML = `<h2 class="italic font-bold font-headline text-secondaryText">No new notifications 🎉</h2>`;
            return;
        }
        // i need to add this element <h2> with no notification to display to sidebar notification content
        dom.mount(sidebarNotificationContent, notificationElement);
    }
}
function handleNotificationEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        //test
        const packet = event.detail;
        console.log("Notification received: ", packet);
        //
        //update notification num badge
        //test
        console.log("notification received, ready to update notificationCount...");
        //
        //window.app.state.notificationCount++;
        try {
            const response = yield fetch("/api/notifications", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const currentNotifs = yield response.json();
                window.app.notifications = [];
                window.app.notifications.push(...currentNotifs);
                renderNotifs();
                window.app.state.notificationCount = currentNotifs.length;
                //test
                console.log("current notifs number: ", window.app.state.notificationCount);
                //
                window.dispatchEvent(new Event("notif-badge-update"));
            }
        }
        catch (err) {
            console.error("Failed to get current notifications");
        }
    });
}
function updateNotifBadge() {
    var _a, _b;
    const notificationBadge = document.querySelector('[data-id="notification-badge"]');
    if (!notificationBadge) {
        //console.warn("Notification badge element not found in DOM");
        return;
    }
    const count = ((_b = (_a = window.app) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.notificationCount) || 0;
    if (count !== 0) {
        notificationBadge.textContent = String(count);
        notificationBadge.classList.remove("hidden");
    }
    else {
        notificationBadge.classList.add("hidden");
    }
}
function updateNotifStack(notifId) {
    const index = window.app.notifications.findIndex((notif) => notif.notifId === notifId);
    if (index !== -1)
        window.app.notifications.splice(index, 1);
}
export { retrieveNotifs, handleNotificationEvent, updateNotifBadge, updateNotifStack, renderNotifs, };
