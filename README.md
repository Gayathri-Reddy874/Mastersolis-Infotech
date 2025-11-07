# 🌐 Wixstro — AI-Powered Company Website Builder  
### A Full-Stack Smart Website for **Mastersolis Infotech**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

---

## 🚀 Overview

**Wixstro** is an **AI-driven full-stack web platform** built for **Mastersolis Infotech**.  
It automatically creates and manages a modern, responsive company website through AI-generated content, resume parsing, analytics summaries, and automated email workflows — without manual coding.

This project demonstrates the future of **no-code + AI-powered web development** — where a complete site can be generated, customized, and managed using simple natural language prompts.

---

## 🎯 Problem Statement

Create a **dynamic, intelligent, and scalable website** for Mastersolis Infotech that:
- Showcases services, projects, and achievements  
- Automates recruitment with resume parsing and job-fit scoring  
- Generates AI-based content (blog posts, taglines, bios, SEO snippets)  
- Provides analytics summaries and client engagement insights  
- Enables non-technical admins to update content seamlessly  

---

## 🧠 AI Features

| Feature | Description |
|----------|--------------|
| 🪄 **AI Content Generator** | Automatically writes service descriptions, bios, and blog posts using LLMs |
| 🤖 **AI Chatbot** | Handles customer queries and provides smart navigation suggestions |
| 📄 **Resume Parser** | Extracts candidate info and matches resumes to job roles |
| 🧾 **AI Analytics Summarizer** | Generates natural-language summaries from visitor data |
| ✉️ **Auto Mail Composer** | Sends AI-drafted acknowledgment and follow-up emails |
| 🧩 **Prompt-based Website Editor** | Allows admins to update content through text prompts |

---

## 🏗️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Astro  
**Backend:** Node.js, Express.js  
**Database:** MongoDB / PostgreSQL  
**AI Integrations:** OpenAI API / Hugging Face  
**Deployment:** Cloudflare / Vercel  
**Version Control:** Git & GitHub  

---

## ⚙️ Setup & Run Instructions

### 1️⃣ Prerequisites
- Node.js ≥ 18  
- npm or yarn  
- Git  
- Cloudflare or Vercel account  
- `.env` with required API keys  

### 2️⃣ Installation
```bash
git clone <repo-url>
cd wixstro
npm install
3️⃣ Configuration
Create a .env file:

env
Copy code
OPENAI_API_KEY=your_key_here
DB_URL=your_database_url
JWT_SECRET=your_secret
SMTP_URL=your_smtp_server
4️⃣ Development
bash
Copy code
npm run dev
# Visit http://localhost:4321
5️⃣ Build & Deploy
bash
Copy code
npm run build
npm run preview
npm run release
🧑‍💻 Team Members & Roles
Name	Role	Responsibilities
Ayaan Pasha	Frontend Developer	React UI, layouts, responsive design
Chowdri Furkhan	Frontend Developer	Tailwind integration, UX & accessibility
Madhuri H S	Backend Developer	API endpoints, authentication, email modules
Mallareddygari Gayathri	AI & Database Engineer	Resume parsing, AI tools integration, database schemas

🧩 Project Structure
arduino
Copy code
wixstro/
 ┣ src/
 ┃ ┣ components/
 ┃ ┣ pages/
 ┃ ┣ api/
 ┃ ┣ assets/
 ┣ public/
 ┣ .env.example
 ┣ package.json
 ┣ README.md
 ┗ tailwind.config.js
📈 Key Features
🌐 Multi-page responsive design (Home, About, Services, Careers, Projects, Blog, Contact)

🧠 AI-powered resume analysis & job-fit scoring

✨ Admin dashboard for content, leads & analytics

💬 Integrated AI chatbot (customizable personality)

📊 Automated SEO & blog summaries

📥 Smart contact form with auto-email reply

🔐 JWT-based authentication system

🌍 Deployment
You can deploy using:

Cloudflare Pages (recommended)

Vercel or Netlify

Docker (optional) for production build environments

💡 Future Enhancements
Add AI voice assistant for user queries

Multi-language translation using NLP

AI-driven performance optimization suggestions

Integration with Notion & Zapier for workflow automation
