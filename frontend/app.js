/**
 * Frontend JavaScript for Automated Software Project Blueprint Generator
 * Handles form submission, API calls, result display, and PDF export
 */

// API Configuration
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const blueprintForm = document.getElementById('blueprintForm');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const formSection = document.getElementById('formSection');
const resultsSection = document.getElementById('resultsSection');
const blueprintContent = document.getElementById('blueprintContent');
const downloadBtn = document.getElementById('downloadBtn');
const newBlueprintBtn = document.getElementById('newBlueprintBtn');

// Store current blueprint for PDF export
let currentBlueprint = null;

/**
 * Initialize event listeners when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Form submission
  blueprintForm.addEventListener('submit', handleFormSubmit);

  // Download PDF button
  downloadBtn.addEventListener('click', handleDownloadPDF);

  // New blueprint button
  newBlueprintBtn.addEventListener('click', handleNewBlueprint);
});

/**
 * Handle form submission
 * Collects form data and sends to API
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  // Collect form data
  const formData = new FormData(blueprintForm);
  const input = {
    projectTitle: formData.get('projectTitle'),
    domain: formData.get('domain'),
    objectives: formData.get('objectives'),
    duration: parseInt(formData.get('duration')),
    budget: parseFloat(formData.get('budget')),
    teamSize: parseInt(formData.get('teamSize')),
    techStack: formData.get('techStack')
  };

  // Show loading, hide error
  showLoading();
  hideError();

  try {
    // Call API to generate blueprint
    const response = await fetch(`${API_URL}/generate-blueprint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate blueprint');
    }

    const data = await response.json();
    currentBlueprint = data.blueprint;

    // Display the blueprint
    displayBlueprint(data.blueprint);

    // Hide form section, show results
    formSection.style.display = 'none';
    resultsSection.style.display = 'block';

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
  } finally {
    hideLoading();
  }
}

/**
 * Display the generated blueprint in structured sections
 */
function displayBlueprint(blueprint) {
  blueprintContent.innerHTML = '';

  // Project Overview
  blueprintContent.appendChild(createOverviewSection(blueprint));

  // Scope
  blueprintContent.appendChild(createScopeSection(blueprint));

  // Deliverables
  blueprintContent.appendChild(createDeliverablesSection(blueprint));

  // Work Breakdown Structure
  blueprintContent.appendChild(createWBSSection(blueprint));

  // Timeline
  blueprintContent.appendChild(createTimelineSection(blueprint));

  // Resource Allocation
  blueprintContent.appendChild(createResourceSection(blueprint));

  // Cost Estimation
  blueprintContent.appendChild(createCostSection(blueprint));

  // Risk Analysis
  blueprintContent.appendChild(createRiskSection(blueprint));

  // Quality Plan
  blueprintContent.appendChild(createQualitySection(blueprint));
}

/**
 * Create Project Overview Section
 */
function createOverviewSection(blueprint) {
  const section = createSection('📋 Project Overview', 'overview');

  const content = `
    <div class="info-box">
      <p><strong>Project:</strong> ${blueprint.projectTitle}</p>
      <p><strong>Scale:</strong> ${blueprint.projectScale} Project</p>
      <p><strong>Tech Stack:</strong> ${blueprint.techStack}</p>
    </div>
  `;

  section.innerHTML += content;
  return section;
}

/**
 * Create Scope Section
 */
function createScopeSection(blueprint) {
  const section = createSection('🎯 Project Scope', 'scope');
  section.innerHTML += `<p>${blueprint.scope}</p>`;
  return section;
}

/**
 * Create Deliverables Section
 */
function createDeliverablesSection(blueprint) {
  const section = createSection('📦 Deliverables', 'deliverables');

  const list = document.createElement('ul');
  list.className = 'deliverables-list';

  blueprint.deliverables.forEach(deliverable => {
    const li = document.createElement('li');
    li.textContent = deliverable;
    list.appendChild(li);
  });

  section.appendChild(list);
  return section;
}

