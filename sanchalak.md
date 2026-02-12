# Product Requirements Document: Sanchalak (सञ्चालक)

**Project Name:** Sanchalak  
**Version:** 1.0 (Production Ready)  
**Vision:** "The Digital Conductor of School Ecosystems"  
**Tech Stack:** React (Web Admin), React Native (Mobile App), Java Spring Boot (Backend)

---

## 1. Executive Summary
**Sanchalak** is a centralized School Management System (SMS) designed to bridge the gap between school administration, teaching staff, and parents/students. It provides a robust Web Dashboard for complex administrative work and a streamlined Mobile App for real-time academic and financial engagement.

---

## 2. Target Personas

| Persona | Primary Access | Key Motivation |
| :--- | :--- | :--- |
| **School Admin** | Web Portal | Financial health, staff management, and legal compliance. |
| **Teachers** | Web + Mobile | Reducing paperwork, marking attendance, and tracking grades. |
| **Parents/Students** | Mobile App | Real-time updates on child's performance and fee payments. |

---

## 3. Functional Requirements (FRD)

### 3.1 Role-Based Access Control (RBAC)
* **FR-1.1: Authentication:** Mobile Number + OTP based login for users; Email + Password for Super Admins.
* **FR-1.2: Dynamic Permissions:** Roles (Admin, Teacher, Staff, Student, Parent) with specific view/edit permissions managed by the Spring Boot backend.

### 3.2 Academic Management
* **FR-2.1: Student Information System (SIS):** Comprehensive profiles including bio-data, document uploads (S3), and unique ID generation.
* **FR-2.2: Smart Attendance:** * Teachers mark attendance via the mobile app.
    * Parents receive an instant push notification via Firebase (FCM) if a student is absent.
* **FR-2.3: Exam & Result Module:**
    * Create exam terms and subjects.
    * Teachers input marks via a mobile grid.
    * System generates dynamic PDF Report Cards with school branding.
* **FR-2.4: Digital Diary:** Daily homework assignments with image/PDF upload capability for teachers.



### 3.3 Financial & Fee Management
* **FR-3.1: Fee Structure Definition:** Flexible configuration for tuition, transport, exam, and laboratory fees.
* **FR-3.2: Online Payments:** Integrated UPI and Card payment gateway.
* **FR-3.3: Digital Receipts:** Automated generation of invoices and payment receipts sent to the parent app.
* **FR-3.4: Payroll:** Staff salary calculation based on attendance and performance.

### 3.4 Communications & Notifications
* **FR-4.1: Notice Board:** Digital circulars targetable to the whole school, specific classes, or staff roles.
* **FR-4.2: Calendar:** Interactive school calendar for holidays, exams, and parent-teacher meetings.

---

## 4. Technical Specifications

### 4.1 Backend (Java Spring Boot)
* **Architecture:** RESTful API services.
* **Database:** PostgreSQL for relational data (Classes, Students, Fees).
* **Security:** JWT (JSON Web Tokens) for session management.
* **PDF Generation:** iText or JasperReports for Report Cards and Invoices.



### 4.2 Frontend (React & React Native)
* **Web:** React.js for the Admin interface using Material UI or Tailwind CSS for a professional look.
* **Mobile:** React Native for a single codebase across Android and iOS. Focus on lightweight screens for low-end devices.

---

## 5. Non-Functional Requirements (NFR)
* **Scalability:** System must handle concurrent attendance marking for 500+ classes during peak morning hours.
* **Data Security:** End-to-end encryption for sensitive documents and financial transaction logs.
* **Localization:** Support for Hindi and regional dialects for rural school adoption.
* **Offline Capability:** Mobile app should cache the last 7 days of attendance and homework for offline viewing.

---

## 6. Project Roadmap

### Phase 1: Core Foundation (Month 1-2) - ✅ COMPLETED
* User Auth & Profile Management.
* SIS (Student Information System).
* Digital Attendance & Notice Board.

### Phase 2: Academic Core (Month 3-4) - 🚧 PENDING
* Exam & Result Management.
* PDF Report Card Generation.
* Homework/Digital Diary.

### Phase 3: Financials & Admin (Month 5+)
* Online Fee Payment Gateway.
* Staff Payroll & Expense Tracking.
* Advanced Admin Analytics Dashboards.

---

## 7. Success Metrics
* **Engagement:** Daily active users (DAU) among teachers.
* **Financial:** Reduction in "Fee Overdue" cases through automated reminders.
* **Operations:** 80% reduction in physical notice printing costs.