var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dom from '../shared/dom.js';
import settingsComponent from '../component/profile/settingsComponent.js';
import api from '../shared/api/api.js';
// optional user parameter
function settingsView(user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const settingsView = dom.create(`
        <div class="p-8 space-y-4 text-primary">
            <div data-id="settings-component"></div>
        </div>
    `);
        const settingsSelector = settingsView.querySelector('[data-id="settings-component"]');
        let resolvedUser = user;
        if (!resolvedUser) {
            yield api.getCurrentUser();
            resolvedUser = (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.app) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.user) !== null && _c !== void 0 ? _c : undefined;
        }
        if (!resolvedUser) {
            console.warn("No user found, settings cannot be rendered.");
            return settingsView; // or show a "Not logged in" message
        }
        const component = yield settingsComponent(resolvedUser);
        if (settingsSelector)
            dom.mount(settingsSelector, component);
        return settingsView;
    });
}
export default settingsView;
