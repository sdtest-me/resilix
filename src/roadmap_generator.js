const TIMELINES = {
  immediate: '0–30',
  mid: '31–60',
  later: '61–90'
};

const OWNERS = {
  COO: 'COO',
  HR: 'HR',
  Strategy: 'Strategy'
};

const IMPACT = {
  high: 'high',
  medium: 'medium',
  low: 'low'
};

function normalizeVMEME(vMEME = {}) {
  const defaults = {
    beige: 0,
    purple: 0,
    red: 0,
    blue: 0,
    orange: 0,
    green: 0,
    yellow: 0,
    turquoise: 0
  };

  return { ...defaults, ...vMEME };
}

function signalTypes(signals = []) {
  return signals.map((s) => String(s.type || '').toLowerCase());
}

function buildRuleSet(context) {
  const { dependencyScore, vMEME, signals } = context;
  const types = signalTypes(signals);
  const hasType = (token) => types.some((t) => t.includes(token));
  const blueOrangeGap = Math.abs(vMEME.blue - vMEME.orange);

  return [
    {
      id: 'dependency_reduction',
      when: () => dependencyScore >= 70,
      action: () => ({
        title: 'Reduce key-person dependency',
        timeline: TIMELINES.immediate,
        rationale: 'High dependency score indicates concentration risk in critical workflows.',
        impact: IMPACT.high,
        owner: OWNERS.COO,
        triggered_by: ['dependencyScore>=70']
      })
    },
    {
      id: 'succession_coverage',
      when: () => hasType('leadership_turnover') || hasType('succession'),
      action: () => ({
        title: 'Establish succession coverage for critical roles',
        timeline: TIMELINES.immediate,
        rationale: 'Leadership continuity signals require explicit backup ownership coverage.',
        impact: IMPACT.high,
        owner: OWNERS.HR,
        triggered_by: [
          ...(hasType('leadership_turnover') ? ['signal:leadership_turnover'] : []),
          ...(hasType('succession') ? ['signal:succession'] : [])
        ]
      })
    },
    {
      id: 'governance_alignment',
      when: () => blueOrangeGap >= 0.25,
      action: () => ({
        title: 'Align governance cadence with performance cadence',
        timeline: TIMELINES.mid,
        rationale: 'Large BLUE/ORANGE distribution gap suggests policy-execution misalignment risk.',
        impact: IMPACT.medium,
        owner: OWNERS.Strategy,
        derived_from: [`vMEME_gap:blue_orange=${blueOrangeGap.toFixed(2)}`]
      })
    },
    {
      id: 'cross_function_sync',
      when: () => {
        const activeBuckets = Object.values(vMEME).filter((v) => v >= 0.15).length;
        return activeBuckets >= 4;
      },
      action: () => ({
        title: 'Implement cross-functional stabilization sync',
        timeline: TIMELINES.mid,
        rationale: 'Fragmented profile across multiple active vMEME buckets requires coordination points.',
        impact: IMPACT.medium,
        owner: OWNERS.COO,
        derived_from: ['vMEME_fragmentation:>=4_buckets_at_or_above_0.15']
      })
    },
    {
      id: 'evidence_review',
      when: () => true,
      action: () => ({
        title: 'Run 90-day evidence review and rule recalibration',
        timeline: TIMELINES.later,
        rationale: 'Periodic review maintains deterministic roadmap fit with newly observed signals.',
        impact: IMPACT.low,
        owner: OWNERS.Strategy,
        triggered_by: ['baseline_roadmap_required']
      })
    }
  ];
}

function validateAction(action) {
  const validTimeline = Object.values(TIMELINES).includes(action.timeline);
  const validOwner = Object.values(OWNERS).includes(action.owner);
  const hasTrace = (action.triggered_by && action.triggered_by.length > 0)
    || (action.derived_from && action.derived_from.length > 0);

  return validTimeline && validOwner && hasTrace && Boolean(action.rationale);
}

export function generateRoadmap(input = {}) {
  const context = {
    dependencyScore: Number(input.dependencyScore || 0),
    vMEME: normalizeVMEME(input.vMEME_distribution || input.vMEME || {}),
    signals: Array.isArray(input.signals) ? input.signals : []
  };

  const actions = buildRuleSet(context)
    .filter((rule) => rule.when())
    .map((rule) => rule.action())
    .filter(validateAction)
    .slice(0, 5);

  if (actions.length < 3) {
    const fallback = {
      title: 'Create stabilization operating checklist',
      timeline: TIMELINES.immediate,
      rationale: 'Insufficient triggered conditions; enforce standard execution controls.',
      impact: IMPACT.medium,
      owner: OWNERS.COO,
      triggered_by: ['fallback:min_actions_guardrail']
    };
    actions.push(fallback);
  }

  return actions.slice(0, 5);
}