/**
 * Create Work Breakdown Structure Section
 */
function createWBSSection(blueprint) {
  const section = createSection('🔨 Work Breakdown Structure', 'wbs');

  blueprint.workBreakdownStructure.forEach(phase => {
    const phaseDiv = document.createElement('div');
    phaseDiv.className = 'wbs-phase';

    const phaseTitle = document.createElement('h5');
    phaseTitle.textContent = phase.phase;
    phaseDiv.appendChild(phaseTitle);

    const tasksList = document.createElement('ul');
    tasksList.className = 'wbs-tasks';

    phase.tasks.forEach(task => {
      const taskLi = document.createElement('li');
      taskLi.textContent = task;
      tasksList.appendChild(taskLi);
    });

    phaseDiv.appendChild(tasksList);
    section.appendChild(phaseDiv);
  });

  return section;
}

/**
 * Create Timeline Section
 */
function createTimelineSection(blueprint) {
  const section = createSection('📅 Project Timeline', 'timeline');

  const timeline = document.createElement('div');
  timeline.className = 'timeline';

  blueprint.timeline.forEach(milestone => {
    const milestoneDiv = document.createElement('div');
    milestoneDiv.className = 'milestone';

    milestoneDiv.innerHTML = `
      <div class="milestone-title">${milestone.milestone}</div>
      <span class="milestone-week">Week ${milestone.week}</span>
      <div class="milestone-description">${milestone.description}</div>
    `;

    timeline.appendChild(milestoneDiv);
  });

  section.appendChild(timeline);
  return section;
}

/**
 * Create Resource Allocation Section
 */
function createResourceSection(blueprint) {
  const section = createSection('👥 Resource Allocation', 'resources');

  const table = document.createElement('table');
  table.className = 'resources-table';

  // Table header
  table.innerHTML = `
    <thead>
      <tr>
        <th>Role</th>
        <th>Count</th>
        <th>Responsibility</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  blueprint.resourceAllocation.forEach(resource => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${resource.role}</strong></td>
      <td>${resource.count}</td>
      <td>${resource.responsibility}</td>
    `;
    tbody.appendChild(row);
  });

  section.appendChild(table);
  return section;
}

/**
 * Create Cost Estimation Section
 */
function createCostSection(blueprint) {
  const section = createSection('💰 Cost Estimation', 'cost');

  const cost = blueprint.costEstimation;

  // Total budget
  section.innerHTML += `
    <div class="info-box">
      <p><strong>Total Budget:</strong> $${formatNumber(cost.totalBudget)}</p>
      <p><strong>Weekly Cost:</strong> $${formatNumber(cost.weeklyCost)}</p>
      <p><strong>Cost per Person:</strong> $${formatNumber(cost.costPerPerson)}</p>
    </div>
  `;

  // Breakdown
  const breakdownTitle = document.createElement('h4');
  breakdownTitle.textContent = 'Budget Breakdown';
  section.appendChild(breakdownTitle);

  const breakdownGrid = document.createElement('div');
  breakdownGrid.className = 'cost-breakdown';

  Object.entries(cost.breakdown).forEach(([key, item]) => {
    const costItem = document.createElement('div');
    costItem.className = 'cost-item';

    costItem.innerHTML = `
      <h5>${capitalizeFirst(key)}</h5>
      <div class="cost-amount">$${formatNumber(item.amount)}</div>
      <div class="cost-percentage">${item.percentage}% of budget</div>
      <div class="cost-description">${item.description}</div>
    `;

    breakdownGrid.appendChild(costItem);
  });

  section.appendChild(breakdownGrid);

  // Recommendations
  if (cost.recommendations && cost.recommendations.length > 0) {
    const recoTitle = document.createElement('h4');
    recoTitle.textContent = 'Recommendations';
    section.appendChild(recoTitle);

    const recoList = document.createElement('ul');
    recoList.className = 'standards-list';

    cost.recommendations.forEach(reco => {
      const li = document.createElement('li');
      li.textContent = reco;
      recoList.appendChild(li);
    });

    section.appendChild(recoList);
  }

  return section;
}

