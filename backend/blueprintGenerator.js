/**
 * Blueprint Generator Module
 * Contains rule-based logic to generate comprehensive project blueprints
 */

/**
 * Main function to generate a complete project blueprint
 * @param {Object} input - User input containing project details
 * @returns {Object} Complete project blueprint
 */
function generateBlueprint(input) {
  const {
    projectTitle,
    domain,
    objectives,
    duration,
    budget,
    teamSize,
    techStack
  } = input;

  // Determine project scale based on duration
  const projectScale = determineProjectScale(duration);

  return {
    projectTitle,
    projectScale,
    scope: generateScope(domain, objectives, duration, projectScale),
    deliverables: generateDeliverables(domain, projectScale),
    workBreakdownStructure: generateWBS(domain, duration, projectScale),
    timeline: generateTimeline(duration, projectScale),
    resourceAllocation: generateResourceAllocation(teamSize, domain, projectScale),
    costEstimation: generateCostEstimation(budget, duration, teamSize),
    riskAnalysis: generateRiskAnalysis(domain, duration, teamSize, projectScale),
    qualityPlan: generateQualityPlan(domain, projectScale),
    techStack: techStack
  };
}

/**
 * Determine project scale based on duration
 */
function determineProjectScale(duration) {
  if (duration < 4) return 'Small';
  if (duration >= 4 && duration <= 12) return 'Medium';
  return 'Large';
}

/**
 * Generate project scope description
 */
function generateScope(domain, objectives, duration, projectScale) {
  const scaleDescriptions = {
    'Small': 'focused MVP with core features',
    'Medium': 'comprehensive solution with extended features',
    'Large': 'enterprise-grade solution with full feature set and scalability'
  };

  return `This ${projectScale.toLowerCase()}-scale ${domain} project aims to ${objectives}. ` +
         `The project will deliver a ${scaleDescriptions[projectScale]} over ${duration} weeks. ` +
         `The scope includes requirements gathering, design, development, testing, and deployment phases.`;
}

/**
 * Generate deliverables based on domain and scale
 */
function generateDeliverables(domain, projectScale) {
  const baseDeliverables = [
    'Project Charter and Scope Document',
    'Technical Architecture Document',
    'Functional Specification Document',
    'Test Plan and Test Cases',
    'User Documentation',
    'Deployment Guide'
  ];

  const domainSpecificDeliverables = {
    'Web': ['Responsive Web Application', 'REST API Documentation', 'Database Schema'],
    'Mobile': ['Native Mobile Application', 'API Integration Documentation', 'App Store Assets'],
    'AI': ['Trained ML Model', 'Data Processing Pipeline', 'Model Performance Report'],
    'Desktop': ['Desktop Application', 'Installation Package', 'System Requirements Doc'],
    'IoT': ['IoT Device Firmware', 'Cloud Integration', 'Sensor Data Dashboard'],
    'Blockchain': ['Smart Contracts', 'Blockchain Integration', 'Wallet Interface']
  };

  let deliverables = [...baseDeliverables];

  if (domainSpecificDeliverables[domain]) {
    deliverables = [...domainSpecificDeliverables[domain], ...deliverables];
  }

  // Add extra deliverables for larger projects
  if (projectScale === 'Large') {
    deliverables.push('Performance Optimization Report', 'Security Audit Report', 'Maintenance Plan');
  }

  return deliverables;
}

/**
 * Generate Work Breakdown Structure (WBS)
 */
