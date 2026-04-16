/**
 * Express Server for Software Project Blueprint Generator
 * Handles API requests and serves the blueprint generation logic
 */

const express = require('express');
const cors = require('cors');
const { generateBlueprint } = require('./blueprintGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('../frontend')); // Serve static frontend files

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blueprint Generator API is running' });
});

/**
 * POST /api/generate-blueprint
 * Main endpoint to generate project blueprint
 *
 * Request Body:
 * {
 *   projectTitle: string,
 *   domain: string,
 *   objectives: string,
 *   duration: number (weeks),
 *   budget: number,
 *   teamSize: number,
 *   techStack: string
 * }
 */
app.post('/api/generate-blueprint', (req, res) => {
  try {
    const input = req.body;

    // Validate required fields
    if (!input.projectTitle || !input.domain || !input.objectives) {
      return res.status(400).json({
        error: 'Missing required fields: projectTitle, domain, objectives'
      });
    }

    // Validate numeric fields
    if (input.duration <= 0 || input.budget <= 0 || input.teamSize <= 0) {
      return res.status(400).json({
        error: 'Duration, budget, and team size must be positive numbers'
      });
    }

    // Generate the blueprint
    const blueprint = generateBlueprint(input);

    // Return the generated blueprint
    res.json({
      success: true,
      blueprint,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating blueprint:', error);
    res.status(500).json({
      error: 'Failed to generate blueprint',
      message: error.message
    });
  }
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Blueprint Generator Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/generate-blueprint`);
});
