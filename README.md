

## Get Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/LyrinePoliarco/OrgAIze.git
   cd OrgAIze
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm install lucide-react
   npm run dev
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add:  
   ```
   You can email lyyrineseojoon@gmail.com to get the api
   
   ```


CCSEL2-18/CSLEL2-18 - Professional Elective 2




NEU OrgAIze 
(New Era University Intelligent Organization Repository)





## Introduction

## 1.1 Project Overview

Student OrgAI: Intelligent Organization Repository is a smart, digital platform designed to address common challenges faced by student organizations in academic institutions. These challenges include unorganized record-keeping, limited access to historical documents, and inefficient recruitment and engagement strategies. Student OrgAI provides a centralized digital repository where organizations can securely store important files such as event documentation, membership records, and organizational histories. The platform enhances document retrieval, streamlines processes, and improves transparency, enabling student organizations to operate more efficiently and maintain continuity over time.
Beyond data management, Student OrgAI features an AI chatbot assistant similar to ChatGPT that helps students with their academic and personal needs. Users can ask the AI any question, and it will provide brief, informative explanations and guidance. The AI can assist with brainstorming for academic projects, explaining difficult concepts, suggesting study techniques, offering life advice, and helping with time management. While not directly connected to organizational documents, this AI feature serves as a valuable resource for individual students, supporting their educational journey and j lopersonal development alongside the platform's organizational management capabilities.

## 1.2 Project Goals and Objectives

## Goals and Objectives:
To provide a centralized repository for student organizations to upload, store and retrieve files easily rather than using external platforms.
To implement role-based access control that allows administrators to manage organizations, executive committees to organize files, and students to view related information in organizations with limited upload permissions for personal forms.
To integrate an AI-powered assistant that can answer general academic and personal questions, helping students with their studies and everyday challenges.

## 1.3 Scope of the Project
This project focuses on the design, development, and implementation of Student OrgAI, a comprehensive organization repository with AI assistance tailored exclusively for student organizations under the College of Computer Studies (CICS). The platform aims to centralize document storage, streamline recruitment processes, and enhance the student experience through an accessible AI chatbot interface. The AI assistant will help CICS students with academic questions, concept explanations, and personal development advice, serving as a supplementary educational resource. The study will assess the platform's usability, efficiency, and impact on operational transparency and knowledge retention within these organizations. The research will be conducted solely within the CICS community, and findings will be based on the specific needs and experiences of its student organizations and members.

## Requirements Analysis

## 2.1 Use Case Diagram
The use case diagram for NEU OrgAIze illustrates a comprehensive student organization management system with three primary actors—Student, Executive, and Admin—and multiple use cases that cover document management, recruitment processes, member engagement, and administrative oversight.

<img width="962" height="711" alt="image" src="https://github.com/user-attachments/assets/17dd2443-c9a6-49de-b59c-a77dded8663e" />

 
                         Diagram 1. NEU orgAIze Use Case Diagram


## 1. User Authentication
Access Control: Validates and restricts access to neu.edu.ph email domains only
Google Integration: Secure login with Google authentication (restricted to neu.edu.ph domains)
Domain Verification: System automatically denies access to non-NEU email addresses
## 2. Student Dashboard
Organization Membership: Request to join university organizations (META, LINKS, ACCS, SITES, CSSC)
Request Management: Submit and track organization membership requests
Request Limitations: Organization memberships managed exclusively through student dashboard
AI Integration: Full AI assistant capabilities for university-related inquiries
## 3. Executive Dashboard
File Management:
Upload functionality for documents and resources
Delete capability for managing outdated content
Data Access:
Description fetching for organizational content
Links management for important resources
Birthday celebrants tracking for community engagement
Announcement creation and distribution
AI Integration: Same AI assistant capabilities as student dashboard
## 4. Organization-Student Dashboard
Content Visibility: Access to view all executive-posted content
AI Integration: Same AI assistant capabilities as other dashboards
## 5.  Admin Dashboard
Role Management: Comprehensive control over user role assignments and modifications
System Administration: Advanced system configuration capabilities

##  System Design

<img width="811" height="694" alt="image" src="https://github.com/user-attachments/assets/b2f51e01-11b7-4e19-b24e-7916f3b208c3" />

 3.1 Entity-Relationship Diagram (ERD)

<img width="670" height="635" alt="image" src="https://github.com/user-attachments/assets/312856de-24c3-4524-bc50-fb55831d10ca" />

3.2 UML Class Diagram



## User Manual

## 4.1 Introduction

a. Purpose and Scope
Student OrgAIze: Intelligent Organization Repository is a smart, digital platform designed to address common challenges faced by student organizations in academic institutions. This project focuses on the design, development, and implementation of Student OrgAIze, a comprehensive organization repository with AI assistance tailored exclusively for student organizations under the College of Computer Studies (CICS).  
b. Target Audience
This manual is for OrgAIze users: Student, Organization Leaders, University Executives,  and System Administrator.

## 4.2  Installation Instructions
	Clone the Repository
 git clone https://github.com/LyrinePoliarco/OrgAIze
.git cd OrgAIze 

            Install Dependencies
npm install 
npm install uuid 
npm install lucide-react 
npm run dev (to start the project)







# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
