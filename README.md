# AI Workplace Productivity Assistant

## Project Overview
AI Workplace Productivity Assistant is a single, integrated web dashboard that helps professionals automate everyday workplace tasks using AI. Instead of switching between multiple tools, users can generate emails, summarize meetings, plan their schedule, research topics, and chat with an AI assistant — all from one clean, modern interface.

This project was built for the AI Skill Accelerator Programme (ASA) to demonstrate practical AI implementation, strong prompt engineering, real-world problem solving, responsible AI usage, and modern UI/UX design.

## Features

1. **Smart Email Generator** — Generates professional emails from a few key points, with selectable tone (Formal, Friendly, Persuasive) and an editable, copyable output.
2. **Meeting Notes Summarizer** — Takes raw meeting notes and produces a structured summary broken into Key Decisions, Action Items (with owner where mentioned), and Deadlines.
3. **AI Task Planner / Scheduler** — Takes a list of tasks and generates a prioritized daily or weekly schedule with time blocks and reasoning for the ordering.
4. **AI Research Assistant** — Summarizes a topic or pasted article into key points, plus actionable recommendations.
5. **AI Chatbot Interface** — A conversational assistant for general workplace questions (scheduling, emails, tasks, work advice), with persistent conversation history during the session.

All AI-output pages display a responsible AI disclaimer reminding users to review AI-generated content before use, and include friendly error handling if an AI request fails.

## Tools Used
- **Lovable AI** — used to design, build, and iterate on the application through natural-language prompts (no manual coding).
- **OpenAI / ChatGPT API** — powers the AI generation behind each feature (email drafting, summarization, scheduling logic, research synthesis, and chat responses).
- **GitHub** — version control and project hosting, connected directly to the Lovable project for automatic syncing.

## Setup Instructions
1. Open the live application link: *[insert your published Lovable app URL here]*
2. No login is required to use the demo features.
3. To run/edit the project yourself:
   - Clone this repository: `git clone [your repo URL]`
   - Open the project in [Lovable](https://lovable.dev) via the connected GitHub integration, or
   - Install dependencies locally with `npm install` and run `npm run dev` (if working with the exported code directly)

## Responsible AI Practices
- All AI-generated content is clearly labeled with a disclaimer: "⚠️ AI-generated content — please review for accuracy before use."
- Error handling ensures users see a clear, friendly message if an AI request fails rather than a broken experience.
- The tool is designed to assist and speed up human work, not replace human review or decision-making.

## Team Members
- oratilwe komane — Solo project

## Project Status
Built as part of the AI Skill Accelerator Programme (ASA), CAPACITI, Week 16.
