/* Optional page helper. Invoke only in a loaded PoE 1 page under MCP Offline
 * emulation, after resolving the exact existing rule and backing up this result.
 * No account, download, save, or synchronization workflows are invoked here.
 */
(() => {
  'use strict';
  if (globalThis.__poeFilterFB) throw new Error('A FilterBlade helper already exists');
  let session = null;
  let busy = false;
  const inputEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'beforeinput', 'input', 'change', 'click'];
  function trackInput(event) {
    if (event.isTrusted && session?.awaiting) session.conflict = true;
  }
  for (const type of inputEvents) document.addEventListener(type, trackInput, true);
  function noInteraction(s) {
    if (s.conflict) throw new Error('User interaction overlapped a native operation; recovery retained for manual reconciliation');
  }
  function removeHelper() {
    for (const type of inputEvents) document.removeEventListener(type, trackInput, true);
    session = null;
    delete globalThis.__poeFilterFB;
  }
  const fields = ['SetTextColor', 'SetBorderColor', 'SetBackgroundColor', 'SetFontSize'];
  const clone = value => JSON.parse(JSON.stringify(value));
  function offline() {
    if (navigator.onLine !== false) throw new Error('Enable MCP Offline emulation first');
  }
  function context() {
    offline();
    const fb = globalThis.gFilterBlade;
    if (!fb?.isLoaded || fb.getGameType?.() !== 'Poe1') throw new Error('A loaded PoE 1 page is required');
    return fb;
  }
  function current() {
    const fb = context();
    if (!session || fb !== session.fb || fb.filterData !== session.data ||
        fb.changeStorage !== session.cs || fb.saveMetaDataProvider !== session.metadata ||
        fb.changeStorage.currentlyActiveSaveState !== session.active ||
        fb.filterData.getEntryById(session.entry.entryId) !== session.entry ||
        session.entry.getVisualEditor() !== session.editor) {
      throw new Error('Prepared page context changed; retain recovery state and inspect manually');
    }
    return session;
  }
  function exclusive(operation) {
    return async (...args) => {
      if (busy) throw new Error('Another helper operation is running');
      busy = true;
      try { return await operation(...args); }
      finally { busy = false; }
    };
  }
  function capture(roots) {
    const saved = new Map();
    function visit(obj, force = false) {
      if (!obj || typeof obj !== 'object' || saved.has(obj) || obj instanceof Node) return;
      const proto = Object.getPrototypeOf(obj);
      if (!force && !Array.isArray(obj) && proto !== Object.prototype && proto !== null &&
          !(obj instanceof Map) && !(obj instanceof Set)) return;
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      const collection = obj instanceof Map ? [...obj] : obj instanceof Set ? [...obj] : null;
      saved.set(obj, {descriptors, collection});
      for (const key of Reflect.ownKeys(descriptors)) {
        const d = descriptors[key];
        if ('value' in d) visit(d.value);
      }
      if (collection) for (const value of collection.flat()) visit(value);
    }
    roots.forEach(obj => visit(obj, true));
    function differences() {
      const result = [];
      let object = 0;
      for (const [obj, {descriptors: expected, collection}] of saved) {
        const actual = Object.getOwnPropertyDescriptors(obj);
        for (const key of new Set([...Reflect.ownKeys(expected), ...Reflect.ownKeys(actual)])) {
          const a = actual[key], b = expected[key];
          if (!a || !b || Reflect.ownKeys(a).some(k => !Object.is(a[k], b[k])) ||
              Reflect.ownKeys(b).some(k => !Object.is(a[k], b[k]))) {
            result.push({object, property: String(key)});
          }
        }
        if (collection) {
          const now = [...obj];
          const equal = now.length === collection.length && now.every((v, i) => obj instanceof Map
            ? Object.is(v[0], collection[i][0]) && Object.is(v[1], collection[i][1])
            : Object.is(v, collection[i]));
          if (!equal) result.push({object, property: 'collection contents'});
        }
        object++;
      }
      return result;
    }
    return {
      count: saved.size, differences,
      restore() {
        for (const [obj, {descriptors, collection}] of saved) {
          for (const key of Reflect.ownKeys(obj)) {
            if (!Object.hasOwn(descriptors, key) && !Reflect.deleteProperty(obj, key)) {
              throw new Error('Cannot remove added native state');
            }
          }
          Object.defineProperties(obj, descriptors);
          if (collection) {
            obj.clear();
            for (const v of collection) obj instanceof Map ? obj.set(v[0], v[1]) : obj.add(v);
          }
        }
      },
    };
  }
  function roots(s) {
    const entries = s.data.filterEntries;
    const observers = s.entry.observables.map(o => o[0]).filter(Boolean);
    const parents = new Set();
    for (const observer of [s.editor, ...observers]) {
      let parent = observer.parent;
      while (parent && !parents.has(parent)) { parents.add(parent); parent = parent.parent; }
    }
    const groups = s.cs.changeGroups;
    return [s.fb, s.data, s.cs, s.cs.changeGroupManager, s.metadata, s.active,
      s.data.filterEntryStyles, ...entries, ...new Set(entries.flatMap(e => e.lineList)),
      ...groups, ...groups.flatMap(g => g.changes), s.editor, s.editor.value,
      s.editor.visualItem, s.editor.visualItem?.value, ...parents,
      ...observers.flatMap(o => [o, o.value, o.visualItem, o.visualItem?.value])].filter(Boolean);
  }
  function capturePage() {
    const nodes = [document.documentElement, ...document.documentElement.querySelectorAll('*')];
    const elements = nodes.map(node => ({node, attrs: [...node.attributes].map(a => [a.name, a.value]),
      children: [...node.childNodes]}));
    const texts = elements.flatMap(e => e.children.filter(n => n.nodeType === Node.TEXT_NODE ||
      n.nodeType === Node.COMMENT_NODE).map(node => ({node, value: node.nodeValue})));
    const controls = nodes.filter(n => /^(INPUT|SELECT|TEXTAREA|OPTION)$/.test(n.tagName)).map(node => ({node,
      properties: ['value', 'checked', 'selected', 'selectedIndex'].filter(k => k in node)
        .map(k => [k, node[k]])}));
    const title = document.title;
    const autosave = localStorage.getItem('ChangeSave:0');
    const equalChildren = e => e.node.childNodes.length === e.children.length &&
      e.children.every((n, i) => e.node.childNodes[i] === n);
    const equalAttrs = e => e.node.attributes.length === e.attrs.length &&
      e.attrs.every(([k, v]) => e.node.getAttribute(k) === v);
    return {
      restore() {
        for (const e of elements) {
          if (!equalChildren(e)) e.node.replaceChildren(...e.children);
          if (!equalAttrs(e)) {
            for (const a of [...e.node.attributes]) e.node.removeAttribute(a.name);
            for (const [k, v] of e.attrs) e.node.setAttribute(k, v);
          }
        }
        for (const t of texts) if (t.node.nodeValue !== t.value) t.node.nodeValue = t.value;
        for (const c of controls) for (const [k, v] of c.properties) if (c.node[k] !== v) c.node[k] = v;
        if (document.title !== title) document.title = title;
        if (localStorage.getItem('ChangeSave:0') !== autosave) {
          if (autosave === null) localStorage.removeItem('ChangeSave:0');
          else localStorage.setItem('ChangeSave:0', autosave);
        }
      },
      checks: () => ({autosaveExact: localStorage.getItem('ChangeSave:0') === autosave,
        titleExact: document.title === title, domExact: elements.every(e => equalChildren(e) && equalAttrs(e)) &&
          texts.every(t => t.node.nodeValue === t.value) &&
          controls.every(c => c.properties.every(([k, v]) => c.node[k] === v))}),
    };
  }
  function checkpoint(s) {
    const native = capture(roots(s)), page = capturePage();
    return {native, page, restore() { try { native.restore(); } finally { page.restore(); } }};
  }
  function stable(s, operation) {
    const point = checkpoint(s);
    let result;
    try { result = operation(); }
    finally {
      point.restore();
      if (point.native.differences().length || !Object.values(point.page.checks()).every(Boolean)) {
        throw new Error('Native serialization state could not be restored');
      }
    }
    return result;
  }
  function compile(s) {
    return stable(s, () => {
      const text = s.data.compileFullText();
      if (typeof text !== 'string') throw new Error('Native export did not return text');
      return text;
    });
  }
  function remember(s) {
    noInteraction(s);
    s.expectedExport = compile(s);
    s.expected = checkpoint(s);
  }
  function unchanged(s) {
    noInteraction(s);
    if (s.uiUnsettled) throw new Error('Native editor UI did not settle; recovery retained for manual reconciliation');
    if (!s.expected || s.expected.native.differences().length ||
        !Object.values(s.expected.page.checks()).every(Boolean) || compile(s) !== s.expectedExport) {
      throw new Error('Page state changed outside this helper; recovery retained, no automatic rollback performed');
    }
  }
  async function settleEditor(s) {
    s.uiUnsettled = true;
    const jq = globalThis.jQuery;
    const slider = document.getElementById('VisualEditor_SizeSlider_' + s.editor.id);
    const background = document.getElementById('Item' + s.editor.visualItem.id + 'BackgroundDiv');
    const label = document.getElementById('Item' + s.editor.visualItem.id + 'TextLabel');
    if (typeof jq !== 'function' || typeof jq.queue !== 'function' || !slider || !background || !label) {
      throw new Error('Native editor animation queues are unavailable; recovery retained');
    }
    const nodes = [...new Set([slider, ...slider.querySelectorAll('*'), background,
      ...background.querySelectorAll('*'), label])];
    const deadline = Date.now() + 3000;
    let quiet = 0;
    while (Date.now() <= deadline) {
      noInteraction(s);
      current();
      const idle = nodes.every(node => jq.queue(node, 'fx').length === 0) && !jq(nodes).is(':animated');
      if (idle && ++quiet >= 2) { s.uiUnsettled = false; return; }
      if (!idle) quiet = 0;
      await new Promise(resolve => setTimeout(resolve, 16));
    }
    throw new Error('Native editor animation queues timed out; recovery retained');
  }
  function preview(s) {
    const id = s.editor.visualItem.id;
    const background = document.getElementById('Item' + id + 'BackgroundDiv');
    const text = document.getElementById('Item' + id + 'TextLabel');
    if (!background || !text) throw new Error('Open the existing rule preview before preparing');
    const bg = getComputedStyle(background), fg = getComputedStyle(text);
    return {text: text.textContent, background: bg.backgroundColor, border: bg.borderColor,
      foreground: fg.color, fontSize: fg.fontSize};
  }
  function summary(s) {
    return {phase: s.phase, entryId: s.entry.entryId, temporary: s.temporary,
      baseTypes: clone(s.entry.getDynamicValue('BaseType') ?? null), priority: s.entry.priorityIndex ?? null,
      appearance: fields.map(f => clone(s.entry.getDynamicValue(f) ?? null)),
      changes: s.cs.countChanges(), dirty: s.cs.unsavedChanges,
      savingToLocalStorage: s.cs.isSavingToLocalStorage,
      style: clone(s.data.filterEntryStyles.entryToStyle[s.entry.entryId] ?? null),
      preview: preview(s), offline: navigator.onLine === false};
  }
  function noTheme(s) {
    if (s.data.filterEntryStyles.entryToStyle[s.entry.entryId] ||
        s.editor.value.getValue(9, false)) {
      throw new Error('Theme-linked rules require the page controls; this helper cannot safely detach themes');
    }
  }
  function validateValue(s, index, value) {
    if (!Number.isInteger(index) || index < 0 || index > 3) throw new Error('Only appearance indices 0..3 are supported');
    if (index < 3) {
      if (value === false) return;
      const m = typeof value === 'string' && value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?))?\s*\)$/);
      if (!m || m.slice(1, 4).some(v => Number(v) > 255) || value.startsWith('rgba') !== (m[4] !== undefined)) {
        throw new Error('Use an RGB/RGBA string with valid channel ranges, or false to disable a color');
      }
    } else {
      if (typeof value !== 'string' || !/^\d+$/.test(value)) throw new Error('Font size must be an integer string');
      const slider = globalThis.jQuery?.('#VisualEditor_SizeSlider_' + s.editor.id);
      if (!slider?.length || typeof slider.slider !== 'function') throw new Error('Native font-size limits are unavailable; use the page controls');
      const min = slider.slider('option', 'min'), max = slider.slider('option', 'max');
      if (!Number.isFinite(min) || !Number.isFinite(max) || +value < min || +value > max) {
        throw new Error('Font size is outside the current native control limits');
      }
    }
  }
  const api = {
    prepare: exclusive(async ({entryId, temporary = false} = {}) => {
      if (session) throw new Error('Recovery state already exists; restore/release or accept it first');
      const fb = context(), data = fb.filterData, cs = fb.changeStorage;
      const entry = data?.getEntryById(entryId), editor = entry?.getVisualEditor();
      if (typeof temporary !== 'boolean' || !entry || !editor?.parent || editor.filterEntry !== entry ||
          typeof editor.onAnyChange !== 'function' || typeof editor.set_Value !== 'function' ||
          typeof editor.value?.getValue !== 'function' || !editor.visualItem ||
          !Array.isArray(data.filterEntries) || !Array.isArray(entry.observables) ||
          typeof cs?.updateSaveStateObj !== 'function' || !cs.currentlyActiveSaveState) {
        throw new Error('An existing native editor and active editable save envelope are required');
      }
      if (!fields.every((f, i) => globalThis.VisualEditor?.indexToFilterIdentifier?.[i] === f)) {
        throw new Error('Appearance mapping changed; use the page controls');
      }
      const s = {fb, data, cs, entry, editor, active: cs.currentlyActiveSaveState,
        metadata: fb.saveMetaDataProvider, temporary, phase: 'preparing', touched: new Set()};
      noTheme(s);
      preview(s);
      session = s;
      try {
        s.point = checkpoint(s);
        s.originalValues = fields.map((_, i) => clone(editor.value.getValue(i, false)));
        s.baselineSummary = summary(s);
        s.exportText = compile(s);
        s.backup = stable(s, () => {
          const copy = clone(s.active);
          if (!copy.meta_json_string || typeof copy.meta_json_string !== 'object') throw new Error('Unsupported save envelope');
          cs.updateSaveStateObj(copy);
          // Copy before rollback: the native serializer may return references.
          const fresh = clone(copy);
          if (typeof fresh.saveStateContent !== 'string') throw new Error('Native editable backup failed');
          JSON.parse(fresh.saveStateContent);
          return fresh;
        });
        s.phase = 'prepared';
        s.baselineSummary = summary(s);
        remember(s);
        return {summary: s.baselineSummary, editableBackup: s.backup, exportText: s.exportText,
          capturedObjects: s.point.native.count};
      } catch (error) {
        s.phase = 'prepare-failed';
        if (s.point) {
          try {
            s.point.restore();
            if (s.point.native.differences().length || !Object.values(s.point.page.checks()).every(Boolean)) {
              throw new Error('Preparation rollback did not match the checkpoint');
            }
            // Preparation never started an edit. A verified rollback permits a
            // fresh attempt without rerunning a serializer that just failed.
            session = null;
          }
          catch (recoveryError) { throw new Error(String(error) + '; rollback failed: ' + recoveryError); }
        }
        throw error;
      }
    }),
    setAppearance: exclusive(async ({index, value} = {}) => {
      const s = current();
      if (!['prepared', 'changed'].includes(s.phase)) throw new Error('No editable preparation is active');
      unchanged(s);
      noTheme(s);
      validateValue(s, index, value);
      s.phase = 'editing';
      s.touched.add(index);
      s.awaiting = true;
      try {
        s.editor.onAnyChange(index);
        await s.editor.set_Value(index, value);
        await settleEditor(s);
        noInteraction(s);
        current();
        s.phase = 'changed';
        remember(s);
        return {summary: summary(s)};
      } catch (error) {
        s.phase = s.conflict ? 'conflict' : 'edit-failed';
        // Retain the immediate failed-operation state for guarded recovery.
        if (!s.conflict && !s.uiUnsettled) {
          try { await settleEditor(s); remember(s); } catch (_) { /* Keep the original recovery checkpoint. */ }
        }
        throw error;
      } finally { s.awaiting = false; }
    }),
    exportCurrent: exclusive(async () => {
      const s = current();
      if (!['prepared', 'changed', 'restored'].includes(s.phase)) throw new Error('Recover failed operation before exporting');
      unchanged(s);
      return {summary: summary(s), exportText: compile(s)};
    }),
    restore: exclusive(async () => {
      const s = current();
      if (!s.point) throw new Error('No complete recovery checkpoint exists');
      unchanged(s);
      s.lastRestorePassed = false;
      const nativeErrors = [];
      s.awaiting = true;
      try {
        for (const index of [...s.touched].reverse()) {
          noInteraction(s);
          try {
            s.editor.onAnyChange(index);
            await s.editor.set_Value(index, s.originalValues[index]);
            noInteraction(s);
          }
          catch (error) { nativeErrors.push(String(error)); }
        }
      } finally {
        try {
          await settleEditor(s);
          // Keep input tracking active through animation settling and rollback.
          noInteraction(s);
          current();
          s.point.restore();
        } finally { s.awaiting = false; }
      }
      s.phase = 'restored';
      const exportText = compile(s), differences = s.point.native.differences();
      const checks = {...s.point.page.checks(), fullExportExact: exportText === s.exportText,
        snapshotDescriptorsExact: differences.length === 0,
        previewExact: !!s.baselineSummary && JSON.stringify(preview(s)) === JSON.stringify(s.baselineSummary.preview),
        nativeRestoreSucceeded: nativeErrors.length === 0};
      s.lastRestorePassed = Object.values(checks).every(v => v === true);
      remember(s);
      return {summary: summary(s), exportText, checks, passed: s.lastRestorePassed,
        descriptorDifferences: differences.slice(0, 20), nativeErrors};
    }),
    accept: exclusive(async () => {
      const s = current();
      if (s.temporary || !['prepared', 'changed'].includes(s.phase)) throw new Error('Temporary or failed edits must be restored');
      unchanged(s);
      const result = {accepted: true, summary: summary(s)};
      removeHelper();
      return result;
    }),
    release: exclusive(async () => {
      const s = current();
      unchanged(s);
      if (s.phase !== 'restored' || !s.lastRestorePassed || s.point.native.differences().length ||
          !Object.values(s.point.page.checks()).every(Boolean) || compile(s) !== s.exportText) {
        throw new Error('All restoration checks must pass before releasing recovery state');
      }
      removeHelper();
      return {released: true};
    }),
  };
  globalThis.__poeFilterFB = Object.freeze(api);
  return {ready: true, offline: navigator.onLine === false};
})();
