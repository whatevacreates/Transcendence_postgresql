var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dom from "./shared/dom.js";
import api from "./shared/api/api.js";
import renderUsers from "./shared/util/renderUserList.js";
import { renderNotifs } from "./shared/util/notifTool.js";
// --- Importing components ---
import navbarComponent from "./component/navbarComponent.js";
import sidebarComponent from "./component/sidebarComponent.js";
import currentChatsComponent from "./component/chat/currentChatsComponent.js";
import currentPeopleComponent from "./component/people/currentPeopleComponent.js";
// --- Importing views ---
import loginView from "./view/loginView.js";
import registerView from "./view/registerView.js";
import rankingView from "./view/rankingView.js";
import invitationView from "./view/invitationView.js";
import pongView from "./view/pongView.js";
import profileView from "./view/profileView.js";
import settingsView from "./view/settingsView.js";
// --- Routes ---
const routes = [
    { title: "Pong", uri: "/", view: pongView, protected: true },
    { title: "Login", uri: "/login", view: loginView, protected: false },
    { title: "Register", uri: "/register", view: registerView, protected: false },
    { title: "Ranking", uri: "/ranking", view: rankingView, protected: true },
    {
        title: "Start a Match",
        uri: "/invitation",
        view: invitationView,
        protected: true,
    },
    { title: "Profile", uri: "/profile", view: profileView, protected: true },
    { title: "Settings", uri: "/settings", view: settingsView, protected: true },
];
const Router = {
    currentRoute: window.location.pathname, // Track current route
    init: () => {
        // websocketManager.connect();
        window.addEventListener("ws:redirect", (event) => {
            Router.go("/");
        });
        // Improved link handling
        document.addEventListener("click", (event) => {
            const target = event.target;
            const anchor = target.closest("a");
            if (anchor) {
                event.preventDefault();
                const href = anchor.getAttribute("href");
                if (href)
                    Router.go(href);
            }
        });
        // Enhanced popstate handling
        window.addEventListener("popstate", (event) => {
            var _a;
            if ((_a = event.state) === null || _a === void 0 ? void 0 : _a.route) {
                Router.go(event.state.route, false);
            }
            else {
                Router.go(location.pathname, false);
            }
        });
        // Initialize with proper state
        history.replaceState({ route: location.pathname }, "", location.pathname);
        Router.go(location.pathname, false);
    },
    go: (route_1, ...args_1) => __awaiter(void 0, [route_1, ...args_1], void 0, function* (route, addToHistory = true) {
        var _a, _b;
        dom.cleanupEvents();
        yield api.getCurrentUser();
        // Normalize route (remove trailing slashes)
        route = route.replace(/\/+$/, "") || "/";
        const targetRoute = routes.find((r) => r.uri === route);
        const isProtected = (_a = targetRoute === null || targetRoute === void 0 ? void 0 : targetRoute.protected) !== null && _a !== void 0 ? _a : false;
        // Handle route protection and auth redirects
        if (isProtected && !window.app.state.user) {
            if (Router.currentRoute !== "/login") {
                history.replaceState({ route: "/login" }, "", "/login");
                return Router.go("/login", false);
            }
            return;
        }
        if (!isProtected &&
            (route === "/login" || route === "/register") &&
            window.app.state.user) {
            if (Router.currentRoute !== "/") {
                history.replaceState({ route: "/" }, "", "/");
                return Router.go("/", false);
            }
            return;
        }
        // Update history if needed
        if (addToHistory) {
            history.pushState({ route }, "", route);
        }
        Router.currentRoute = route;
        // Rest of your view rendering code...
        //const routeObj = routes.find(r => r.uri === route) || routes[0];
        const routeObj = routes.find((r) => r.uri === route);
        if (!routeObj) {
            if (route !== "/") {
                return Router.go("/");
            }
            return;
        }
        let view;
        if (route === "/profile") {
            const stateUser = (_b = history.state) === null || _b === void 0 ? void 0 : _b.user;
            view = yield routeObj.view(stateUser);
        }
        else {
            view = yield routeObj.view();
        }
        if (view) {
            // --- Set title (always) ---
            if (window.app.selector &&
                window.app.selector.title1 &&
                window.app.selector.title2) {
                window.app.selector.title1.textContent = routeObj.title;
                window.app.selector.title2.textContent = routeObj.title;
            }
            if (routeObj.protected) {
                // --- Set navbar ---
                const navbar = yield navbarComponent();
                if (window.app.selector)
                    dom.mount(window.app.selector.navbar, navbar.component);
                navbar.update(route);
                // --- Set notification sidebar ---
                if (window.app.selector) {
                    dom.mount(window.app.selector.sidebarNotification, sidebarComponent({
                        identifier: "notification",
                        title: "Notification",
                    }));
                }
                renderNotifs();
                // --- Set chat sidebar ---
                if (window.app.selector) {
                    dom.mount(window.app.selector.sidebarChat, sidebarComponent({
                        identifier: "chat",
                        title: "Chat",
                    }));
                }
                if (window.app.selector) {
                    dom.mount(window.app.selector.sidebarPeople, sidebarComponent({
                        identifier: "people",
                        title: "People",
                    }));
                }
                const sidebarChatContent = document.querySelector('[data-id="sidebar-chat-content"]');
                const sidebarPeopleContent = document.querySelector('[data-id="sidebar-people-content"]');
                if (sidebarChatContent) {
                    // const chatElement = chatComponent();
                    const chatElement = yield currentChatsComponent();
                    dom.mount(sidebarChatContent, chatElement);
                    window.addEventListener("friendship-status-updated", () => {
                        //test
                        console.log("renderUsers to update friendship status triggered by dispatched event");
                        //
                        const userList = document.querySelector('[data-id="user-list"]');
                        if (userList)
                            renderUsers(userList);
                    });
                }
                if (sidebarPeopleContent) {
                    const peopleElement = yield currentPeopleComponent();
                    dom.mount(sidebarPeopleContent, peopleElement);
                    window.addEventListener("friendship-status-updated", () => {
                        const userList = document.querySelector('[data-id="user-list"]');
                        if (userList)
                            renderUsers(userList);
                    });
                }
            }
            else {
                // --- Clear navbar and sidebars on public pages ---
                if (window.app.selector &&
                    window.app.selector.navbar &&
                    window.app.selector.sidebarNotification &&
                    window.app.selector.sidebarChat &&
                    window.app.selector.sidebarPeople) {
                    window.app.selector.navbar.innerHTML = "";
                    window.app.selector.sidebarNotification.innerHTML = "";
                    window.app.selector.sidebarChat.innerHTML = "";
                    window.app.selector.sidebarPeople.innerHTML = "";
                }
            }
            // --- Set view ---
            if (window.app.selector && window.app.selector.view) {
                window.app.selector.view.innerHTML = "";
                dom.mount(window.app.selector.view, view);
            }
        }
        // --- Reset scrollbar ---
        window.scrollX = 0;
    }),
    goToProfile: (user) => {
        const encoded = encodeURIComponent(JSON.stringify(user));
        history.pushState({ route: "/profile", user }, "", "/profile");
        window.dispatchEvent(new PopStateEvent("popstate", { state: { route: "/profile", user } }));
    },
};
export default Router;
