var InfiniteCarouselWc = (function (exports) {
    'use strict';

    var css = "#content-wc #infinite-indicator {\n  width: 100%;\n  text-align: center; }\n  #content-wc #infinite-indicator.fixed {\n    position: fixed;\n    bottom: 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlLnNhc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFXO0VBQ1gsa0JBQWtCLEVBQUU7RUFDcEI7SUFDRSxlQUFlO0lBQ2YsU0FBUyxFQUFFIiwiZmlsZSI6InN0eWxlLnNhc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjY29udGVudC13YyAjaW5maW5pdGUtaW5kaWNhdG9yIHtcbiAgd2lkdGg6IDEwMCU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjsgfVxuICAjY29udGVudC13YyAjaW5maW5pdGUtaW5kaWNhdG9yLmZpeGVkIHtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgYm90dG9tOiAwOyB9XG4iXX0= */";

    var template = "<div id=\"content-wc\">\n    <div id=\"infinite-container\">\n        <slot name=\"content\">My default content</slot>\n    </div>\n\n    <div id=\"infinite-indicator\">\n        <slot name=\"loading-content\">\n            <h2>Loading More ...</h2>\n        </slot>\n    </div>\n</div>";

    // @ts-ignore
    const templateElement = document.createElement("template");
    templateElement.innerHTML = `<style>${css}</style>${template}`;
    class InfiniteScrollWc extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(templateElement.content.cloneNode(true));
            this._container = this.shadowRoot.getElementById("content-wc");
            this._infiniteContainer = this.shadowRoot.getElementById("infinite-container");
            // element to detect end of page
            this._indicator = this.shadowRoot.getElementById("infinite-indicator");
            this._observer = new IntersectionObserver(this._loadMore.bind(this), { threshold: 1 });
        }
        connectedCallback() {
            this._observer.observe(this._indicator);
        }
        disconnectedCallback() {
            this._observer.disconnect();
        }
        _loadMore() {
            if (this.isLoading || !(this.loadNextInfinite instanceof Function)) {
                return;
            }
            console.log('PRUEBA', this.loadNextInfinite());
            this.isLoading = true;
            this.loadNextInfinite()
                .then((items) => this._infiniteContainer.append(items))
                .then(() => this.isLoading = false);
        }
        set isLoading(isLoading) {
            if (isLoading) {
                this.setAttribute('isLoading', '');
            }
            else {
                this.removeAttribute('isLoading');
            }
        }
        get isLoading() {
            return this.hasAttribute('isLoading');
        }
    }
    customElements.define("infinity-scroll-wc", InfiniteScrollWc);

    exports.InfiniteScrollWc = InfiniteScrollWc;

    return exports;

}({}));
