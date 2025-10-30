---
title: "Crisis Forge"
description: "Crisis training through technology."
date: 2024-09-17T05:00:00Z
image: "/images/projects/CrisisForge.webp"
categories: ["project"]
author: "rae-j"
tags: ["simulation", "crisis"]
draft: false

sdgs: ["3", "9", "17"]
url: ""
status: ["Partner", "Approved"]
partners: ["aid-arena", "ubc-emerging-media-lab", "conversacorps"]
liaison: ["daniel-lindenberger"]
start_date: 2024-02-12T05:00:00Z
end_date:
location: "Vancouver, BC"
---

CrisisForge is an initiative to improve simulations training, particularly for better inter-organizational collaboration during crises, and to create tools for use during crises.

This project started as a Hackathon hosted by UBC's Emerging Media Lab with mentorship provided by members of the Justice Institute of British Columbia and Conversa Corps. With a focus on JIBC's "Praxis" tabletop simulation tool, participants made a wide range of projects ranging from UI/UX designs to functional prototypes:

---

### 1. **Nonlinear Crisis Timeline Interface with AI-Assisted Injects**

- **Problem**: Traditional crisis management timelines are too linear and hard to modify dynamically.
- **Solution**: A redesigned user interface for the PRACTICE system that supports _branching timelines_ and AI-generated injects.
- **Features**:
  - Drag-and-drop inject reordering.
  - AI-generated visuals for injects.
  - Enhanced buttons, added “Cancel” and “Back to Dashboard.”
  - Categorization and sub-inject numbering system (e.g., 2.1, 2.2).
- **Goal**: Improve usability and realism of crisis simulations, especially for administrators and controllers.

---

### 2. **AI-Supported Debriefing Tool for Decision Traceability**

- **Problem**: Experts only see the final decision and rationale, missing insights from the full conversation.
- **Solution**: Use of **LangChain** and **AI prompts** to analyze chat logs and generate:
  - All possible decisions discussed.
  - Contributions of individual participants.
  - A percentage breakdown of how much each comment influenced each decision.
- **Prototype Features**:
  - Review reports with full chat history.
  - AI-generated potential decisions.
  - Linked rationale and contributors per decision.
- **Future Potential**: Applying this to tools like Slack or Zoom for structured insight capture.

---

### 3. **Dynamic Crisis Simulation Engine with Recursive AI Prompts**

- **Problem**: Need for responsive, iterative crisis simulations that evolve with participant input.
- **Solution**: A modular system that separates simulation into:
  - Baseline prompt (overall situation).
  - Rolling situational updates.
  - Ongoing user assessments and actions.
- **Architecture**:
  - Containerized microservices (for scalability).
  - Uses prompt chaining and AI evaluation to simulate crisis evolution.
  - Efficient token usage and data storage.
- **Outcome**: A scalable, Zork/AI Dungeon-style real-time crisis interaction system.

---

### 4. **Real-Time Slide Deck with Live Data and GPT Integration**

- **Problem**: Static slides lack adaptability in crisis simulations.
- **Solution**: A prototype for slide decks that dynamically pull real-time data and GPT outputs per slide.
- **Use Case**: Command centers or practice simulations with evolving real-world info (e.g., wildfire updates).
- **Features**:
  - Slides auto-refresh with live or pseudo-live data (e.g., from Wikipedia or news).
  - Future vision includes live inputs from websites or APIs to drive simulation updates.
- **Challenges**: Debugging inconsistent live data rendering.

---

### 5. **After Action Report (AAR) Generator + Decision Dynamics Evaluator**

- **Problem**: Generating quality AARs is time-consuming and subject to human oversight.
- **Solution**:
  - Use GPT to generate AARs based on FEMA templates.
  - Evaluate team decision-making dynamics from transcripts.
- **Experiments Included**:
  - Testing with fictional input (e.g., _Star Trek_, _Council of Elrond_) to simulate decisions.
  - Added a fictional disruptive participant to evaluate how the system handled poor input.
- **Result**: Dynamic scoring, feedback, and insights into group performance and individual contributions.

---

### 6. **Sphere Handbook RAG (Retrieval-Augmented Generation) Assistant**

- **Problem**: Humanitarian guidelines are complex and hard to access in real-time.
- **Solution**: LangChain-based tool that uses a vector database of the **Sphere Handbook** (~450 pages).
- **Features**:
  - AI answers questions like “How do we get water to isolated communities?”
  - Cites specific handbook segments and page references (with some formatting issues to fix).
- **Goal**: Reliable, non-hallucinated AI access to expert humanitarian protocols.

---

### Additional Contributions and Observations:

- **Early GPT-based scenario generation tool**: Prompt-based assistant trying to generate JSON scenarios (MVP level).
- **A few teams collaborated closely** and learned tools like LangChain, vector stores, prompt engineering, and GPT-based API integration on the fly.
- **Suggestions for future work**:
  - Integration with RAG (Retrieval-Augmented Generation) pipelines for knowledge bases.
  - Incorporating Reinforcement Learning (e.g., RH models) for more accurate simulations.
  - Expanded containerization and microservice architecture for scale and deployment.

---

### General Themes:

- Emphasis on **nonlinear thinking**, **human-centered interface design**, and **modular AI pipelines**.
- Strong orientation toward **applicability in both simulations and real-world crisis scenarios**.
- Tools developed were portable, flexible, and grounded in practical crisis management needs.

---

Presentations from the Hackathon may be seen here: https://www.youtube.com/watch?v=DTsG-YLgj1M
