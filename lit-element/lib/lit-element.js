import { html, render } from '../node_modules/lit-html/lib/lit-extended.js';
export { html } from '../node_modules/lit-html/lib/lit-extended.js';
export class LitElement extends HTMLElement {
    constructor() {
        super();
        this._needsRender = false;
        this._lookupCache = [];
        this._values = [];
        this.attachShadow({ mode: 'open' });
    }
    static get properties() {
        return [];
    }
    static get observedAttributes() {
        const attrs = [];
        for (const prop in this.properties) {
            if (this.properties[prop].attrName) {
                attrs.push(prop);
            }
        }
        return attrs;
    }
    static withProperties() {
        for (const prop in this.properties) {
            const { type: typeFn, value, attrName } = this.properties[prop];
            Object.defineProperty(this.prototype, prop, {
                get() { return this._values[prop] || value; },
                set(v) {
                    const value = typeFn(v);
                    this._values[prop] = value;
                    if (attrName) {
                        if (typeFn.name === 'Boolean') {
                            if (!value) {
                                this.removeAttribute(attrName);
                            }
                            else {
                                this.setAttribute(attrName, attrName);
                            }
                        }
                        else {
                            this.setAttribute(attrName, value);
                        }
                    }
                    this.invalidate();
                },
            });
        }
        return this;
    }
    render() {
        return html ``;
    }
    attributeChangedCallback(prop, _oldValue, newValue) {
        const { type: typeFn } = this.constructor.properties[prop];
        if (typeFn.name === 'Boolean') {
            this._values[prop] = (newValue === '') || (newValue === prop);
        }
        else {
            this._values[prop] = typeFn(newValue);
        }
        this.invalidate();
    }
    connectedCallback() {
        // FIXME: Should we force render here?
        this.invalidate();
    }
    async invalidate() {
        if (!this._needsRender) {
            this._needsRender = true;
            // Schedule the following as micro task, which runs before
            // requestAnimationFrame. All additional invalidate() calls
            // before will be ignored.
            // https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
            this._needsRender = await false;
            render(this.render(), this.shadowRoot);
        }
    }
    $(id) {
        let value = this._lookupCache[id];
        if (!value && this.shadowRoot) {
            const element = this.shadowRoot.getElementById(id);
            if (element) {
                value = element;
                this._lookupCache[id] = element;
            }
        }
        return value;
    }
}
//# sourceMappingURL=lit-element.js.map