'use strict';

const ENUMS={coverage:['low','medium','high'],coherence:['fragmented','partial','coherent'],status:['hypothesis','observation','low_signal_warning']};
const TH={timeMs:1000*60*60*24*30,minSignalsMedium:3,minSignalsHigh:11,highContradiction:0.4,lowContradiction:0.15};

export function buildAlignmentRules(){
  // Fixed order: 1) alignment rules, 2) contradiction rules, 3) coverage/coherence, 4) suggestions.
  return [{id:'rule_same_type_compatible_source_time',kind:'align'},{id:'rule_complementary_types',kind:'align'},{id:'rule_same_type_mutually_exclusive_high_confidence',kind:'contradict'}];
}

const comp=(a,b)=>new Set([`${a}:${b}`,`${b}:${a}`]);
const COMPLEMENTARY=comp('leadership_change','succession_plan');
const COMPATIBLE_SRC=new Set(['internal_report:board_minutes','board_minutes:internal_report','kpi_dashboard:audit_log','audit_log:kpi_dashboard']);
const hi=(c)=>String(c).toLowerCase()==='high';
const excl=(a,b)=>{const x=String(a||'').toLowerCase(),y=String(b||'').toLowerCase();return !!x&&!!y&&(x.includes('increase')&&y.includes('decrease')||x.includes('approved')&&y.includes('rejected')||x.includes('active')&&y.includes('inactive')||x===`not ${y}`||y===`not ${x}`);};
const sarr=(v)=>Array.isArray(v)?v:[];

export function computeAlignment(evidence,context={}){
  const signals=(Array.isArray(evidence)?evidence:(evidence&&Array.isArray(evidence.signals)?evidence.signals:[])).filter(Boolean);
  const rules=buildAlignmentRules();
  const map=Object.fromEntries(signals.map(s=>[s.id,{signal_id:s.id,aligned_with:[],contradicts:[],coverage_contribution:'low',ambiguity_notes:'',derived_from:[s.id],triggered_by:[]}]));
  let contradictions=0; const seenTypes={};
  for(let i=0;i<signals.length;i++)for(let j=i+1;j<signals.length;j++){
    const a=signals[i],b=signals[j],sp=`${a.source}:${b.source}`,dt=Math.abs(new Date(a.timestamp||0)-new Date(b.timestamp||0));
    if(a.type===b.type&&(a.source===b.source||COMPATIBLE_SRC.has(sp))&&dt<=TH.timeMs){map[a.id].aligned_with.push(b.id);map[b.id].aligned_with.push(a.id);map[a.id].triggered_by.push(rules[0].id);map[b.id].triggered_by.push(rules[0].id);}
    if(COMPLEMENTARY.has(`${a.type}:${b.type}`)){map[a.id].aligned_with.push(b.id);map[b.id].aligned_with.push(a.id);map[a.id].triggered_by.push(rules[1].id);map[b.id].triggered_by.push(rules[1].id);}
    if(a.type===b.type&&hi(a.source_confidence)&&hi(b.source_confidence)&&excl(a.summary,b.summary)){map[a.id].contradicts.push(b.id);map[b.id].contradicts.push(a.id);map[a.id].triggered_by.push(rules[2].id);map[b.id].triggered_by.push(rules[2].id);contradictions++;}
  }
  signals.forEach(s=>{seenTypes[s.type]=1;const d=map[s.id],score=d.aligned_with.length-d.contradicts.length;d.coverage_contribution=score>=2?'high':score===1?'medium':'low';if(!d.aligned_with.length&&!d.contradicts.length){d.ambiguity_notes='isolated signal; low relational context';d.triggered_by.push('rule_isolated_signal');}d.aligned_with=[...new Set(d.aligned_with)].sort();d.contradicts=[...new Set(d.contradicts)].sort();d.triggered_by=[...new Set(d.triggered_by)].sort();});
  const dens=signals.length>1?contradictions/(signals.length*(signals.length-1)/2):0;
  const coherence=dens>TH.highContradiction?'fragmented':dens>TH.lowContradiction?'partial':'coherent';
  const sparse=Object.keys(seenTypes).length<Math.max(2,Math.floor(signals.length/4));
  const coverage=signals.length<TH.minSignalsMedium||dens>TH.highContradiction||sparse?'low':(signals.length>=TH.minSignalsHigh&&coherence==='coherent')?'high':'medium';
  const sugg=[];
  if(dens>TH.lowContradiction)sugg.push({type:'reconcile_contradiction',target_signals:signals.filter(s=>map[s.id].contradicts.length).map(s=>s.id).sort(),rationale:'rule threshold exceeded for contradiction density',epistemic_status:'observation',derived_from:signals.map(s=>s.id),triggered_by:['rule_same_type_mutually_exclusive_high_confidence']});
  if(coverage==='low')sugg.push({type:'flag_low_coverage',target_signals:signals.map(s=>s.id),rationale:'coverage rule marked low from signal count/type sparsity/contradiction burden',epistemic_status:'low_signal_warning',derived_from:signals.map(s=>s.id),triggered_by:['rule_coverage_low']});
  if(signals.length<TH.minSignalsMedium)sugg.push({type:'seek_additional_signal',target_signals:signals.map(s=>s.id),rationale:'minimum signal count not met for medium coverage',epistemic_status:'hypothesis',derived_from:signals.map(s=>s.id),triggered_by:['rule_signal_count_minimum']});
  return {alignment_summary:{evidence_coverage:coverage,contradiction_density:Number(dens.toFixed(3)),signal_coherence:coherence},alignment_details:Object.values(map).sort((a,b)=>a.signal_id.localeCompare(b.signal_id)),resolution_suggestions:sugg};
}

export function validateAlignmentOutput(o){
  const okEnum=(v,a)=>a.includes(v), tr=(x)=>Array.isArray(x.derived_from)&&x.derived_from.length&&Array.isArray(x.triggered_by)&&x.triggered_by.length;
  return !!o&&okEnum(o.alignment_summary?.evidence_coverage,ENUMS.coverage)&&typeof o.alignment_summary?.contradiction_density==='number'&&o.alignment_summary.contradiction_density>=0&&o.alignment_summary.contradiction_density<=1&&okEnum(o.alignment_summary?.signal_coherence,ENUMS.coherence)&&Array.isArray(o.alignment_details)&&o.alignment_details.every(d=>d.signal_id&&Array.isArray(d.aligned_with)&&Array.isArray(d.contradicts)&&okEnum(d.coverage_contribution,ENUMS.coverage)&&tr(d))&&Array.isArray(o.resolution_suggestions)&&o.resolution_suggestions.every(s=>['seek_additional_signal','reconcile_contradiction','flag_low_coverage'].includes(s.type)&&Array.isArray(s.target_signals)&&okEnum(s.epistemic_status,ENUMS.status)&&typeof s.rationale==='string'&&tr(s));
}
