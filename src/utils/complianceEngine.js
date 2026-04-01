// Policy weights for scoring
const POLICY_WEIGHTS = {
  encryptionAtRest: 18,
  encryptionInTransit: 18,
  loggingEnabled: 10,
  kycUpdated: 16,
  accessControl: 14,
  auditLogs: 10,
  dataDeletion: 14,
};

// Region-specific required controls
const REGION_REQUIREMENTS = {
  India: {
    required: ['encryptionAtRest', 'encryptionInTransit', 'kycUpdated', 'auditLogs'],
    regulations: ['RBI Guidelines', 'IT Act 2000', 'DPDP Act 2023'],
  },
  'United States': {
    required: ['encryptionAtRest', 'encryptionInTransit', 'accessControl', 'auditLogs', 'loggingEnabled'],
    regulations: ['SOX', 'CCPA', 'GLBA', 'HIPAA'],
  },
  'European Union': {
    required: ['encryptionAtRest', 'encryptionInTransit', 'dataDeletion', 'accessControl', 'auditLogs', 'loggingEnabled'],
    regulations: ['GDPR', 'PSD2', 'eIDAS', 'DORA'],
  },
  UK: {
    required: ['encryptionAtRest', 'encryptionInTransit', 'dataDeletion', 'accessControl', 'auditLogs'],
    regulations: ['UK GDPR', 'FCA Regulations', 'PSD2 UK'],
  },
  Singapore: {
    required: ['encryptionAtRest', 'encryptionInTransit', 'accessControl', 'loggingEnabled'],
    regulations: ['PDPA', 'MAS TRM', 'Cybersecurity Act'],
  },
};

const POLICY_LABELS = {
  encryptionAtRest: 'Data Encryption at Rest',
  encryptionInTransit: 'Data Encryption in Transit',
  loggingEnabled: 'Logging Enabled',
  kycUpdated: 'KYC System Updated',
  accessControl: 'Access Control (RBAC)',
  auditLogs: 'Audit Logs Enabled',
  dataDeletion: 'Data Deletion Capability',
};

/**
 * Calculate compliance score from policies (0–100)
 */
export function calculateScore(policies) {
  let score = 0;
  let totalWeight = 0;
  for (const [key, weight] of Object.entries(POLICY_WEIGHTS)) {
    totalWeight += weight;
    if (policies[key]) {
      score += weight;
    }
  }
  return Math.round((score / totalWeight) * 100);
}

/**
 * Get required controls for a region
 */
export function getRegionRequirements(region) {
  return REGION_REQUIREMENTS[region] || { required: [], regulations: [] };
}

/**
 * Get region compliance status & missing controls
 */
export function getRegionStatus(region, policies) {
  const reqs = REGION_REQUIREMENTS[region];
  if (!reqs) return { status: 'Unknown', missing: [], regulations: [] };

  const missing = reqs.required.filter((key) => !policies[key]);
  const missingLabels = missing.map((key) => POLICY_LABELS[key]);
  const total = reqs.required.length;
  const fulfilled = total - missing.length;
  const percentage = Math.round((fulfilled / total) * 100);

  let status;
  if (missing.length === 0) {
    status = 'Compliant';
  } else if (missing.length <= Math.ceil(total * 0.3)) {
    status = 'At Risk';
  } else {
    status = 'Non-Compliant';
  }

  return {
    status,
    missing: missingLabels,
    missingKeys: missing,
    regulations: reqs.regulations,
    percentage,
    fulfilled,
    total,
  };
}

/**
 * Generate action items from gaps
 */
export function generateActions(regions, policies) {
  const actionMap = new Map();
  const owners = {
    encryptionAtRest: 'DevOps',
    encryptionInTransit: 'DevOps',
    loggingEnabled: 'Backend',
    kycUpdated: 'Legal',
    accessControl: 'Backend',
    auditLogs: 'Backend',
    dataDeletion: 'Backend',
  };

  const priorities = {
    encryptionAtRest: 'High',
    encryptionInTransit: 'High',
    loggingEnabled: 'Medium',
    kycUpdated: 'High',
    accessControl: 'High',
    auditLogs: 'Medium',
    dataDeletion: 'High',
  };

  const deadlineDays = {
    High: 7,
    Medium: 14,
    Low: 30,
  };

  regions.forEach((region) => {
    const { missingKeys } = getRegionStatus(region, policies);
    if (!missingKeys) return;
    missingKeys.forEach((key) => {
      if (!actionMap.has(key)) {
        const priority = priorities[key];
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + deadlineDays[priority]);
        actionMap.set(key, {
          id: key,
          title: `Implement ${POLICY_LABELS[key]}`,
          owner: owners[key],
          priority,
          deadline: deadline.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          regions: [region],
        });
      } else {
        actionMap.get(key).regions.push(region);
      }
    });
  });

  return Array.from(actionMap.values()).sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

/**
 * Generate risk alerts
 */
export function generateAlerts(regions, policies) {
  const alerts = [];

  regions.forEach((region) => {
    const { missingKeys, regulations } = getRegionStatus(region, policies);
    if (!missingKeys) return;

    missingKeys.forEach((key) => {
      let message = '';
      let priority = 'Medium';

      if (key === 'dataDeletion' && (region === 'European Union' || region === 'UK')) {
        message = `GDPR Violation Risk: No ${POLICY_LABELS[key]} in ${region}`;
        priority = 'High';
      } else if (key === 'kycUpdated' && region === 'India') {
        message = `RBI Non-compliance: ${POLICY_LABELS[key]} missing for ${region}`;
        priority = 'High';
      } else if (key === 'encryptionAtRest' || key === 'encryptionInTransit') {
        message = `Security Risk: ${POLICY_LABELS[key]} not enabled for ${region}`;
        priority = 'High';
      } else if (key === 'accessControl') {
        message = `Access Control gap: RBAC not implemented for ${region} operations`;
        priority = 'Medium';
      } else {
        message = `Compliance gap: ${POLICY_LABELS[key]} missing for ${region}`;
        priority = 'Low';
      }

      alerts.push({
        id: `${region}-${key}`,
        message,
        priority,
        region,
        regulation: regulations?.[0] || 'General',
      });
    });
  });

  return alerts.sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

export { POLICY_LABELS, REGION_REQUIREMENTS };
