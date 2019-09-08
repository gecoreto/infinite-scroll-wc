// @ts-ignore
import style from "./style.sass";
// @ts-ignore
import template from "./template.html";

const templateElement = document.createElement("template");
templateElement.innerHTML = `<style>${style}</style>${template}`;

export class InfiniteScrollWc extends HTMLElement {
  _observer: IntersectionObserver;
  _container: Element;
  _infiniteContainer: Element;
  _indicator: Element;
  [key: string]: any;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this._container = this.shadowRoot!.getElementById("content-wc")!;
    this._infiniteContainer = this.shadowRoot!.getElementById("infinite-container")!;
    // element to detect end of page
    this._indicator = this.shadowRoot!.getElementById("infinite-indicator")!;

    this._observer = new IntersectionObserver(
      this._loadMore.bind(this),
      { threshold: 1 }
    );
  }

  connectedCallback() {
    this._observer.observe(this._indicator!);
  }

  disconnectedCallback() {
    this._observer.disconnect();
  }

  private _loadMore() {
    if (this.isLoading || !(this.loadNextInfinite instanceof Function)) {
      return;
    }
    this.isLoading = true;
    this.loadNextInfinite()
      .then((items: any) => this._infiniteContainer.append(items))
      .then(() => this.isLoading = false)
      .catch(() => this.isLoading = false);

  }

  set isLoading(isLoading: boolean) {
    if (isLoading) {
      this.setAttribute('isLoading', '');
    } else {
      this.removeAttribute('isLoading');
    }
  }

  get isLoading() {
    return this.hasAttribute('isLoading');
  }

}

customElements.define("infinity-scroll-wc", InfiniteScrollWc);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "infinity-scroll-wc": any;
    }
  }
}