function generateWBS(domain, duration, projectScale) {
  const phases = [
    {
      phase: 'Planning & Analysis',
      tasks: [
        'Requirements gathering and documentation',
        'Stakeholder analysis',
        'Feasibility study',
        'Risk assessment',
        'Project charter creation'
      ]
    },
    {
      phase: 'Design',
      tasks: [
        'System architecture design',
        'Database schema design',
        'UI/UX wireframes and mockups',
        'API design and documentation',
        'Security architecture planning'
      ]
    },
    {
      phase: 'Development',
      tasks: [
        'Environment setup and configuration',
        'Backend development',
        'Frontend development',
        'Database implementation',
        'API integration',
        'Code reviews and refactoring'
      ]
    },
    {
      phase: 'Testing',
      tasks: [
        'Unit testing',
        'Integration testing',
        'User acceptance testing (UAT)',
        'Performance testing',
        'Security testing',
        'Bug fixing and optimization'
      ]
    },
    {
      phase: 'Deployment',
      tasks: [
        'Production environment setup',
        'Deployment pipeline configuration',
        'Application deployment',
        'Smoke testing',
        'Documentation finalization',
        'Knowledge transfer and training'
      ]
    }
  ];

  // Add domain-specific tasks
  if (domain === 'AI') {
    phases[2].tasks.push('Data collection and preprocessing', 'Model training and validation', 'Model optimization');
  }

  if (domain === 'Mobile') {
    phases[3].tasks.push('App store submission', 'Beta testing with TestFlight/Firebase');
  }

  // For small projects, simplify the WBS
  if (projectScale === 'Small') {
    return phases.map(phase => ({
      phase: phase.phase,
      tasks: phase.tasks.slice(0, 3) // Keep only first 3 tasks per phase
    }));
  }

  return phases;
}

/**
 * Generate timeline with milestones
 */
function generateTimeline(duration, projectScale) {
  const milestones = [];

  // Calculate phase durations (percentage of total duration)
  const phaseDistribution = {
    'Small': { planning: 0.15, design: 0.20, development: 0.40, testing: 0.15, deployment: 0.10 },
    'Medium': { planning: 0.15, design: 0.20, development: 0.35, testing: 0.20, deployment: 0.10 },
    'Large': { planning: 0.20, design: 0.20, development: 0.30, testing: 0.20, deployment: 0.10 }
  };

  const distribution = phaseDistribution[projectScale];
  let cumulativeWeeks = 0;

  const phases = ['planning', 'design', 'development', 'testing', 'deployment'];
  const phaseNames = {
    planning: 'Planning & Analysis Complete',
    design: 'Design & Architecture Complete',
    development: 'Development Complete',
    testing: 'Testing & QA Complete',
    deployment: 'Deployment & Launch'
  };

  phases.forEach(phase => {
    cumulativeWeeks += Math.ceil(duration * distribution[phase]);
    milestones.push({
      milestone: phaseNames[phase],
      week: Math.min(cumulativeWeeks, duration),
      description: `${phaseNames[phase].split(' ')[0]} phase deliverables reviewed and approved`
    });
  });

  return milestones;
}

/**
 * Generate resource allocation based on team size
 */
function generateResourceAllocation(teamSize, domain, projectScale) {
  const roles = [];

  // Base roles that every project needs
  if (teamSize >= 1) {
    roles.push({ role: 'Project Manager', count: 1, responsibility: 'Overall project coordination, stakeholder communication, timeline management' });
  }

  if (teamSize >= 2) {
    roles.push({ role: 'Full-Stack Developer', count: Math.min(2, teamSize - 1), responsibility: 'Backend and frontend development, API integration' });
  }

  if (teamSize >= 4) {
    roles.push({ role: 'UI/UX Designer', count: 1, responsibility: 'User interface design, wireframing, prototyping' });
  }

  if (teamSize >= 5) {
    roles.push({ role: 'QA Engineer', count: 1, responsibility: 'Test planning, test execution, quality assurance' });
  }

  if (teamSize >= 6) {
    roles.push({ role: 'DevOps Engineer', count: 1, responsibility: 'CI/CD setup, deployment, infrastructure management' });
  }

  // Domain-specific roles
  if (domain === 'AI' && teamSize >= 3) {
    roles.push({ role: 'Data Scientist/ML Engineer', count: 1, responsibility: 'Data analysis, model development, algorithm optimization' });
  }

  if (teamSize > 5) {
    roles.push({ role: 'Technical Lead', count: 1, responsibility: 'Technical architecture, code reviews, team mentoring' });
  }

  // If large team, add coordination note
  if (teamSize > 5) {
    roles.push({ role: 'Scrum Master (optional)', count: 1, responsibility: 'Facilitate agile ceremonies, remove blockers' });
  }

  return roles;
}

