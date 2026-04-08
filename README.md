# CarbonCampus Development Report

Welcome to the documentation of **CarbonCampus**!

This Software Development Report, tailored for LEIC-ES-2025-26, provides comprehensive details about **CarbonCampus**, starting from a high-level vision and going into low-level implementation decisions.

It is organised by the following activities:

- Business modeling
  - Product Vision
  - Features and Assumptions
- Requirements
  - User stories
  - Domain model
  - User interfaces
- Architecture and Design
  - Logical architecture
  - Physical architecture
  - Functional prototype
- Project management
  - Sprint 0
  - Sprint 1
  - Sprint 2
  - Sprint 3
  - Final Release

Contributions are expected to be made exclusively by the initial team, but we may open them to the community, after the course, in all areas and topics: requirements, technologies, development, experimentation, testing, etc.


---

## Business Modelling

The app we propose, **CarbonCampus**, has the objective to reduce the carbon footprint of university students. The intense use of cars for short campus commutes is a leading cause in localized pollution. However, one way of limiting that is through the increased utilization of eco-friendly transport like cycling or walking. That way, if 5 students choose to walk to their faculty instead of driving, they significantly lower emissions.

The biggest issue with that is that students might lack the social motivation or feedback to change their habits, making it difficult to feel the impact of their choices. That's where our app steps in. We can connect students and allow them to compete in green challenges, making it a great way to avoid excessive usage of cars, earn rewards, and save the planet.

But a student might find it disadvantageous to change their routine without a tangible incentive. That's where we implement a gamified ecosystem.

Business modeling in software development involves defining the product's vision, understanding market needs, aligning features with user expectations, and setting the groundwork for strategic planning and execution.

### Product Vision

**CarbonCampus - Full Product Vision**

The app **CarbonCampus** aims to transform the way students commute by reducing unnecessary car usage and promoting sustainable habits. Today, many student trips are under-optimized, often relying on solo car travel while contributing to traffic, high fuel consumption, and campus pollution. CarbonCampus addresses this by connecting peers through competitive challenges and transparent impact tracking, creating an efficient, eco-friendly way to move through the university.

For participants, CarbonCampus provides gamified rewards, reducing environmental impact and giving easy access to a community of like-minded individuals. For all users, the app ensures trust through verified academic tags, course-based rankings, and secure social interaction. Finally, by implementing a point system and a leaderboard, we are using basic human psychology to encourage competition and therefore the usage of the app. By making sustainability easy, safe, and rewarding, CarbonCampus encourages more people to choose green alternatives over solo car trips.

Our vision is to create a community-driven ecosystem where daily habits meet sustainability: fewer cars on the road, lower emissions, more cost-effective travel, and the opportunity to connect with new people. Ultimately, CarbonCampus doesn't just track points - it moves society closer to a greener, smarter, and more connected future.

**Key Features Driving This Vision:**

- Smart impact calculation to minimize the perceived effort for users.
- Verified academic tags, ratings, and challenge history for safety and trust.
- Automated point-sharing for groups to reward team efforts fairly.
- Real-time sustainability statistics and notifications for convenience.
- Community-building features, such as peer invites and shared challenges, to foster trust and engagement.
- A point system that encourages app utilization.

### Features and Assumptions

- **Sustainability Dashboard:** Depending on the profile of the user (active or passive participant), the dashboard highlights the best way to maximize CO2 savings and earn the most points.
- **Registration System:** Basic account management to keep track of the users and their academic affiliations.
- **Competitiveness Framework:** The points allow for competitive rankings and the acquisition of social badges for the profile.

## Requirements

### User Stories

Our requirements are documented as User Stories in our GitHub Project T5-Scrumboard. We followed the INVEST guidelines to ensure each story is Independent, Negotiable, Valuable, Estimable, Small, and Testable.

