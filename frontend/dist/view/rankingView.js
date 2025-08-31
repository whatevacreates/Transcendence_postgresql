var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dom from "../shared/dom.js";
import rankingComponent from "../component/rankingComponent.js";
function RankingView() {
    return __awaiter(this, void 0, void 0, function* () {
        const rankingView = dom.create(`
        <div class="w-full mx-auto space-y-10">
            <div data-id="ranking-component"></div>
        </div>
    `);
        const rankingSelector = rankingView.querySelector('[data-id="ranking-component"]');
        const component = yield rankingComponent();
        if (rankingSelector)
            dom.mount(rankingSelector, component);
        return rankingView;
    });
}
export default RankingView;
