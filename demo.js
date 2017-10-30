'use strict';

import { html, LitElement } from './node_modules/lit-html-element/lit-element.js';
import { repeat } from './node_modules/lit-html/lib/repeat.js';

const productApiUrl = 'http://www.json-generator.com/api/json/get/celLKmqymq';

export class ProductListElement extends LitElement {
    connectedCallback() {
        super.connectedCallback();
        this.products = [];
        fetch(productApiUrl)
            .then(res => res.json())
            .then(data => {
                this.products = data;
                this.invalidate();
            });
    }

    constructor() {
        super();
        this.onBuy = this.onBuy.bind(this);
        this.onSort = this.onSort.bind(this);
    }

    onSort() {
        this.products = this.products.sort((a,b)=>{
            return a.name > b.name ? 1 : -1;
        });
        this.invalidate();
    }

    onBuy(product, count) {
        alert(`buy ${count} of these: ${product.name}`);
    }

    render() {
        return html`
            <style>
                product-item[favorite] {
                    border-color:red;
                }
            </style>
            <h1>Product List</h1>
            <button on-click="${this.onSort}">sort 500 products ny name</button>
            ${this.products.map(product=>html`
                <product-item product=${product} on-buy=${(e)=> { this.onBuy(product, e.detail.count) }}></product-item>
            `)}
        `
    }
}
customElements.define('product-list', ProductListElement);


export class ProductItemElement extends LitElement {
    static get properties() {
        return {
            product: {
                type: Object
            },
            favorite: {
                type: Boolean,
                attrName:'favorite'
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        setTimeout(_=>{
            this.favorite = this.product.isfavorite;
        }, 0);
    }

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.dispatchEvent(new CustomEvent('buy', { 
            detail: { 
                count: this.$('counter').value 
            } 
        }));
    }

    render() {
        return html`
            <style>
                :host {
                    border-bottom:1px solid #000;
                    display:block;
                }
            </style>
            <h3>${this.product.name}</h3>
            <p>Price: ${this.product.price}</p>
            <input id="counter" type="number" value="1">
            <button on-click="${this.onClick}">Buy</button>
        `;  
    }
}
customElements.define('product-item', ProductItemElement.withProperties());
