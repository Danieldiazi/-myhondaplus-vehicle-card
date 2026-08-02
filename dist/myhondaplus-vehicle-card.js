/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, Y = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, X = Symbol(), oe = /* @__PURE__ */ new WeakMap();
let _e = class {
  constructor(e, i, o) {
    if (this._$cssResult$ = !0, o !== X) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Y && e === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (e = oe.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), o && oe.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ee = (t) => new _e(typeof t == "string" ? t : t + "", void 0, X), $e = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((o, s, r) => o + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[r + 1], t[0]);
  return new _e(i, t, X);
}, Ce = (t, e) => {
  if (Y) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const o = document.createElement("style"), s = j.litNonce;
    s !== void 0 && o.setAttribute("nonce", s), o.textContent = i.cssText, t.appendChild(o);
  }
}, se = Y ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const o of e.cssRules) i += o.cssText;
  return Ee(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Pe, defineProperty: Me, getOwnPropertyDescriptor: Oe, getOwnPropertyNames: Le, getOwnPropertySymbols: ze, getPrototypeOf: He } = Object, $ = globalThis, ae = $.trustedTypes, Te = ae ? ae.emptyScript : "", W = $.reactiveElementPolyfillSupport, z = (t, e) => t, I = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Te : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, ee = (t, e) => !Pe(t, e), re = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: ee };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = re) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const o = Symbol(), s = this.getPropertyDescriptor(e, o, i);
      s !== void 0 && Me(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, o) {
    const { get: s, set: r } = Oe(this.prototype, e) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: s, set(a) {
      const c = s == null ? void 0 : s.call(this);
      r == null || r.call(this, a), this.requestUpdate(e, c, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? re;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = He(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const i = this.properties, o = [...Le(i), ...ze(i)];
      for (const s of o) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [o, s] of i) this.elementProperties.set(o, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const s = this._$Eu(i, o);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const o = new Set(e.flat(1 / 0).reverse());
      for (const s of o) i.unshift(se(s));
    } else e !== void 0 && i.push(se(e));
    return i;
  }
  static _$Eu(e, i) {
    const o = i.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const o of i.keys()) this.hasOwnProperty(o) && (e.set(o, this[o]), delete this[o]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ce(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var o;
      return (o = i.hostConnected) == null ? void 0 : o.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var o;
      return (o = i.hostDisconnected) == null ? void 0 : o.call(i);
    });
  }
  attributeChangedCallback(e, i, o) {
    this._$AK(e, o);
  }
  _$ET(e, i) {
    var r;
    const o = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, o);
    if (s !== void 0 && o.reflect === !0) {
      const a = (((r = o.converter) == null ? void 0 : r.toAttribute) !== void 0 ? o.converter : I).toAttribute(i, o.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var r, a;
    const o = this.constructor, s = o._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const c = o.getPropertyOptions(s), n = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((r = c.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? c.converter : I;
      this._$Em = s;
      const u = n.fromAttribute(i, c.type);
      this[s] = u ?? ((a = this._$Ej) == null ? void 0 : a.get(s)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(e, i, o, s = !1, r) {
    var a;
    if (e !== void 0) {
      const c = this.constructor;
      if (s === !1 && (r = this[e]), o ?? (o = c.getPropertyOptions(e)), !((o.hasChanged ?? ee)(r, i) || o.useDefault && o.reflect && r === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(c._$Eu(e, o)))) return;
      this.C(e, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: o, reflect: s, wrapped: r }, a) {
    o && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? i ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || o || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var o;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, a] of s) {
        const { wrapped: c } = a, n = this[r];
        c !== !0 || this._$AL.has(r) || n === void 0 || this.C(r, void 0, a, n);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (o = this._$EO) == null || o.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((o) => {
      var s;
      return (s = o.hostUpdated) == null ? void 0 : s.call(o);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[z("elementProperties")] = /* @__PURE__ */ new Map(), C[z("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: C }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, ne = (t) => t, B = H.trustedTypes, ce = B ? B.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, be = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, ye = "?" + _, Ue = `<${ye}>`, S = document, T = () => S.createComment(""), U = (t) => t === null || typeof t != "object" && typeof t != "function", te = Array.isArray, Ne = (t) => te(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", G = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, de = />/g, A = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, ue = /"/g, Ae = /^(?:script|style|textarea|title)$/i, Re = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), h = Re(1), M = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), pe = /* @__PURE__ */ new WeakMap(), x = S.createTreeWalker(S, 129);
function we(t, e) {
  if (!te(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ce !== void 0 ? ce.createHTML(e) : e;
}
const De = (t, e) => {
  const i = t.length - 1, o = [];
  let s, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = L;
  for (let c = 0; c < i; c++) {
    const n = t[c];
    let u, p, l = -1, f = 0;
    for (; f < n.length && (a.lastIndex = f, p = a.exec(n), p !== null); ) f = a.lastIndex, a === L ? p[1] === "!--" ? a = le : p[1] !== void 0 ? a = de : p[2] !== void 0 ? (Ae.test(p[2]) && (s = RegExp("</" + p[2], "g")), a = A) : p[3] !== void 0 && (a = A) : a === A ? p[0] === ">" ? (a = s ?? L, l = -1) : p[1] === void 0 ? l = -2 : (l = a.lastIndex - p[2].length, u = p[1], a = p[3] === void 0 ? A : p[3] === '"' ? ue : he) : a === ue || a === he ? a = A : a === le || a === de ? a = L : (a = A, s = void 0);
    const v = a === A && t[c + 1].startsWith("/>") ? " " : "";
    r += a === L ? n + Ue : l >= 0 ? (o.push(u), n.slice(0, l) + be + n.slice(l) + _ + v) : n + _ + (l === -2 ? c : v);
  }
  return [we(t, r + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), o];
};
class N {
  constructor({ strings: e, _$litType$: i }, o) {
    let s;
    this.parts = [];
    let r = 0, a = 0;
    const c = e.length - 1, n = this.parts, [u, p] = De(e, i);
    if (this.el = N.createElement(u, o), x.currentNode = this.el.content, i === 2 || i === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = x.nextNode()) !== null && n.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(be)) {
          const f = p[a++], v = s.getAttribute(l).split(_), V = /([.?@])?(.*)/.exec(f);
          n.push({ type: 1, index: r, name: V[2], strings: v, ctor: V[1] === "." ? je : V[1] === "?" ? Ie : V[1] === "@" ? Be : q }), s.removeAttribute(l);
        } else l.startsWith(_) && (n.push({ type: 6, index: r }), s.removeAttribute(l));
        if (Ae.test(s.tagName)) {
          const l = s.textContent.split(_), f = l.length - 1;
          if (f > 0) {
            s.textContent = B ? B.emptyScript : "";
            for (let v = 0; v < f; v++) s.append(l[v], T()), x.nextNode(), n.push({ type: 2, index: ++r });
            s.append(l[f], T());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ye) n.push({ type: 2, index: r });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(_, l + 1)) !== -1; ) n.push({ type: 7, index: r }), l += _.length - 1;
      }
      r++;
    }
  }
  static createElement(e, i) {
    const o = S.createElement("template");
    return o.innerHTML = e, o;
  }
}
function O(t, e, i = t, o) {
  var a, c;
  if (e === M) return e;
  let s = o !== void 0 ? (a = i._$Co) == null ? void 0 : a[o] : i._$Cl;
  const r = U(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), r === void 0 ? s = void 0 : (s = new r(t), s._$AT(t, i, o)), o !== void 0 ? (i._$Co ?? (i._$Co = []))[o] = s : i._$Cl = s), s !== void 0 && (e = O(t, s._$AS(t, e.values), s, o)), e;
}
class Ve {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: o } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? S).importNode(i, !0);
    x.currentNode = s;
    let r = x.nextNode(), a = 0, c = 0, n = o[0];
    for (; n !== void 0; ) {
      if (a === n.index) {
        let u;
        n.type === 2 ? u = new R(r, r.nextSibling, this, e) : n.type === 1 ? u = new n.ctor(r, n.name, n.strings, this, e) : n.type === 6 && (u = new Qe(r, this, e)), this._$AV.push(u), n = o[++c];
      }
      a !== (n == null ? void 0 : n.index) && (r = x.nextNode(), a++);
    }
    return x.currentNode = S, s;
  }
  p(e) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(e, o, i), i += o.strings.length - 2) : o._$AI(e[i])), i++;
  }
}
class R {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, o, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = o, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = O(this, e, i), U(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== M && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ne(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: i, _$litType$: o } = e, s = typeof o == "number" ? this._$AC(e) : (o.el === void 0 && (o.el = N.createElement(we(o.h, o.h[0]), this.options)), o);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(i);
    else {
      const a = new Ve(s, this), c = a.u(this.options);
      a.p(i), this.T(c), this._$AH = a;
    }
  }
  _$AC(e) {
    let i = pe.get(e.strings);
    return i === void 0 && pe.set(e.strings, i = new N(e)), i;
  }
  k(e) {
    te(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, s = 0;
    for (const r of e) s === i.length ? i.push(o = new R(this.O(T()), this.O(T()), this, this.options)) : o = i[s], o._$AI(r), s++;
    s < i.length && (this._$AR(o && o._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var o;
    for ((o = this._$AP) == null ? void 0 : o.call(this, !1, !0, i); e !== this._$AB; ) {
      const s = ne(e).nextSibling;
      ne(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, o, s, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = r, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = d;
  }
  _$AI(e, i = this, o, s) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = O(this, e, i, 0), a = !U(e) || e !== this._$AH && e !== M, a && (this._$AH = e);
    else {
      const c = e;
      let n, u;
      for (e = r[0], n = 0; n < r.length - 1; n++) u = O(this, c[o + n], i, n), u === M && (u = this._$AH[n]), a || (a = !U(u) || u !== this._$AH[n]), u === d ? e = d : e !== d && (e += (u ?? "") + r[n + 1]), this._$AH[n] = u;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class je extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Ie extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Be extends q {
  constructor(e, i, o, s, r) {
    super(e, i, o, s, r), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = O(this, e, i, 0) ?? d) === M) return;
    const o = this._$AH, s = e === d && o !== d || e.capture !== o.capture || e.once !== o.once || e.passive !== o.passive, r = e !== d && (o === d || s);
    s && this.element.removeEventListener(this.name, this, o), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Qe {
  constructor(e, i, o) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    O(this, e);
  }
}
const Z = H.litHtmlPolyfillSupport;
Z == null || Z(N, R), (H.litHtmlVersions ?? (H.litHtmlVersions = [])).push("3.3.3");
const Fe = (t, e, i) => {
  const o = (i == null ? void 0 : i.renderBefore) ?? e;
  let s = o._$litPart$;
  if (s === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    o._$litPart$ = s = new R(e.insertBefore(T(), r), r, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class P extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Fe(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return M;
  }
}
var ve;
P._$litElement$ = !0, P.finalized = !0, (ve = k.litElementHydrateSupport) == null || ve.call(k, { LitElement: P });
const J = k.litElementPolyfillSupport;
J == null || J({ LitElement: P });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: ee }, We = (t = qe, e, i) => {
  const { kind: o, metadata: s } = i;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), o === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(i.name, t), o === "accessor") {
    const { name: a } = i;
    return { set(c) {
      const n = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(a, n, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, t, c), c;
    } };
  }
  if (o === "setter") {
    const { name: a } = i;
    return function(c) {
      const n = this[a];
      e.call(this, c), this.requestUpdate(a, n, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function ie(t) {
  return (e, i) => typeof i == "object" ? We(t, e, i) : ((o, s, r) => {
    const a = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, o), a ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(t) {
  return ie({ ...t, state: !0, attribute: !1 });
}
const Q = "myhondaplus-vehicle-card", Ge = "myhondaplus-vehicle-card-editor", ke = "0.5.1", g = {
  type: `custom:${Q}`,
  name: "My Honda+",
  vehicle_color: "#a51d2d",
  color_preset: "rallye_red",
  image_mode: "rendered",
  vehicle_model: "auto",
  layout: "full",
  stale_after: 21600,
  show_controls: !0,
  show_model: !0,
  animate: !0,
  confirm_unlock: !0,
  locale: "auto",
  debug: !1,
  controls: ["lock", "climate", "refresh", "location"],
  metrics: ["range", "battery", "odometer"]
}, F = {
  rallye_red: { label: "Rallye Red", value: "#a51d2d", accent: "#ef8a92" },
  platinum_white: { label: "Platinum White Pearl", value: "#d9dcde", accent: "#ffffff" },
  crystal_black: { label: "Crystal Black Pearl", value: "#202326", accent: "#70777d" },
  sonic_grey: { label: "Sonic Grey Pearl", value: "#7f8789", accent: "#cbd0d1" },
  urban_grey: { label: "Urban Grey Pearl", value: "#6e706d", accent: "#b8bab5" },
  premium_blue: { label: "Premium Crystal Blue", value: "#1f4f7c", accent: "#74a9dd" },
  canyon_river_blue: { label: "Canyon River Blue", value: "#35566f", accent: "#89a9bf" },
  silver: { label: "Silver Metallic", value: "#aeb4b8", accent: "#eef1f3" },
  custom: { label: "Personalizado", value: "#a51d2d", accent: "#ef8a92" }
}, Ze = [
  "lock",
  "range",
  "battery",
  "odometer",
  "updated",
  "climate",
  "charging",
  "refresh",
  "location",
  "doors",
  "windows",
  "trunk",
  "hood",
  "lights"
];
function ge(t, e, i, o) {
  var s;
  return {
    cardVersion: ke,
    homeAssistantVersion: (s = t == null ? void 0 : t.config) == null ? void 0 : s.version,
    model: i,
    locale: o,
    entities: Ze.map((r) => {
      const a = e[r], c = a == null ? void 0 : a.split(".")[0];
      return {
        key: r,
        entityId: c ? `${c}.[redacted]` : void 0,
        available: !!(a && (t != null && t.states[a]))
      };
    })
  };
}
function fe(t) {
  return JSON.stringify(t, null, 2);
}
const Je = {
  lock: { domains: ["lock"], hints: ["doors", "door_lock", "lock"] },
  range: { domains: ["sensor"], hints: ["total_range", "range_climate_off", "range"] },
  battery: { domains: ["sensor"], hints: ["battery_level", "ev_battery", "battery"] },
  odometer: { domains: ["sensor"], hints: ["odometer", "mileage"] },
  updated: { domains: ["sensor"], hints: ["last_updated", "updated"] },
  climate: { domains: ["switch"], hints: ["climate", "preconditioning"] },
  charging: {
    domains: ["binary_sensor", "sensor", "switch"],
    hints: ["charging", "charge_status", "plugged"]
  },
  refresh: { domains: ["button"], hints: ["refresh_from_car"] },
  location: { domains: ["device_tracker"], hints: ["location", "car_finder"] },
  doors: { domains: ["binary_sensor"], hints: ["doors", "door"] },
  windows: { domains: ["binary_sensor"], hints: ["windows", "window"] },
  trunk: { domains: ["binary_sensor"], hints: ["trunk", "tailgate", "boot"] },
  hood: { domains: ["binary_sensor"], hints: ["hood", "bonnet"] },
  lights: { domains: ["binary_sensor"], hints: ["lights", "headlights"] }
}, Ke = (t) => [t.entity_id, t.unique_id, t.translation_key, t.original_name].filter(Boolean).join(" ").toLowerCase();
function Ye(t, e = {}) {
  const i = { ...e };
  for (const [o, s] of Object.entries(Je)) {
    if (i[o]) continue;
    const r = t.filter((a) => !a.disabled_by).filter((a) => s.domains.includes(a.entity_id.split(".")[0] ?? "")).map((a) => {
      const c = Ke(a), n = s.hints.reduce(
        (u, p, l) => u + (c.includes(p) ? 100 - l : 0),
        0
      );
      return { entry: a, score: n };
    }).filter(({ score: a }) => a > 0).sort((a, c) => c.score - a.score)[0];
    r && (i[o] = r.entry.entity_id);
  }
  return i;
}
const Xe = {
  en: {
    required_config: "Configuration is required",
    vehicle: "Vehicle",
    connected_vehicle: "Connected vehicle",
    select_vehicle: "Select a vehicle in the editor.",
    locked: "Locked",
    unlocked: "Unlocked",
    unknown_state: "Unknown state",
    updated_now: "Updated now",
    updated_minutes: "Updated {count} min ago",
    updated_hours: "Updated {count} h ago",
    no_update_date: "No update date",
    stale_data: "Vehicle data may be outdated",
    range: "Range",
    battery: "Battery",
    odometer: "Odometer",
    doors: "Doors",
    windows: "Windows",
    trunk: "Trunk",
    hood: "Hood",
    lights: "Lights",
    charging: "Charging",
    open: "Open",
    closed: "Closed",
    on: "On",
    off: "Off",
    active: "Active",
    inactive: "Inactive",
    unlock: "Unlock",
    lock: "Lock",
    climate: "Climate",
    refresh: "Refresh",
    location: "Location",
    confirm_unlock: "Unlock the vehicle doors?",
    action_failed: "The vehicle action could not be completed.",
    discovery_failed: "Vehicle entities could not be discovered.",
    action_in_progress: "Action in progress"
  },
  es: {
    required_config: "La configuración es obligatoria",
    vehicle: "Vehículo",
    connected_vehicle: "Vehículo conectado",
    select_vehicle: "Selecciona el vehículo en el editor.",
    locked: "Cerrado",
    unlocked: "Desbloqueado",
    unknown_state: "Estado desconocido",
    updated_now: "Actualizado ahora",
    updated_minutes: "Actualizado hace {count} min",
    updated_hours: "Actualizado hace {count} h",
    no_update_date: "Sin fecha de actualización",
    stale_data: "Los datos del vehículo pueden estar desactualizados",
    range: "Autonomía",
    battery: "Batería",
    odometer: "Kilometraje",
    doors: "Puertas",
    windows: "Ventanas",
    trunk: "Maletero",
    hood: "Capó",
    lights: "Luces",
    charging: "Carga",
    open: "Abierto",
    closed: "Cerrado",
    on: "Encendidas",
    off: "Apagadas",
    active: "Activa",
    inactive: "Inactiva",
    unlock: "Abrir",
    lock: "Cerrar",
    climate: "Clima",
    refresh: "Actualizar",
    location: "Ubicación",
    confirm_unlock: "¿Abrir las puertas del vehículo?",
    action_failed: "No se pudo completar la acción del vehículo.",
    discovery_failed: "No se pudieron detectar las entidades del vehículo.",
    action_in_progress: "Acción en curso"
  },
  gl: {
    required_config: "A configuración é obrigatoria",
    vehicle: "Vehículo",
    connected_vehicle: "Vehículo conectado",
    select_vehicle: "Selecciona o vehículo no editor.",
    locked: "Pechado",
    unlocked: "Desbloqueado",
    unknown_state: "Estado descoñecido",
    updated_now: "Actualizado agora",
    updated_minutes: "Actualizado hai {count} min",
    updated_hours: "Actualizado hai {count} h",
    no_update_date: "Sen data de actualización",
    stale_data: "Os datos do vehículo poden estar desactualizados",
    range: "Autonomía",
    battery: "Batería",
    odometer: "Quilometraxe",
    doors: "Portas",
    windows: "Xanelas",
    trunk: "Maleteiro",
    hood: "Capó",
    lights: "Luces",
    charging: "Carga",
    open: "Aberto",
    closed: "Pechado",
    on: "Acesas",
    off: "Apagadas",
    active: "Activa",
    inactive: "Inactiva",
    unlock: "Abrir",
    lock: "Pechar",
    climate: "Clima",
    refresh: "Actualizar",
    location: "Localización",
    confirm_unlock: "Abrir as portas do vehículo?",
    action_failed: "Non se puido completar a acción do vehículo.",
    discovery_failed: "Non se puideron detectar as entidades do vehículo.",
    action_in_progress: "Acción en curso"
  }
};
function Se(t) {
  const e = t == null ? void 0 : t.toLowerCase().split(/[-_]/)[0];
  return e === "en" || e === "gl" ? e : "es";
}
function me(t, e, i = {}) {
  const o = Se(e);
  let s = Xe[o][t];
  for (const [r, a] of Object.entries(i))
    s = s.replaceAll(`{${r}}`, String(a));
  return s;
}
const et = [
  ["civic", /civic/i],
  ["hrv", /\bhr[- ]?v\b/i],
  ["crv", /\bcr[- ]?v\b/i],
  ["zrv", /\bzr[- ]?v\b/i],
  ["jazz", /jazz|fit/i],
  ["eny1", /\be:?ny1\b/i],
  ["honda_e", /honda\s*e\b/i]
];
function tt(t) {
  var i;
  const e = [t == null ? void 0 : t.name_by_user, t == null ? void 0 : t.name, t == null ? void 0 : t.model, t == null ? void 0 : t.manufacturer].filter(Boolean).join(" ");
  return ((i = et.find(([, o]) => o.test(e))) == null ? void 0 : i[0]) ?? "generic";
}
function it(t) {
  return {
    civic: "Honda Civic",
    hrv: "Honda HR-V",
    crv: "Honda CR-V",
    zrv: "Honda ZR-V",
    jazz: "Honda Jazz",
    honda_e: "Honda e",
    eny1: "Honda e:Ny1",
    generic: "Honda"
  }[t];
}
const ot = {
  civic: "M270 174 L360 94 Q410 62 495 68 L625 82 Q680 90 735 170",
  hrv: "M250 174 L335 78 Q388 45 486 50 L642 66 Q702 77 758 171",
  crv: "M235 174 L320 62 Q380 30 500 38 L660 55 Q724 70 775 171",
  zrv: "M245 174 L332 72 Q392 40 500 47 L648 63 Q710 76 765 171",
  jazz: "M265 174 L340 82 Q390 53 470 55 L594 65 Q650 75 720 171",
  honda_e: "M285 174 L350 88 Q392 62 470 62 L575 66 Q627 72 692 171",
  eny1: "M240 174 L326 70 Q388 36 500 42 L655 58 Q716 72 770 171",
  generic: "M260 174 L340 82 Q395 50 488 55 L625 68 Q687 78 745 171"
};
function st(t, e, i) {
  return h`<svg class="vehicle-art" viewBox="0 0 960 360" role="img" aria-label="${t}">
    <defs>
      <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".46"></stop>
        <stop offset=".18" stop-color=${e}></stop>
        <stop offset=".72" stop-color=${e}></stop>
        <stop offset="1" stop-color="#000" stop-opacity=".34"></stop>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#bfe3ef" stop-opacity=".82"></stop>
        <stop offset="1" stop-color="#17242c" stop-opacity=".92"></stop>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="8"></feGaussianBlur></filter>
    </defs>
    <ellipse cx="480" cy="316" rx="350" ry="22" fill="rgba(0,0,0,.22)"></ellipse>
    ${i.climate ? h`<g class="climate-wave" fill="none" stroke="var(--info-color,#42a5f5)" stroke-width="5" opacity=".55"><path d="M390 82q-20-25 0-48"></path><path d="M470 72q-20-25 0-48"></path><path d="M550 82q-20-25 0-48"></path></g>` : null}
    <path
      d="M95 245 Q120 198 210 182 L270 174 ${ot[t]} L840 196 Q894 207 915 254 L899 291 L790 300 Q778 235 705 235 Q632 235 620 300 L350 300 Q338 235 265 235 Q192 235 180 300 L87 284 Z"
      fill="url(#paint)"
      stroke="rgba(0,0,0,.45)"
      stroke-width="5"
    ></path>
    <path
      d="M286 170 L365 103 Q404 78 484 80 L612 91 Q662 98 718 170 Z"
      fill="url(#glass)"
      stroke="rgba(255,255,255,.35)"
      stroke-width="4"
    ></path>
    <path d="M482 80 L478 170 M617 92 L650 170" stroke="rgba(8,15,20,.7)" stroke-width="5"></path>
    <path
      d="M126 232 Q182 205 245 201"
      stroke="rgba(255,255,255,.48)"
      stroke-width="7"
      stroke-linecap="round"
    ></path>
    <path
      d="M751 197 Q835 204 876 230"
      stroke="rgba(255,255,255,.34)"
      stroke-width="6"
      stroke-linecap="round"
    ></path>
    ${i.lights ? h`<g class="headlight"><ellipse cx="864" cy="228" rx="28" ry="10" fill="#fff7c2"></ellipse><path d="M880 226 L950 206 L950 248 Z" fill="#fff7c2" opacity=".24" filter="url(#glow)"></path></g>` : null}
    ${i.charging ? h`<g class="charge" transform="translate(730 154)"><circle r="26" fill="var(--success-color,#43a047)" opacity=".92"></circle><path d="M4-18L-10 3H0L-5 19L12-5H2Z" fill="white"></path></g>` : null}
    ${[265, 705].map((o) => h`<g><circle cx=${o} cy="288" r="65" fill="#15191c"></circle><circle cx=${o} cy="288" r="37" fill="#8f979d"></circle><circle cx=${o} cy="288" r="13" fill="#34393d"></circle></g>`)}
  </svg>`;
}
const at = /* @__PURE__ */ new Set(["on", "open", "unlocked", "active", "charging", "plugged", "true"]), rt = /* @__PURE__ */ new Set(["unknown", "unavailable", "none"]);
function w(t) {
  return at.has((t == null ? void 0 : t.state.toLowerCase()) ?? "");
}
function K(t) {
  if (!t || rt.has(t.state.toLowerCase())) return "—";
  const e = t.attributes.unit_of_measurement;
  return `${t.state}${e ? ` ${String(e)}` : ""}`;
}
function nt(t, e = Date.now()) {
  if (!t) return;
  const i = Date.parse(t.last_updated);
  return Number.isFinite(i) ? Math.max(0, Math.floor((e - i) / 1e3)) : void 0;
}
function ct(t, e, i = Date.now()) {
  const o = t.updated ?? t.range ?? t.odometer, s = nt(o, i);
  return {
    locked: t.lock ? t.lock.state === "locked" : void 0,
    range: K(t.range),
    battery: K(t.battery),
    odometer: K(t.odometer),
    climateActive: w(t.climate),
    charging: w(t.charging),
    doorsOpen: w(t.doors),
    windowsOpen: w(t.windows),
    trunkOpen: w(t.trunk),
    hoodOpen: w(t.hood),
    lightsOn: w(t.lights),
    ageSeconds: s,
    stale: s !== void 0 && s > e
  };
}
var lt = Object.defineProperty, dt = Object.getOwnPropertyDescriptor, E = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? dt(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (s = (o ? a(e, i, s) : a(s)) || s);
  return o && s && lt(e, i, s), s;
};
const ht = ["lock", "climate", "refresh", "location"], ut = ["range", "battery", "odometer"];
let m = class extends P {
  constructor() {
    super(...arguments), this.config = { ...g }, this.entities = {};
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ft), document.createElement("myhondaplus-vehicle-card-editor");
  }
  static getStubConfig() {
    return { ...g };
  }
  setConfig(t) {
    if (!t) throw new Error(me("required_config", "es"));
    this.config = { ...g, ...t }, this.entities = { ...t.entities ?? {} }, this.loadedDevice = void 0;
  }
  getCardSize() {
    return this.config.layout === "compact" ? 3 : 6;
  }
  updated() {
    this.loadDeviceData();
  }
  locale() {
    var t;
    return this.config.locale && this.config.locale !== "auto" ? this.config.locale : Se((t = this.hass) == null ? void 0 : t.language);
  }
  t(t, e = {}) {
    return me(t, this.locale(), e);
  }
  async loadDeviceData() {
    if (!(!this.hass || !this.config.device || this.loadedDevice === this.config.device)) {
      this.loadedDevice = this.config.device;
      try {
        const [t, e] = await Promise.all([
          this.hass.callWS({ type: "config/entity_registry/list" }),
          this.hass.callWS({ type: "config/device_registry/list" })
        ]);
        this.entities = Ye(
          t.filter((i) => i.device_id === this.config.device),
          this.config.entities
        ), this.device = e.find((i) => i.id === this.config.device), this.message = void 0;
      } catch (t) {
        this.loadedDevice = void 0, this.message = { kind: "error", text: this.t("discovery_failed") }, console.warn("My Honda+ Vehicle Card: discovery failed", t);
      }
    }
  }
  entity(t) {
    var i;
    const e = this.entities[t];
    return e ? (i = this.hass) == null ? void 0 : i.states[e] : void 0;
  }
  entityRecord() {
    return Object.fromEntries(
      Object.keys(this.entities).map((t) => [t, this.entity(t)])
    );
  }
  vehicleState() {
    return ct(
      this.entityRecord(),
      this.config.stale_after ?? g.stale_after
    );
  }
  model() {
    return this.config.vehicle_model && this.config.vehicle_model !== "auto" ? this.config.vehicle_model : tt(this.device);
  }
  paintColor() {
    const t = this.config.color_preset ?? g.color_preset;
    if (t !== "custom" && F[t]) return F[t].value;
    const e = this.config.vehicle_color ?? g.vehicle_color;
    return /^#[0-9a-f]{6}$/i.test(e) ? e : g.vehicle_color;
  }
  ageText(t) {
    return t.ageSeconds === void 0 ? this.t("no_update_date") : t.ageSeconds < 60 ? this.t("updated_now") : t.ageSeconds < 3600 ? this.t("updated_minutes", { count: Math.floor(t.ageSeconds / 60) }) : this.t("updated_hours", { count: Math.floor(t.ageSeconds / 3600) });
  }
  async execute(t) {
    var r;
    const e = this.entities[t];
    if (!e || !this.hass || this.busy) return;
    if (t === "location") {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: !0,
          composed: !0,
          detail: { entityId: e }
        })
      );
      return;
    }
    const i = this.vehicleState(), o = e.split(".")[0] ?? "";
    let s = o === "button" ? "press" : ((r = this.entity(t)) == null ? void 0 : r.state) === "on" ? "turn_off" : "turn_on";
    if (o === "lock" && (s = i.locked ? "unlock" : "lock"), !(o === "lock" && s === "unlock" && this.config.confirm_unlock !== !1 && !window.confirm(this.t("confirm_unlock")))) {
      this.busy = t, this.message = void 0;
      try {
        await this.hass.callService(o, s, { entity_id: e });
      } catch (a) {
        this.message = { kind: "error", text: this.t("action_failed") }, console.warn("My Honda+ Vehicle Card: service call failed", { domain: o, service: s, error: a });
      } finally {
        this.busy = void 0;
      }
    }
  }
  async copyDiagnostics() {
    const t = fe(
      ge(this.hass, this.entities, this.model(), this.locale())
    );
    try {
      await navigator.clipboard.writeText(t), this.message = { kind: "success", text: "Diagnostics copied" };
    } catch {
      this.message = { kind: "error", text: t };
    }
  }
  metric(t, e) {
    const i = {
      range: { icon: "🛣️", label: this.t("range"), value: e.range },
      battery: { icon: "🔋", label: this.t("battery"), value: e.battery },
      odometer: { icon: "◉", label: this.t("odometer"), value: e.odometer }
    }[t];
    return h`<div class="metric">
      <span aria-hidden="true">${i.icon}</span>
      <div><small>${i.label}</small><strong>${i.value}</strong></div>
    </div>`;
  }
  status(t, e, i, o, s) {
    return h`<div
      class="status ${i ? "warning" : ""}"
      aria-label=${`${e}: ${i ? o : s}`}
    >
      <span class="status-icon" aria-hidden="true">${t}</span>
      <div><b>${e}</b><small>${i ? o : s}</small></div>
      <i aria-hidden="true"></i>
    </div>`;
  }
  control(t, e, i) {
    if (!this.entities[i]) return d;
    const o = this.busy === i;
    return h`<button
      type="button"
      aria-label=${e}
      aria-busy=${o ? "true" : "false"}
      ?disabled=${!!this.busy}
      @click=${() => void this.execute(i)}
    >
      <span aria-hidden="true">${o ? "…" : t}</span><small>${e}</small>
    </button>`;
  }
  vehicleVisual(t) {
    return this.config.image_mode === "custom" && this.config.vehicle_image ? h`<img src=${this.config.vehicle_image} alt=${this.t("vehicle")} loading="lazy" />` : st(this.model(), this.paintColor(), {
      charging: t.charging,
      climate: t.climateActive,
      lights: t.lightsOn
    });
  }
  render() {
    var s;
    const t = this.vehicleState(), e = t.locked === !0 ? this.t("locked") : t.locked === !1 ? this.t("unlocked") : this.t("unknown_state"), i = this.config.controls ?? [...ht], o = this.config.metrics ?? [...ut];
    return h`<ha-card class=${this.config.animate === !1 ? "reduce-motion" : ""}>
      <header>
        <div>
          <h2>${this.config.name}</h2>
          ${this.config.show_model !== !1 ? h`<p>${it(this.model())}</p>` : d}
        </div>
        <span class="badge ${t.locked === !1 ? "alert" : ""}">
          ${t.locked ? "🔒" : "🔓"} ${e}
        </span>
      </header>

      <div class="announcer" aria-live="polite">
        ${this.busy ? this.t("action_in_progress") : ((s = this.message) == null ? void 0 : s.text) ?? ""}
      </div>
      ${this.message ? h`<div class="message ${this.message.kind}">${this.message.text}</div>` : d}

      <section class="vehicle ${t.charging ? "is-charging" : ""}">
        ${this.vehicleVisual(t)}
        <div
          class="freshness ${t.stale ? "stale" : ""}"
          title=${t.stale ? this.t("stale_data") : ""}
        >
          ${this.ageText(t)}
        </div>
      </section>

      ${this.config.device ? h`<section class="metrics">
              ${o.map((r) => this.metric(r, t))}
            </section>` : h`<div class="setup">${this.t("select_vehicle")}</div>`}
      ${this.config.layout !== "compact" ? h`<section class="statuses">
              ${this.status("🚪", this.t("doors"), t.doorsOpen, this.t("open"), this.t("closed"))}
              ${this.status("▤", this.t("windows"), t.windowsOpen, this.t("open"), this.t("closed"))}
              ${this.status("▰", this.t("trunk"), t.trunkOpen, this.t("open"), this.t("closed"))}
              ${this.status("▱", this.t("hood"), t.hoodOpen, this.t("open"), this.t("closed"))}
              ${this.status("💡", this.t("lights"), t.lightsOn, this.t("on"), this.t("off"))}
              ${this.status("⚡", this.t("charging"), t.charging, this.t("active"), this.t("inactive"))}
            </section>` : d}
      ${this.config.show_controls !== !1 ? h`<nav class="controls" aria-label="Vehicle controls">
              ${i.map((r) => {
      const a = {
        lock: {
          icon: t.locked ? "🔓" : "🔒",
          label: t.locked ? this.t("unlock") : this.t("lock")
        },
        climate: { icon: "❄️", label: this.t("climate") },
        refresh: { icon: "↻", label: this.t("refresh") },
        location: { icon: "⌖", label: this.t("location") }
      }[r];
      return this.control(a.icon, a.label, r);
    })}
            </nav>` : d}
      ${this.config.debug ? h`<details class="diagnostics">
              <summary>Diagnostics</summary>
              <button type="button" @click=${() => void this.copyDiagnostics()}>
                Copy anonymized diagnostics
              </button>
              <pre>
${fe(ge(this.hass, this.entities, this.model(), this.locale()))}</pre>
            </details>` : d}
    </ha-card>`;
  }
};
m.styles = $e`
    :host {
      display: block;
    }
    ha-card {
      padding: 20px;
      overflow: hidden;
      color: var(--primary-text-color);
      background: linear-gradient(
        145deg,
        var(--ha-card-background, var(--card-background-color)),
        color-mix(
          in srgb,
          var(--ha-card-background, var(--card-background-color)) 90%,
          var(--primary-color) 10%
        )
      );
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    p {
      margin: 4px 0 0;
      color: var(--secondary-text-color);
      font-size: 0.83rem;
    }
    .badge {
      padding: 7px 11px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      font-size: 0.76rem;
    }
    .alert,
    .message.error {
      color: var(--error-color);
    }
    .announcer {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    .message {
      margin-top: 10px;
      padding: 9px 11px;
      border-radius: 10px;
      background: var(--secondary-background-color);
      font-size: 0.8rem;
    }
    .vehicle {
      position: relative;
      min-height: 235px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vehicle svg,
    .vehicle img {
      width: 100%;
      max-height: 250px;
      object-fit: contain;
      filter: drop-shadow(0 16px 18px rgba(0, 0, 0, 0.12));
    }
    .freshness {
      position: absolute;
      bottom: 7px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.72rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .freshness.stale {
      color: var(--warning-color, #f9a825);
      font-weight: 600;
    }
    .metrics,
    .controls {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 9px;
    }
    .metric {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 11px;
      border-radius: 14px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
    }
    .metric small,
    .metric strong,
    .status small,
    .status b {
      display: block;
    }
    .metric small,
    .status small {
      color: var(--secondary-text-color);
    }
    .statuses {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin-top: 13px;
    }
    .status {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 9px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      font-size: 0.78rem;
    }
    .status i {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--success-color, #43a047);
    }
    .status.warning i {
      background: var(--error-color);
    }
    .controls {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-top: 15px;
    }
    button {
      display: grid;
      place-items: center;
      gap: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      padding: 10px 5px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      transition: transform 0.18s ease;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    button:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: progress;
      opacity: 0.65;
    }
    .setup {
      padding: 18px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .diagnostics {
      margin-top: 14px;
      font-size: 0.8rem;
    }
    .diagnostics pre {
      overflow: auto;
      max-height: 260px;
      padding: 10px;
      background: var(--secondary-background-color);
      border-radius: 10px;
      white-space: pre-wrap;
    }
    .reduce-motion *,
    .reduce-motion *::before,
    .reduce-motion *::after {
      animation: none !important;
      transition: none !important;
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    @media (max-width: 520px) {
      ha-card {
        padding: 16px;
      }
      .vehicle {
        min-height: 190px;
      }
      .metrics,
      .statuses {
        grid-template-columns: 1fr;
      }
      .controls {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;
E([
  ie({ attribute: !1 })
], m.prototype, "hass", 2);
E([
  y()
], m.prototype, "config", 2);
E([
  y()
], m.prototype, "entities", 2);
E([
  y()
], m.prototype, "device", 2);
E([
  y()
], m.prototype, "busy", 2);
E([
  y()
], m.prototype, "message", 2);
m = E([
  xe(Q)
], m);
window.customCards ?? (window.customCards = []);
window.customCards.some((t) => t.type === Q) || window.customCards.push({
  type: Q,
  name: "My Honda+ Vehicle Card",
  description: "Tarjeta visual para vehículos conectados mediante My Honda+.",
  preview: !0,
  documentationURL: "https://github.com/Danieldiazi/myhondaplus-vehicle-card"
});
console.info(
  `%c MYHONDAPLUS-VEHICLE-CARD %c ${ke} `,
  "color:white;background:#a51d2d;font-weight:700",
  "color:#a51d2d;background:white;font-weight:700"
);
var pt = Object.defineProperty, gt = Object.getOwnPropertyDescriptor, D = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? gt(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (s = (o ? a(e, i, s) : a(s)) || s);
  return o && s && pt(e, i, s), s;
};
let b = class extends P {
  constructor() {
    super(...arguments), this.config = { ...g }, this.devices = [], this.loading = !1;
  }
  setConfig(t) {
    this.config = { ...g, ...t };
  }
  updated(t) {
    t.has("hass") && this.hass && this.loadDevices();
  }
  async loadDevices() {
    if (!(!this.hass || this.loading)) {
      this.loading = !0;
      try {
        const [t, e] = await Promise.all([
          this.hass.callWS({ type: "config/device_registry/list" }),
          this.hass.callWS({ type: "config/entity_registry/list" })
        ]), i = new Set(
          e.filter((o) => o.platform === "myhondaplus" && o.device_id).map((o) => o.device_id)
        );
        this.devices = t.filter((o) => i.has(o.id)).sort((o, s) => this.deviceName(o).localeCompare(this.deviceName(s)));
      } catch (t) {
        console.warn("My Honda+ Vehicle Card: device discovery failed", t), this.devices = [];
      } finally {
        this.loading = !1;
      }
    }
  }
  deviceName(t) {
    return t.name_by_user ?? t.name ?? t.model ?? t.id;
  }
  updateField(t) {
    var s;
    const e = t.currentTarget;
    let i = e.value;
    e instanceof HTMLInputElement && e.type === "checkbox" && (i = e.checked), e.name === "stale_after" && (i = Number(e.value));
    const o = { ...this.config, [e.name]: i };
    e.name === "color_preset" && i !== "custom" && (o.vehicle_color = ((s = F[String(i)]) == null ? void 0 : s.value) ?? o.vehicle_color), this.config = o, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: o },
        bubbles: !0,
        composed: !0
      })
    );
  }
  toggleListValue(t, e) {
    const i = t.currentTarget, o = new Set(this.config[e] ?? g[e]);
    i.checked ? o.add(i.value) : o.delete(i.value);
    const s = { ...this.config, [e]: [...o] };
    this.config = s, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: s },
        bubbles: !0,
        composed: !0
      })
    );
  }
  checklist(t, e, i) {
    const o = new Set(this.config[e] ?? g[e]);
    return h`<fieldset>
      <legend>${t}</legend>
      <div class="checks">
        ${i.map(
      ([s, r]) => h`<label class="check">
              <input
                type="checkbox"
                .value=${s}
                .checked=${o.has(s)}
                @change=${(a) => this.toggleListValue(a, e)}
              />
              ${r}
            </label>`
    )}
      </div>
    </fieldset>`;
  }
  render() {
    return h`<div class="grid">
      <section>
        <h3>Vehículo</h3>
        <label
          >Vehículo conectado
          <select name="device" @change=${this.updateField}>
            <option value="">Selecciona un vehículo My Honda+</option>
            ${this.devices.map(
      (t) => h`<option value=${t.id} ?selected=${this.config.device === t.id}>
                  ${this.deviceName(t)}
                </option>`
    )}
          </select>
          <span class="hint"
            >${this.loading ? "Buscando vehículos…" : `${this.devices.length} vehículo(s) encontrado(s)`}</span
          >
        </label>
        <label
          >Nombre
          <input name="name" .value=${this.config.name ?? ""} @change=${this.updateField} />
        </label>
        <label
          >Modelo visual
          <select name="vehicle_model" @change=${this.updateField}>
            ${[
      ["auto", "Automático"],
      ["civic", "Honda Civic"],
      ["hrv", "Honda HR-V"],
      ["crv", "Honda CR-V"],
      ["zrv", "Honda ZR-V"],
      ["jazz", "Honda Jazz"],
      ["honda_e", "Honda e"],
      ["eny1", "Honda e:Ny1"],
      ["generic", "Honda genérico"]
    ].map(
      ([t, e]) => h`<option value=${t} ?selected=${this.config.vehicle_model === t}>
                  ${e}
                </option>`
    )}
          </select>
        </label>
      </section>

      <section>
        <h3>Apariencia</h3>
        <label
          >Color de fábrica
          <select name="color_preset" @change=${this.updateField}>
            ${Object.entries(F).map(
      ([t, e]) => h`<option value=${t} ?selected=${this.config.color_preset === t}>
                  ${e.label}
                </option>`
    )}
          </select>
        </label>
        ${this.config.color_preset === "custom" ? h`<label
                >Color personalizado
                <input
                  name="vehicle_color"
                  type="color"
                  .value=${this.config.vehicle_color ?? g.vehicle_color}
                  @change=${this.updateField}
                />
              </label>` : d}
        <label
          >Diseño
          <select name="layout" @change=${this.updateField}>
            <option value="full" ?selected=${this.config.layout === "full"}>Completo</option>
            <option value="compact" ?selected=${this.config.layout === "compact"}>Compacto</option>
          </select>
        </label>
        <label
          >Imagen
          <select name="image_mode" @change=${this.updateField}>
            <option value="rendered" ?selected=${this.config.image_mode === "rendered"}>
              Ilustración recoloreable
            </option>
            <option value="custom" ?selected=${this.config.image_mode === "custom"}>
              Imagen personalizada
            </option>
          </select>
        </label>
        ${this.config.image_mode === "custom" ? h`<label
                >URL de imagen
                <input
                  name="vehicle_image"
                  .value=${this.config.vehicle_image ?? ""}
                  placeholder="/local/coches/mi-civic.png"
                  @change=${this.updateField}
                />
              </label>` : d}
      </section>

      <section>
        <h3>Contenido</h3>
        ${this.checklist("Métricas", "metrics", [
      ["range", "Autonomía"],
      ["battery", "Batería"],
      ["odometer", "Kilometraje"]
    ])}
        ${this.checklist("Controles", "controls", [
      ["lock", "Cierre"],
      ["climate", "Climatización"],
      ["refresh", "Actualizar"],
      ["location", "Ubicación"]
    ])}
      </section>

      <section>
        <h3>Comportamiento</h3>
        <label
          >Idioma
          <select name="locale" @change=${this.updateField}>
            <option value="auto" ?selected=${this.config.locale === "auto"}>Automático</option>
            <option value="es" ?selected=${this.config.locale === "es"}>Español</option>
            <option value="en" ?selected=${this.config.locale === "en"}>English</option>
            <option value="gl" ?selected=${this.config.locale === "gl"}>Galego</option>
          </select>
        </label>
        <label
          >Datos antiguos después de (segundos)
          <input
            name="stale_after"
            type="number"
            min="300"
            step="300"
            .value=${String(this.config.stale_after ?? g.stale_after)}
            @change=${this.updateField}
          />
        </label>
        <label class="check"
          ><input
            name="show_controls"
            type="checkbox"
            .checked=${this.config.show_controls !== !1}
            @change=${this.updateField}
          />
          Mostrar controles</label
        >
        <label class="check"
          ><input
            name="show_model"
            type="checkbox"
            .checked=${this.config.show_model !== !1}
            @change=${this.updateField}
          />
          Mostrar modelo</label
        >
        <label class="check"
          ><input
            name="animate"
            type="checkbox"
            .checked=${this.config.animate !== !1}
            @change=${this.updateField}
          />
          Permitir animaciones</label
        >
        <label class="check"
          ><input
            name="confirm_unlock"
            type="checkbox"
            .checked=${this.config.confirm_unlock !== !1}
            @change=${this.updateField}
          />
          Confirmar antes de abrir</label
        >
        <label class="check"
          ><input
            name="debug"
            type="checkbox"
            .checked=${this.config.debug === !0}
            @change=${this.updateField}
          />
          Mostrar diagnóstico anonimizado</label
        >
      </section>
    </div>`;
  }
};
b.styles = $e`
    .grid {
      display: grid;
      gap: 16px;
      padding: 8px 0;
    }
    section {
      display: grid;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }
    h3 {
      margin: 0;
      font-size: 1rem;
    }
    label {
      display: grid;
      gap: 5px;
      font-size: 0.9rem;
    }
    input,
    select {
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    input:focus-visible,
    select:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    fieldset {
      margin: 0;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    legend {
      padding: 0 5px;
      font-size: 0.85rem;
    }
    .checks {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .check {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .check input {
      width: auto;
    }
    .hint {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    @media (max-width: 520px) {
      .checks {
        grid-template-columns: 1fr;
      }
    }
  `;
D([
  ie({ attribute: !1 })
], b.prototype, "hass", 2);
D([
  y()
], b.prototype, "config", 2);
D([
  y()
], b.prototype, "devices", 2);
D([
  y()
], b.prototype, "loading", 2);
b = D([
  xe(Ge)
], b);
const ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get MyHondaPlusVehicleCardEditor() {
    return b;
  }
}, Symbol.toStringTag, { value: "Module" }));