| ID   | User Story | Priority (MoSCoW) | Effort (Fibonacci) |
| ---- | ---------- | ----------------- | ------------------ |
| US1  | Como visitante, quero criar uma conta utilizando o meu endereço de email e uma palavra-passe, para poder guardar o meu histórico de viagens e a minha pontuação. | Must-have | 8 |
| US2  | Como utilizador registado, quero fazer o login na aplicação, para aceder aos meus dados e aos meus desafios em curso. | Must-have | 5 |
| US3  | Como utilizador, quero selecionar um meio de transporte sustentável (ex: bicicleta, transporte público, a pé) e inserir a distância que percorri, para registar uma deslocação. | Must-have | 20 |
| US4  | Como utilizador, quero que a aplicação calcule e mostre automaticamente a quantidade de CO2 (em kg ou gramas) que poupei ao registar a viagem, para validar a minha ação. | Must-have | 5 |
| US5  | Como utilizador, quero visualizar a minha pontuação total de CO2 poupado no ecrã principal, para ter noção do meu impacto ambiental acumulado. | Must-have | 3 |
| US6  | Como utilizador, quero pesquisar outros utilizadores inserindo o seu endereço de email, para lhes enviar um pedido de ligação/amizade. | Must-have | 5 |
| US7  | Como utilizador, quero aceitar ou rejeitar convites de outros utilizadores, para gerir quem pertence à minha rede. | Must-have | 5 |
| US8  | Como utilizador, quero criar um novo desafio com uma data de início e uma data de fim estipuladas, para definir o período da competição. | Must-have | 5 |
| US9  | Como criador de um desafio, quero selecionar contactos da minha rede e enviar-lhes um convite, para que entrem na competição. | Must-have | 5 |
| US10 | Como participante num desafio ativo, quero ver uma tabela classificativa (leaderboard) ordenada pela quantidade de CO2 poupado durante o tempo do desafio, para verificar em que posição me encontro face aos restantes concorrentes. | Must-have | 8 |

### Requirements Quality (DoR)

Each User Story in our backlog includes:

- **Gherkin Scenarios:** Clear "Given/When/Then" acceptance tests to confirm requirements are met.
- **User Interface Mockups:** High-fidelity drafts attached to each issue to guide frontend development.
- **Estimation:** Value (Business Priority) and Effort (Story Points) defined by the whole team.
- **Refinement:** Larger stories were broken down into technical Tasks to be "immediately actionable" as per the LEIC-ES Dashboard criteria.

### Domain Model

Our app allows Users to create personal accounts, enabling them to log Trips or join Challenges. It includes different types of users, such as Active Participants and Admins, and supports interactions between them.

- **User:** Stores information about the user with their statistics (id, handle, email, password, points).
- **Trip Log:** Represents a sustainable activity that earns points.
- **Social Invite:** Manages invitations between users.
- **Challenge:** Stores information about a challenge, including timeframe (Start/End), title, and participants.
- **Eco-Metric:** Stores the carbon offset related to specific transport modes.
- **Leaderboard:** Ranks each user by the amount of points accumulated within their department.

[Image Placeholder for Domain Model]

## Architecture and Design

### Logical Architecture

The user interacts through the User Interface for visual elements and interactions, with the Business Logic layer handling carbon calculations and social logic, and external services for location tracking. Data storage and retrieval are handled by local persistence and eventually a database schema.

### Physical Architecture

Each user interacts with the application via their mobile device. The application accesses external machines to retrieve necessary data, such as mapping services and the central database.

### Functional Prototype

To help validate all architectural, design, and technological decisions made, we implemented a functional prototype - a thin vertical slice of the system.

We implemented the Trip Logging and Friend Invite modules. The prototype demonstrates a screen where users can search for peers via unique tags and log their daily commutes, showing the immediate update of points on the dashboard.

## Project Management

To ensure a smooth, transparent, and iterative development process for **CarbonCampus**, our team adopted Agile methodologies, specifically focusing on the Scrum framework. We utilize a set of practices and tools to plan, implement, monitor, and control our software project effectively.

Our project management workflow is structured around the following key areas:

- **Backlog Management:** We manage both our Product Backlog and Sprint Backlogs using our GitHub Projects board. This board acts as our single source of truth for tracking User Stories, Tasks, estimations, and priorities.
- **Release Management:** We align our releases with the end of our Sprints. Code increments are systematically tagged (e.g., `v1` for Sprint 1) in our GitHub repository to mark stable milestones.
- **Sprint Planning & Retrospectives:**
  - **Plans:** At the beginning of each Sprint, we select User Stories and break them down into actionable tasks.
  - **Retrospectives:** At the end of every Sprint, the team inspects our workflow. We address what we did well, what to do differently, open puzzles, and future improvements.

### Sprint 1

The detailed notes from our Sprint 1 Planning and Retrospective can be found in our dedicated documentation. During this sprint, we successfully established the foundational UI and the social networking logic.

### Sprint 2

Focused on the implementation of Competitive Group Challenges and refining the automated CO2 offset calculations.

### Final Release

[Placeholder for final evaluation notes]

## The T5 Development Team

- Afonso Vilas and up202403577@up.pt
- Martim Ferreira and up202403764@up.pt
- Guilherme Pinho and up202406596@up.pt
- Luís Castanheira and up202404122@up.pt
- Pedro Cunha and up202403358@up.pt
