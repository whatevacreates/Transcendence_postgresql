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
import avatarComponent from './avatarComponent.js';
import api from '../../shared/api/api.js';
import validate from '../../shared/util/validate.js';
// =============================================================================
// Component: 
// =============================================================================
function avatarUploadSection(user) {
    const container = dom.create(`
        <div class="flex flex-col items-center gap-2">
            <div data-id="avatar-slot"></div>
            <button class="text-secondaryText text-[1.1rem] font-bold font-headline hover:underline" data-id="edit-avatar-button">Edit Avatar</button>
        </div>
    `);
    // =============================================================================
    // Query Selectors: 
    // =============================================================================
    const avatarSlot = container.querySelector('[data-id="avatar-slot"]');
    dom.mount(avatarSlot, avatarComponent(user));
    const editButton = container.querySelector('[data-id="edit-avatar-button"]');
    const fileInput = dom.create(`<input type="file" accept="image/*" style="display:none" />`);
    container.appendChild(fileInput);
    // =============================================================================
    // Event Listeners: 
    // =============================================================================
    editButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const error = validate.isValidImage(file);
        if (error) {
            alert(error);
            return;
        }
        try {
            yield api.uploadAvatar(file);
            const avatarImg = avatarSlot.querySelector('img');
            if (avatarImg) {
                avatarImg.src = `/api/user/avatar/${user.id}?t=${Date.now()}`;
            }
        }
        catch (err) {
            console.error('Avatar upload failed', err);
            alert('Failed to upload avatar');
        }
    }));
    return container;
}
export default avatarUploadSection;