/**
 * Create Risk Analysis Section
 */
function createRiskSection(blueprint) {
  const section = createSection('⚠️ Risk Analysis', 'risks');

  blueprint.riskAnalysis.forEach(risk => {
    const riskDiv = document.createElement('div');
    riskDiv.className = 'risk-item';

    riskDiv.innerHTML = `
      <div class="risk-header">
        <div class="risk-title">${risk.risk}</div>
        <div class="risk-badges">
          <span class="badge badge-probability">Probability: ${risk.probability}</span>
          <span class="badge badge-impact">Impact: ${risk.impact}</span>
        </div>
      </div>
      <div class="risk-mitigation">
        <strong>Mitigation:</strong> ${risk.mitigation}
      </div>
    `;

    section.appendChild(riskDiv);
  });

  return section;
}

/**
 * Create Quality Plan Section
 */
function createQualitySection(blueprint) {
  const section = createSection('✅ Quality Plan', 'quality');

  const quality = blueprint.qualityPlan;

  // Standards
  const standardsTitle = document.createElement('h4');
  standardsTitle.textContent = 'Quality Standards';
  section.appendChild(standardsTitle);

  const standardsList = document.createElement('ul');
  standardsList.className = 'standards-list';

  quality.standards.forEach(standard => {
    const li = document.createElement('li');
    li.textContent = standard;
    standardsList.appendChild(li);
  });

  section.appendChild(standardsList);

  // Processes
  const processesTitle = document.createElement('h4');
  processesTitle.textContent = 'Quality Processes';
  section.appendChild(processesTitle);

  quality.processes.forEach(process => {
    const processDiv = document.createElement('div');
    processDiv.style.marginBottom = '1rem';

    processDiv.innerHTML = `
      <strong>${process.process}:</strong> ${process.description}
    `;

    section.appendChild(processDiv);
  });

  // Metrics
  const metricsTitle = document.createElement('h4');
  metricsTitle.textContent = 'Key Metrics';
  section.appendChild(metricsTitle);

  const metricsList = document.createElement('ul');
  metricsList.className = 'standards-list';

  quality.metrics.forEach(metric => {
    const li = document.createElement('li');
    li.textContent = metric;
    metricsList.appendChild(li);
  });

  section.appendChild(metricsList);

  // Tools
  const toolsTitle = document.createElement('h4');
  toolsTitle.textContent = 'Recommended Tools';
  section.appendChild(toolsTitle);

  const toolsList = document.createElement('ul');
  toolsList.className = 'tools-list';

  quality.tools.forEach(tool => {
    const li = document.createElement('li');
    li.textContent = tool;
    toolsList.appendChild(li);
  });

  section.appendChild(toolsList);

  return section;
}

/**
 * Helper: Create a section element
 */
function createSection(title, id) {
  const section = document.createElement('div');
  section.className = 'blueprint-section';
  section.id = id;

  const heading = document.createElement('h3');
  heading.textContent = title;
  section.appendChild(heading);

  return section;
}

/**
 * Handle PDF Download
 * Uses jsPDF to generate PDF from the displayed blueprint
 */
