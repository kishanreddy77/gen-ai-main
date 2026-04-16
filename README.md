# 📋 Automated Software Project Blueprint Generator

A full-stack web application that automatically generates comprehensive project blueprints based on user inputs. Perfect for students, beginners, and project managers who need structured project planning.

## 🚀 Features

- **Interactive Form**: Easy-to-use interface for entering project details
- **Intelligent Generation**: Rule-based logic creates customized blueprints
- **Comprehensive Output**: Includes scope, deliverables, WBS, timeline, resources, costs, risks, and quality plans
- **PDF Export**: Download generated blueprints as professional PDF documents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Processing**: Fast API-based blueprint generation

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: Pure JavaScript, no frameworks
- **jsPDF**: Client-side PDF generation

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
/
├── backend/
│   ├── package.json           # Backend dependencies
│   ├── server.js              # Express server
│   └── blueprintGenerator.js  # Blueprint generation logic
├── frontend/
│   ├── index.html             # Main HTML page
│   ├── styles.css             # Styling
│   └── app.js                 # Frontend JavaScript
├── start.sh                   # Easy startup script
├── stop.sh                    # Easy shutdown script
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🏗️ Installation & Setup

### ⚡ Quick Start (Easiest Method)

**One-command startup:**

```bash
./start.sh
```

This script will:
- ✅ Check for Node.js and npm
- ✅ Install backend dependencies (if needed)
- ✅ Start the backend server (port 3000)
- ✅ Start the frontend server (port 8080)
- ✅ Automatically open your browser

**To stop all servers:**

```bash
./stop.sh
```

Or press `Ctrl+C` in the terminal running start.sh

---

### 📋 Manual Setup (Alternative Method)

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- A modern web browser

### Step 1: Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

This will install:
- `express`: Web framework
- `cors`: CORS middleware

### Step 2: Start the Backend Server

From the `backend` directory:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

You should see:
```
🚀 Blueprint Generator Server running on http://localhost:3000
📝 API available at http://localhost:3000/api/generate-blueprint
```

### Step 3: Open the Frontend

Open the `frontend/index.html` file in your web browser:

**Option 1: Direct File Access**
```bash
cd frontend
open index.html  # macOS
# or
start index.html # Windows
# or
xdg-open index.html # Linux
```

**Option 2: Using a Local Server (Recommended)**

Using Python:
```bash
cd frontend
python -m http.server 8080
```

Then visit: http://localhost:8080

Using Node.js http-server:
```bash
npm install -g http-server
cd frontend
http-server -p 8080
```

Then visit: http://localhost:8080

## 📖 How to Use

### 1. Fill Out the Form

Enter your project details:

- **Project Title**: Name of your software project
- **Domain**: Choose from Web, Mobile, AI, Desktop, IoT, Blockchain, or Other
- **Objectives**: Describe what you want to achieve
- **Duration**: Project timeline in weeks (1-52)
- **Budget**: Total project budget in USD
- **Team Size**: Number of team members (1-50)
- **Tech Stack**: Technologies you plan to use (e.g., "React, Node.js, MongoDB")

### 2. Generate Blueprint

Click the **"🚀 Generate Blueprint"** button. The system will:
- Validate your inputs
- Send data to the backend API
- Process using rule-based logic
- Display comprehensive blueprint

### 3. Review the Blueprint

The generated blueprint includes:

- **📋 Project Overview**: Scale, title, and tech stack summary
- **🎯 Project Scope**: Detailed scope description
- **📦 Deliverables**: Complete list of project outputs
- **🔨 Work Breakdown Structure**: Phase-by-phase task breakdown
- **📅 Timeline**: Milestone-based project schedule
- **👥 Resource Allocation**: Team roles and responsibilities
- **💰 Cost Estimation**: Budget breakdown and recommendations
- **⚠️ Risk Analysis**: Identified risks with mitigation strategies
- **✅ Quality Plan**: Standards, processes, metrics, and tools

### 4. Download PDF

Click **"📥 Download PDF"** to save the blueprint as a PDF document.

### 5. Create New Blueprint

Click **"➕ New Blueprint"** to start over with a new project.

