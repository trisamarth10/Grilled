# AI Interview Simulator - Product Vision & Development Principles

## Product Vision

The goal of this product is to create the most realistic AI-powered mock interview experience possible.

The product should simulate the feeling of speaking with an experienced interviewer from a top-tier technology company rather than interacting with a chatbot.

The experience should feel natural, conversational, and immersive.

Users should feel as though they are participating in an actual interview rather than completing an assessment tool.

The primary objective is to help candidates identify weaknesses, improve interview readiness, and gain realistic interview practice based on their own resume and experience.

---

# Core Product Experience

## Step 1: Authentication & Onboarding

The user lands on the platform and is able to:

* Create an account
* Log in
* Upload their resume
* Select interview type
* Select target role
* Select experience level

Examples:

* Software Engineer
* Data Scientist
* Product Manager
* DevOps Engineer
* Machine Learning Engineer

Future versions may support custom job descriptions.

The onboarding experience should be simple and require minimal user effort.

---

## Step 2: Resume Analysis

After resume upload:

The system performs a deep analysis of:

* Projects
* Work experience
* Technologies
* Leadership experiences
* Education
* Research
* Achievements

The interview plan should be dynamically generated from the resume.

The AI should identify:

* Strong areas
* Weak areas
* Potential exaggerations
* Areas requiring validation
* Topics requiring deeper investigation

The interview should never feel generic.

Every interview should be personalized.

---

## Step 3: Interview Preparation Screen

Before the interview begins:

The user is presented with a preparation screen.

Suggested duration:

30-60 seconds

Purpose:

* Allow users to settle down
* Test microphone
* Review interview instructions
* Understand interview expectations

The countdown should build anticipation while reducing anxiety.

No technical setup should be required by the user.

---

## Step 4: Real-Time Voice Interview

This is the core experience of the product.

The interview should be fully voice-based.

The interaction should feel similar to a Zoom or Google Meet conversation.

### Requirements

The user should not need to:

* Press push-to-talk buttons
* Manually activate recording
* Continuously click UI controls

Voice interaction should be hands-free.

The system should automatically:

* Detect when the interviewer is speaking
* Detect when the candidate is speaking
* Handle interruptions naturally
* Manage conversational turn-taking

### Interview Behavior

The interviewer should:

* Ask questions naturally
* React to answers dynamically
* Ask follow-up questions
* Challenge assumptions
* Probe technical depth
* Validate project ownership
* Test communication skills

Questions should not come from a predefined script.

The interviewer should adapt continuously based on candidate responses.

The objective is realism rather than question quantity.

### Interview Types

Future support may include:

* Resume-based interviews
* Behavioral interviews
* Technical interviews
* System design interviews
* Leadership interviews

The initial version should focus exclusively on resume-based interviews.

---

## Step 5: Comprehensive Evaluation Report

At the conclusion of the interview:

The user receives a detailed report.

The report should resemble feedback provided by an actual hiring committee.

### Report Sections

Overall Recommendation

* Hire
* Lean Hire
* Lean No Hire
* No Hire

Technical Assessment

Communication Assessment

Project Depth Assessment

Resume Credibility Assessment

Strengths

Weaknesses

Areas for Improvement

Suggested Next Steps

### Download Options

The report should be downloadable as:

* PDF
* Shareable Link (future phase)

---

# Development Philosophy

## Planning Before Building

Planning and implementation must remain separate activities.

Claude must never immediately build large features.

Every feature must go through:

1. Planning
2. Discussion
3. Approval
4. Implementation

No feature should be implemented without a clear plan and explicit user approval.

---

## User Approval Requirements

Claude should never make major decisions silently.

Whenever important decisions are required, Claude must:

* Present options
* Explain trade-offs
* Recommend an approach
* Wait for approval

This applies to:

* Architecture
* Frontend framework
* Backend framework
* Database selection
* Authentication providers
* Model providers
* Voice providers
* Infrastructure decisions
* Cost-impacting decisions
* Feature scope decisions

The user must remain in control of major project decisions.

---

# Strict Phase-by-Phase Development Process

The project must be developed incrementally.

Complex systems should be postponed until foundational systems are stable.

Claude should focus on building the smallest working version first.

---

## Phase 1 - Product Planning

Deliverables:

* PRD
* User flows
* Architecture proposal
* Cost estimation
* MVP definition

No coding.

Approval required before proceeding.

---

## Phase 2 - UI & Experience Design

Deliverables:

* Wireframes
* Screen designs
* User journey review
* Design system proposal

No backend implementation.

Approval required before proceeding.

---

## Phase 3 - Core Platform Setup

Deliverables:

* Frontend setup
* Authentication
* Database
* User management

No voice functionality.

Approval required before proceeding.

---

## Phase 4 - Resume Upload & Analysis

Deliverables:

* Resume upload
* Resume parsing
* Resume analysis pipeline
* Interview plan generation

Approval required before proceeding.

---

## Phase 5 - Voice Interview Prototype

Deliverables:

* Speech-to-Text integration
* Text-to-Speech integration
* Real-time interview flow

This should initially prioritize simplicity and cost efficiency.

Approval required before proceeding.

---

## Phase 6 - Interview Evaluation Engine

Deliverables:

* Scoring framework
* Feedback generation
* Strength/weakness analysis
* Recommendation generation

Approval required before proceeding.

---

## Phase 7 - Reporting System

Deliverables:

* Interview reports
* PDF export
* Analytics dashboard

Approval required before proceeding.

---

## Phase 8 - Production Hardening

Deliverables:

* Monitoring
* Error tracking
* Logging
* Performance optimization
* Security review

Approval required before proceeding.

---

# Model & API Selection Policy

Model and API decisions should only be discussed when the relevant phase requires them.

Claude should not prematurely optimize future phases.

When a phase requires external services, Claude should present options and recommendations.

Examples include:

### Speech-to-Text (STT)

Compare providers based on:

* Accuracy
* Latency
* Cost
* Ease of integration

### Text-to-Speech (TTS)

Compare providers based on:

* Voice quality
* Naturalness
* Cost
* Real-time performance

### LLM Selection

Compare models based on:

* Interview quality
* Reasoning capability
* Cost per session
* Scalability

### Reporting Systems

Compare approaches based on:

* Cost
* Reliability
* User value

Recommendations should always prioritize practical early-stage validation.

The preferred approach is to keep infrastructure and API costs extremely low during MVP development.

Target budget:

Under $15 total during initial validation and testing.

Expensive providers should only be introduced after product-market validation.

# Design System Authority

A Design Markdown file exists for this project titled design.md

This file contains the approved design system, visual direction, user experience principles, layouts, styling decisions, branding decisions, screen structures, and interaction patterns for the application.

The Design Markdown document must be treated as the authoritative source of truth for all UI and UX decisions.

## Design Priority Rules

Whenever a design-related decision is required, Claude must:

1. Consult the Design Markdown file first.
2. Follow the specifications defined in the Design Markdown file.
3. Avoid introducing alternative visual styles unless explicitly requested.
4. Avoid redesigning approved screens.
5. Avoid changing layouts, component structures, visual hierarchy, spacing systems, color systems, or interaction patterns without approval.

The objective is to maintain consistency with the approved product vision and design language throughout development.

## Design Change Approval

If Claude believes a design improvement is necessary, Claude must:

* Explain the proposed change.
* Explain why the current design may create issues.
* Present the benefits and trade-offs.
* Wait for explicit approval.

Claude must never silently replace, redesign, or substantially modify approved designs.

## Relationship Between Product Vision and Design

When conflicts arise:

1. The Design Markdown file governs visual and UX decisions.
2. The Product Vision document governs product behavior and functionality.
3. Claude should identify conflicts and request clarification rather than making assumptions.

## Implementation Expectations

During implementation phases:

* UI should closely match the Design Markdown specifications.
* Components should be built according to the approved designs.
* New screens should follow the same design language.
* Styling should remain consistent across the entire application.

The goal is to achieve a professional, production-quality user experience with minimal design drift during development.

## Critical Rule

Claude should treat the Design Markdown file as a project requirement rather than a design suggestion.
The Design Markdown file should be referenced before making any UI, UX, layout, interaction, or visual design decision.
The design should be treated as the primary visual reference.
The final UI should remain close to the design.
Claude should ask questions whenever design decisions require clarification.
The design file should influence:
- Layout
- Navigation
- User flow
- Visual identity
- Styling decisions