async function handleDownloadPDF() {
  if (!currentBlueprint) {
    alert('No blueprint available to download');
    return;
  }

  try {
    // Show loading state
    downloadBtn.disabled = true;
    downloadBtn.textContent = '⏳ Generating PDF...';

    // Use jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const maxWidth = pageWidth - (2 * margin);

    // Helper function to check if we need a new page
    const checkNewPage = (heightNeeded) => {
      if (yPosition + heightNeeded > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Title
    doc.setFontSize(24);
    doc.setTextColor(79, 70, 229);
    doc.text('Software Project Blueprint', margin, yPosition);
    yPosition += 10;

    // Project Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(currentBlueprint.projectTitle, margin, yPosition);
    yPosition += 10;

    // Project Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Scale: ${currentBlueprint.projectScale} | Tech: ${currentBlueprint.techStack}`, margin, yPosition);
    yPosition += 15;

    // Function to add section
    const addSection = (title, content) => {
      checkNewPage(15);

      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text(title, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      if (typeof content === 'string') {
        const lines = doc.splitTextToSize(content, maxWidth);
        lines.forEach(line => {
          checkNewPage(6);
          doc.text(line, margin, yPosition);
          yPosition += 5;
        });
      } else if (Array.isArray(content)) {
        content.forEach(item => {
          checkNewPage(6);
          const lines = doc.splitTextToSize(`• ${item}`, maxWidth - 5);
          lines.forEach((line, index) => {
            checkNewPage(5);
            doc.text(line, margin + (index > 0 ? 5 : 0), yPosition);
            yPosition += 5;
          });
        });
      }

      yPosition += 5;
    };

    // Scope
    addSection('Project Scope', currentBlueprint.scope);

    // Deliverables
    addSection('Deliverables', currentBlueprint.deliverables);

    // Timeline
    const timelineText = currentBlueprint.timeline.map(m =>
      `Week ${m.week}: ${m.milestone}`
    );
    addSection('Timeline Milestones', timelineText);

    // Resources
    const resourcesText = currentBlueprint.resourceAllocation.map(r =>
      `${r.role} (${r.count}): ${r.responsibility}`
    );
    addSection('Resource Allocation', resourcesText);

    // Cost
    const costText = [
      `Total Budget: $${formatNumber(currentBlueprint.costEstimation.totalBudget)}`,
      `Weekly Cost: $${formatNumber(currentBlueprint.costEstimation.weeklyCost)}`,
      `Personnel: $${formatNumber(currentBlueprint.costEstimation.breakdown.personnel.amount)} (60%)`,
      `Infrastructure: $${formatNumber(currentBlueprint.costEstimation.breakdown.infrastructure.amount)} (15%)`,
      `Tools: $${formatNumber(currentBlueprint.costEstimation.breakdown.tools.amount)} (10%)`,
      `Contingency: $${formatNumber(currentBlueprint.costEstimation.breakdown.contingency.amount)} (15%)`
    ];
    addSection('Cost Estimation', costText);

    // Risks
    const risksText = currentBlueprint.riskAnalysis.map(r =>
      `${r.risk} [${r.probability} probability, ${r.impact} impact] - Mitigation: ${r.mitigation}`
    );
    addSection('Risk Analysis', risksText);

    // Save the PDF
    const filename = `${currentBlueprint.projectTitle.replace(/\s+/g, '_')}_Blueprint.pdf`;
    doc.save(filename);

    // Reset button
    downloadBtn.disabled = false;
    downloadBtn.textContent = '📥 Download PDF';

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    downloadBtn.disabled = false;
    downloadBtn.textContent = '📥 Download PDF';
  }
}

/**
 * Handle creating a new blueprint
 */
function handleNewBlueprint() {
  // Reset form
  blueprintForm.reset();

  // Clear current blueprint
  currentBlueprint = null;
  blueprintContent.innerHTML = '';

  // Show form, hide results
  formSection.style.display = 'block';
  resultsSection.style.display = 'none';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * UI Helper Functions
 */
function showLoading() {
  loadingIndicator.style.display = 'block';
}

function hideLoading() {
  loadingIndicator.style.display = 'none';
}

function showError(message) {
  errorMessage.textContent = `❌ Error: ${message}`;
  errorMessage.style.display = 'block';
}

function hideError() {
  errorMessage.style.display = 'none';
}

function formatNumber(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