## 🎯 Blueprint Generation Logic

### Project Scale

Projects are categorized by duration:
- **Small**: < 4 weeks
- **Medium**: 4-12 weeks
- **Large**: > 12 weeks

### Rule-Based Generation

The system applies intelligent rules:

**Duration-Based:**
- Short projects (<4 weeks): Simplified WBS, tight timeline warnings
- Long projects (>12 weeks): Technology obsolescence risks

**Team Size-Based:**
- Small teams (≤2): Key person dependency risks
- Large teams (>5): Communication overhead concerns, coordination roles

**Domain-Specific:**
- **AI**: Data quality risks, ML-specific deliverables
- **Mobile**: Platform fragmentation risks, app store tasks
- **Web**: Browser compatibility considerations
- **Blockchain**: Security audit requirements
- **IoT**: Hardware integration challenges

**Budget Analysis:**
- Compares budget against estimated minimum
- Provides cost optimization recommendations
- 60% personnel, 15% infrastructure, 10% tools, 15% contingency

## 🔌 API Documentation

### POST `/api/generate-blueprint`

Generate a project blueprint.

**Request Body:**
```json
{
  "projectTitle": "E-commerce Mobile App",
  "domain": "Mobile",
  "objectives": "Build a cross-platform mobile shopping application",
  "duration": 12,
  "budget": 75000,
  "teamSize": 5,
  "techStack": "React Native, Node.js, MongoDB, AWS"
}
```

**Response:**
```json
{
  "success": true,
  "blueprint": {
    "projectTitle": "E-commerce Mobile App",
    "projectScale": "Medium",
    "scope": "...",
    "deliverables": [...],
    "workBreakdownStructure": [...],
    "timeline": [...],
    "resourceAllocation": [...],
    "costEstimation": {...},
    "riskAnalysis": [...],
    "qualityPlan": {...},
    "techStack": "React Native, Node.js, MongoDB, AWS"
  },
  "generatedAt": "2026-03-26T10:30:00.000Z"
}
```

### GET `/api/health`

Check API status.

**Response:**
```json
{
  "status": "ok",
  "message": "Blueprint Generator API is running"
}
```

## 🎨 Customization

### Modify Generation Logic

Edit `backend/blueprintGenerator.js` to:
- Add new domains
- Adjust risk calculations
- Customize deliverables
- Change timeline distributions

### Update Styling

Edit `frontend/styles.css` to:
- Change color scheme (CSS variables at top)
- Adjust layout and spacing
- Modify responsive breakpoints

### Enhance Frontend

Edit `frontend/app.js` to:
- Add new form fields
- Customize result display
- Enhance PDF formatting

## 🐛 Troubleshooting

### npm Permission Error (EACCES)

If you see `npm error code EACCES` or cache permission errors:

**The start script will automatically detect and fix this!** Just run:
```bash
./start.sh
```

Or manually fix with:
```bash
# Option 1: Fix cache permissions
sudo chown -R $(whoami) ~/.npm

# Option 2: Clear cache
npm cache clean --force
```

### Permission Denied (Script Not Executable)

If you see `Permission denied` when running `./start.sh`:

```bash
chmod +x start.sh stop.sh
./start.sh
```

### Port Already in Use

If port 3000 is taken:

```bash
PORT=3001 node server.js
```

Then update `API_URL` in `frontend/app.js`:
```javascript
const API_URL = 'http://localhost:3001/api';
```

### CORS Issues

If you get CORS errors:
1. Make sure the backend server is running
2. Check that CORS is enabled in `server.js`
3. Access frontend via http-server instead of file://

### PDF Not Generating

Ensure these CDN scripts are loaded in `index.html`:
- jsPDF: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
- html2canvas: https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js

## 🚀 Future Enhancements

Potential features to add:
- Database integration (MongoDB/PostgreSQL)
- User authentication and saved blueprints
- Template library
- Gantt chart visualization
- Export to Word/Excel formats
- Team collaboration features
- Integration with project management tools (Jira, Trello)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for project managers, students, and software development teams.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

**Happy Blueprint Generating! 🎉**
