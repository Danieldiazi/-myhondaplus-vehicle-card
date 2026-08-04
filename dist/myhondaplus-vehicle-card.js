/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, X = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ee = Symbol(), ne = /* @__PURE__ */ new WeakMap();
let be = class {
  constructor(e, i, o) {
    if (this._$cssResult$ = !0, o !== ee) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (X && e === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (e = ne.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), o && ne.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const De = (t) => new be(typeof t == "string" ? t : t + "", void 0, ee), $e = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((o, s, a) => o + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[a + 1], t[0]);
  return new be(i, t, ee);
}, He = (t, e) => {
  if (X) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const o = document.createElement("style"), s = V.litNonce;
    s !== void 0 && o.setAttribute("nonce", s), o.textContent = i.cssText, t.appendChild(o);
  }
}, ae = X ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const o of e.cssRules) i += o.cssText;
  return De(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Pe, defineProperty: Oe, getOwnPropertyDescriptor: Le, getOwnPropertyNames: Ne, getOwnPropertySymbols: Te, getPrototypeOf: Ie } = Object, y = globalThis, re = y.trustedTypes, Ue = re ? re.emptyScript : "", G = y.reactiveElementPolyfillSupport, L = (t, e) => t, j = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ue : null;
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
} }, te = (t, e) => !Pe(t, e), ce = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: te };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let z = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = ce) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const o = Symbol(), s = this.getPropertyDescriptor(e, o, i);
      s !== void 0 && Oe(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, o) {
    const { get: s, set: a } = Le(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: s, set(n) {
      const c = s == null ? void 0 : s.call(this);
      a == null || a.call(this, n), this.requestUpdate(e, c, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const e = Ie(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const i = this.properties, o = [...Ne(i), ...Te(i)];
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
      for (const s of o) i.unshift(ae(s));
    } else e !== void 0 && i.push(ae(e));
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
    return He(e, this.constructor.elementStyles), e;
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
    var a;
    const o = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, o);
    if (s !== void 0 && o.reflect === !0) {
      const n = (((a = o.converter) == null ? void 0 : a.toAttribute) !== void 0 ? o.converter : j).toAttribute(i, o.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var a, n;
    const o = this.constructor, s = o._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const c = o.getPropertyOptions(s), r = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((a = c.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? c.converter : j;
      this._$Em = s;
      const u = r.fromAttribute(i, c.type);
      this[s] = u ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(e, i, o, s = !1, a) {
    var n;
    if (e !== void 0) {
      const c = this.constructor;
      if (s === !1 && (a = this[e]), o ?? (o = c.getPropertyOptions(e)), !((o.hasChanged ?? te)(a, i) || o.useDefault && o.reflect && a === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(c._$Eu(e, o)))) return;
      this.C(e, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: o, reflect: s, wrapped: a }, n) {
    o && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), a !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || o || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [a, n] of this._$Ep) this[a] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, n] of s) {
        const { wrapped: c } = n, r = this[a];
        c !== !0 || this._$AL.has(a) || r === void 0 || this.C(a, void 0, n, r);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (o = this._$EO) == null || o.forEach((s) => {
        var a;
        return (a = s.hostUpdate) == null ? void 0 : a.call(s);
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
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[L("elementProperties")] = /* @__PURE__ */ new Map(), z[L("finalized")] = /* @__PURE__ */ new Map(), G == null || G({ ReactiveElement: z }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, le = (t) => t, F = N.trustedTypes, de = F ? F.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ye = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, we = "?" + $, Ze = `<${we}>`, S = document, T = () => S.createComment(""), I = (t) => t === null || typeof t != "object" && typeof t != "function", ie = Array.isArray, Re = (t) => ie(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ue = />/g, x = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, Ce = /"/g, xe = /^(?:script|style|textarea|title)$/i, Ve = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Ve(1), H = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), ge = /* @__PURE__ */ new WeakMap(), k = S.createTreeWalker(S, 129);
function Ae(t, e) {
  if (!ie(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return de !== void 0 ? de.createHTML(e) : e;
}
const je = (t, e) => {
  const i = t.length - 1, o = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = O;
  for (let c = 0; c < i; c++) {
    const r = t[c];
    let u, h, p = -1, v = 0;
    for (; v < r.length && (n.lastIndex = v, h = n.exec(r), h !== null); ) v = n.lastIndex, n === O ? h[1] === "!--" ? n = he : h[1] !== void 0 ? n = ue : h[2] !== void 0 ? (xe.test(h[2]) && (s = RegExp("</" + h[2], "g")), n = x) : h[3] !== void 0 && (n = x) : n === x ? h[0] === ">" ? (n = s ?? O, p = -1) : h[1] === void 0 ? p = -2 : (p = n.lastIndex - h[2].length, u = h[1], n = h[3] === void 0 ? x : h[3] === '"' ? Ce : pe) : n === Ce || n === pe ? n = x : n === he || n === ue ? n = O : (n = x, s = void 0);
    const b = n === x && t[c + 1].startsWith("/>") ? " " : "";
    a += n === O ? r + Ze : p >= 0 ? (o.push(u), r.slice(0, p) + ye + r.slice(p) + $ + b) : r + $ + (p === -2 ? c : b);
  }
  return [Ae(t, a + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), o];
};
class U {
  constructor({ strings: e, _$litType$: i }, o) {
    let s;
    this.parts = [];
    let a = 0, n = 0;
    const c = e.length - 1, r = this.parts, [u, h] = je(e, i);
    if (this.el = U.createElement(u, o), k.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = k.nextNode()) !== null && r.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(ye)) {
          const v = h[n++], b = s.getAttribute(p).split($), R = /([.?@])?(.*)/.exec(v);
          r.push({ type: 1, index: a, name: R[2], strings: b, ctor: R[1] === "." ? Be : R[1] === "?" ? qe : R[1] === "@" ? We : W }), s.removeAttribute(p);
        } else p.startsWith($) && (r.push({ type: 6, index: a }), s.removeAttribute(p));
        if (xe.test(s.tagName)) {
          const p = s.textContent.split($), v = p.length - 1;
          if (v > 0) {
            s.textContent = F ? F.emptyScript : "";
            for (let b = 0; b < v; b++) s.append(p[b], T()), k.nextNode(), r.push({ type: 2, index: ++a });
            s.append(p[v], T());
          }
        }
      } else if (s.nodeType === 8) if (s.data === we) r.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = s.data.indexOf($, p + 1)) !== -1; ) r.push({ type: 7, index: a }), p += $.length - 1;
      }
      a++;
    }
  }
  static createElement(e, i) {
    const o = S.createElement("template");
    return o.innerHTML = e, o;
  }
}
function P(t, e, i = t, o) {
  var n, c;
  if (e === H) return e;
  let s = o !== void 0 ? (n = i._$Co) == null ? void 0 : n[o] : i._$Cl;
  const a = I(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== a && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), a === void 0 ? s = void 0 : (s = new a(t), s._$AT(t, i, o)), o !== void 0 ? (i._$Co ?? (i._$Co = []))[o] = s : i._$Cl = s), s !== void 0 && (e = P(t, s._$AS(t, e.values), s, o)), e;
}
class Fe {
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
    k.currentNode = s;
    let a = k.nextNode(), n = 0, c = 0, r = o[0];
    for (; r !== void 0; ) {
      if (n === r.index) {
        let u;
        r.type === 2 ? u = new Z(a, a.nextSibling, this, e) : r.type === 1 ? u = new r.ctor(a, r.name, r.strings, this, e) : r.type === 6 && (u = new Ge(a, this, e)), this._$AV.push(u), r = o[++c];
      }
      n !== (r == null ? void 0 : r.index) && (a = k.nextNode(), n++);
    }
    return k.currentNode = S, s;
  }
  p(e) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(e, o, i), i += o.strings.length - 2) : o._$AI(e[i])), i++;
  }
}
class Z {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, o, s) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = o, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    e = P(this, e, i), I(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== H && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Re(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && I(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: i, _$litType$: o } = e, s = typeof o == "number" ? this._$AC(e) : (o.el === void 0 && (o.el = U.createElement(Ae(o.h, o.h[0]), this.options)), o);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === s) this._$AH.p(i);
    else {
      const n = new Fe(s, this), c = n.u(this.options);
      n.p(i), this.T(c), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = ge.get(e.strings);
    return i === void 0 && ge.set(e.strings, i = new U(e)), i;
  }
  k(e) {
    ie(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, s = 0;
    for (const a of e) s === i.length ? i.push(o = new Z(this.O(T()), this.O(T()), this, this.options)) : o = i[s], o._$AI(a), s++;
    s < i.length && (this._$AR(o && o._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var o;
    for ((o = this._$AP) == null ? void 0 : o.call(this, !1, !0, i); e !== this._$AB; ) {
      const s = le(e).nextSibling;
      le(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, o, s, a) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = a, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = l;
  }
  _$AI(e, i = this, o, s) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) e = P(this, e, i, 0), n = !I(e) || e !== this._$AH && e !== H, n && (this._$AH = e);
    else {
      const c = e;
      let r, u;
      for (e = a[0], r = 0; r < a.length - 1; r++) u = P(this, c[o + r], i, r), u === H && (u = this._$AH[r]), n || (n = !I(u) || u !== this._$AH[r]), u === l ? e = l : e !== l && (e += (u ?? "") + a[r + 1]), this._$AH[r] = u;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Be extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class qe extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class We extends W {
  constructor(e, i, o, s, a) {
    super(e, i, o, s, a), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = P(this, e, i, 0) ?? l) === H) return;
    const o = this._$AH, s = e === l && o !== l || e.capture !== o.capture || e.once !== o.once || e.passive !== o.passive, a = e !== l && (o === l || s);
    s && this.element.removeEventListener(this.name, this, o), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ge {
  constructor(e, i, o) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const J = N.litHtmlPolyfillSupport;
J == null || J(U, Z), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.3");
const Ye = (t, e, i) => {
  const o = (i == null ? void 0 : i.renderBefore) ?? e;
  let s = o._$litPart$;
  if (s === void 0) {
    const a = (i == null ? void 0 : i.renderBefore) ?? null;
    o._$litPart$ = s = new Z(e.insertBefore(T(), a), a, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
class D extends z {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ye(i, this.renderRoot, this.renderOptions);
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
    return H;
  }
}
var ve;
D._$litElement$ = !0, D.finalized = !0, (ve = M.litElementHydrateSupport) == null || ve.call(M, { LitElement: D });
const K = M.litElementPolyfillSupport;
K == null || K({ LitElement: D });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ke = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Je = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: te }, Ke = (t = Je, e, i) => {
  const { kind: o, metadata: s } = i;
  let a = globalThis.litPropertyMetadata.get(s);
  if (a === void 0 && globalThis.litPropertyMetadata.set(s, a = /* @__PURE__ */ new Map()), o === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(i.name, t), o === "accessor") {
    const { name: n } = i;
    return { set(c) {
      const r = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, r, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, t, c), c;
    } };
  }
  if (o === "setter") {
    const { name: n } = i;
    return function(c) {
      const r = this[n];
      e.call(this, c), this.requestUpdate(n, r, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function oe(t) {
  return (e, i) => typeof i == "object" ? Ke(t, e, i) : ((o, s, a) => {
    const n = s.hasOwnProperty(a);
    return s.constructor.createProperty(a, o), n ? Object.getOwnPropertyDescriptor(s, a) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(t) {
  return oe({ ...t, state: !0, attribute: !1 });
}
const B = "myhondaplus-vehicle-card", Qe = "myhondaplus-vehicle-card-editor", Me = "0.7.1", C = {
  type: `custom:${B}`,
  name: "My Honda+",
  vehicle_color: "#a51d2d",
  color_preset: "rallye_red",
  image_mode: "rendered",
  vehicle_model: "auto",
  vehicle_scale: 100,
  vehicle_alignment: "center",
  vehicle_shadow: !0,
  shadow_intensity: 60,
  layout: "full",
  stale_after: 21600,
  show_controls: !0,
  show_model: !0,
  animate: !0,
  confirm_unlock: !0,
  locale: "auto",
  debug: !1,
  controls: ["lock", "climate", "horn_lights", "refresh", "location"],
  metrics: ["range", "battery", "odometer", "trip_distance", "trip_consumption"]
}, q = {
  rallye_red: { label: "Rallye Red", value: "#a51d2d", accent: "#ef8a92" },
  platinum_white: { label: "Platinum White Pearl", value: "#d9dcde", accent: "#ffffff" },
  crystal_black: { label: "Crystal Black Pearl", value: "#202326", accent: "#70777d" },
  sonic_grey: { label: "Sonic Grey Pearl", value: "#7f8789", accent: "#cbd0d1" },
  urban_grey: { label: "Urban Grey Pearl", value: "#6e706d", accent: "#b8bab5" },
  premium_blue: { label: "Premium Crystal Blue", value: "#1f4f7c", accent: "#74a9dd" },
  canyon_river_blue: { label: "Canyon River Blue", value: "#35566f", accent: "#89a9bf" },
  silver: { label: "Silver Metallic", value: "#aeb4b8", accent: "#eef1f3" },
  custom: { label: "Personalizado", value: "#a51d2d", accent: "#ef8a92" }
}, Xe = [
  "lock",
  "range",
  "battery",
  "odometer",
  "updated",
  "climate",
  "charging",
  "refresh",
  "refresh_cached",
  "horn_lights",
  "location",
  "doors",
  "windows",
  "trunk",
  "hood",
  "lights",
  "trip_distance",
  "trip_consumption",
  "trip_duration"
];
function _e(t, e, i, o) {
  var s;
  return {
    cardVersion: Me,
    homeAssistantVersion: (s = t == null ? void 0 : t.config) == null ? void 0 : s.version,
    model: i,
    locale: o,
    entities: Xe.map((a) => {
      const n = e[a], c = n == null ? void 0 : n.split(".")[0];
      return {
        key: a,
        entityId: c ? `${c}.[redacted]` : void 0,
        available: !!(n && (t != null && t.states[n]))
      };
    })
  };
}
function me(t) {
  return JSON.stringify(t, null, 2);
}
const e1 = {
  lock: { domains: ["lock"], hints: ["doors", "door_lock", "lock"] },
  range: { domains: ["sensor"], hints: ["total_range", "range_climate_off", "range"] },
  battery: { domains: ["sensor"], hints: ["battery_level", "ev_battery"] },
  odometer: { domains: ["sensor"], hints: ["odometer", "mileage"] },
  updated: { domains: ["sensor"], hints: ["last_updated", "updated"] },
  climate: { domains: ["switch"], hints: ["climate", "preconditioning"] },
  charging: {
    domains: ["binary_sensor", "sensor", "switch"],
    hints: ["charging", "charge_status", "plugged"]
  },
  refresh: { domains: ["button"], hints: ["refresh_from_car"] },
  refresh_cached: {
    domains: ["button"],
    hints: ["refresh_cached", "refresh"],
    excludes: ["refresh_from_car"]
  },
  horn_lights: { domains: ["button"], hints: ["horn_lights", "horn_and_lights"] },
  location: { domains: ["device_tracker"], hints: ["location", "car_finder"] },
  doors: { domains: ["binary_sensor"], hints: ["doors", "door"] },
  windows: { domains: ["binary_sensor"], hints: ["windows", "window"] },
  trunk: { domains: ["binary_sensor"], hints: ["trunk", "tailgate", "boot"] },
  hood: { domains: ["binary_sensor"], hints: ["hood", "bonnet"] },
  lights: { domains: ["binary_sensor"], hints: ["lights", "headlights"] },
  trip_distance: {
    domains: ["sensor"],
    hints: ["distance_this_month", "trip_distance", "total_distance"]
  },
  trip_consumption: {
    domains: ["sensor"],
    hints: ["avg_consumption_this_month", "average_consumption", "avg_consumption"]
  },
  trip_duration: {
    domains: ["sensor"],
    hints: ["driving_time_this_month", "trip_duration", "driving_time"]
  }
}, fe = (t) => [t.entity_id, t.unique_id, t.translation_key, t.original_name].filter(Boolean).join(" ").toLowerCase();
function Se(t, e = {}) {
  const i = { ...e };
  for (const [o, s] of Object.entries(e1)) {
    if (i[o]) continue;
    const a = t.filter((n) => n.platform === "myhondaplus").filter((n) => !n.disabled_by).filter((n) => s.domains.includes(n.entity_id.split(".")[0] ?? "")).filter((n) => {
      const c = fe(n);
      return !(s.excludes ?? []).some((r) => c.includes(r));
    }).map((n) => {
      const c = fe(n), r = s.hints.reduce(
        (u, h, p) => u + (c.includes(h) ? 100 - p : 0),
        0
      );
      return { entry: n, score: r };
    }).filter(({ score: n }) => n > 0).sort((n, c) => c.score - n.score)[0];
    a && (i[o] = a.entry.entity_id);
  }
  return i;
}
function Ee(t, e, i = [], o, s = {}) {
  const a = e.filter((h) => h.platform === "myhondaplus"), n = new Set(
    a.filter((h) => h.device_id).map((h) => h.device_id)
  ), c = t.filter((h) => n.has(h.id)), r = o ? t.find((h) => h.id === o) : void 0, u = r ? Se(
    a.filter((h) => h.device_id === r.id),
    s
  ) : {};
  return {
    integrationDetected: a.length > 0 || i.includes("myhondaplus"),
    vehicles: c,
    selectedDevice: r,
    entities: u,
    compatibleEntityCount: Object.values(u).filter(Boolean).length
  };
}
const t1 = {
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
    trip_distance: "Distance this month",
    trip_consumption: "Average consumption",
    trip_duration: "Driving time",
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
    unavailable: "No data",
    unlock: "Unlock",
    lock: "Lock",
    climate: "Climate",
    refresh: "Refresh",
    refresh_cached: "Refresh cached data",
    refresh_from_car: "Refresh from car",
    horn_lights: "Horn & lights",
    location: "Location",
    confirm_unlock: "Unlock the vehicle doors?",
    action_failed: "The vehicle action could not be completed.",
    discovery_failed: "Vehicle entities could not be discovered.",
    action_in_progress: "Action in progress",
    vehicle_controls: "Vehicle controls",
    diagnostics: "Diagnostics",
    copy_diagnostics: "Copy anonymized diagnostics",
    diagnostics_copied: "Diagnostics copied",
    custom_image_failed: "The custom image could not be loaded. Showing the Honda fallback.",
    editor_vehicle: "Vehicle",
    editor_select_vehicle: "Select a My Honda+ vehicle",
    editor_searching_vehicles: "Searching for vehicles…",
    editor_vehicles_found: "Vehicles found: {count}",
    editor_name: "Name",
    editor_visual_model: "Visual model",
    editor_automatic: "Automatic",
    editor_generic_honda: "Generic Honda",
    editor_appearance: "Appearance",
    editor_layout: "Layout",
    editor_full: "Full",
    editor_compact: "Compact",
    editor_vehicle_scale: "Vehicle scale (%)",
    editor_alignment: "Alignment",
    editor_left: "Left",
    editor_center: "Center",
    editor_right: "Right",
    editor_show_shadow: "Show color shadow",
    editor_shadow_color: "Shadow color",
    editor_custom: "Custom",
    editor_custom_shadow_color: "Custom shadow color",
    editor_shadow_intensity: "Shadow intensity (%)",
    editor_image: "Image",
    editor_included_art: "Included artwork",
    editor_custom_image: "Custom image",
    editor_image_url: "Image URL",
    editor_content: "Content",
    editor_metrics: "Metrics",
    editor_controls: "Controls",
    editor_locking: "Locking",
    editor_behavior: "Behavior",
    editor_language: "Language",
    editor_stale_after: "Data considered stale after (seconds)",
    editor_show_controls: "Show controls",
    editor_show_model: "Show model",
    editor_allow_animations: "Allow animations",
    editor_confirm_unlock: "Confirm before unlocking",
    editor_show_diagnostics: "Show anonymized diagnostics",
    editor_not_available: "not available",
    editor_checking_integration: "Checking the My Honda+ integration…",
    editor_integration_detected: "My Honda+ integration detected",
    editor_integration_not_detected: "My Honda+ integration not detected",
    editor_install_or_configure_integration: "Install or configure My Honda+ for Home Assistant before using this card.",
    editor_integration_instructions: "Open integration instructions",
    editor_no_vehicles_configured: "No configured vehicle with My Honda+ entities was found.",
    editor_redetect_entities: "Detect integration and entities again",
    editor_capabilities: "Detected capabilities",
    editor_states: "States",
    editor_no_compatible_entities: "No compatible entities were detected for this vehicle.",
    card_checking_integration: "Checking the My Honda+ integration…",
    card_integration_not_detected: "My Honda+ integration was not detected",
    card_no_vehicles_configured: "No configured My Honda+ vehicle was found",
    card_vehicle_not_found: "The configured vehicle is no longer available",
    card_no_compatible_entities: "No compatible entities were found for this vehicle"
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
    trip_distance: "Distancia este mes",
    trip_consumption: "Consumo medio",
    trip_duration: "Tiempo de conducción",
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
    unavailable: "Sin datos",
    unlock: "Abrir",
    lock: "Cerrar",
    climate: "Clima",
    refresh: "Actualizar",
    refresh_cached: "Actualizar datos guardados",
    refresh_from_car: "Actualizar desde el coche",
    horn_lights: "Bocina y luces",
    location: "Ubicación",
    confirm_unlock: "¿Abrir las puertas del vehículo?",
    action_failed: "No se pudo completar la acción del vehículo.",
    discovery_failed: "No se pudieron detectar las entidades del vehículo.",
    action_in_progress: "Acción en curso",
    vehicle_controls: "Controles del vehículo",
    diagnostics: "Diagnóstico",
    copy_diagnostics: "Copiar diagnóstico anonimizado",
    diagnostics_copied: "Diagnóstico copiado",
    custom_image_failed: "No se pudo cargar la imagen personalizada. Se muestra el logo de Honda.",
    editor_vehicle: "Vehículo",
    editor_select_vehicle: "Selecciona un vehículo My Honda+",
    editor_searching_vehicles: "Buscando vehículos…",
    editor_vehicles_found: "Vehículos encontrados: {count}",
    editor_name: "Nombre",
    editor_visual_model: "Modelo visual",
    editor_automatic: "Automático",
    editor_generic_honda: "Honda genérico",
    editor_appearance: "Apariencia",
    editor_layout: "Diseño",
    editor_full: "Completo",
    editor_compact: "Compacto",
    editor_vehicle_scale: "Escala del vehículo (%)",
    editor_alignment: "Alineación",
    editor_left: "Izquierda",
    editor_center: "Centro",
    editor_right: "Derecha",
    editor_show_shadow: "Mostrar sombra de color",
    editor_shadow_color: "Color de la sombra",
    editor_custom: "Personalizado",
    editor_custom_shadow_color: "Color personalizado de la sombra",
    editor_shadow_intensity: "Intensidad de la sombra (%)",
    editor_image: "Imagen",
    editor_included_art: "Ilustración incluida",
    editor_custom_image: "Imagen personalizada",
    editor_image_url: "URL de imagen",
    editor_content: "Contenido",
    editor_metrics: "Métricas",
    editor_controls: "Controles",
    editor_locking: "Cierre",
    editor_behavior: "Comportamiento",
    editor_language: "Idioma",
    editor_stale_after: "Datos antiguos después de (segundos)",
    editor_show_controls: "Mostrar controles",
    editor_show_model: "Mostrar modelo",
    editor_allow_animations: "Permitir animaciones",
    editor_confirm_unlock: "Confirmar antes de abrir",
    editor_show_diagnostics: "Mostrar diagnóstico anonimizado",
    editor_not_available: "no disponible",
    editor_checking_integration: "Comprobando la integración My Honda+…",
    editor_integration_detected: "Integración My Honda+ detectada",
    editor_integration_not_detected: "Integración My Honda+ no detectada",
    editor_install_or_configure_integration: "Instala o configura My Honda+ for Home Assistant antes de utilizar esta tarjeta.",
    editor_integration_instructions: "Abrir instrucciones de la integración",
    editor_no_vehicles_configured: "No se encontró ningún vehículo configurado con entidades de My Honda+.",
    editor_redetect_entities: "Volver a detectar integración y entidades",
    editor_capabilities: "Capacidades detectadas",
    editor_states: "Estados",
    editor_no_compatible_entities: "No se detectaron entidades compatibles para este vehículo.",
    card_checking_integration: "Comprobando la integración My Honda+…",
    card_integration_not_detected: "No se detectó la integración My Honda+",
    card_no_vehicles_configured: "No se encontró ningún vehículo My Honda+ configurado",
    card_vehicle_not_found: "El vehículo configurado ya no está disponible",
    card_no_compatible_entities: "No se encontraron entidades compatibles para este vehículo"
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
    trip_distance: "Distancia este mes",
    trip_consumption: "Consumo medio",
    trip_duration: "Tempo de condución",
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
    unavailable: "Sen datos",
    unlock: "Abrir",
    lock: "Pechar",
    climate: "Clima",
    refresh: "Actualizar",
    refresh_cached: "Actualizar datos gardados",
    refresh_from_car: "Actualizar desde o coche",
    horn_lights: "Bucina e luces",
    location: "Localización",
    confirm_unlock: "Abrir as portas do vehículo?",
    action_failed: "Non se puido completar a acción do vehículo.",
    discovery_failed: "Non se puideron detectar as entidades do vehículo.",
    action_in_progress: "Acción en curso",
    vehicle_controls: "Controis do vehículo",
    diagnostics: "Diagnóstico",
    copy_diagnostics: "Copiar diagnóstico anonimizado",
    diagnostics_copied: "Diagnóstico copiado",
    custom_image_failed: "Non se puido cargar a imaxe personalizada. Móstrase o logo de Honda.",
    editor_vehicle: "Vehículo",
    editor_select_vehicle: "Selecciona un vehículo My Honda+",
    editor_searching_vehicles: "Buscando vehículos…",
    editor_vehicles_found: "Vehículos atopados: {count}",
    editor_name: "Nome",
    editor_visual_model: "Modelo visual",
    editor_automatic: "Automático",
    editor_generic_honda: "Honda xenérico",
    editor_appearance: "Aparencia",
    editor_layout: "Deseño",
    editor_full: "Completo",
    editor_compact: "Compacto",
    editor_vehicle_scale: "Escala do vehículo (%)",
    editor_alignment: "Aliñamento",
    editor_left: "Esquerda",
    editor_center: "Centro",
    editor_right: "Dereita",
    editor_show_shadow: "Mostrar sombra de cor",
    editor_shadow_color: "Cor da sombra",
    editor_custom: "Personalizado",
    editor_custom_shadow_color: "Cor personalizada da sombra",
    editor_shadow_intensity: "Intensidade da sombra (%)",
    editor_image: "Imaxe",
    editor_included_art: "Ilustración incluída",
    editor_custom_image: "Imaxe personalizada",
    editor_image_url: "URL da imaxe",
    editor_content: "Contido",
    editor_metrics: "Métricas",
    editor_controls: "Controis",
    editor_locking: "Pechadura",
    editor_behavior: "Comportamento",
    editor_language: "Idioma",
    editor_stale_after: "Datos antigos despois de (segundos)",
    editor_show_controls: "Mostrar controis",
    editor_show_model: "Mostrar modelo",
    editor_allow_animations: "Permitir animacións",
    editor_confirm_unlock: "Confirmar antes de abrir",
    editor_show_diagnostics: "Mostrar diagnóstico anonimizado",
    editor_not_available: "non dispoñible",
    editor_checking_integration: "Comprobando a integración My Honda+…",
    editor_integration_detected: "Integración My Honda+ detectada",
    editor_integration_not_detected: "Integración My Honda+ non detectada",
    editor_install_or_configure_integration: "Instala ou configura My Honda+ for Home Assistant antes de utilizar esta tarxeta.",
    editor_integration_instructions: "Abrir instrucións da integración",
    editor_no_vehicles_configured: "Non se atopou ningún vehículo configurado con entidades de My Honda+.",
    editor_redetect_entities: "Volver detectar a integración e as entidades",
    editor_capabilities: "Capacidades detectadas",
    editor_states: "Estados",
    editor_no_compatible_entities: "Non se detectaron entidades compatibles para este vehículo.",
    card_checking_integration: "Comprobando a integración My Honda+…",
    card_integration_not_detected: "Non se detectou a integración My Honda+",
    card_no_vehicles_configured: "Non se atopou ningún vehículo My Honda+ configurado",
    card_vehicle_not_found: "O vehículo configurado xa non está dispoñible",
    card_no_compatible_entities: "Non se atoparon entidades compatibles para este vehículo"
  }
};
function se(t) {
  const e = t == null ? void 0 : t.toLowerCase().split(/[-_]/)[0];
  return e === "en" || e === "gl" ? e : "es";
}
function Q(t, e, i = {}) {
  const o = se(e);
  let s = t1[o][t];
  for (const [a, n] of Object.entries(i))
    s = s.replaceAll(`{${a}}`, String(n));
  return s;
}
const i1 = [
  ["civic", /civic/i],
  ["hrv", /\bhr[- ]?v\b/i],
  ["crv", /\bcr[- ]?v\b/i],
  ["zrv", /\bzr[- ]?v\b/i],
  ["jazz", /jazz|fit/i],
  ["eny1", /\be:?ny1\b/i],
  ["honda_e", /honda\s*e\b/i]
];
function o1(t) {
  var i;
  const e = [t == null ? void 0 : t.name_by_user, t == null ? void 0 : t.name, t == null ? void 0 : t.model, t == null ? void 0 : t.manufacturer].filter(Boolean).join(" ");
  return ((i = i1.find(([, o]) => o.test(e))) == null ? void 0 : i[0]) ?? "generic";
}
function s1(t) {
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
const n1 = '<svg xmlns="http://www.w3.org/2000/svg" width="623" height="300" viewBox="0 0 623 300" role="img" aria-label="Honda Civic vista lateral"><title>Honda Civic - vista lateral</title><path fill="currentColor" fill-rule="evenodd" d="M130.8 247.2C122.5 246.4 114 242.3 108 236.2C105.9 234.1 102 229 102 228.3C102 228.3 101.8 227.9 101.5 227.5C100.9 226.6 99.1 222.4 98.6 220.4C96.5 213.4 96.6 205.7 98.7 198.8C102.3 186.7 112.3 176.8 124.2 173.5C128.9 172.2 129.6 172.1 134.9 172.1C139.1 172.1 140.3 172.2 142.4 172.7C158.4 176.3 170.1 188.8 172.3 204.7C172.7 207.9 172.4 214.7 171.8 217.5C167.3 236.8 150.3 249.1 130.8 247.2ZM445.8 247.2C437.5 246.4 429.2 242.4 423 236.3C418 231.3 414.7 225.5 412.9 218.3C412.2 215.2 412.1 215 412.1 209.9C412.1 205.2 412.2 204.3 412.7 202C414.8 192.9 419.5 185.5 426.6 179.9C429.2 177.9 429.8 177.5 433.4 175.8C436.8 174.1 438.5 173.5 442.1 172.7C445.6 171.9 453.8 171.9 456.9 172.6C467.5 175 475.1 180.1 481.1 188.7C481.6 189.4 482 190.1 482 190.1C482 190.2 482.3 190.7 482.6 191.2C484.8 194.5 486.8 201.1 487.3 206.2C489.4 230 469.6 249.5 445.8 247.2ZM142.4 244.3C145.7 243.5 147.3 242.9 150.6 241.2C171.8 230.8 176.8 202.7 160.6 185.5C152.6 177 140.9 172.9 129.7 174.7C114 177.2 102.3 188.8 99.8 204.3C99.4 207.4 99.5 214.1 100.1 216.9C102.2 226.1 107.6 234 115.2 239.1C119.8 242.1 123.5 243.6 130.2 244.8C132 245.2 140.2 244.8 142.4 244.3ZM455.5 244.6C466.7 242.7 476.4 235.5 481.3 225.4C484.3 219.3 485.1 215.7 484.9 208.9C484.8 202.9 484 199.4 481.8 194.8C477.5 185.8 470 179.1 460.9 176.1C442.3 170 422.3 180 416.1 198.6C410.1 216.4 419.3 235.6 437.1 242.7C442.2 244.8 449.9 245.6 455.5 244.6ZM130.4 235C125.2 234.2 119.7 231.1 115.8 226.9C105.4 215.5 107.5 197.3 120.4 188.5C125 185.4 129.1 184.1 134.9 184.1C141.5 184.1 147.3 186.4 152.2 190.8C166.8 204.3 161.2 228.4 142.1 234.3C139.9 235 139.2 235.1 135.6 235.1C133.4 235.2 131.1 235.1 130.4 235ZM445.3 235C436.4 233.5 428.4 226.7 425.4 218C420.5 203.8 428.9 188.5 443.9 184.7C446.6 184 452.3 183.9 455.1 184.6C464.8 186.9 471.6 193.4 474.7 203.4C475 204.6 475.1 205.8 475.1 209.6C475.1 214.1 475.1 214.5 474.4 216.8C471.5 226.3 463.7 233.3 454.1 235C452.4 235.3 447.2 235.3 445.3 235ZM140.5 232.3C147.5 230.4 153.3 225.5 156.3 218.8C158 214.8 158.6 208.7 157.5 204.4C154.8 193.7 145.7 186.4 134.9 186.5C116.2 186.5 105.3 206.8 115.4 222.6C120.6 230.6 131.2 234.7 140.5 232.3ZM455.5 232.3C465.4 229.7 472.5 221 472.9 210.9C473.2 204.1 471 198.3 466.4 193.6C463.2 190.4 460.9 188.9 457.5 187.7C445.5 183.7 432.8 189.5 428 201.2C426.1 205.9 426 212.6 427.8 217.6C430.7 225.7 438.4 231.8 446.8 232.8C448.9 233.1 453.4 232.8 455.5 232.3ZM132.2 230C125.5 229.3 118.7 224 116 217.6C112.4 208.9 115.1 199.1 122.6 193.4C134.1 184.8 150.1 190.2 154.5 204.2C155.5 207.2 155.4 212.5 154.4 215.5C151.7 223.7 144.9 229.2 136.6 230C135.4 230.1 134.3 230.2 134.1 230.2C134 230.2 133.1 230.1 132.2 230ZM447.4 230C442.8 229.5 437.3 226.6 434.3 223C425.4 212.4 428.9 196.8 441.4 191.1C452.8 185.9 466 192.2 469.5 204.6C470.3 207.5 470.3 212.3 469.4 215.1C466.4 224.9 457.4 231 447.4 230ZM137.5 227.8C137.9 227.5 137.9 224.8 137.6 219.9L137.4 217.6 134.8 217.6C132.8 217.6 132.2 217.7 132.1 218C132.1 218.2 132 220.4 131.9 222.9C131.7 227.2 131.7 227.5 132.2 227.7C132.7 228 137 228.1 137.5 227.8ZM452.4 227.8C452.8 227.7 452.9 224.4 452.5 219.9L452.4 217.6 449.8 217.6L447.1 217.6 447 220C446.6 225 446.6 227.5 447 227.8C447.4 228 451.7 228.1 452.4 227.8ZM129.9 223.5C130.2 216.8 130.2 216.4 129.7 216.3C129.4 216.2 128.9 216.3 128.7 216.5C128.1 216.7 124.7 218.1 122 219.1C119.4 220 119.4 220.3 121.7 222.5C124 224.8 128.5 227.4 129.4 227.1C129.6 227 129.8 225.9 129.9 223.5ZM144.2 225.5C146 224.4 149.9 220.7 149.7 220.2C149.6 219.8 147.8 219.1 143.5 217.5C142.3 217.1 141.3 216.6 141.1 216.5C140.8 216.1 139.9 216.2 139.6 216.6C139.4 216.8 139.4 218 139.5 220.1C139.6 221.9 139.8 224.1 139.8 225C139.8 227.6 140.4 227.6 144.2 225.5ZM179.4 227C178.3 226.3 178.3 225.7 178.2 217.1C178.2 206.2 177.9 203.4 176.2 198.1C171.8 184.7 161.1 174.1 147.5 170C141.4 168.1 133.4 167.6 127.3 168.7C114.4 171.1 104.1 177.3 98.1 186.6C97.6 187.4 97 188.4 96.8 188.8C95.7 190.4 93.8 194.6 93 197.5C91.7 201.7 91.5 204 91.3 212.9L91.1 221.5 90.4 222.3C88.9 223.9 90.9 223.8 60.4 223.8L32.4 223.8 31.6 222.9C30.1 221.4 30.3 220.7 34.1 216.8C35.4 215.5 36.4 214.3 36.5 214.2C36.5 214 35.1 210.2 33.5 206.2C32.7 204.2 32.1 202.8 30.5 198.6C29.7 196.4 28.8 194.2 28.5 193.6C27.5 191.4 27.2 189.3 27.6 187.7C28 186.4 29.1 184.3 29.7 183.9C30.6 183.3 30.4 180.7 29.5 180.1C29.3 180 28.9 179.6 28.6 179.2C28 178.5 28 178.2 28 172.8C28 167.6 28 167.1 28.6 165.9C31.9 158.2 42.7 152.2 62.6 147.1C78 143.2 104.3 139.3 125 137.8C126.9 137.6 129.8 137.4 131.5 137.3C134.5 137 138.6 136.8 148 136.3C150.3 136.1 155.8 136 160.4 135.9L168.6 135.7 169.5 135C170.2 134.5 181.7 126.8 185.5 124.4C188.8 122.3 191.3 120.7 196.5 117.5C199.7 115.5 202.7 113.7 203 113.5C203.3 113.3 203.8 113 204.1 112.9C204.4 112.7 205 112.3 205.6 112C206.1 111.7 206.9 111.3 207.3 111C207.8 110.8 208.7 110.2 209.5 109.8C210.9 108.9 212.8 107.9 214.5 106.9C215 106.7 215.8 106.2 216.4 105.9C219.6 104.1 232.2 97.6 234.6 96.6C235 96.4 236.7 95.7 238.2 95C239.8 94.3 241.3 93.6 241.5 93.5C241.7 93.4 242.7 93 243.6 92.7C244.5 92.3 246 91.7 246.9 91.3C249.5 90.3 255.9 88.3 257.8 87.9C262.6 86.7 264.2 86.4 267.5 85.9C278.9 83.9 294.8 82.5 311.2 82C322.9 81.6 352.5 81.8 360.8 82.4C364.1 82.6 368.8 82.9 371.1 83C391.8 84.2 413.3 87.2 429.5 91C430.7 91.3 432.4 91.7 433.3 91.9C434.3 92.1 435.3 92.4 435.5 92.5C435.7 92.6 436.3 92.8 436.9 92.9C437.8 93 439.5 93.5 443 94.5C443.9 94.8 445.5 95.2 446.5 95.5C447.5 95.8 448.8 96.2 449.4 96.4C449.9 96.5 451.4 97 452.6 97.4C455.6 98.3 464.7 101.3 466.9 102.1C467.8 102.5 469.1 102.9 469.6 103.1C470.2 103.3 471.6 103.8 472.8 104.2C480 107 481.4 107.6 483.7 108.5C484.3 108.8 486 109.4 487.4 110C493.7 112.6 499.8 115.3 505.4 117.9C507.8 119 509.5 119.2 520.5 120C524.4 120.3 525.9 120.4 546.5 122.3C551.7 122.7 552.1 123.2 552.3 128.7C552.4 132.5 552.7 134.1 553.5 135.1C554.2 136 557 145.4 557 146.8C557 147.8 555.7 148.8 554.5 148.9C553.2 149 553.3 148.8 551.7 152L550.4 154.6 550.6 157C551.1 163 553 168.5 556 172.3L557.4 174 559.1 174C561.9 174 563.7 175.1 564.6 177.3C565 178.2 565 179.3 564.9 186.7C564.7 196.3 564.4 203.2 564 204.5C563.4 206.8 561.1 209.5 558.9 210.6C557.5 211.3 555.6 211.8 550.6 212.5C548.6 212.8 545.4 213.2 543.4 213.5C541.5 213.8 538.4 214.2 536.6 214.5C530.5 215.4 519.6 216.9 517.4 217.2C513.8 217.7 504.5 219 501.5 219.5C497.4 220.2 495.9 220.1 494.8 219.5C493.4 218.6 493.3 218 493.2 213.8C493.2 209.3 492.9 204.8 492.4 202.6C491.8 200.3 490.7 196.4 490.5 196.1C490.4 196 490.2 195.6 490.1 195.2C489.7 193.8 487.8 190.2 486.1 187.6C481.1 180 473 173.5 464.8 170.7C458.7 168.7 455.8 168.2 449.9 168.2C429.4 168.2 412.4 180.6 407.8 198.9C406.8 202.9 406.7 204 406.5 214.7C406.4 226.4 406.4 226 404.5 226.5C404 226.6 388.8 226.7 363.9 226.7C342 226.7 321.8 226.8 318.9 226.9C307.4 227.1 179.9 227.2 179.4 227ZM444.9 222C445 219.3 445.1 216.9 445 216.7C444.9 216.1 444.5 216.1 442.6 216.8C441.8 217.2 439.8 218 438.1 218.6C436.3 219.3 435 220 434.9 220.2C434.8 220.5 435.3 221.2 436.9 222.8C439.4 225.1 442.6 227 443.9 226.9L444.6 226.9 444.9 222ZM457.8 226.1C460.1 225 461.5 223.9 463.3 222C465 220.3 465 220 463.3 219.4C462.7 219.1 460.6 218.3 458.7 217.6C455.2 216.2 454.6 216.1 454.4 216.5C454.2 216.7 454.7 226.1 454.9 226.7C455.1 227.2 455.9 227 457.8 226.1ZM251.1 224.1C353.6 223.9 403.1 223.7 403.3 223.5C403.4 223.4 403.5 223 403.6 222.5C403.8 221.4 402.9 220.6 400.3 219.6C394.1 217.1 384.5 215.3 374.3 214.7C369.5 214.5 354.3 214.6 329.4 215.1C325.8 215.2 318 215.4 312 215.5C306 215.6 297.4 215.8 292.8 215.9C288.1 216 278.8 216.1 272 216.3C265.2 216.4 253.7 216.6 246.4 216.8C187.1 217.9 181.7 218 181.4 218.2C181.1 218.4 181.2 224 181.6 224.2C181.8 224.3 184 224.4 186.4 224.3C188.9 224.3 218 224.2 251.1 224.1ZM87.7 220.8C88.5 220.3 88.7 216.7 88 216.2C87.8 216.1 78.3 216 66.1 216C54.3 215.9 43.5 215.9 42 215.9C40.6 215.9 39.3 216 39.2 216.1C38.5 216.5 34.8 220.4 34.8 220.7C34.8 220.9 39.3 221 61.1 221C75.5 221 87.5 220.9 87.7 220.8ZM123.6 216.4C126.3 215.4 127.9 214.7 128 214.4C128 214.2 127.8 213.6 127.5 213.1C127.3 212.5 127 211.6 126.9 210.9C126.7 209.5 126.6 209.5 123 210.5C121.6 210.9 119.7 211.4 118.9 211.7C116.9 212.2 116.7 212.4 116.9 213.5C117.1 214.7 118 217.3 118.3 217.7C118.7 218.2 119.1 218.1 123.6 216.4ZM151.3 217.6C151.9 216.9 153.1 212.8 152.8 212.5C152.6 212.3 147.5 210.7 144.5 210C143.1 209.6 142.8 209.8 142.8 211C142.8 211.4 142.5 212.2 142.1 212.9C141.2 214.8 140.9 214.5 146.3 216.5C147.8 217.1 149.2 217.6 149.5 217.7C150.1 218.1 150.9 218 151.3 217.6ZM437.3 216.9C443.5 214.6 443.4 214.7 442.5 213.2C442.2 212.7 441.9 211.8 441.8 211.2C441.6 209.7 441.4 209.6 439.6 210.1C435.9 211.1 435 211.3 433.5 211.8C432.6 212 431.8 212.4 431.7 212.5C431.3 213.2 433.1 218 433.7 218C434 218 435.6 217.5 437.3 216.9ZM466.3 217.4C466.8 216.6 467.8 213.8 467.8 213C467.8 212.4 467.6 212.3 466.1 211.8C462 210.6 458.5 209.7 458.2 209.8C458 209.9 457.7 210.4 457.6 211C457.6 211.6 457.2 212.6 456.9 213.2C456.4 214 456.3 214.4 456.5 214.6C456.8 214.9 464.7 217.9 465.4 218C465.7 218 466.1 217.8 466.3 217.4ZM403.4 217.5C403.5 217.4 403.6 214.5 403.6 211.1C403.7 207.7 403.8 204 404 203C405.3 193.5 409.7 184.9 416.5 178.2C428.4 166.5 448.7 162 465 167.7C467.1 168.4 472.3 170.8 473.3 171.5C474.2 172.2 474.6 172.1 476 171.3C478.4 169.9 487.1 164.2 491.2 161.2C492.4 160.4 493.8 159.4 494.2 159.1C494.7 158.8 495.7 158.1 496.4 157.6C500.2 154.8 503.6 152.3 504.1 152C506.3 150.4 507.2 149.7 507.2 149.4C507.2 149.1 505.4 148 501.2 145.8C500.1 145.2 499 144.6 498.8 144.5C498.7 144.3 497.1 144.3 495.1 144.5C493.2 144.6 488.4 144.9 484.4 145C480.4 145.1 475.2 145.4 472.9 145.5C470.5 145.6 465.5 145.9 461.8 146C444.4 146.6 436.4 147 436.1 147.3C435.9 147.5 435.3 148.2 434.8 149C431.8 153.5 422.7 165.9 417.4 172.9C404.9 188.9 395.7 199.9 391.4 204C388.2 206.9 382.9 210.2 380.1 211C377.5 211.7 378 212.1 382.2 212.6C390.9 213.7 400.1 215.9 402.4 217.4C403 217.8 403.2 217.8 403.4 217.5ZM499.9 216.8C502.4 216.4 505 216 507.9 215.6C509.2 215.4 511.3 215.1 512.4 215C514.2 214.8 516.8 214.4 523.9 213.4C526.8 213 532.3 212.2 537 211.5C544.7 210.4 548 209.9 550.8 209.5C552.3 209.2 554.2 209 554.9 208.9C557.7 208.5 561.2 205.8 561 204C560.9 203.3 560.9 203.3 558.1 203.7C555.1 204.2 552.5 204.5 549.5 204.9C547.9 205.1 545.5 205.4 544.1 205.6C540.2 206.2 533 207.2 527.4 207.9C525.9 208.1 523.8 208.3 522.9 208.5C521.2 208.8 518.8 209.1 512.9 209.9C511.2 210.1 508.7 210.4 507.2 210.6C504.5 211 502.4 211.3 498.8 211.8C497.6 211.9 496.5 212.2 496.4 212.3C496.3 212.4 496.2 213.4 496.1 214.5C496.1 216.8 496.4 217.4 497.5 217.1C497.8 217.1 498.9 216.9 499.9 216.8ZM137.4 215C143.8 211.8 140.3 202.4 133.3 204C129.8 204.8 127.8 209 129.5 212.3C130.9 215.3 134.6 216.5 137.4 215ZM190.9 215.2C191 215.1 190.8 213.4 190.3 210.7C185 183.4 184.2 165.9 187.6 153.6C188.3 151.3 188.3 151.1 188 150.8C187.2 150.3 143.9 152.3 130.9 153.5C129.4 153.6 126.7 153.9 124.9 154C123.1 154.1 120.7 154.4 119.5 154.5C118.3 154.6 115.9 154.9 114.1 155C112.3 155.2 109.6 155.4 108.1 155.6C106.6 155.8 104.5 156 103.5 156.1C102.5 156.2 101 156.4 100.2 156.5C99.5 156.7 98 156.9 96.9 157C94.7 157.1 94.3 157.5 95.5 158.1C97 158.9 104.5 164.7 110.9 170.1L111.7 170.8 113.3 170.1C117.4 168.1 123.7 166.2 126.8 165.9C127.6 165.8 128.9 165.6 129.5 165.5C131.3 165.1 138.4 165.2 141.4 165.6C144.8 166.1 150.6 167.7 152.2 168.5C152.4 168.6 153.8 169.2 155.1 169.9C160.2 172.4 163.5 174.8 168 179.2C170 181.2 174 186.1 174 186.6C174 186.7 174.3 187.2 174.6 187.7C175.8 189.3 177.9 194 178.9 196.9C180.3 201.4 181 205.2 181.2 210.5C181.3 213.7 181.4 215.2 181.6 215.4C182 215.7 190.5 215.6 190.9 215.2ZM451.6 215.3C455.7 213.8 457 208.7 454.1 205.7C452.7 204.2 451.9 203.9 449.8 203.9C448.2 203.9 447.7 204 446.7 204.5C442.4 207.1 442.9 213.4 447.6 215.2C449.2 215.8 450 215.9 451.6 215.3ZM210.1 215C216.9 214.9 227.3 214.6 233.2 214.5C243.7 214.3 265.6 213.8 293.2 213.2C317.2 212.8 317 212.8 317 212.1C317 211.8 316.8 211.2 316.6 210.7C316.1 209.3 315.1 204 314.7 200.6C313.7 189.5 313.7 168.5 314.9 153.9C315.3 148.4 315.3 148.4 313.5 148.6C312.9 148.7 304.1 148.8 293.9 148.9C275.5 149 259.7 149.2 231.8 149.7C198.1 150.3 192.2 150.5 191.8 150.7C191.5 150.9 191.1 151.5 191 152.1C190.8 152.6 190.6 153.6 190.4 154.2C189.7 156.4 189 160.4 188.6 163.9C188 169.6 188.4 183.3 189.5 189.5C189.6 190.3 189.8 191.9 190 193.2C190.3 195.9 190.6 197.9 191.7 204.6C193.1 212.8 193.5 214.5 193.8 214.9C194.1 215.3 193.7 215.3 210.1 215ZM47 212.8C47 212.5 46.9 211.8 46.7 211.4C46.4 211 45.7 209.3 45 207.6C44.3 206 43.3 203.7 42.9 202.6C42.4 201.5 41.3 198.8 40.4 196.6C39.4 194.4 38.5 192.4 38.3 192.2C38 191.8 37.5 191.7 34.6 191.8L31.4 191.9 31.4 192.5C31.4 192.8 31.7 193.7 31.9 194.4C32.2 195.1 32.8 196.5 33.2 197.5C33.6 198.5 34.3 200.2 34.6 201.1C35 202.1 35.9 204.4 36.6 206.3C37.4 208.1 38 209.8 38 209.9C38 210 38.2 210.6 38.5 211.1C38.8 211.7 39 212.3 39 212.4C39 213.2 40 213.4 43.4 213.4C46.9 213.4 46.9 213.4 47 212.8ZM71.9 212.9C72 212.6 71.8 212.2 71.6 211.9C71.3 211.6 70.6 210.6 70 209.8C68.9 208.3 68.5 207.6 66.2 204.4C64.3 201.7 62.6 199.2 61.6 197.7C60.1 195.4 58.4 194 56.1 192.8L54.2 191.9 47.7 191.8L41.2 191.7 41.2 192.3C41.2 192.6 41.3 193 41.5 193.1C41.6 193.3 47.6 206.7 50 212.2L50.5 213.2 61.1 213.2C70.5 213.2 71.8 213.2 71.9 212.9ZM88 213C88.2 212.9 88.3 211.7 88.4 209.1C88.6 202.5 89.4 198.3 91.7 192.5C93.7 187.4 97.6 181.8 102.2 177.5C104.1 175.7 104.9 175.1 107.6 173.3C108.5 172.7 108.7 172.4 108.3 171.9C108 171.5 104.3 168.2 102.1 166.5C101 165.6 99.9 164.7 99.7 164.5C99.1 163.8 99 163.9 97.5 165C94.7 167.3 89.8 170.1 86.9 171.1C81.6 173.1 78.5 173.8 70.9 174.5C56 175.9 52.9 176.4 47.4 177.8C39.2 179.9 32.7 183.6 30.8 187.3C29.9 189.1 29.6 189 42 189C53.8 189 54.4 189.1 57.2 190.4C59.7 191.6 61.6 193.3 63.4 195.9C64.2 197 66.5 200.3 68.6 203.5C70.4 206.1 72 208.4 74.2 211.6C74.7 212.3 75.2 213 75.4 213.1C75.7 213.3 87.6 213.3 88 213ZM338.8 212.3C366.4 211.7 366.3 211.7 371.4 210.9C377.8 209.8 383.4 207.4 387.7 203.8C388.5 203.1 389.3 202.5 389.6 202.2C390 201.9 393.9 197.7 396 195.4C397 194.2 402.7 187.2 407.5 181.1C411.1 176.6 415.7 170.6 423.2 160.6C423.5 160.2 424.4 159 425.1 157.9C425.9 156.8 427 155.3 427.5 154.5C428.1 153.7 429.2 152.1 430.1 150.9C430.9 149.7 431.8 148.5 432 148.2C432.2 148 432.2 147.6 432.2 147.4C432 147 431.5 147 428.1 147.1C421 147.4 395.7 147.8 367.8 148C330.3 148.3 318.7 148.5 318.3 148.8C318.2 148.9 318 149.9 317.9 151.1C317.8 152.2 317.6 155 317.4 157.3C316.5 166.4 316.3 188.9 317 198.1C317.5 204.8 318.8 211.1 319.9 212.3C320.3 212.8 320.6 212.8 323.2 212.6C324.8 212.6 331.8 212.4 338.8 212.3ZM121.9 208.8C124.4 208.2 126.5 207.6 126.7 207.4C127.1 207.1 127.1 206.4 126.6 206C126.4 205.8 125 204.1 123.4 202.3C121.9 200.4 120.5 198.8 120.4 198.8C119.2 198.5 116.5 205.6 116.5 208.9C116.5 210.3 116.3 210.3 121.9 208.8ZM153 208.1C152.9 205.9 152 203 150.8 200.7C149.7 198.6 149.4 198.4 148.4 199.5C144.7 203.9 142.7 206.6 142.8 207C142.9 207.5 143.4 207.7 146.5 208.5C148.5 209 150.5 209.6 151 209.7C151.5 209.8 152.2 209.9 152.5 209.9C153.1 209.9 153.1 209.8 153 208.1ZM436.6 208.9C438.6 208.4 440.5 207.9 440.9 207.8C442.4 207.4 442.3 207.1 438.8 202.8C437 200.6 435.4 198.8 435.3 198.8C434.2 198.8 431.9 204.2 431.4 208.2C431.1 210.4 431.1 210.4 436.6 208.9ZM468.1 209.7C468.2 209.2 467.6 205 467.3 204.1C466.2 201.6 465.8 200.8 465.2 199.8C464.4 198.6 464.2 198.5 463.6 199.2C457.2 206.9 457.1 207 457.8 207.4C458.2 207.7 466.7 210 467.4 210C467.7 210 468 209.9 468.1 209.7ZM499.5 208.8C500.4 208.6 502.8 208.3 504.9 208C506.9 207.7 510.3 207.3 512.2 207C514.2 206.7 517.2 206.3 518.9 206.1C520.5 205.9 523 205.6 524.4 205.4C528.1 204.9 533.9 204 535.4 203.9C536.1 203.8 537.8 203.6 539.2 203.4C545.7 202.5 549 202 550.2 201.9C551 201.8 552.2 201.6 552.9 201.5C553.6 201.4 555.6 201.1 557.5 200.9C560 200.6 560.9 200.4 561.3 200.1C561.7 199.7 561.7 198.7 561.9 189L562.1 178.4 561.3 177.6L560.5 176.9 548.7 177.1C542.2 177.2 535.4 177.4 533.5 177.5C531.6 177.6 528 177.9 525.4 178.1C522.8 178.3 518.4 178.7 515.6 179C509.1 179.7 509 179.7 508.7 179.2C508.2 178.5 509 178.1 511.4 177.9C512.6 177.8 514.2 177.6 514.9 177.5C516.7 177.1 525.6 176.1 533.4 175.4C537.1 175 543 174.6 550.1 174.3C553.5 174.1 553.8 173.9 552.6 172.6C551 170.6 548 162.8 548 160.5C548 159.8 547.5 159.7 546.8 160.2C545.7 160.9 545.7 160.9 539.4 160.7C528.2 160.3 526.7 159.9 518.8 155.5C517.4 154.7 516.2 154 516.2 154C516.1 154 514.8 153.3 513.4 152.5C511.9 151.7 510.6 151 510.5 151C510.4 151 508.8 152 507.1 153.3C505.3 154.6 503.6 155.8 503.2 156.1C502.9 156.3 502.1 156.9 501.4 157.4C491.6 164.3 483.6 169.6 478.8 172.4C476.5 173.7 476.5 173.5 479.2 175.7C480.7 176.8 484.6 180.7 486 182.4C491.3 189 494.8 197.4 495.8 206C495.9 207.3 496.1 208.5 496.1 208.7C496.2 209.1 497.2 209.1 499.5 208.8ZM457.2 204.3C457.3 204 458.7 202.3 460.1 200.4C462.1 197.9 462.7 196.9 462.6 196.6C462.3 196.2 459.8 194.2 458.8 193.7C458.4 193.5 458.1 193.5 457.8 193.7C457.3 194 452.3 201.2 452.3 201.7C452.3 201.9 452.8 202.3 453.4 202.6C454.1 202.9 455 203.6 455.5 204.1C456.4 205 456.7 205 457.2 204.3ZM129.4 203.9C129.9 203.4 130.7 202.8 131.3 202.5C131.9 202.2 132.2 201.8 132.2 201.6C132 200.7 126.9 193.5 126.4 193.5C126 193.5 123.8 194.9 122.6 196C122.3 196.2 122 196.7 122 196.9C122 197.5 127.7 204.8 128.2 204.8C128.4 204.8 128.9 204.4 129.4 203.9ZM144.8 200.9C146.4 198.9 147.8 197.1 147.8 196.9C147.8 196.3 143.8 193.5 143.2 193.5C142.8 193.6 142 194.5 140.7 196.5C139.7 198.1 138.5 199.8 138.1 200.4C137.7 200.9 137.3 201.5 137.3 201.5C137.3 201.6 137.8 202.1 138.5 202.6C139.3 203 140.2 203.7 140.5 204.1C140.8 204.5 141.3 204.7 141.5 204.7C141.8 204.7 143.2 203 144.8 200.9ZM444 204.1C444.4 203.7 445.2 203.1 445.9 202.6C446.8 202 447.2 201.6 447.1 201.4C446.1 199.7 441.9 193.7 441.6 193.6C440.9 193.3 436.8 196.2 436.8 196.9C436.8 197.1 437.9 198.7 439.4 200.5C440.8 202.3 442.1 204 442.3 204.3C442.6 204.9 443.3 204.9 444 204.1ZM135.4 201C135.7 200.8 136.4 199.7 137.1 198.6C137.8 197.5 138.9 195.8 139.5 194.8C140.9 192.7 141 192.3 140.1 192.1C139.7 192 139 191.9 138.5 191.7C135.1 191 129 191.6 129 192.7C129 193 129.9 194.6 131.1 196.4C134.8 202.1 134.6 201.9 135.4 201ZM451.4 199.5C454.5 194.8 455.8 192.7 455.6 192.5C454.6 191.5 449.1 191.1 445.9 191.8C443.6 192.2 443.5 192.4 444.8 194.4C448.3 200 449.3 201.5 449.7 201.4C449.9 201.4 450.7 200.5 451.4 199.5ZM35 179.6C35.8 179 39.3 177.4 41.9 176.5C44.9 175.5 45.1 175.3 44.4 173.8C43.4 171.9 44.2 168 45.9 166.2C47.1 164.9 45.9 164.6 44.4 165.7C40.6 168.4 34.8 175.5 34.1 178.1C34 178.5 33.8 178.8 33.7 178.9C33.6 179 33.5 179.3 33.5 179.7C33.5 180.2 33.6 180.3 34.1 180.1C34.4 180 34.8 179.8 35 179.6ZM32.3 175.4C33.1 173.8 35.9 170.1 37.9 168.3C39.5 166.7 39.3 166.1 37.3 166.7C37 166.8 35.5 167.1 34.1 167.4C30.6 168 30.8 167.9 30.8 172.7C30.8 177.7 31 178.1 32.3 175.4ZM52.9 173.8C56.6 173.2 60.9 172.7 68.6 172.1C77.6 171.4 81.4 170.7 86.3 168.7C90 167.2 96.8 163.2 96.8 162.5C96.8 162.4 96.2 161.8 95.4 161.3C91.1 158.1 88 157.8 77.1 159.6C68.8 161 61.1 162.3 57.8 162.9C53.7 163.6 50.9 164.8 48.7 167C47.1 168.6 46.6 169.8 46.8 172C46.9 173.1 47.1 173.4 47.7 174.1C48.3 174.5 48.7 174.7 49 174.6C49.2 174.5 51 174.2 52.9 173.8ZM37.5 164.3C39.5 163.9 41.8 163.4 42.6 163.3C43.5 163.1 44.9 162.8 45.9 162.6C47.6 162.3 49.4 161.9 54.6 161C56.1 160.7 58.6 160.3 60 160C68.8 158.4 70.6 158.1 82.8 156.3C87.5 155.5 97.5 154.3 102.2 153.7C103.6 153.6 105.6 153.4 106.9 153.3C116.3 152.2 127.9 151.2 133.1 150.9C134.6 150.8 136.8 150.6 137.9 150.5C139 150.4 142.2 150.1 145 150C147.8 149.9 151.7 149.6 153.7 149.5C155.7 149.4 161.4 149.1 166.2 148.9C171.1 148.7 177.7 148.4 180.8 148.3C183.8 148.1 187 148 187.8 148C189.2 148 189.3 148 189.7 147.2C190.3 146.1 195 141.5 197.1 140C197.9 139.5 198.4 138.5 197.9 138.5C188.9 138.2 149.7 138.9 141.9 139.5C140.1 139.6 136.8 139.9 134.5 140C129.3 140.3 122.6 140.9 116.2 141.5C113.6 141.8 110.8 142.1 110 142.1C108.6 142.3 103.7 142.8 100.4 143.3C99.3 143.4 97.1 143.7 95.6 143.9C94.1 144.1 92.6 144.3 92.3 144.4C92 144.5 90.2 144.7 88.4 145C82 146 73.3 147.6 69.4 148.5C68.8 148.6 66.9 149.1 65.1 149.5C63.3 149.9 61.4 150.4 60.8 150.6C60.1 150.8 58.7 151.2 57.6 151.5C55.1 152.2 50.1 153.9 48.1 154.7C47.3 155 46.3 155.4 45.9 155.6C45.2 155.9 40.4 158.2 39 159C38 159.5 34.5 162.3 33.4 163.5C32.3 164.6 32.3 165.4 33.3 165.1C33.6 165 35.5 164.7 37.5 164.3ZM544.1 157.7C544.5 156.9 542.7 150.4 541.4 147.4C540.2 144.8 538.6 141.6 538.2 140.9L537.7 140.2 521.6 140.2L505.6 140.2 503.5 141.3C501.4 142.4 501.3 142.5 501.9 143C502.4 143.4 506.9 146 507.1 146C507.2 146 508 146.4 509 147C509.9 147.5 511.5 148.4 512.6 149C513.6 149.5 515.4 150.5 516.4 151C517.5 151.6 519.4 152.7 520.7 153.4C523.8 155.2 527.7 156.9 529.8 157.2C531.5 157.6 536.6 157.9 541.2 158C543.4 158 544 157.9 544.1 157.7ZM548.9 151.2C550.8 147.3 551.8 146 552.9 146C554 146 553.9 145.5 552.6 144.3C550.5 142.4 546.9 141 542.9 140.6C541.1 140.4 540.9 140.6 541.6 141.6C542.6 143.1 545.6 151.4 545.9 153.5C546.1 154.7 546.4 155.3 546.8 155.1C546.9 155 547.8 153.3 548.9 151.2ZM213.9 147.4C223.8 147.2 237.4 147 244.2 146.9C251.1 146.8 260.6 146.6 265.5 146.5C270.4 146.4 283.5 146.2 294.7 146.1C314 145.9 315.1 145.9 315.5 145.5C315.8 145.2 316 144.7 316 144.4C316 143.8 316.9 141 317.9 138.8C318.3 138 318.4 137.3 318.3 137.2C318.1 137 304.1 137.1 268.5 137.7C261.4 137.9 245.2 138 232.4 138.1C202 138.4 203.7 138.3 202.8 138.9C202.2 139.3 198.2 142.8 195.5 145.1C195 145.6 194.2 146.3 193.8 146.7C192.6 147.7 192.9 148.1 194.6 147.9C195.3 147.8 204 147.6 213.9 147.4ZM343.1 145.5C355.6 145.4 366.4 145.2 367.1 145.1C367.8 145.1 374.2 145 381.2 145C395.7 144.9 413.4 144.6 426.1 144.3C435.9 144 435.4 144.1 435.2 141.6C435.1 139.8 434 137.8 431.9 135.6L430.6 134.2 429.2 134.5C428.4 134.7 421.4 134.9 411.4 135.1C395.5 135.4 389.5 135.6 349 136.4C338.8 136.6 328.6 136.8 326.5 136.8C323.8 136.8 322.5 136.9 322.1 137.1C321.5 137.5 319.2 142.7 318.9 144.5C318.7 145.5 319.2 146.1 320 145.9C320.2 145.8 330.6 145.7 343.1 145.5ZM445.8 143.7C448.6 143.6 455.3 143.3 460.6 143.1C466 142.9 472.6 142.6 475.4 142.5C478.1 142.4 483.1 142.1 486.5 142C495.7 141.6 497.8 141.5 498.5 141.1C498.8 141 500.2 140.2 501.6 139.4L504.1 137.9 512.8 137.8L521.4 137.6 524.6 135.8C530.7 132.3 540.3 127.5 543.7 126.2C544.4 125.9 545 125.6 545 125.4C545 125.2 545 125 544.9 125C544.9 125 543.7 124.9 542.2 124.8C533.7 124.1 529.6 123.7 527.6 123.5C526.4 123.4 523.6 123.1 521.5 123C519.4 122.9 517.2 122.7 516.8 122.6C515 122.4 505.8 121.8 495.8 121.2C491.4 121 489 120.6 486.5 119.5C485.9 119.3 484.6 118.7 483.8 118.4C482.9 118 481.8 117.6 481.4 117.4C481 117.2 479.3 116.5 477.6 115.9C476 115.2 474.4 114.6 474.1 114.5C473.9 114.4 473.2 114.1 472.6 113.9C472.1 113.7 471 113.3 470.2 113C468.4 112.3 463.6 110.5 462.4 110.1C461.8 109.9 459.9 109.2 458.1 108.6C456.3 108 454.4 107.3 453.8 107.1C453.1 106.9 451.1 106.3 449.1 105.6C444.9 104.2 437.2 101.9 433.8 101.1C431.3 100.5 430 99.6 430 98.6C430 98 431.4 96.7 432.4 96.2C433.5 95.7 433.8 95.1 433.2 94.9C433 94.8 432.2 94.6 431.4 94.4C430 94.1 428.8 93.8 423.5 92.6C416.6 91.1 405.1 89.2 396.6 88.2C395.4 88.1 393 87.8 391.2 87.6C389.5 87.4 386.7 87.1 384.9 87C383.1 86.9 380.6 86.6 379.4 86.5C370.2 85.5 345.6 84.5 330.5 84.5C320.5 84.5 300.5 85.1 297 85.5C295.8 85.6 293.5 85.8 291.9 85.9C290.2 86 287 86.2 284.8 86.5C282.5 86.8 279.9 87 279 87.1C273.2 87.7 256.7 90.7 256.1 91.4C255.8 91.7 256.4 92 258.2 92.4C260.3 92.8 264 94.1 266.2 95C267.5 95.6 267.5 95.6 269.4 95.1C270.5 94.9 271.7 94.6 272.1 94.5C274.4 93.8 286.5 92.2 291.2 91.9C292.6 91.8 294.7 91.6 296 91.5C303.2 90.7 332.1 90.3 343.7 90.7C357.9 91.3 372 92.7 381.6 94.3C382.4 94.4 384.4 94.8 385.9 95C390.1 95.7 392.7 96.2 394.5 96.6C399.6 97.8 405.3 99.1 406.8 99.5C407.6 99.8 409.5 100.3 410.9 100.6C412.2 101 413.7 101.4 414 101.5C414.3 101.6 415.6 102 416.9 102.4C421.8 103.9 429.8 106.7 433.2 108C434 108.3 435 108.7 435.5 108.9C436 109.1 437.1 109.5 437.9 109.9C438.8 110.2 440.1 110.8 440.9 111.1C442.5 111.7 447.6 113.9 449.5 114.8C450.1 115.1 451.8 115.9 453.2 116.5C460.5 119.8 461.5 120.4 461.5 122.2C461.5 123.2 461 124.3 460.2 124.8C459.9 125 458 125.7 456.1 126.4C454.2 127 452.1 127.8 451.4 128C448.8 128.9 441.8 131.4 439.4 132.1C438.1 132.6 436.5 133 435.8 133.1C434.6 133.3 434.3 133.8 434.9 134.6C435.1 134.9 435.6 135.6 436 136.1C437.7 138.4 438.1 139.5 438.1 141.8C438.2 142.9 438.2 143.9 438.2 143.9C438.3 144 440.5 144 445.8 143.7ZM552.3 140.1C552.2 139.8 551.8 138.7 551.3 137.5C549.4 133 549.4 132.8 549.4 129.8C549.4 128.1 549.2 126.9 549.1 126.7C548.9 126.5 547.4 127.1 543.7 128.9C540.9 130.2 538.1 131.5 537.4 131.8C536 132.5 535.9 132.9 537.1 134.3C537.5 134.9 538.2 135.9 538.6 136.5C539.5 137.7 540 138 541.8 138C544.1 138 550.1 139.6 551 140.4C551.6 140.9 552.4 140.7 552.3 140.1ZM535.6 137.4C535.6 136.9 533.5 134.2 533.1 134.2C532.9 134.2 532.1 134.6 531.3 135.1C530.5 135.6 529.7 136 529.6 136C529.1 136 527.2 137.6 527.4 137.7C527.6 137.8 529.5 137.9 531.7 137.8C535 137.8 535.6 137.7 535.6 137.4ZM200.4 135.5L202.2 135.5 204.4 133.7C214.3 125.5 224.3 118.1 233.1 112.5C240.2 108 249.8 102.8 256.1 100C257.8 99.3 259.3 98.6 259.6 98.5C259.9 98.3 260.7 98 261.4 97.8C263.2 97.1 263.1 96.5 261.1 95.9C258.5 95.2 254.5 94.1 252.3 93.6C250.4 93.2 250.2 93.2 249.3 93.6C248.8 93.8 247.7 94.2 246.9 94.5C238.2 97.8 225.2 104.2 211.2 112.2C207.9 114.1 204.8 115.9 204.3 116.2C203.5 116.7 200.9 118.2 199.8 118.9C198.9 119.4 194.1 122.4 192.9 123.1C190.8 124.4 189 125.6 187.1 126.8C184.9 128.2 176.4 133.8 175.2 134.6C174.7 135 174.3 135.4 174.4 135.6C174.5 135.7 178.1 135.8 186.6 135.7C193.2 135.6 199.4 135.5 200.4 135.5ZM253.2 135C266.9 134.9 283 134.6 288.9 134.5C294.8 134.4 304.1 134.2 309.6 134.1C316.5 134 319.6 133.9 319.7 133.7C319.8 133.5 320 133 320.1 132.6C320.1 132.2 320.8 128.7 321.6 124.9C322.4 121 323.2 116.7 323.5 115.2C323.8 113.8 324.2 111.9 324.4 111C324.6 110.1 324.8 108.8 325 108C325.4 105.4 327.3 96.1 327.6 95.2C328.1 93.3 328.2 93.4 321 93.4C311.9 93.6 298.4 94.1 294.8 94.5C293.6 94.6 291.1 94.9 289.2 95C281.6 95.6 272.3 97.2 266.5 99C264.9 99.4 261.4 100.8 259.4 101.7C258.8 102 257.5 102.6 256.5 103C252.5 104.8 243.6 109.4 242 110.4C241.7 110.7 241.1 111 240.7 111.2C236.8 113.4 228 119.2 223.2 122.7C215.5 128.3 207.5 134.7 207.5 135.2C207.5 135.5 208.7 135.6 217.9 135.4C223.7 135.3 239.6 135.1 253.2 135ZM346.2 133.5C352.2 133.3 363.6 133.1 371.6 133C394.8 132.6 428 131.8 429.2 131.6C430.5 131.3 430.5 130.9 429.2 128.7C428.9 128.2 428.3 127.2 427.8 126.4C426.2 123.6 420.3 115.1 417.5 111.3C413.6 106.2 412 104.3 411.3 103.9C409.5 103 393.5 99.2 386.4 98.1C385.2 97.9 384 97.7 383.8 97.6C383.5 97.5 382.1 97.3 380.7 97.1C379.3 96.9 377.4 96.7 376.6 96.5C374.7 96.2 369.4 95.6 364.6 95.1C362.6 94.9 359.8 94.7 358.4 94.5C353 94 334.6 93.3 331.9 93.5C330.1 93.6 330.2 93.5 329.5 97.4C328.4 103.4 328.1 105.3 326.5 113.9C325.5 119.2 325.3 120.4 324.6 124C324.3 126 323.7 128.7 323.5 130C323 132.6 322.9 133.6 323.2 133.8C323.3 134 326.1 134 329.4 133.9C332.7 133.8 340.3 133.6 346.2 133.5ZM440.9 128.5C442.5 128 445.3 127 447.1 126.4C448.9 125.7 451.5 124.9 452.9 124.4C454.2 123.9 455.7 123.4 456 123.3C456.3 123.2 456.9 123 457.3 122.9C458.6 122.6 458.1 122 455.4 120.8C452.7 119.5 449.9 118.2 448.5 117.6C448 117.4 447.2 117 446.6 116.7C443.7 115.4 441.1 114.3 439.2 113.6C438.1 113.1 436.8 112.6 436.3 112.4C435.9 112.2 435.5 112 435.4 112C435.3 112 434.8 111.8 434.4 111.6C434 111.4 433.1 111.1 432.5 110.9C431.9 110.6 430.8 110.2 430.1 110C427.6 109 420.1 106.5 419 106.1C418.4 106 417.6 105.7 417.3 105.5C415.6 104.6 415.9 105.4 418.6 108.7C419.9 110.3 421.3 112.1 421.7 112.8C422.1 113.4 423 114.5 423.5 115.2C425 117.2 430.5 125.5 431.9 127.9C433.7 130.8 433.6 130.8 435.9 130.1C437 129.8 439.2 129.1 440.9 128.5ZM498.3 117.9C498 117.6 497.4 117.2 497 117.1C496.7 117 495.2 116.4 493.8 115.8C489.9 114.1 486.3 112.7 482.4 111.1C477.9 109.3 476.5 108.8 475.9 108.5C475.6 108.4 474.8 108 474 107.8C473.2 107.5 471.5 106.9 470.1 106.4C462 103.4 451.2 99.8 444.8 98C442.8 97.5 440.5 96.8 439.8 96.6C438.6 96.2 438.5 96.2 436.9 97C434.8 98 434.8 98.5 436.8 98.9C437.5 99.1 438.6 99.4 439.2 99.6C439.9 99.8 441.4 100.3 442.8 100.6C446.1 101.6 449.8 102.8 455.9 104.8C463.1 107.2 466.5 108.5 470.5 110C471.3 110.3 472.3 110.7 472.9 110.9C473.4 111.1 474.1 111.4 474.4 111.5C474.6 111.6 475.8 112.1 476.9 112.5C478 112.9 480 113.7 481.4 114.3C482.8 114.8 484.7 115.6 485.6 116C489.7 117.8 492.6 118.3 497.5 118.5L498.8 118.5 498.3 117.9Z"/></svg>', a1 = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Creator: CorelDRAW -->
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="2049px" height="1984px" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
viewBox="0 0 2200.59 2130.34"
 xmlns:xlink="http://www.w3.org/1999/xlink">
 <g id="Ebene_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <g id="g1963">
   <path id="path1965" fill="#DA251D" d="M1606.73 151.243c-50.6032,225.554 -70.5426,329.159 -111.632,492.465 -39.4247,156.732 -69.9604,302.135 -122.776,372.644 -53.617,71.532 -125.113,87.1081 -173.81,92.5876 -25.2084,2.82729 -43.5889,4.09443 -98.1838,4.30372 -54.6051,-0.220703 -72.9742,-1.47643 -98.1838,-4.30372 -48.6955,-5.47953 -120.228,-21.0556 -173.81,-92.5876 -52.7912,-70.5198 -83.351,-215.946 -122.811,-372.644 -41.0648,-163.318 -61.0384,-266.923 -111.607,-492.465 0,0 -50.4536,1.96604 -72.789,3.53633 -30.1996,2.15122 -53.8377,4.73498 -79.594,8.15461 0,0 29.025,463.847 42.1708,660.366 13.8193,206.709 38.0751,555.017 60.8761,818.018 0,0 42.356,6.73526 112.713,10.7726 73.9978,4.24537 106.897,4.71088 106.897,4.71088 30.4444,-115.854 68.0883,-276.647 110.84,-345.224 34.7481,-55.7695 88.2725,-61.679 118.623,-65.8318 47.6732,-6.49172 87.8767,-7.47982 106.502,-6.89888l0 0c0.0570785,0 0.128109,0 0.185188,0 0.0583469,0 0.152209,0 0.186456,0l0 0c18.6253,-0.616447 58.8517,0.395744 106.525,6.89888 30.3163,4.15278 83.8749,10.0623 118.623,65.8318 42.7518,68.5779 80.3969,229.37 110.864,345.224 0,0 32.8975,-0.488338 106.897,-4.71088 70.3333,-4.03735 112.713,-10.7726 112.713,-10.7726 22.7768,-263.014 47.0555,-611.275 60.9103,-818.018 13.1458,-196.53 42.1353,-660.366 42.1353,-660.366 -25.7322,-3.41963 -49.3703,-5.96787 -79.594,-8.15461 -22.428,-1.55888 -72.8702,-3.53633 -72.8702,-3.53633z"/>
   <path id="path1967" fill="#DA251D" d="M2191.13 425.086c-29.9205,-294.609 -226.473,-356.823 -399.028,-385.754 -86.9812,-14.588 -241.469,-26.9309 -340.514,-30.9911 -86.55,-5.53788 -290.699,-8.31823 -351.308,-8.34107 -60.5742,0.0355155 -264.736,2.80319 -351.286,8.34107 -99.0438,4.06018 -253.532,16.4031 -340.478,30.9911 -172.577,28.9312 -369.143,91.1454 -399.086,385.754 -8.15461,80.2447 -10.4936,184.955 -9.01586,297.703 2.46706,186.677 18.4972,312.744 27.6754,400.005 6.30527,59.8994 31.3285,239.957 63.47,333.092 44.1369,127.975 83.8165,165.248 130.536,203.324 85.4097,69.6586 226.078,91.0757 256.057,96.4613 158.827,28.5595 480.251,33.7017 622.14,33.5152 141.924,0.186456 463.382,-4.95568 622.139,-33.5152 30.0144,-5.38567 170.67,-26.8142 256.081,-96.4613 46.7181,-38.0751 86.399,-75.3486 130.535,-203.324 32.1314,-93.1356 57.1305,-273.193 63.4712,-333.092 9.1668,-87.2603 25.2084,-213.328 27.6399,-400.005 1.50053,-112.749 -0.837151,-217.493 -9.02728,-297.703zm-107.944 494.873c-17.4495,235.338 -38.377,376.46 -68.2975,478.192 -26.2903,89.1096 -58.8517,148.974 -106.408,192.004 -79.3847,71.811 -188.713,87.2248 -252.858,96.7759 -138.574,20.5559 -371.935,27.6983 -555.354,27.768 -183.418,-0.0570785 -416.756,-7.20076 -555.353,-27.768 -64.1105,-9.53844 -173.416,-24.9648 -252.788,-96.7759 -47.5793,-43.0308 -80.1521,-102.93 -106.408,-192.004 -29.9434,-101.72 -50.8835,-242.854 -68.2988,-478.192 -10.5164,-141.854 -8.29413,-371.69 7.4925,-495.21 23.4872,-184.176 114.934,-276.95 310.906,-311.884 91.4486,-16.2864 214.375,-27.8492 331.032,-33.6078 93.5427,-6.30527 247.495,-9.48137 333.43,-8.67846 85.9678,-0.802904 239.921,2.3732 333.428,8.67846 116.657,5.78141 239.584,17.3328 331.032,33.6078 195.972,34.9346 287.419,127.674 310.965,311.861 15.7625,123.543 17.9505,353.379 7.47982,495.233z"/>
  </g>
  <path fill="#DA251D" d="M1727.67 2121.48l0 -33.2336 34.3409 -3.32323c11.0796,-2.21845 15.5063,-12.1856 17.721,-14.4003l83.0859 -136.256c6.64393,-9.96717 -0.00380523,-19.9356 -8.86492,-21.0442l-43.2033 -4.43183 0 -34.3384 189.427 0c11.0808,0 17.7248,7.75252 22.1566,14.4003l110.778 169.489c8.86492,13.2879 15.505,24.3674 26.5846,25.476l35.4508 3.3207 0 34.3422 -213.802 0 0 -33.2336 26.5884 -3.32323c13.2942,-1.10605 24.3674,-7.75252 13.2917,-23.2588l-9.96717 -15.5114 -151.763 0 -12.1894 18.8283c-6.64393,11.0808 0,18.8359 11.0796,19.9458l27.6919 3.31943 0 33.2336 -158.407 0zm158.407 -119.64l96.3763 0 -48.7412 -75.3258 -47.6351 75.3258z"/>
  <path fill="#DA251D" d="M1585.87 1874.45l-243.705 0 0 34.3384 29.9066 2.21718c12.1882,2.21464 16.6174,9.97097 16.6174,21.0467 0,11.077 0,124.072 0,132.931 0,9.97097 -4.43183,18.8321 -14.4028,19.9419l-32.1212 4.42929 0 32.1238 243.705 0c112.989,0 161.734,-54.2765 161.734,-127.389 0.00253682,-64.2539 -48.745,-119.639 -161.738,-119.639l0.00380523 0zm-37.6654 199.395l-63.1377 0 0 -151.763 63.1377 0c60.9306,0 85.298,13.2942 85.298,76.4357 0.00380523,62.0316 -24.3674,75.3296 -85.298,75.3271z"/>
  <path fill="#DA251D" d="M13.955 2121.48l198.289 0 0 -33.2336 -34.3409 -3.32323c-7.75252,-1.10605 -15.5089,-5.53534 -15.5089,-22.1528l0 -39.8763 152.871 0 0 37.6578c0,11.077 -2.21464,22.1566 -15.5089,23.2652l-34.3409 3.3207 0 34.3422 198.289 0 0 -34.3422 -35.447 -3.3207c-6.64774,-1.1124 -14.4003,-6.64647 -14.4003,-19.9381l0 -128.5c0,-13.2942 4.42929,-22.1566 15.5089,-23.2652l34.3384 -3.32323 0 -34.3384 -198.289 0 0 33.2323 34.3409 4.42548c12.1882,1.1124 15.5089,11.0834 15.5089,23.269l0 37.6616 -152.871 0 0 -38.774c0,-14.4003 6.64647,-21.0442 16.6174,-22.1528l33.2323 -3.32323 0 -34.3384 -197.183 0 0 34.3384 33.2362 3.31943c12.1843,1.1124 16.6136,11.0834 15.5089,23.269l0 125.173c0,14.4041 -3.3245,23.2652 -16.6187,24.375l-33.2323 3.31943 0 33.2336z"/>
  <path fill="#DA251D" d="M472.57 1997.41c0,-77.5443 63.1415,-131.821 202.719,-131.821 138.472,0 201.61,54.2803 201.61,131.821 0,78.6516 -63.1377,132.934 -201.61,132.934 -139.577,-0.00380523 -202.719,-54.2803 -202.719,-132.934l0 0zm202.719 -85.3006c-56.4937,0 -88.6213,21.0543 -88.6213,85.3006 0,65.3561 32.1276,86.4066 88.6213,86.4066 55.3915,0 87.5127,-21.0467 87.5127,-86.4066 0,-64.2462 -32.1212,-85.2968 -87.5127,-85.3006z"/>
  <path fill="#DA251D" d="M887.978 2121.48l157.304 0 0 -33.2336 -33.2323 -3.32323c-9.97097,-1.10605 -15.5127,-8.85858 -15.5127,-21.0442l0 -125.177 130.726 172.809c4.42168,6.6414 13.2866,9.97097 21.0404,9.97097l124.071 -0.00253682 0 -187.214c0,-8.85858 2.21464,-21.0442 14.4003,-22.1528l34.3422 -3.32323 0 -34.3384 -157.302 0 0 33.2323 34.3422 4.42548c12.1818,1.1124 14.4003,12.1894 14.4003,23.269l0 121.85 -129.607 -171.697c-5.53788,-6.65408 -12.1882,-11.0796 -21.0505,-11.0796l-173.922 0 0 34.3384 32.1276 3.31943c12.1843,2.21845 16.6174,7.76013 16.6174,23.269l0 125.173c0,15.5101 -4.43309,22.1566 -16.6174,24.375l-32.1276 3.31943 0 33.2336z"/>
 </g>
</svg>
`;
function r1(t) {
  if (t === "civic") {
    const i = n1.replace('fill="currentColor"', 'fill="#20252b"'), o = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(i)}`;
    return d`<img
      class="vehicle-art civic-lateral-art"
      src=${o}
      alt="Honda Civic - vista lateral"
    />`;
  }
  const e = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(a1)}`;
  return d`<img class="vehicle-art honda-logo-art" src=${e} alt="Honda" />`;
}
const c1 = /* @__PURE__ */ new Set(["on", "open", "unlocked", "active", "charging", "plugged", "true"]), ze = /* @__PURE__ */ new Set(["unknown", "unavailable", "none"]);
function A(t) {
  if (!(!t || ze.has(t.state.toLowerCase())))
    return c1.has(t.state.toLowerCase());
}
function E(t) {
  if (!t || ze.has(t.state.toLowerCase())) return "—";
  const e = t.attributes.unit_of_measurement;
  return `${t.state}${e ? ` ${String(e)}` : ""}`;
}
function l1(t, e = Date.now()) {
  if (!t) return;
  const i = Date.parse(t.last_updated);
  return Number.isFinite(i) ? Math.max(0, Math.floor((e - i) / 1e3)) : void 0;
}
function d1(t, e, i = Date.now()) {
  const o = t.updated ?? t.range ?? t.odometer, s = l1(o, i);
  return {
    locked: t.lock ? t.lock.state === "locked" : void 0,
    range: E(t.range),
    battery: E(t.battery),
    odometer: E(t.odometer),
    tripDistance: E(t.trip_distance),
    tripConsumption: E(t.trip_consumption),
    tripDuration: E(t.trip_duration),
    climateActive: A(t.climate),
    charging: A(t.charging),
    doorsOpen: A(t.doors),
    windowsOpen: A(t.windows),
    trunkOpen: A(t.trunk),
    hoodOpen: A(t.hood),
    lightsOn: A(t.lights),
    ageSeconds: s,
    stale: s !== void 0 && s > e
  };
}
var h1 = Object.defineProperty, u1 = Object.getOwnPropertyDescriptor, m = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? u1(e, i) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (s = (o ? n(e, i, s) : n(s)) || s);
  return o && s && h1(e, i, s), s;
};
let _ = class extends D {
  constructor() {
    super(...arguments), this.config = { ...C }, this.entities = {}, this.customImageFailed = !1, this.discoveryComplete = !1, this.integrationDetected = !1, this.vehicleCount = 0, this.compatibleEntityCount = 0;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => g1), document.createElement("myhondaplus-vehicle-card-editor");
  }
  static getStubConfig() {
    return { ...C };
  }
  setConfig(t) {
    if (!t) throw new Error(Q("required_config", "es"));
    const e = { ...C, ...t };
    (this.config.vehicle_image !== e.vehicle_image || this.config.image_mode !== e.image_mode) && (this.customImageFailed = !1), this.config = e, this.entities = { ...t.entities ?? {} }, this.loadedDevice = void 0, this.discoveryComplete = !1;
  }
  getCardSize() {
    return this.config.layout === "compact" ? 3 : 6;
  }
  updated() {
    this.loadDeviceData();
  }
  locale() {
    var t;
    return this.config.locale && this.config.locale !== "auto" ? this.config.locale : se((t = this.hass) == null ? void 0 : t.language);
  }
  t(t, e = {}) {
    return Q(t, this.locale(), e);
  }
  async loadDeviceData() {
    var e;
    const t = this.config.device ?? "";
    if (!(!this.hass || this.discoveryComplete && this.loadedDevice === t)) {
      this.loadedDevice = t;
      try {
        const [i, o] = await Promise.all([
          this.hass.callWS({ type: "config/entity_registry/list" }),
          this.hass.callWS({ type: "config/device_registry/list" })
        ]), s = Ee(
          o,
          i,
          (e = this.hass.config) == null ? void 0 : e.components,
          this.config.device,
          this.config.entities
        );
        this.integrationDetected = s.integrationDetected, this.vehicleCount = s.vehicles.length, this.device = s.selectedDevice, this.entities = s.entities, this.compatibleEntityCount = s.compatibleEntityCount, this.discoveryComplete = !0, this.message = void 0;
      } catch (i) {
        this.loadedDevice = void 0, this.discoveryComplete = !1, this.message = { kind: "error", text: this.t("discovery_failed") }, console.warn("My Honda+ Vehicle Card: discovery failed", i);
      }
    }
  }
  setupIssue() {
    if (!this.discoveryComplete) return "card_checking_integration";
    if (!this.integrationDetected) return "card_integration_not_detected";
    if (!this.config.device && this.vehicleCount === 0) return "card_no_vehicles_configured";
    if (!this.config.device) return "select_vehicle";
    if (!this.device) return "card_vehicle_not_found";
    if (this.compatibleEntityCount === 0) return "card_no_compatible_entities";
  }
  setupPanel(t) {
    const e = t === "card_integration_not_detected";
    return d`<div class="setup" role="status">
      <ha-icon
        icon=${e ? "mdi:puzzle-alert" : "mdi:car-info"}
        aria-hidden="true"
      ></ha-icon>
      <strong>${this.t(t)}</strong>
      ${e ? d`<span>${this.t("editor_install_or_configure_integration")}</span>
              <a
                href="https://github.com/enricobattocchi/myhondaplus-homeassistant"
                target="_blank"
                rel="noopener noreferrer"
                >${this.t("editor_integration_instructions")}</a
              >` : l}
    </div>`;
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
    return d1(
      this.entityRecord(),
      this.config.stale_after ?? C.stale_after
    );
  }
  model() {
    return this.config.vehicle_model && this.config.vehicle_model !== "auto" ? this.config.vehicle_model : o1(this.device);
  }
  paintColor() {
    const t = this.config.color_preset ?? C.color_preset;
    if (t !== "custom" && q[t]) return q[t].value;
    const e = this.config.vehicle_color ?? C.vehicle_color;
    return /^#[0-9a-f]{6}$/i.test(e) ? e : C.vehicle_color;
  }
  ageText(t) {
    return t.ageSeconds === void 0 ? this.t("no_update_date") : t.ageSeconds < 60 ? this.t("updated_now") : t.ageSeconds < 3600 ? this.t("updated_minutes", { count: Math.floor(t.ageSeconds / 60) }) : this.t("updated_hours", { count: Math.floor(t.ageSeconds / 3600) });
  }
  async execute(t) {
    var a;
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
    let s = o === "button" ? "press" : ((a = this.entity(t)) == null ? void 0 : a.state) === "on" ? "turn_off" : "turn_on";
    if (o === "lock" && (s = i.locked ? "unlock" : "lock"), !(o === "lock" && s === "unlock" && this.config.confirm_unlock !== !1 && !window.confirm(this.t("confirm_unlock")))) {
      this.busy = t, this.message = void 0;
      try {
        await this.hass.callService(o, s, { entity_id: e });
      } catch (n) {
        this.message = { kind: "error", text: this.t("action_failed") }, console.warn("My Honda+ Vehicle Card: service call failed", { domain: o, service: s, error: n });
      } finally {
        this.busy = void 0;
      }
    }
  }
  async copyDiagnostics() {
    const t = me(
      _e(this.hass, this.entities, this.model(), this.locale())
    );
    try {
      await navigator.clipboard.writeText(t), this.message = { kind: "success", text: this.t("diagnostics_copied") };
    } catch {
      this.message = { kind: "error", text: t };
    }
  }
  metric(t, e) {
    if (!this.entities[t]) return l;
    const i = {
      range: { icon: "mdi:map-marker-distance", label: this.t("range"), value: e.range },
      battery: { icon: "mdi:battery", label: this.t("battery"), value: e.battery },
      odometer: { icon: "mdi:counter", label: this.t("odometer"), value: e.odometer },
      trip_distance: {
        icon: "mdi:map-marker-path",
        label: this.t("trip_distance"),
        value: e.tripDistance
      },
      trip_consumption: {
        icon: "mdi:gas-station",
        label: this.t("trip_consumption"),
        value: e.tripConsumption
      },
      trip_duration: {
        icon: "mdi:timer-outline",
        label: this.t("trip_duration"),
        value: e.tripDuration
      }
    }[t];
    return d`<div class="metric">
      <ha-icon icon=${i.icon} aria-hidden="true"></ha-icon>
      <div><small>${i.label}</small><strong>${i.value}</strong></div>
    </div>`;
  }
  status(t, e, i, o, s) {
    const a = i === void 0 ? this.t("unavailable") : i ? o : s;
    return d`<div
      class="status ${i === !0 ? "warning" : ""} ${i === void 0 ? "unavailable" : ""}"
      aria-label=${`${e}: ${a}`}
    >
      <ha-icon class="status-icon" icon=${t} aria-hidden="true"></ha-icon>
      <div><b>${e}</b><small>${a}</small></div>
      <i aria-hidden="true"></i>
    </div>`;
  }
  control(t, e, i) {
    var r;
    if (!this.entities[i]) return l;
    const o = this.busy === i, s = this.entity(i), a = (r = this.entities[i]) == null ? void 0 : r.split(".")[0], n = s == null ? void 0 : s.state.toLowerCase(), c = !s || n === "unavailable" || n === "unknown" && a !== "button" && i !== "location";
    return d`<button
      type="button"
      aria-label=${e}
      aria-busy=${o ? "true" : "false"}
      ?disabled=${!!this.busy || c}
      @click=${() => void this.execute(i)}
    >
      <span aria-hidden="true"> ${o ? "…" : d`<ha-icon icon=${t}></ha-icon>`} </span>
      <small>${e}</small>
    </button>`;
  }
  vehicleVisual() {
    return this.config.image_mode === "custom" && this.config.vehicle_image && !this.customImageFailed ? d`<img
        class="vehicle-art custom-vehicle-art"
        src=${this.config.vehicle_image}
        alt=${this.t("vehicle")}
        loading="lazy"
        @error=${() => {
      this.customImageFailed = !0;
    }}
      />` : r1(this.customImageFailed ? "generic" : this.model());
  }
  visualStyle() {
    const t = Math.min(140, Math.max(70, this.config.vehicle_scale ?? 100)), e = this.config.vehicle_shadow === !1 ? 0 : Math.min(100, Math.max(0, this.config.shadow_intensity ?? 60)), i = Math.round(e / 100 * 255).toString(16).padStart(2, "0");
    return `--vehicle-scale:${t / 100};--vehicle-shadow-opacity:${e / 100};--vehicle-shadow-color:${this.paintColor()}${i}`;
  }
  render() {
    var n;
    const t = this.vehicleState(), e = this.setupIssue(), i = t.locked === !0 ? this.t("locked") : t.locked === !1 ? this.t("unlocked") : this.t("unknown_state"), o = this.config.controls ?? [...C.controls], s = this.config.metrics ?? [...C.metrics], a = this.config.vehicle_alignment ?? C.vehicle_alignment;
    return d`<ha-card class=${this.config.animate === !1 ? "reduce-motion" : ""}>
      <header>
        <div>
          <h2>${this.config.name}</h2>
          ${this.config.show_model !== !1 ? d`<p>${s1(this.model())}</p>` : l}
        </div>
        ${this.entities.lock ? d`<span class="badge ${t.locked === !1 ? "alert" : ""}">
                <ha-icon
                  icon=${t.locked === !0 ? "mdi:lock" : t.locked === !1 ? "mdi:lock-open-variant" : "mdi:lock-question"}
                  aria-hidden="true"
                ></ha-icon>
                ${i}
              </span>` : l}
      </header>

      <div class="announcer" aria-live="polite">
        ${this.busy ? this.t("action_in_progress") : ((n = this.message) == null ? void 0 : n.text) ?? ""}
      </div>
      ${this.message ? d`<div class="message ${this.message.kind}">${this.message.text}</div>` : l}
      ${this.customImageFailed ? d`<div class="message error" role="alert">${this.t("custom_image_failed")}</div>` : l}
      ${e ? this.setupPanel(e) : d`<section
              class="vehicle align-${a} ${t.charging === !0 ? "is-charging" : ""}"
              style=${this.visualStyle()}
            >
              ${this.vehicleVisual()}
              <div
                class="freshness ${t.stale ? "stale" : ""}"
                title=${t.stale ? this.t("stale_data") : ""}
              >
                ${this.ageText(t)}
              </div>
            </section>`}
      ${e ? l : this.config.device ? d`<section class="metrics">
                ${s.map((c) => this.metric(c, t))}
              </section>` : d`<div class="setup">${this.t("select_vehicle")}</div>`}
      ${!e && (this.config.layout !== "compact" || this.entities.climate) ? d`<section
              class="statuses ${this.config.layout === "compact" ? "compact-statuses" : ""}"
            >
              ${this.config.layout !== "compact" ? d`
                      ${this.entities.doors ? this.status("mdi:car-door", this.t("doors"), t.doorsOpen, this.t("open"), this.t("closed")) : l}
                      ${this.entities.windows ? this.status("mdi:window-closed-variant", this.t("windows"), t.windowsOpen, this.t("open"), this.t("closed")) : l}
                      ${this.entities.trunk ? this.status("mdi:car-back", this.t("trunk"), t.trunkOpen, this.t("open"), this.t("closed")) : l}
                      ${this.entities.hood ? this.status("mdi:car", this.t("hood"), t.hoodOpen, this.t("open"), this.t("closed")) : l}
                      ${this.entities.lights ? this.status("mdi:car-light-high", this.t("lights"), t.lightsOn, this.t("on"), this.t("off")) : l}
                      ${this.entities.charging ? this.status("mdi:battery-charging", this.t("charging"), t.charging, this.t("active"), this.t("inactive")) : l}
                    ` : l}
              ${this.entities.climate ? this.status("mdi:snowflake", this.t("climate"), t.climateActive, this.t("active"), this.t("inactive")) : l}
            </section>` : l}
      ${!e && this.config.show_controls !== !1 ? d`<nav class="controls" aria-label=${this.t("vehicle_controls")}>
              ${o.map((c) => {
      const r = {
        lock: {
          icon: t.locked === !0 ? "mdi:lock-open-variant" : t.locked === !1 ? "mdi:lock" : "mdi:lock-question",
          label: t.locked ? this.t("unlock") : this.t("lock")
        },
        climate: { icon: "mdi:snowflake", label: this.t("climate") },
        horn_lights: { icon: "mdi:bullhorn", label: this.t("horn_lights") },
        refresh_cached: {
          icon: "mdi:database-refresh",
          label: this.t("refresh_cached")
        },
        refresh: { icon: "mdi:car-connected", label: this.t("refresh_from_car") },
        location: { icon: "mdi:map-marker", label: this.t("location") }
      }[c];
      return this.control(r.icon, r.label, c);
    })}
            </nav>` : l}
      ${this.config.debug ? d`<details class="diagnostics">
              <summary>${this.t("diagnostics")}</summary>
              <button type="button" @click=${() => void this.copyDiagnostics()}>
                ${this.t("copy_diagnostics")}
              </button>
              <pre>
${me(_e(this.hass, this.entities, this.model(), this.locale()))}</pre>
            </details>` : l}
    </ha-card>`;
  }
};
_.styles = $e`
    :host {
      display: block;
      font-family: var(--ha-font-family-body, inherit);
      font-size: var(--ha-font-size-m, 0.875rem);
      line-height: 1.4;
    }
    ha-card {
      padding: 20px;
      overflow: hidden;
      color: var(--primary-text-color);
      background: var(--ha-card-background, var(--card-background-color));
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
    }
    h2 {
      margin: 0;
      font-size: var(--ha-font-size-xl, 1.25rem);
    }
    p {
      margin: 4px 0 0;
      color: var(--secondary-text-color);
      font-size: var(--ha-font-size-m, 0.875rem);
    }
    .badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 7px 11px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      font-size: var(--ha-font-size-m, 0.875rem);
    }
    .badge ha-icon,
    .status-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
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
      font-size: var(--ha-font-size-m, 0.875rem);
    }
    .vehicle {
      position: relative;
      min-height: 235px;
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      justify-items: center;
    }
    .vehicle svg,
    .vehicle img {
      width: 100%;
      height: 100%;
      max-height: 250px;
      object-fit: contain;
      transform: scale(var(--vehicle-scale, 1));
      filter: drop-shadow(0 16px 18px rgb(0 0 0 / calc(var(--vehicle-shadow-opacity, 0.6) * 0.2)));
      transform-origin: center;
    }
    .vehicle.align-left {
      justify-items: start;
    }
    .vehicle.align-left svg,
    .vehicle.align-left img {
      transform-origin: left center;
    }
    .vehicle.align-right {
      justify-items: end;
    }
    .vehicle.align-right svg,
    .vehicle.align-right img {
      transform-origin: right center;
    }
    .vehicle img.civic-lateral-art,
    .vehicle img.custom-vehicle-art {
      filter: drop-shadow(0 8px 6px var(--vehicle-shadow-color));
    }
    .vehicle img.honda-logo-art {
      width: clamp(120px, 34%, 150px);
      max-height: 150px;
      filter: drop-shadow(0 10px 12px var(--vehicle-shadow-color))
        drop-shadow(0 0 14px var(--vehicle-shadow-color));
    }
    .freshness {
      justify-self: center;
      font-size: var(--ha-font-size-s, 0.75rem);
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
    .metric ha-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
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
      font-size: var(--ha-font-size-s, 0.75rem);
    }
    .metric strong {
      font-size: var(--ha-font-size-l, 1rem);
    }
    .statuses {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin-top: 13px;
    }
    .compact-statuses {
      grid-template-columns: 1fr;
    }
    .status {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 9px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      font-size: var(--ha-font-size-m, 0.875rem);
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
    .status.unavailable i {
      background: var(--disabled-text-color, var(--secondary-text-color));
    }
    .controls {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-top: 15px;
    }
    button {
      display: grid;
      place-items: center;
      gap: 4px;
      border: 1px solid var(--primary-color);
      border-color: color-mix(in srgb, var(--primary-color) 35%, var(--divider-color));
      border-radius: 14px;
      padding: 10px 5px;
      background: var(--secondary-background-color);
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      font-size: var(--ha-font-size-m, 0.875rem);
      cursor: pointer;
      transition:
        transform 0.18s ease,
        background-color 0.18s ease,
        border-color 0.18s ease;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      background: color-mix(in srgb, var(--primary-color) 20%, var(--card-background-color));
      border-color: var(--primary-color);
    }
    button:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: progress;
      opacity: 0.65;
    }
    button ha-icon {
      color: var(--primary-color);
      --mdc-icon-size: 21px;
    }
    .setup {
      display: grid;
      justify-items: center;
      gap: 8px;
      margin-top: 18px;
      padding: 18px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .setup ha-icon {
      --mdc-icon-size: 32px;
    }
    .setup a {
      color: var(--primary-color);
    }
    .diagnostics {
      margin-top: 14px;
      font-size: var(--ha-font-size-s, 0.75rem);
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
m([
  oe({ attribute: !1 })
], _.prototype, "hass", 2);
m([
  g()
], _.prototype, "config", 2);
m([
  g()
], _.prototype, "entities", 2);
m([
  g()
], _.prototype, "device", 2);
m([
  g()
], _.prototype, "busy", 2);
m([
  g()
], _.prototype, "message", 2);
m([
  g()
], _.prototype, "customImageFailed", 2);
m([
  g()
], _.prototype, "discoveryComplete", 2);
m([
  g()
], _.prototype, "integrationDetected", 2);
m([
  g()
], _.prototype, "vehicleCount", 2);
m([
  g()
], _.prototype, "compatibleEntityCount", 2);
_ = m([
  ke(B)
], _);
window.customCards ?? (window.customCards = []);
window.customCards.some((t) => t.type === B) || window.customCards.push({
  type: B,
  name: "My Honda+ Vehicle Card",
  description: "Tarjeta visual para vehículos conectados mediante My Honda+.",
  preview: !0,
  documentationURL: "https://github.com/Danieldiazi/myhondaplus-vehicle-card"
});
console.info(
  `%c MYHONDAPLUS-VEHICLE-CARD %c ${Me} `,
  "color:white;background:#a51d2d;font-weight:700",
  "color:#a51d2d;background:white;font-weight:700"
);
var p1 = Object.defineProperty, C1 = Object.getOwnPropertyDescriptor, w = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? C1(e, i) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (s = (o ? n(e, i, s) : n(s)) || s);
  return o && s && p1(e, i, s), s;
};
let f = class extends D {
  constructor() {
    super(...arguments), this.config = { ...C }, this.devices = [], this.registryEntries = [], this.loading = !1, this.integrationDetected = !1, this.discoveryError = !1, this.automaticDiscoveryStarted = !1;
  }
  setConfig(t) {
    this.config = { ...C, ...t };
  }
  locale() {
    var t;
    return this.config.locale && this.config.locale !== "auto" ? this.config.locale : se((t = this.hass) == null ? void 0 : t.language);
  }
  t(t, e = {}) {
    return Q(t, this.locale(), e);
  }
  updated(t) {
    t.has("hass") && this.hass && !this.automaticDiscoveryStarted && (this.automaticDiscoveryStarted = !0, this.loadDevices());
  }
  async loadDevices() {
    var t;
    if (!(!this.hass || this.loading)) {
      this.loading = !0, this.discoveryError = !1;
      try {
        const [e, i] = await Promise.all([
          this.hass.callWS({ type: "config/device_registry/list" }),
          this.hass.callWS({ type: "config/entity_registry/list" })
        ]), o = Ee(e, i, (t = this.hass.config) == null ? void 0 : t.components);
        this.integrationDetected = o.integrationDetected, this.devices = o.vehicles.sort(
          (s, a) => this.deviceName(s).localeCompare(this.deviceName(a))
        ), this.registryEntries = i;
      } catch (e) {
        console.warn("My Honda+ Vehicle Card: device discovery failed", e), this.devices = [], this.discoveryError = !0;
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
    e instanceof HTMLInputElement && e.type === "checkbox" && (i = e.checked), ["stale_after", "vehicle_scale", "shadow_intensity"].includes(e.name) && (i = Number(e.value));
    const o = { ...this.config, [e.name]: i };
    e.name === "color_preset" && i !== "custom" && (o.vehicle_color = ((s = q[String(i)]) == null ? void 0 : s.value) ?? o.vehicle_color), this.config = o, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: o },
        bubbles: !0,
        composed: !0
      })
    );
  }
  toggleListValue(t, e) {
    const i = t.currentTarget, o = new Set(this.config[e] ?? C[e]);
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
    const o = new Set(this.config[e] ?? C[e]), s = this.detectedEntities();
    return d`<fieldset>
      <legend>${t}</legend>
      <div class="checks">
        ${i.map(([a, n]) => {
      const c = !this.config.device || !!s[a];
      return d`<label class="check">
            <input
              type="checkbox"
              .value=${a}
              .checked=${o.has(a)}
              ?disabled=${!c && !o.has(a)}
              @change=${(r) => this.toggleListValue(r, e)}
            />
            ${n}${c ? "" : ` — ${this.t("editor_not_available")}`}
          </label>`;
    })}
      </div>
    </fieldset>`;
  }
  detectedEntities() {
    return this.config.device ? Se(
      this.registryEntries.filter((t) => t.device_id === this.config.device),
      this.config.entities
    ) : {};
  }
  capabilitySummary() {
    if (!this.config.device) return d`${l}`;
    const t = this.detectedEntities(), e = [
      [
        "editor_metrics",
        [
          ["range", "range"],
          ["battery", "battery"],
          ["odometer", "odometer"],
          ["trip_distance", "trip_distance"],
          ["trip_consumption", "trip_consumption"],
          ["trip_duration", "trip_duration"]
        ]
      ],
      [
        "editor_states",
        [
          ["doors", "doors"],
          ["windows", "windows"],
          ["trunk", "trunk"],
          ["hood", "hood"],
          ["lights", "lights"],
          ["charging", "charging"]
        ]
      ],
      [
        "editor_controls",
        [
          ["lock", "editor_locking"],
          ["climate", "climate"],
          ["horn_lights", "horn_lights"],
          ["refresh_cached", "refresh_cached"],
          ["refresh", "refresh_from_car"],
          ["location", "location"]
        ]
      ]
    ], i = e.flatMap(([, o]) => o).filter(([o]) => t[o]).length;
    return d`<div class="capabilities">
      <strong>${this.t("editor_capabilities")}</strong>
      ${i === 0 ? d`<p class="hint warning">${this.t("editor_no_compatible_entities")}</p>` : e.map(([o, s]) => {
      const a = s.filter(([n]) => t[n]);
      return a.length === 0 ? l : d`<div class="capability-group">
                    <span>${this.t(o)}</span>
                    <div class="chips">
                      ${a.map(
        ([, n]) => d`<span class="chip">${this.t(n)}</span>`
      )}
                    </div>
                  </div>`;
    })}
    </div>`;
  }
  integrationStatus() {
    return this.loading ? d`<div class="integration-status">${this.t("editor_checking_integration")}</div>` : this.discoveryError ? d`<div class="integration-status warning">${this.t("discovery_failed")}</div>` : this.integrationDetected ? this.devices.length === 0 ? d`<div class="integration-status warning">
        <strong>${this.t("editor_integration_detected")}</strong>
        <span>${this.t("editor_no_vehicles_configured")}</span>
      </div>` : d`<div class="integration-status success">
      <strong>${this.t("editor_integration_detected")}</strong>
      <span>${this.t("editor_vehicles_found", { count: this.devices.length })}</span>
    </div>` : d`<div class="integration-status warning">
        <strong>${this.t("editor_integration_not_detected")}</strong>
        <span>${this.t("editor_install_or_configure_integration")}</span>
        <a
          href="https://github.com/enricobattocchi/myhondaplus-homeassistant"
          target="_blank"
          rel="noopener noreferrer"
          >${this.t("editor_integration_instructions")}</a
        >
      </div>`;
  }
  render() {
    return d`<div class="grid">
      <section>
        <h3>${this.t("editor_vehicle")}</h3>
        ${this.integrationStatus()}
        <button type="button" ?disabled=${this.loading} @click=${() => this.loadDevices()}>
          ${this.t("editor_redetect_entities")}
        </button>
        <label
          >${this.t("connected_vehicle")}
          <select name="device" @change=${this.updateField}>
            <option value="">${this.t("editor_select_vehicle")}</option>
            ${this.devices.map(
      (t) => d`<option value=${t.id} ?selected=${this.config.device === t.id}>
                  ${this.deviceName(t)}
                </option>`
    )}
          </select>
          <span class="hint"
            >${this.loading ? this.t("editor_searching_vehicles") : this.t("editor_vehicles_found", { count: this.devices.length })}</span
          >
        </label>
        ${this.capabilitySummary()}
        <label
          >${this.t("editor_name")}
          <input name="name" .value=${this.config.name ?? ""} @change=${this.updateField} />
        </label>
        <label
          >${this.t("editor_visual_model")}
          <select name="vehicle_model" @change=${this.updateField}>
            ${[
      ["auto", this.t("editor_automatic")],
      ["civic", "Honda Civic"],
      ["hrv", "Honda HR-V"],
      ["crv", "Honda CR-V"],
      ["zrv", "Honda ZR-V"],
      ["jazz", "Honda Jazz"],
      ["honda_e", "Honda e"],
      ["eny1", "Honda e:Ny1"],
      ["generic", this.t("editor_generic_honda")]
    ].map(
      ([t, e]) => d`<option value=${t} ?selected=${this.config.vehicle_model === t}>
                  ${e}
                </option>`
    )}
          </select>
        </label>
      </section>

      <section>
        <h3>${this.t("editor_appearance")}</h3>
        <label
          >${this.t("editor_layout")}
          <select name="layout" @change=${this.updateField}>
            <option value="full" ?selected=${this.config.layout === "full"}>
              ${this.t("editor_full")}
            </option>
            <option value="compact" ?selected=${this.config.layout === "compact"}>
              ${this.t("editor_compact")}
            </option>
          </select>
        </label>
        <label
          >${this.t("editor_vehicle_scale")}
          <input
            name="vehicle_scale"
            type="number"
            min="70"
            max="140"
            step="5"
            .value=${String(this.config.vehicle_scale ?? C.vehicle_scale)}
            @change=${this.updateField}
          />
        </label>
        <label
          >${this.t("editor_alignment")}
          <select name="vehicle_alignment" @change=${this.updateField}>
            <option value="left" ?selected=${this.config.vehicle_alignment === "left"}>
              ${this.t("editor_left")}
            </option>
            <option value="center" ?selected=${this.config.vehicle_alignment === "center"}>
              ${this.t("editor_center")}
            </option>
            <option value="right" ?selected=${this.config.vehicle_alignment === "right"}>
              ${this.t("editor_right")}
            </option>
          </select>
        </label>
        <label class="check"
          ><input
            name="vehicle_shadow"
            type="checkbox"
            .checked=${this.config.vehicle_shadow !== !1}
            @change=${this.updateField}
          />
          ${this.t("editor_show_shadow")}</label
        >
        ${this.config.vehicle_shadow !== !1 ? d`
                <label
                  >${this.t("editor_shadow_color")}
                  <select name="color_preset" @change=${this.updateField}>
                    ${Object.entries(q).map(
      ([t, e]) => d`<option value=${t} ?selected=${this.config.color_preset === t}>
                          ${t === "custom" ? this.t("editor_custom") : e.label}
                        </option>`
    )}
                  </select>
                </label>
                ${this.config.color_preset === "custom" ? d`<label
                        >${this.t("editor_custom_shadow_color")}
                        <input
                          name="vehicle_color"
                          type="color"
                          .value=${this.config.vehicle_color ?? C.vehicle_color}
                          @change=${this.updateField}
                        />
                      </label>` : l}
                <label
                  >${this.t("editor_shadow_intensity")}
                  <input
                    name="shadow_intensity"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    .value=${String(this.config.shadow_intensity ?? C.shadow_intensity)}
                    @change=${this.updateField}
                  />
                </label>
              ` : l}
        <label
          >${this.t("editor_image")}
          <select name="image_mode" @change=${this.updateField}>
            <option value="rendered" ?selected=${this.config.image_mode === "rendered"}>
              ${this.t("editor_included_art")}
            </option>
            <option value="custom" ?selected=${this.config.image_mode === "custom"}>
              ${this.t("editor_custom_image")}
            </option>
          </select>
        </label>
        ${this.config.image_mode === "custom" ? d`<label
                >${this.t("editor_image_url")}
                <input
                  name="vehicle_image"
                  .value=${this.config.vehicle_image ?? ""}
                  placeholder="/local/coches/mi-civic.png"
                  @change=${this.updateField}
                />
              </label>` : l}
      </section>

      <section>
        <h3>${this.t("editor_content")}</h3>
        ${this.checklist(this.t("editor_metrics"), "metrics", [
      ["range", this.t("range")],
      ["battery", this.t("battery")],
      ["odometer", this.t("odometer")],
      ["trip_distance", this.t("trip_distance")],
      ["trip_consumption", this.t("trip_consumption")],
      ["trip_duration", this.t("trip_duration")]
    ])}
        ${this.checklist(this.t("editor_controls"), "controls", [
      ["lock", this.t("editor_locking")],
      ["climate", this.t("climate")],
      ["horn_lights", this.t("horn_lights")],
      ["refresh_cached", this.t("refresh_cached")],
      ["refresh", this.t("refresh_from_car")],
      ["location", this.t("location")]
    ])}
      </section>

      <section>
        <h3>${this.t("editor_behavior")}</h3>
        <label
          >${this.t("editor_language")}
          <select name="locale" @change=${this.updateField}>
            <option value="auto" ?selected=${this.config.locale === "auto"}>
              ${this.t("editor_automatic")}
            </option>
            <option value="es" ?selected=${this.config.locale === "es"}>Español</option>
            <option value="en" ?selected=${this.config.locale === "en"}>English</option>
            <option value="gl" ?selected=${this.config.locale === "gl"}>Galego</option>
          </select>
        </label>
        <label
          >${this.t("editor_stale_after")}
          <input
            name="stale_after"
            type="number"
            min="300"
            step="300"
            .value=${String(this.config.stale_after ?? C.stale_after)}
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
          ${this.t("editor_show_controls")}</label
        >
        <label class="check"
          ><input
            name="show_model"
            type="checkbox"
            .checked=${this.config.show_model !== !1}
            @change=${this.updateField}
          />
          ${this.t("editor_show_model")}</label
        >
        <label class="check"
          ><input
            name="animate"
            type="checkbox"
            .checked=${this.config.animate !== !1}
            @change=${this.updateField}
          />
          ${this.t("editor_allow_animations")}</label
        >
        <label class="check"
          ><input
            name="confirm_unlock"
            type="checkbox"
            .checked=${this.config.confirm_unlock !== !1}
            @change=${this.updateField}
          />
          ${this.t("editor_confirm_unlock")}</label
        >
        <label class="check"
          ><input
            name="debug"
            type="checkbox"
            .checked=${this.config.debug === !0}
            @change=${this.updateField}
          />
          ${this.t("editor_show_diagnostics")}</label
        >
      </section>
    </div>`;
  }
};
f.styles = $e`
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
    select,
    button {
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    input:focus-visible,
    select:focus-visible,
    button:focus-visible,
    a:focus-visible {
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
    button {
      cursor: pointer;
      font-weight: 600;
    }
    button:disabled {
      cursor: wait;
      opacity: 0.65;
    }
    .integration-status,
    .capabilities {
      display: grid;
      gap: 7px;
      padding: 11px;
      border: 1px solid var(--divider-color);
      border-radius: 9px;
      background: var(--secondary-background-color);
      font-size: 0.85rem;
    }
    .integration-status.success {
      border-inline-start: 4px solid var(--success-color, #43a047);
    }
    .integration-status.warning {
      border-inline-start: 4px solid var(--warning-color, #f9a825);
    }
    .integration-status a {
      color: var(--primary-color);
    }
    .capability-group {
      display: grid;
      gap: 5px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .chip {
      padding: 4px 7px;
      border-radius: 999px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      font-size: 0.75rem;
    }
    @media (max-width: 520px) {
      .checks {
        grid-template-columns: 1fr;
      }
    }
  `;
w([
  oe({ attribute: !1 })
], f.prototype, "hass", 2);
w([
  g()
], f.prototype, "config", 2);
w([
  g()
], f.prototype, "devices", 2);
w([
  g()
], f.prototype, "registryEntries", 2);
w([
  g()
], f.prototype, "loading", 2);
w([
  g()
], f.prototype, "integrationDetected", 2);
w([
  g()
], f.prototype, "discoveryError", 2);
f = w([
  ke(Qe)
], f);
const g1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get MyHondaPlusVehicleCardEditor() {
    return f;
  }
}, Symbol.toStringTag, { value: "Module" }));
