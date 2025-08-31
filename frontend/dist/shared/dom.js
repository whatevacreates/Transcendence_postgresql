const cleanupRegistry = [];
function create(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const first = template.content.firstElementChild;
    if (!first)
        throw new Error("frontend.create(): HTML string must have at least one root element.");
    return first.cloneNode(true);
}
function mount(selector, component, clear = true) {
    if (selector) {
        if (clear)
            selector.innerHTML = "";
        selector.appendChild(component);
    }
    else {
        console.warn(`mount(): Target element not found or null.`);
    }
}
function navigateTo(component, sectionId) {
    const dataId = document.querySelector(`[data-id="${sectionId}"]`);
    if (!dataId) {
        console.warn(`navigateTo(): No container found with id '${sectionId}'`);
        return;
    }
    mount(dataId, component);
}
// General fallback implementation
function registerEvent(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    const cleanup = () => target.removeEventListener(event, handler, options);
    cleanupRegistry.push({ target, event, handler, options, cleanup });
    return cleanup;
}
function cleanupEvents() {
    console.log(`DOM: Starting cleanup of registered events`);
    showRegistry();
    while (cleanupRegistry.length) {
        const { cleanup } = cleanupRegistry.pop();
        cleanup();
    }
    console.log(`DOM: Finished cleanup`);
    showRegistry();
}
function showRegistry() {
    console.log(`DOM: ${cleanupRegistry.length} event(s) registered`);
    cleanupRegistry.forEach((entry, index) => {
        console.log(`Event #${index + 1}:`);
        console.log(`  Target:`, entry.target);
        console.log(`  Event: ${entry.event}`);
        console.log(`  Handler:`, entry.handler);
        console.log(`  Options:`, entry.options);
    });
}
export default {
    create,
    mount,
    navigateTo,
    registerEvent,
    cleanupEvents
};