/**
 * Generate cost estimation
 */
function generateCostEstimation(budget, duration, teamSize) {
  // Calculate breakdowns
  const personnelCost = budget * 0.60; // 60% for team
  const infrastructureCost = budget * 0.15; // 15% for infrastructure
  const toolsCost = budget * 0.10; // 10% for tools/software
  const contingencyCost = budget * 0.15; // 15% contingency

  const weeklyCost = budget / duration;
  const costPerPerson = personnelCost / teamSize;

  return {
    totalBudget: budget,
    breakdown: {
      personnel: {
        amount: personnelCost,
        percentage: 60,
        description: `Team salaries and contractor fees (${teamSize} members)`
      },
      infrastructure: {
        amount: infrastructureCost,
        percentage: 15,
        description: 'Cloud hosting, servers, storage, bandwidth'
      },
      tools: {
        amount: toolsCost,
        percentage: 10,
        description: 'Software licenses, development tools, third-party services'
      },
      contingency: {
        amount: contingencyCost,
        percentage: 15,
        description: 'Buffer for unexpected costs and risks'
      }
    },
    weeklyCost: weeklyCost,
    costPerPerson: costPerPerson,
    recommendations: generateCostRecommendations(budget, duration, teamSize)
  };
}

/**
 * Generate cost recommendations
 */
function generateCostRecommendations(budget, duration, teamSize) {
  const recommendations = [];
  const avgWeeklyCostPerPerson = 1500; // Average weekly cost per team member
  const estimatedMinBudget = avgWeeklyCostPerPerson * teamSize * duration;

  if (budget < estimatedMinBudget) {
    recommendations.push('⚠️ Budget may be insufficient for team size and duration. Consider reducing team size or extending timeline.');
  } else {
    recommendations.push('✅ Budget appears adequate for the planned team size and duration.');
  }

  if (duration < 4 && budget > 50000) {
    recommendations.push('💡 Consider using budget surplus for post-launch support or additional features.');
  }

  recommendations.push('💡 Use open-source tools where possible to reduce licensing costs.');
  recommendations.push('💡 Consider cloud services with pay-as-you-go pricing for cost efficiency.');

  return recommendations;
}

/**
 * Generate risk analysis based on domain, duration, and team size
 */
