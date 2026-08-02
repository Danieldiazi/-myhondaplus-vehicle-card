/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, ee = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, te = Symbol(), re = /* @__PURE__ */ new WeakMap();
let be = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== te) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ee && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = re.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && re.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Me = (t) => new be(typeof t == "string" ? t : t + "", void 0, te), ye = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, o, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[n + 1], t[0]);
  return new be(i, t, te);
}, Pe = (t, e) => {
  if (ee) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), o = j.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = i.cssText, t.appendChild(s);
  }
}, ne = ee ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return Me(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Le, defineProperty: Oe, getOwnPropertyDescriptor: ze, getOwnPropertyNames: He, getOwnPropertySymbols: Te, getPrototypeOf: Ue } = Object, $ = globalThis, ae = $.trustedTypes, Ne = ae ? ae.emptyScript : "", G = $.reactiveElementPolyfillSupport, z = (t, e) => t, I = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ne : null;
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
} }, ie = (t, e) => !Le(t, e), ce = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: ie };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let M = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = ce) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), o = this.getPropertyDescriptor(e, s, i);
      o !== void 0 && Oe(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: o, set: n } = ze(this.prototype, e) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: o, set(r) {
      const c = o == null ? void 0 : o.call(this);
      n == null || n.call(this, r), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = Ue(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const i = this.properties, s = [...He(i), ...Te(i)];
      for (const o of s) this.createProperty(o, i[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, o] of i) this.elementProperties.set(s, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const o = this._$Eu(i, s);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const o of s) i.unshift(ne(o));
    } else e !== void 0 && i.push(ne(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostConnected) == null ? void 0 : s.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostDisconnected) == null ? void 0 : s.call(i);
    });
  }
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    var n;
    const s = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, s);
    if (o !== void 0 && s.reflect === !0) {
      const r = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : I).toAttribute(i, s.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var n, r;
    const s = this.constructor, o = s._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const c = s.getPropertyOptions(o), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((n = c.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? c.converter : I;
      this._$Em = o;
      const u = a.fromAttribute(i, c.type);
      this[o] = u ?? ((r = this._$Ej) == null ? void 0 : r.get(o)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, o = !1, n) {
    var r;
    if (e !== void 0) {
      const c = this.constructor;
      if (o === !1 && (n = this[e]), s ?? (s = c.getPropertyOptions(e)), !((s.hasChanged ?? ie)(n, i) || s.useDefault && s.reflect && n === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(c._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: o, wrapped: n }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? i ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [n, r] of o) {
        const { wrapped: c } = r, a = this[n];
        c !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, r, a);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (s = this._$EO) == null || s.forEach((o) => {
        var n;
        return (n = o.hostUpdate) == null ? void 0 : n.call(o);
      }), this.update(i)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((s) => {
      var o;
      return (o = s.hostUpdated) == null ? void 0 : o.call(s);
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[z("elementProperties")] = /* @__PURE__ */ new Map(), M[z("finalized")] = /* @__PURE__ */ new Map(), G == null || G({ ReactiveElement: M }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, le = (t) => t, B = H.trustedTypes, de = B ? B.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, we = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, Ae = "?" + _, De = `<${Ae}>`, S = document, T = () => S.createComment(""), U = (t) => t === null || typeof t != "object" && typeof t != "function", se = Array.isArray, Re = (t) => se(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ue = />/g, w = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, ge = /"/g, xe = /^(?:script|style|textarea|title)$/i, Ve = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), h = Ve(1), E = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), fe = /* @__PURE__ */ new WeakMap(), x = S.createTreeWalker(S, 129);
function ke(t, e) {
  if (!se(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return de !== void 0 ? de.createHTML(e) : e;
}
const je = (t, e) => {
  const i = t.length - 1, s = [];
  let o, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = O;
  for (let c = 0; c < i; c++) {
    const a = t[c];
    let u, p, d = -1, f = 0;
    for (; f < a.length && (r.lastIndex = f, p = r.exec(a), p !== null); ) f = r.lastIndex, r === O ? p[1] === "!--" ? r = he : p[1] !== void 0 ? r = ue : p[2] !== void 0 ? (xe.test(p[2]) && (o = RegExp("</" + p[2], "g")), r = w) : p[3] !== void 0 && (r = w) : r === w ? p[0] === ">" ? (r = o ?? O, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, u = p[1], r = p[3] === void 0 ? w : p[3] === '"' ? ge : pe) : r === ge || r === pe ? r = w : r === he || r === ue ? r = O : (r = w, o = void 0);
    const v = r === w && t[c + 1].startsWith("/>") ? " " : "";
    n += r === O ? a + De : d >= 0 ? (s.push(u), a.slice(0, d) + we + a.slice(d) + _ + v) : a + _ + (d === -2 ? c : v);
  }
  return [ke(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: e, _$litType$: i }, s) {
    let o;
    this.parts = [];
    let n = 0, r = 0;
    const c = e.length - 1, a = this.parts, [u, p] = je(e, i);
    if (this.el = N.createElement(u, s), x.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (o = x.nextNode()) !== null && a.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const d of o.getAttributeNames()) if (d.endsWith(we)) {
          const f = p[r++], v = o.getAttribute(d).split(_), V = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: n, name: V[2], strings: v, ctor: V[1] === "." ? Be : V[1] === "?" ? Qe : V[1] === "@" ? Fe : q }), o.removeAttribute(d);
        } else d.startsWith(_) && (a.push({ type: 6, index: n }), o.removeAttribute(d));
        if (xe.test(o.tagName)) {
          const d = o.textContent.split(_), f = d.length - 1;
          if (f > 0) {
            o.textContent = B ? B.emptyScript : "";
            for (let v = 0; v < f; v++) o.append(d[v], T()), x.nextNode(), a.push({ type: 2, index: ++n });
            o.append(d[f], T());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Ae) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = o.data.indexOf(_, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += _.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const s = S.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(t, e, i = t, s) {
  var r, c;
  if (e === E) return e;
  let o = s !== void 0 ? (r = i._$Co) == null ? void 0 : r[s] : i._$Cl;
  const n = U(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== n && ((c = o == null ? void 0 : o._$AO) == null || c.call(o, !1), n === void 0 ? o = void 0 : (o = new n(t), o._$AT(t, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = o : i._$Cl = o), o !== void 0 && (e = L(t, o._$AS(t, e.values), o, s)), e;
}
class Ie {
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
    const { el: { content: i }, parts: s } = this._$AD, o = ((e == null ? void 0 : e.creationScope) ?? S).importNode(i, !0);
    x.currentNode = o;
    let n = x.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let u;
        a.type === 2 ? u = new D(n, n.nextSibling, this, e) : a.type === 1 ? u = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (u = new qe(n, this, e)), this._$AV.push(u), a = s[++c];
      }
      r !== (a == null ? void 0 : a.index) && (n = x.nextNode(), r++);
    }
    return x.currentNode = S, o;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class D {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, s, o) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    e = L(this, e, i), U(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Re(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: i, _$litType$: s } = e, o = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = N.createElement(ke(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === o) this._$AH.p(i);
    else {
      const r = new Ie(o, this), c = r.u(this.options);
      r.p(i), this.T(c), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = fe.get(e.strings);
    return i === void 0 && fe.set(e.strings, i = new N(e)), i;
  }
  k(e) {
    se(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, o = 0;
    for (const n of e) o === i.length ? i.push(s = new D(this.O(T()), this.O(T()), this, this.options)) : s = i[o], s._$AI(n), o++;
    o < i.length && (this._$AR(s && s._$AB.nextSibling, o), i.length = o);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); e !== this._$AB; ) {
      const o = le(e).nextSibling;
      le(e).remove(), e = o;
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
  constructor(e, i, s, o, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = i, this._$AM = o, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(e, i = this, s, o) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = L(this, e, i, 0), r = !U(e) || e !== this._$AH && e !== E, r && (this._$AH = e);
    else {
      const c = e;
      let a, u;
      for (e = n[0], a = 0; a < n.length - 1; a++) u = L(this, c[s + a], i, a), u === E && (u = this._$AH[a]), r || (r = !U(u) || u !== this._$AH[a]), u === l ? e = l : e !== l && (e += (u ?? "") + n[a + 1]), this._$AH[a] = u;
    }
    r && !o && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Be extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class Qe extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class Fe extends q {
  constructor(e, i, s, o, n) {
    super(e, i, s, o, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = L(this, e, i, 0) ?? l) === E) return;
    const s = this._$AH, o = e === l && s !== l || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== l && (s === l || o);
    o && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class qe {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    L(this, e);
  }
}
const Z = H.litHtmlPolyfillSupport;
Z == null || Z(N, D), (H.litHtmlVersions ?? (H.litHtmlVersions = [])).push("3.3.3");
const Ge = (t, e, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? e;
  let o = s._$litPart$;
  if (o === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = o = new D(e.insertBefore(T(), n), n, void 0, i ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
let P = class extends M {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ge(i, this.renderRoot, this.renderOptions);
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
    return E;
  }
};
var $e;
P._$litElement$ = !0, P.finalized = !0, ($e = k.litElementHydrateSupport) == null || $e.call(k, { LitElement: P });
const J = k.litElementPolyfillSupport;
J == null || J({ LitElement: P });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Se = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: ie }, Ze = (t = We, e, i) => {
  const { kind: s, metadata: o } = i;
  let n = globalThis.litPropertyMetadata.get(o);
  if (n === void 0 && globalThis.litPropertyMetadata.set(o, n = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), s === "accessor") {
    const { name: r } = i;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(r, a, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, t, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = i;
    return function(c) {
      const a = this[r];
      e.call(this, c), this.requestUpdate(r, a, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function oe(t) {
  return (e, i) => typeof i == "object" ? Ze(t, e, i) : ((s, o, n) => {
    const r = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(t) {
  return oe({ ...t, state: !0, attribute: !1 });
}
const Q = "myhondaplus-vehicle-card", Je = "myhondaplus-vehicle-card-editor", Ee = "0.5.1", g = {
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
}, Ke = [
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
function me(t, e, i, s) {
  var o;
  return {
    cardVersion: Ee,
    homeAssistantVersion: (o = t == null ? void 0 : t.config) == null ? void 0 : o.version,
    model: i,
    locale: s,
    entities: Ke.map((n) => {
      const r = e[n], c = r == null ? void 0 : r.split(".")[0];
      return {
        key: n,
        entityId: c ? `${c}.[redacted]` : void 0,
        available: !!(r && (t != null && t.states[r]))
      };
    })
  };
}
function ve(t) {
  return JSON.stringify(t, null, 2);
}
const Ye = {
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
}, Xe = (t) => [t.entity_id, t.unique_id, t.translation_key, t.original_name].filter(Boolean).join(" ").toLowerCase();
function et(t, e = {}) {
  const i = { ...e };
  for (const [s, o] of Object.entries(Ye)) {
    if (i[s]) continue;
    const n = t.filter((r) => !r.disabled_by).filter((r) => o.domains.includes(r.entity_id.split(".")[0] ?? "")).map((r) => {
      const c = Xe(r), a = o.hints.reduce(
        (u, p, d) => u + (c.includes(p) ? 100 - d : 0),
        0
      );
      return { entry: r, score: a };
    }).filter(({ score: r }) => r > 0).sort((r, c) => c.score - r.score)[0];
    n && (i[s] = n.entry.entity_id);
  }
  return i;
}
const tt = {
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
function Ce(t) {
  const e = t == null ? void 0 : t.toLowerCase().split(/[-_]/)[0];
  return e === "en" || e === "gl" ? e : "es";
}
function _e(t, e, i = {}) {
  const s = Ce(e);
  let o = tt[s][t];
  for (const [n, r] of Object.entries(i))
    o = o.replaceAll(`{${n}}`, String(r));
  return o;
}
const it = [
  ["civic", /civic/i],
  ["hrv", /\bhr[- ]?v\b/i],
  ["crv", /\bcr[- ]?v\b/i],
  ["zrv", /\bzr[- ]?v\b/i],
  ["jazz", /jazz|fit/i],
  ["eny1", /\be:?ny1\b/i],
  ["honda_e", /honda\s*e\b/i]
];
function st(t) {
  var i;
  const e = [t == null ? void 0 : t.name_by_user, t == null ? void 0 : t.name, t == null ? void 0 : t.model, t == null ? void 0 : t.manufacturer].filter(Boolean).join(" ");
  return ((i = it.find(([, s]) => s.test(e))) == null ? void 0 : i[0]) ?? "generic";
}
function ot(t) {
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
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = { CHILD: 2 }, nt = (t) => (...e) => ({ _$litDirective$: t, values: e });
class at {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, s) {
    this._$Ct = e, this._$AM = i, this._$Ci = s;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Y extends at {
  constructor(e) {
    if (super(e), this.it = l, e.type !== rt.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === l || e == null) return this._t = void 0, this.it = e;
    if (e === E) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const i = [e];
    return i.raw = i, this._t = { _$litType$: this.constructor.resultType, strings: i, values: [] };
  }
}
Y.directiveName = "unsafeHTML", Y.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class X extends Y {
}
X.directiveName = "unsafeSVG", X.resultType = 2;
const ct = nt(X), lt = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623 300" role="img" aria-labelledby="title desc">
  <title id="title">Honda Civic 2024, vista lateral</title>
  <desc id="desc">Ilustración lateral de un Honda Civic con carrocería coloreable, cristales y ruedas independientes.</desc>

  <defs>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9e8ee" />
      <stop offset="1" stop-color="#8299a5" />
    </linearGradient>
    <linearGradient id="tire" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#30383d" />
      <stop offset="1" stop-color="#111518" />
    </linearGradient>
  </defs>

  <g class="vehicle-shadow" opacity=".16">
    <ellipse cx="312" cy="242" rx="267" ry="14" fill="#000" />
  </g>

  <g class="body" fill="currentColor">
    <path d="M27 207c5-18 22-30 53-38l93-14 68-54c24-19 51-29 86-31l69 4c38 3 71 15 104 31l49 24 27 3 4 26-11 10 21 12v35l-43 5c-5-23-23-39-48-39s-45 16-50 39H181c-5-23-24-39-49-39s-44 16-49 39H34z" />
    <path d="M34 207h49c5-23 24-39 49-39s44 16 49 39h268c5-23 25-39 50-39s43 16 48 39h43l-2 15-68 5H177l-90-3-52-4z" />
  </g>

  <g class="glass" fill="url(#glass)" stroke="#20272b" stroke-width="3" stroke-linejoin="round">
    <path d="m184 153 57-45c22-18 48-28 80-29l67 4c36 3 66 13 96 28l36 18-25 8-34-25c-22-9-46-14-73-16l-65-3c-29 1-51 9-71 25l-43 35z" />
    <path d="m319 81-12 73M404 87l38 67" fill="none" />
  </g>

  <g class="wheels">
    <g transform="translate(132 207)">
      <circle r="37" fill="url(#tire)" stroke="#15191c" stroke-width="3" />
      <circle r="27" fill="#c5cdd0" stroke="#20272b" stroke-width="3" />
      <circle r="19" fill="#879298" stroke="#20272b" stroke-width="2" />
      <path d="M0-17v34M-17 0h34M-12-12l24 24M12-12-12 12" stroke="#273035" stroke-width="3" />
      <circle r="5" fill="#20272b" />
    </g>
    <g transform="translate(487 207)">
      <circle r="37" fill="url(#tire)" stroke="#15191c" stroke-width="3" />
      <circle r="27" fill="#c5cdd0" stroke="#20272b" stroke-width="3" />
      <circle r="19" fill="#879298" stroke="#20272b" stroke-width="2" />
      <path d="M0-17v34M-17 0h34M-12-12l24 24M12-12-12 12" stroke="#273035" stroke-width="3" />
      <circle r="5" fill="#20272b" />
    </g>
  </g>

  <g class="lines" fill="none" stroke="#20272b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M27 207c5-18 22-30 53-38l93-14 68-54c24-19 51-29 86-31l69 4c38 3 71 15 104 31l49 24 27 3 4 26-11 10 21 12v35l-43 5M34 222l52 5 91 3h278l68-5" />
    <path d="M80 169c29-5 60-9 93-12M493 129l42 6 28 18-24 10-39-19-35-3" />
    <path d="M181 153v67M314 154l-1 66M440 154l18 66M181 201h277" />
    <path d="M80 184c16-8 34-11 54-10M513 181l45 3M29 207l17-17 36-6M35 220l35-2" />
    <path d="M543 151h30M548 157l25 3" stroke-width="2" />
    <path d="M87 224c5-23 24-39 49-39s44 16 49 39M438 224c5-23 25-39 50-39s43 16 48 39" />
  </g>

  <g class="lights" fill="#f5f1c4" stroke="#20272b" stroke-width="2">
    <path d="M39 187c12-9 26-13 43-14l-12 14-31 8z" />
    <path d="M560 148h18l6 10-22 3z" />
  </g>
</svg>
`, dt = {
  civic: "M270 174 L360 94 Q410 62 495 68 L625 82 Q680 90 735 170",
  hrv: "M250 174 L335 78 Q388 45 486 50 L642 66 Q702 77 758 171",
  crv: "M235 174 L320 62 Q380 30 500 38 L660 55 Q724 70 775 171",
  zrv: "M245 174 L332 72 Q392 40 500 47 L648 63 Q710 76 765 171",
  jazz: "M265 174 L340 82 Q390 53 470 55 L594 65 Q650 75 720 171",
  honda_e: "M285 174 L350 88 Q392 62 470 62 L575 66 Q627 72 692 171",
  eny1: "M240 174 L326 70 Q388 36 500 42 L655 58 Q716 72 770 171",
  generic: "M260 174 L340 82 Q395 50 488 55 L625 68 Q687 78 745 171"
};
function ht(t, e, i) {
  return t === "civic" ? h`${ct(lt.replaceAll("currentColor", e))}` : h`<svg class="vehicle-art" viewBox="0 0 960 360" role="img" aria-label="${t}">
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
      d="M95 245 Q120 198 210 182 L270 174 ${dt[t]} L840 196 Q894 207 915 254 L899 291 L790 300 Q778 235 705 235 Q632 235 620 300 L350 300 Q338 235 265 235 Q192 235 180 300 L87 284 Z"
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
    ${[265, 705].map((s) => h`<g><circle cx=${s} cy="288" r="65" fill="#15191c"></circle><circle cx=${s} cy="288" r="37" fill="#8f979d"></circle><circle cx=${s} cy="288" r="13" fill="#34393d"></circle></g>`)}
  </svg>`;
}
const ut = /* @__PURE__ */ new Set(["on", "open", "unlocked", "active", "charging", "plugged", "true"]), pt = /* @__PURE__ */ new Set(["unknown", "unavailable", "none"]);
function A(t) {
  return ut.has((t == null ? void 0 : t.state.toLowerCase()) ?? "");
}
function K(t) {
  if (!t || pt.has(t.state.toLowerCase())) return "—";
  const e = t.attributes.unit_of_measurement;
  return `${t.state}${e ? ` ${String(e)}` : ""}`;
}
function gt(t, e = Date.now()) {
  if (!t) return;
  const i = Date.parse(t.last_updated);
  return Number.isFinite(i) ? Math.max(0, Math.floor((e - i) / 1e3)) : void 0;
}
function ft(t, e, i = Date.now()) {
  const s = t.updated ?? t.range ?? t.odometer, o = gt(s, i);
  return {
    locked: t.lock ? t.lock.state === "locked" : void 0,
    range: K(t.range),
    battery: K(t.battery),
    odometer: K(t.odometer),
    climateActive: A(t.climate),
    charging: A(t.charging),
    doorsOpen: A(t.doors),
    windowsOpen: A(t.windows),
    trunkOpen: A(t.trunk),
    hoodOpen: A(t.hood),
    lightsOn: A(t.lights),
    ageSeconds: o,
    stale: o !== void 0 && o > e
  };
}
var mt = Object.defineProperty, vt = Object.getOwnPropertyDescriptor, C = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? vt(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (o = (s ? r(e, i, o) : r(o)) || o);
  return s && o && mt(e, i, o), o;
};
const _t = ["lock", "climate", "refresh", "location"], $t = ["range", "battery", "odometer"];
let m = class extends P {
  constructor() {
    super(...arguments), this.config = { ...g }, this.entities = {};
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => wt), document.createElement("myhondaplus-vehicle-card-editor");
  }
  static getStubConfig() {
    return { ...g };
  }
  setConfig(t) {
    if (!t) throw new Error(_e("required_config", "es"));
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
    return this.config.locale && this.config.locale !== "auto" ? this.config.locale : Ce((t = this.hass) == null ? void 0 : t.language);
  }
  t(t, e = {}) {
    return _e(t, this.locale(), e);
  }
  async loadDeviceData() {
    if (!(!this.hass || !this.config.device || this.loadedDevice === this.config.device)) {
      this.loadedDevice = this.config.device;
      try {
        const [t, e] = await Promise.all([
          this.hass.callWS({ type: "config/entity_registry/list" }),
          this.hass.callWS({ type: "config/device_registry/list" })
        ]);
        this.entities = et(
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
    return ft(
      this.entityRecord(),
      this.config.stale_after ?? g.stale_after
    );
  }
  model() {
    return this.config.vehicle_model && this.config.vehicle_model !== "auto" ? this.config.vehicle_model : st(this.device);
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
    var n;
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
    const i = this.vehicleState(), s = e.split(".")[0] ?? "";
    let o = s === "button" ? "press" : ((n = this.entity(t)) == null ? void 0 : n.state) === "on" ? "turn_off" : "turn_on";
    if (s === "lock" && (o = i.locked ? "unlock" : "lock"), !(s === "lock" && o === "unlock" && this.config.confirm_unlock !== !1 && !window.confirm(this.t("confirm_unlock")))) {
      this.busy = t, this.message = void 0;
      try {
        await this.hass.callService(s, o, { entity_id: e });
      } catch (r) {
        this.message = { kind: "error", text: this.t("action_failed") }, console.warn("My Honda+ Vehicle Card: service call failed", { domain: s, service: o, error: r });
      } finally {
        this.busy = void 0;
      }
    }
  }
  async copyDiagnostics() {
    const t = ve(
      me(this.hass, this.entities, this.model(), this.locale())
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
  status(t, e, i, s, o) {
    return h`<div
      class="status ${i ? "warning" : ""}"
      aria-label=${`${e}: ${i ? s : o}`}
    >
      <span class="status-icon" aria-hidden="true">${t}</span>
      <div><b>${e}</b><small>${i ? s : o}</small></div>
      <i aria-hidden="true"></i>
    </div>`;
  }
  control(t, e, i) {
    if (!this.entities[i]) return l;
    const s = this.busy === i;
    return h`<button
      type="button"
      aria-label=${e}
      aria-busy=${s ? "true" : "false"}
      ?disabled=${!!this.busy}
      @click=${() => void this.execute(i)}
    >
      <span aria-hidden="true">${s ? "…" : t}</span><small>${e}</small>
    </button>`;
  }
  vehicleVisual(t) {
    return this.config.image_mode === "custom" && this.config.vehicle_image ? h`<img src=${this.config.vehicle_image} alt=${this.t("vehicle")} loading="lazy" />` : ht(this.model(), this.paintColor(), {
      charging: t.charging,
      climate: t.climateActive,
      lights: t.lightsOn
    });
  }
  render() {
    var o;
    const t = this.vehicleState(), e = t.locked === !0 ? this.t("locked") : t.locked === !1 ? this.t("unlocked") : this.t("unknown_state"), i = this.config.controls ?? [..._t], s = this.config.metrics ?? [...$t];
    return h`<ha-card class=${this.config.animate === !1 ? "reduce-motion" : ""}>
      <header>
        <div>
          <h2>${this.config.name}</h2>
          ${this.config.show_model !== !1 ? h`<p>${ot(this.model())}</p>` : l}
        </div>
        <span class="badge ${t.locked === !1 ? "alert" : ""}">
          ${t.locked ? "🔒" : "🔓"} ${e}
        </span>
      </header>

      <div class="announcer" aria-live="polite">
        ${this.busy ? this.t("action_in_progress") : ((o = this.message) == null ? void 0 : o.text) ?? ""}
      </div>
      ${this.message ? h`<div class="message ${this.message.kind}">${this.message.text}</div>` : l}

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
              ${s.map((n) => this.metric(n, t))}
            </section>` : h`<div class="setup">${this.t("select_vehicle")}</div>`}
      ${this.config.layout !== "compact" ? h`<section class="statuses">
              ${this.status("🚪", this.t("doors"), t.doorsOpen, this.t("open"), this.t("closed"))}
              ${this.status("▤", this.t("windows"), t.windowsOpen, this.t("open"), this.t("closed"))}
              ${this.status("▰", this.t("trunk"), t.trunkOpen, this.t("open"), this.t("closed"))}
              ${this.status("▱", this.t("hood"), t.hoodOpen, this.t("open"), this.t("closed"))}
              ${this.status("💡", this.t("lights"), t.lightsOn, this.t("on"), this.t("off"))}
              ${this.status("⚡", this.t("charging"), t.charging, this.t("active"), this.t("inactive"))}
            </section>` : l}
      ${this.config.show_controls !== !1 ? h`<nav class="controls" aria-label="Vehicle controls">
              ${i.map((n) => {
      const r = {
        lock: {
          icon: t.locked ? "🔓" : "🔒",
          label: t.locked ? this.t("unlock") : this.t("lock")
        },
        climate: { icon: "❄️", label: this.t("climate") },
        refresh: { icon: "↻", label: this.t("refresh") },
        location: { icon: "⌖", label: this.t("location") }
      }[n];
      return this.control(r.icon, r.label, n);
    })}
            </nav>` : l}
      ${this.config.debug ? h`<details class="diagnostics">
              <summary>Diagnostics</summary>
              <button type="button" @click=${() => void this.copyDiagnostics()}>
                Copy anonymized diagnostics
              </button>
              <pre>
${ve(me(this.hass, this.entities, this.model(), this.locale()))}</pre>
            </details>` : l}
    </ha-card>`;
  }
};
m.styles = ye`
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
C([
  oe({ attribute: !1 })
], m.prototype, "hass", 2);
C([
  y()
], m.prototype, "config", 2);
C([
  y()
], m.prototype, "entities", 2);
C([
  y()
], m.prototype, "device", 2);
C([
  y()
], m.prototype, "busy", 2);
C([
  y()
], m.prototype, "message", 2);
m = C([
  Se(Q)
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
  `%c MYHONDAPLUS-VEHICLE-CARD %c ${Ee} `,
  "color:white;background:#a51d2d;font-weight:700",
  "color:#a51d2d;background:white;font-weight:700"
);
var bt = Object.defineProperty, yt = Object.getOwnPropertyDescriptor, R = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? yt(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (o = (s ? r(e, i, o) : r(o)) || o);
  return s && o && bt(e, i, o), o;
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
          e.filter((s) => s.platform === "myhondaplus" && s.device_id).map((s) => s.device_id)
        );
        this.devices = t.filter((s) => i.has(s.id)).sort((s, o) => this.deviceName(s).localeCompare(this.deviceName(o)));
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
    var o;
    const e = t.currentTarget;
    let i = e.value;
    e instanceof HTMLInputElement && e.type === "checkbox" && (i = e.checked), e.name === "stale_after" && (i = Number(e.value));
    const s = { ...this.config, [e.name]: i };
    e.name === "color_preset" && i !== "custom" && (s.vehicle_color = ((o = F[String(i)]) == null ? void 0 : o.value) ?? s.vehicle_color), this.config = s, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: s },
        bubbles: !0,
        composed: !0
      })
    );
  }
  toggleListValue(t, e) {
    const i = t.currentTarget, s = new Set(this.config[e] ?? g[e]);
    i.checked ? s.add(i.value) : s.delete(i.value);
    const o = { ...this.config, [e]: [...s] };
    this.config = o, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: o },
        bubbles: !0,
        composed: !0
      })
    );
  }
  checklist(t, e, i) {
    const s = new Set(this.config[e] ?? g[e]);
    return h`<fieldset>
      <legend>${t}</legend>
      <div class="checks">
        ${i.map(
      ([o, n]) => h`<label class="check">
              <input
                type="checkbox"
                .value=${o}
                .checked=${s.has(o)}
                @change=${(r) => this.toggleListValue(r, e)}
              />
              ${n}
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
              </label>` : l}
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
              </label>` : l}
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
b.styles = ye`
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
R([
  oe({ attribute: !1 })
], b.prototype, "hass", 2);
R([
  y()
], b.prototype, "config", 2);
R([
  y()
], b.prototype, "devices", 2);
R([
  y()
], b.prototype, "loading", 2);
b = R([
  Se(Je)
], b);
const wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get MyHondaPlusVehicleCardEditor() {
    return b;
  }
}, Symbol.toStringTag, { value: "Module" }));
