/* Local native project-operation adapter. Requires a compatible loaded PoE 1 model.
 * Uses native change factories, application and SaveFile serializers only.
 * Replay requires a fresh compatible model. Applying a plan is not atomic; callers
 * must retain complete exported/project backups and discard a failed staging model.
 */
window.__poeFilterFBProject = window.faComplete = (() => {
  const fb = () => gFilterBlade;
  const clone = value => JSON.parse(JSON.stringify(value));
  let lastOperationAt = 0;
  const operationLedger = [];
  function requireRuleName(name) {
    if(typeof name!=='string' || !name.trim() || name!==name.trim() || name.length>50 || /[\x00-\x1f\x7f<>]/.test(name) || /^unnamed(?: custom)? rule$/i.test(name)) {
      throw new Error('Provide a meaningful rule name of 1 to 50 characters, without markup, control characters or surrounding whitespace');
    }
  }
  function requireModel() {
    if(fb()?.getGameType()!=='Poe1' || fb().aversion!=='1.1.6730' || !fb().isLoaded || !(fb().filterData instanceof Filter) || !fb().changeStorage?.addAndApplyChange || !fb().filterData.waypoints?.getByID) throw new Error('A compatible loaded PoE 1 native model is required (frontend 1.1.6730)');
  }
  function expandedOperations(plan) {
    if(!plan || !Array.isArray(plan.operations))throw new Error('Expected operations array');
    return plan.operations.flatMap(op=>op.op==='add'
      ? [op,{op:'rename',entryId:op.entryId,name:op.name}]
      : op.op==='set' && op.field==='ShowHide' && op.value==='Hide'
        ? [op,...['PlayAlertSound','MinimapIcon','PlayEffect'].map(field=>({op:'set',target:op.target || {entryId:op.entryId},field,value:null}))]
        : [op]);
  }
  function entries(queryName) {
    const query = fb().loggedGlobals.OptionBasedItems[queryName];
    if (!query) throw new Error('Unknown native query: ' + queryName);
    return {query, entries: FilterSearch.getEntriesByItem_FullResultList(query)};
  }
  function stableExport() {
    requireModel();
    const records = new Map();
    const visit = (object, force = false) => {
      if (!object || typeof object !== 'object' || records.has(object)) return;
      const proto = Object.getPrototypeOf(object);
      if (!force && !Array.isArray(object) && proto !== Object.prototype && proto !== null) return;
      const descriptors = Object.getOwnPropertyDescriptors(object);
      records.set(object, descriptors);
      Object.values(descriptors).forEach(d => { if ('value' in d) visit(d.value); });
    };
    fb().filterData.filterEntries.forEach(e => { visit(e, true); e.lineList.forEach(l => visit(l, true)); });
    try { return fb().filterData.compileFullText(); }
    finally {
      for (const [object, descriptors] of records) {
        Reflect.ownKeys(object).forEach(k => { if (!Object.hasOwn(descriptors, k)) delete object[k]; });
        Object.defineProperties(object, descriptors);
      }
    }
  }
  function resolve(target) {
    requireModel();
    if (!target || (target.queryName == null) === (target.entryId == null)) throw new Error('Specify one exact target selector');
    if (target.queryName != null) {
      const selected = entries(target.queryName);
      if(!selected.entries.length)throw new Error('Native query resolved no entries');
      if (!Array.isArray(target.expectedEntryIds) || JSON.stringify(selected.entries.map(e => e.entryId)) !== JSON.stringify(target.expectedEntryIds)) throw new Error('Native target scope changed');
      return {...selected, entryList: selected.entries};
    }
    const entry = fb().filterData.getEntryById(target.entryId);
    if (!entry) throw new Error('Native target absent: ' + target.entryId);
    if (!entry.conditional) throw new Error('Ordinary rules require complete native query scope');
    return {entryList:[entry]};
  }
  function inspect(target) {
    const selected = resolve(target);
    return selected.entryList.map(entry => ({entryId:entry.entryId,conditional:entry.conditional,frozen:entry.getFrozen(),
      name:entry.getMeta('CustomUserEntryDisplayName') ?? null,displayName:entry.getDisplayName(),
      builderName:entry.parentEntryBuilder?.name ?? null,priorityIndex:entry.priorityIndex ?? null,
      waypointId:entry.parentEntryBuilder?.integrationData[entry.entryId]?.target ?? null,
      styleId:fb().filterData.filterEntryStyles.getStyleByEntry(entry)?.id ?? null,showHide:entry.get_ShowHideDisable(),
      fields:Object.fromEntries((target.fields || ['BaseType','ItemLevel','Rarity','SetFontSize']).map(field => [field,entry.getDynamicValue(field)]))}));
  }
  async function addCustom(builderName, id) {
    if (!fb().commandManager.entryBuilderDictionary[builderName]) throw new Error('Native custom-rule builder unavailable');
    await fb().changeStorage.addAndApplyChange('tier', TierChange.createChangeValue(builderName, 'add', id));
    const entry = fb().filterData.getEntryById(id);
    if (!entry?.conditional) throw new Error('Native add did not integrate the expected custom rule');
    return entry;
  }
  function nativeValue(spec) {
    if (!spec || typeof spec !== 'object' || Array.isArray(spec) || !spec.kind) return spec;
    if (spec.kind === 'number') return AbstractChange.createOperatorValueObject(spec.operator,spec.value,!!spec.wildcard);
    if (spec.kind === 'list') return AbstractChange.createListBasedValueObject(spec.values,!!spec.wildcard,spec.operator);
    if (spec.kind === 'listDelta') return AbstractChange.createListChangeBasedValueObject(!!spec.wildcard,spec.added || [],spec.removed || [],spec.operator);
    throw new Error('Unsupported value factory: '+spec.kind);
  }
  function listMember(target,field,value) {
    const selected=resolve(target).entryList;
    if(selected.length!==1)throw new Error('List member operation requires one representative rule');
    const panel=selected[0].getSortableList(field || 'BaseType');
    if(!panel || panel.setManager.getCurrentPanelForBaseType(value)!==panel)throw new Error('Native list member scope changed');
    const child=panel.setManager.getValueChild(value);
    if(!child || typeof child.setLocked!=='function')throw new Error('Native list member control unavailable');
    return child;
  }
  function inspectListMember(target,field,value) {
    const child=listMember(target,field,value);
    return {value,locked:child.isLocked(),lockChanged:child.isLockChanged()};
  }
  function preflight(plan) {
    requireModel();
    if (!plan || !Array.isArray(plan.operations)) throw new Error('Expected operations array');
    const permitted=new Set(['set','add','rename','remove','target','priority','moveList','lockList']);
    const instances=new Map(fb().filterData.filterEntries.filter(e=>e.conditional).map(e=>[e.entryId,e.parentEntryBuilder?.name]));
    const owned=new Set(fb().changeStorage.changeGroups.at(-1).changes.filter(c=>c instanceof TierChange && c.changeValue.operation==='add').map(c=>c.changeValue.entryId));
    if(plan.minIntervalMs!=null && (!Number.isFinite(plan.minIntervalMs) || plan.minIntervalMs<1100 || plan.minIntervalMs>1200))throw new Error('Operation interval must be between 1100 and 1200 ms');
    const expanded=expandedOperations(plan);
    for(const op of expanded) {
      if(!permitted.has(op.op)) throw new Error('Unsupported project operation: '+op.op);
      if(op.op==='set') {
        if(op.index!=null && (!Number.isInteger(op.index) || op.index<1))throw new Error('Condition line index must be a positive integer');
        const mode=op.mode || (op.value?.kind==='listDelta' ? 'change' : 'normal');
        if(!['normal','change','lock'].includes(mode) || (mode!=='normal' && !isIdentListBased(op.field)))throw new Error('Unsupported identifier mode for this field');
        const identifier=AbstractChange.createIdentifierObject(op.field,op.index || 1,mode,3);
        if(!identifier.isReal && op.field!=='ShowHide') throw new Error('Unsupported user rule field: '+op.field);
        if(op.field==='Continue')throw new Error('Direct Continue toggling is not exposed by the pinned UI; use its native decorator builder');
        nativeValue(op.value);
        if(op.field==='SetFontSize' && op.value==null)throw new Error('Font removal is not stable in this frontend; set the intended default or backed-up font size explicitly');
        if(VisualEditor.soundTypes_RealOnly.includes(op.field) && op.field!=='PlayAlertSound')throw new Error('Sound changes require PlayAlertSound with a typed native payload');
        if(op.field==='PlayAlertSound' && op.value!=null && (!Array.isArray(op.value) || !VisualEditor.soundTypes_RealOnly.includes(op.value[0]) || !Array.isArray(op.value[1])))throw new Error('Unsupported native sound payload');
      }
      if(op.op==='add') {
        requireRuleName(op.name);
        if(!fb().commandManager.entryBuilderDictionary[op.builderName]) throw new Error('Unknown native builder');
        if(typeof op.entryId!=='string' || !op.entryId.startsWith(op.builderName) || op.entryId.length!==op.builderName.length+6) throw new Error('Invalid native custom instance ID');
        if(instances.has(op.entryId) || fb().filterData.getEntryById(op.entryId)) throw new Error('Custom instance already exists');
        instances.set(op.entryId,op.builderName);
        owned.add(op.entryId);
      }
      if(op.op==='rename') {
        requireRuleName(op.name);
        const selector=op.target || {entryId:op.entryId};
        if(selector.queryName!=null || !owned.has(selector.entryId))throw new Error('Renaming requires one custom rule owned by the active user change group');
      }
      if(['set','target','priority','rename'].includes(op.op)) {
        const selector=op.target || {entryId:op.entryId};
        if((selector.entryId==null)===(selector.queryName==null)) throw new Error('Specify exactly one target selector');
        if(selector.entryId!=null && !instances.has(selector.entryId)) throw new Error('Custom target not present in plan');
        if(selector.queryName!=null || fb().filterData.getEntryById(selector.entryId)) {
          const selected=resolve(selector);
          for(const entry of selected.entryList) {
            if(entry.protected>1)throw new Error('Native entry is protected');
            if(entry.getFrozen() && !entry.conditional) throw new Error('Refusing to edit a frozen ordinary entry');
            if(fb().filterData.filterEntryStyles.getStyleByEntry(entry)!=null) throw new Error('Explicit theme policy required');
          }
          if(op.op==='set' && op.field==='PlayAlertSound' && op.value!=null) {
            const native=VisualElement.createChange('PlayAlertSound',nativeValue(op.value),selected.entryList[0],selected.query ? [selected.query] : []);
            const previous=fb().changeStorage.changeGroups.at(-1).changes.find(c=>c.changeType===native.changeType && c.isValidUpdate(native.changeValue));
            if(previous && (previous.isUndeletableChange || previous.isPreset))throw new Error('Sound replacement requires an independently editable user change record');
          }
        }
      }
      if(op.op==='target' && !fb().filterData.waypoints.getByID(op.waypointId)) throw new Error('Unknown native waypoint');
      if(op.op==='priority' && !Number.isInteger(op.index)) throw new Error('Priority must be an integer');
      if(op.op==='remove') {
        if(typeof op.builderName!=='string' || !fb().commandManager.entryBuilderDictionary[op.builderName])throw new Error('Unknown native removal builder');
        if(!instances.has(op.entryId) || instances.get(op.entryId)!==op.builderName) throw new Error('Custom removal scope mismatch');
        if(!owned.has(op.entryId))throw new Error('Removal requires a custom rule owned by the active user change group');
        instances.delete(op.entryId);
        owned.delete(op.entryId);
      }
      if(op.op==='moveList') {
        const source=resolve(op.source).entryList, destination=resolve(op.destination).entryList;
        if(source.length!==1 || destination.length!==1) throw new Error('List move requires single representative rules');
        const from=source[0].getSortableList(op.field || 'BaseType'),to=destination[0].getSortableList(op.field || 'BaseType');
        if(!from || !to || from.setManager!==to.setManager || !op.values?.length || op.values.some(v=>from.setManager.getCurrentPanelForBaseType(v)!==from)) throw new Error('Native list scope mismatch');
      }
      if(op.op==='lockList') {
        if(typeof op.locked!=='boolean')throw new Error('List lock state must be boolean');
        const child=listMember(op.target,op.field,op.value);
        if(!child.getHtmlElement())throw new Error('Native list locking requires its rendered control; open the corresponding panel first');
      }
    }
    return {operationCount:expanded.length,expandedOperations:clone(expanded),
      notices:[...(plan.operations.some(op=>op.op==='add') ? ['Each added custom rule includes a native persisted rename operation.'] : []),
        ...(plan.operations.some(op=>op.op==='set' && op.field==='ShowHide' && op.value==='Hide') ? ['Hide persistently clears sound, icon and beam overrides. Show alone does not restore them; retain the complete project backup.'] : [])]};
  }
  async function applyPlan(plan) {
    preflight(plan);
    const operations=expandedOperations(plan);
    if(operations.length>20)throw new Error('Preflight the full plan, then dispatch at most 20 expanded operations per evaluation');
    const applied=[];
    for (const op of operations) {
      const interval=Math.max(1100,plan.minIntervalMs || 1100);
      await new Promise(resolve=>setTimeout(resolve,Math.max(0,lastOperationAt+interval-Date.now())));
      lastOperationAt=Date.now();
      operationLedger.push({at:new Date(lastOperationAt).toISOString(),op:op.op});
      if (op.op === 'add') {
        if (fb().filterData.getEntryById(op.entryId)) throw new Error('Custom instance already exists');
        await addCustom(op.builderName,op.entryId);
      } else if (op.op === 'remove') {
        const selected=resolve({entryId:op.entryId}).entryList[0];
        if (selected.parentEntryBuilder?.name !== op.builderName) throw new Error('Custom rule builder mismatch');
        const adder=selected.parentEntryBuilder.elementAdder;
        const index=adder.currentEntries.indexOf(selected);
        if(index<0 || !adder.childElements[index])throw new Error('Native custom-rule removal control is unavailable');
        await adder.removeTier(index);
        if (fb().filterData.getEntryById(op.entryId)) throw new Error('Native remove did not remove the rule');
      } else if (['set','target','priority','rename'].includes(op.op)) {
        const selected=resolve(op.target || {entryId:op.entryId});
        const field=op.op === 'target' ? 'Target' : op.op === 'priority' ? 'ConditionalEntryPriorityIndex' : op.op === 'rename' ? 'CustomUserEntryDisplayName' : op.field;
        const value=op.op === 'target' ? ConditionalChange.createConditionalTargetValue(op.waypointId) : op.op === 'priority' ? {newPrioIndex:op.index} : op.op === 'rename' ? {newName:op.name} : nativeValue(op.value);
        for (const entry of selected.entryList) {
          if (entry.getFrozen() && !entry.conditional) throw new Error('Refusing to edit a frozen ordinary entry');
          if (fb().filterData.filterEntryStyles.getStyleByEntry(entry) != null) throw new Error('Explicit theme policy is required for this target');
        }
        let target=selected.entryList[0];
        if(selected.entryList.length>1) {target=new EntryCluster();selected.entryList.forEach(e=>target.addEntry(e));}
        const identifier=AbstractChange.createIdentifierObject(field,op.op==='set' ? op.index || 1 : 1,op.mode || (op.value?.kind==='listDelta' ? 'change' : 'normal'),3);
        const native=VisualElement.createChange(field,value,target,selected.query ? [selected.query] : []);
        native.changeValue.identifier=identifier;
        // Native sound setters remove their old line and append the replacement.
        // Move only the matching user record through the native removal API so
        // fresh replay reproduces that same directive order; preserve other groups.
        if(field==='PlayAlertSound' && value!=null) {
          const group=fb().changeStorage.changeGroups.at(-1);
          const previous=group.changes.find(c=>c.changeType===native.changeType && c.isValidUpdate(native.changeValue));
          if(previous) {
            if(previous.isUndeletableChange || previous.isPreset)throw new Error('Sound replacement requires an independently editable user change record');
            fb().changeStorage.removeChange(native.changeType,native.changeValue);
            if(group.changes.includes(previous))throw new Error('Native sound record could not be repositioned');
          }
        }
        await fb().changeStorage.addAndApplyChange(native.changeType,native.changeValue,target);
        if(op.op==='rename' && target.getMeta('CustomUserEntryDisplayName')!==op.name)throw new Error('Native rule rename did not preserve the requested name');
      } else if (op.op === 'moveList') {
        const source=resolve(op.source).entryList;
        const destination=resolve(op.destination).entryList;
        if(source.length!==1 || destination.length!==1) throw new Error('List tier operation requires single representative rules');
        const from=source[0].getSortableList(op.field || 'BaseType');
        const to=destination[0].getSortableList(op.field || 'BaseType');
        if(!from || !to || from.setManager!==to.setManager) throw new Error('List tiers do not share one native manager');
        if(!op.values?.length || op.values.some(v=>from.setManager.getCurrentPanelForBaseType(v)!==from)) throw new Error('List source scope changed');
        await from.setManager.moveValue_AndFilter(op.values,to.id);
        if(op.values.some(v=>from.setManager.getCurrentPanelForBaseType(v)!==to)) throw new Error('Native list move failed');
      } else if(op.op==='lockList') {
        const child=listMember(op.target,op.field,op.value);
        if(!child.getHtmlElement())throw new Error('Native list locking requires its rendered control');
        child.setLocked(op.locked);
        if(child.isLocked()!==op.locked)throw new Error('Native list lock update failed');
      } else throw new Error('Unsupported project operation: '+op.op);
      applied.push(clone(op));
    }
    return {applied,changeCount:fb().changeStorage.countChanges(),operationLedger:clone(operationLedger)};
  }
  function serializeProject() {
    requireModel();
    const records=new Map();
    function capture(object,recursive=false) {
      if(!object || typeof object!=='object' || records.has(object))return;
      const descriptors=Object.getOwnPropertyDescriptors(object);records.set(object,descriptors);
      if(recursive)Object.values(descriptors).forEach(d=>{if('value'in d && d.value && typeof d.value==='object' && (Array.isArray(d.value)||Object.getPrototypeOf(d.value)===Object.prototype))capture(d.value,true);});
    }
    capture(fb().saveMetaDataProvider);capture(fb().saveMetaDataProvider.metaDataObj,true);
    fb().changeStorage.changeGroups.forEach(group=>{capture(group);capture(group.presetDataObj,true);capture(group.changes);group.changes.forEach(change=>{capture(change);capture(change.changeValue,true);});});
    const envelope = BackendFacade.createSimpleSaveStateObject('FilterAgent local project', false, 0, null);
    try {fb().changeStorage.updateSaveStateObj(envelope);return JSON.stringify(envelope);}
    finally {for(const [object,descriptors]of records){Reflect.ownKeys(object).forEach(k=>{if(!Object.hasOwn(descriptors,k))delete object[k];});Object.defineProperties(object,descriptors);}}
  }
  async function replayProject(serialized, options) {
    requireModel();
    if(options?.freshContext!==true || fb().changeStorage.countChanges()!==0) throw new Error('Native replay requires an explicitly fresh empty model');
    const envelope = JSON.parse(serialized);
    const content = SaveStateMigrationUtils.parseChangeString(envelope.saveStateContent);
    const selection=fb().fileSelectionHandler.getCurrentFilterObject();
    if(content.filterName!==selection.filterBranch.name || content.strictness.name!==selection.strictness.name || content.style!==selection.style.name)throw new Error('Native replay selection mismatch');
    fb().saveMetaDataProvider.fromSaveStateObject(clone(content.metaData));
    const replacement = fb().changeStorage.prepareChangeGroups(clone(content));
    if (replacement) throw new Error('Unexpected module replacement');
    const result = await fb().changeStorage.loadAndApplyChanges();
    if (result.failedChangesCount || result.invalidationMessages.length || result.errorChanges.length || result.invalidatedChanges.length) {
      throw new Error('Native replay invalidated changes: ' + JSON.stringify(result));
    }
    return result;
  }
  function itemResult(stats) {
    requireModel();
    const item = new Item();
    Object.entries(stats).filter(([key])=>key!=='AreaLevel').forEach(([key, value]) => item.addStat(key, value));
    item.addStaticStats();
    // Preserve explicitly supplied context after native derivation.
    Object.entries(stats).forEach(([key,value])=>item.addStat(key,value));
    const search = new FilterSearch(fb().filterData, 'normal', false);
    search.initSearchByItem(item);
    const entry = search.result[0];
    return {entryId: entry?.entryId || null, verdict: entry?.get_ShowHideDisable() || null,
      continueEntries:search.continueResults.map(e=>e.entryId),
      continueCount: search.continueResults.length,
      values: entry ? Object.fromEntries(['BaseType', 'ItemLevel', 'Rarity', 'SetFontSize', 'SetTextColor', 'SetBorderColor', 'SetBackgroundColor', 'PlayAlertSound', 'MinimapIcon', 'PlayEffect'].map(f => [f, entry.getDynamicValue(f)])) : null,
      preview: new DefaultItemAppearanceVerifier(entry, item, 0, search.continueResults.slice(), false).getVerifiedValues()};
  }
  return {inspect, inspectListMember, preflight, preflightPlan:preflight, applyPlan, stableExport, serializeProject, replayProject, itemResult};
})();