function generateRiskAnalysis(domain, duration, teamSize, projectScale) {
  const risks = [];

  // Common risks for all projects
  risks.push({
    risk: 'Scope Creep',
    probability: 'Medium',
    impact: 'High',
    mitigation: 'Implement strict change control process, maintain clear requirements documentation, regular stakeholder communication'
  });

  risks.push({
    risk: 'Technical Debt',
    probability: 'Medium',
    impact: 'Medium',
    mitigation: 'Enforce code review practices, allocate time for refactoring, follow coding standards'
  });

  // Duration-based risks
  if (duration < 4) {
    risks.push({
      risk: 'Tight Timeline Pressure',
      probability: 'High',
      impact: 'High',
      mitigation: 'Prioritize MVP features, use agile sprints, maintain buffer time, avoid gold-plating'
    });
  }

  if (duration > 12) {
    risks.push({
      risk: 'Technology Obsolescence',
      probability: 'Medium',
      impact: 'Medium',
      mitigation: 'Regular technology stack review, stay updated with industry trends, modular architecture'
    });
  }

  // Team size risks
  if (teamSize > 5) {
    risks.push({
      risk: 'Communication Overhead',
      probability: 'High',
      impact: 'Medium',
      mitigation: 'Establish clear communication channels, daily standups, use collaboration tools, define roles clearly'
    });
  }

  if (teamSize <= 2) {
    risks.push({
      risk: 'Key Person Dependency',
      probability: 'High',
      impact: 'High',
      mitigation: 'Knowledge documentation, code documentation, pair programming, cross-training'
    });
  }

  // Domain-specific risks
  const domainRisks = {
    'AI': {
      risk: 'Data Quality and Availability',
      probability: 'High',
      impact: 'High',
      mitigation: 'Early data assessment, data validation pipeline, backup data sources, synthetic data generation'
    },
    'Mobile': {
      risk: 'Platform Fragmentation',
      probability: 'Medium',
      impact: 'Medium',
      mitigation: 'Device testing matrix, beta testing program, backward compatibility testing'
    },
    'Web': {
      risk: 'Browser Compatibility Issues',
      probability: 'Medium',
      impact: 'Low',
      mitigation: 'Cross-browser testing, progressive enhancement, use modern frameworks'
    },
    'Blockchain': {
      risk: 'Smart Contract Vulnerabilities',
      probability: 'Medium',
      impact: 'High',
      mitigation: 'Security audits, formal verification, extensive testing, bug bounty program'
    },
    'IoT': {
      risk: 'Hardware Integration Challenges',
      probability: 'High',
      impact: 'High',
      mitigation: 'Early prototype testing, hardware simulation, fallback mechanisms'
    }
  };

  if (domainRisks[domain]) {
    risks.push(domainRisks[domain]);
  }

  // Security risk (common for all)
  risks.push({
    risk: 'Security Vulnerabilities',
    probability: 'Medium',
    impact: 'High',
    mitigation: 'Security-first design, regular security audits, dependency updates, penetration testing'
  });

  return risks;
}

/**
 * Generate quality plan
 */
function generateQualityPlan(domain, projectScale) {
  return {
    standards: [
      'Follow industry-standard coding conventions and style guides',
      'Maintain minimum 80% code coverage with unit tests',
      'All code must pass peer review before merging',
      'Zero tolerance for critical and high-severity bugs in production',
      'Adhere to WCAG 2.1 Level AA accessibility standards'
    ],
    processes: [
      {
        process: 'Code Review',
        description: 'Mandatory peer review for all code changes using pull request workflow'
      },
      {
        process: 'Automated Testing',
        description: 'CI/CD pipeline with automated unit, integration, and end-to-end tests'
      },
      {
        process: 'Static Code Analysis',
        description: 'Automated code quality checks using linters and static analysis tools'
      },
      {
        process: 'Performance Monitoring',
        description: 'Regular performance testing and monitoring in staging environment'
      },
      {
        process: 'Security Scanning',
        description: 'Automated security vulnerability scanning for dependencies and code'
      }
    ],
    metrics: [
      'Code Coverage: Target 80%+',
      'Bug Resolution Time: Critical < 24hrs, High < 72hrs',
      'Code Review Turnaround: < 24 hours',
      'Build Success Rate: > 95%',
      'Test Pass Rate: 100% before deployment'
    ],
    tools: generateQualityTools(domain, projectScale)
  };
}

/**
 * Generate quality tools recommendations
 */
function generateQualityTools(domain, projectScale) {
  const baseTools = [
    'Version Control: Git + GitHub/GitLab',
    'CI/CD: GitHub Actions / Jenkins / CircleCI',
    'Testing: Jest / Pytest / JUnit (based on tech stack)',
    'Code Quality: SonarQube / ESLint / Prettier',
    'Project Management: Jira / Trello / Asana'
  ];

  if (projectScale === 'Large') {
    baseTools.push('Monitoring: New Relic / Datadog');
    baseTools.push('Security: Snyk / OWASP Dependency Check');
  }

  if (domain === 'AI') {
    baseTools.push('ML Tools: MLflow / Weights & Biases');
    baseTools.push('Data Validation: Great Expectations');
  }

  return baseTools;
}

// Export the main function
module.exports = {
  generateBlueprint
};
