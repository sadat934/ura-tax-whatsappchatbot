# URA Tax Chatbot - System Description Document

**Version:** 1.0  
**Date:** May 25, 2026  
**Project:** Uganda Government Digital Registry (GDR) Showcase Application  
**Status:** Prototype Phase

---

## 1. Executive Summary

The URA Tax Chatbot is a WhatsApp-based conversational assistant designed to help Ugandan Small and Medium Enterprises (SMEs) manage their tax compliance obligations. The system provides tax estimation, registration guidance, deadline reminders, and URA account balance inquiries through an accessible mobile messaging interface.

This prototype demonstrates the feasibility of using WhatsApp as a primary channel for government-to-citizen (G2C) tax services, targeting the 85% of Ugandan businesses that operate informally or struggle with tax compliance due to limited digital literacy and access to traditional web-based systems.

**Key Capabilities:**
- Tax profile registration via conversational flow
- Real-time tax obligation estimation based on business revenue
- URA API integration for official balance inquiries (production)
- Automated tax deadline reminders
- Multi-language support (English, Luganda - planned)
- Accessible via any smartphone with WhatsApp

**Technology Approach:**
- **Prototype Phase:** Free WhatsApp integration using Baileys library, JSON file storage, local development environment
- **Production Phase:** Official WhatsApp Business API, PostgreSQL database, cloud hosting with high availability

---

## 2. System Overview

### 2.1 Purpose and Scope

The URA Tax Chatbot serves as a digital intermediary between the Uganda Revenue Authority and small business owners, reducing the complexity and friction associated with tax compliance. The system addresses three primary use cases:

1. **Tax Education:** Helping business owners understand their tax obligations
2. **Compliance Assistance:** Providing estimates and reminders to prevent late filing
3. **Account Management:** Enabling users to check their URA account status without visiting physical offices

**In Scope:**
- WhatsApp-based conversational interface
- Tax profile registration and management
- Tax estimation for VAT, income tax, PAYE, and withholding tax
- URA API integration for balance inquiries
- User data storage and session management
- Audit logging for compliance tracking

**Out of Scope (Current Phase):**
- Actual tax payment processing (redirects to official URA channels)
- Document upload and verification
- Multi-agent customer support
- Web-based admin dashboard
- Integration with mobile money platforms

### 2.2 Target Users

**Primary Users:**
- Small business owners (annual turnover: UGX 10M - 150M)
- Informal sector entrepreneurs transitioning to formal registration
- Self-employed professionals (consultants, artisans, traders)

**User Characteristics:**
- Limited digital literacy (comfortable with WhatsApp but not web forms)
- Mobile-first access (smartphone with data or WiFi)
- Time-constrained (prefer quick interactions over office visits)
- Language preference: English or Luganda

**Expected Usage Patterns:**
- Initial registration: 5-10 minutes
- Tax estimation queries: 2-3 minutes
- Balance checks: 1-2 minutes
- Peak usage: End of month (deadline reminders), quarterly filing periods

### 2.3 System Context

The URA Tax Chatbot operates within Uganda's digital government ecosystem:

```
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEMS                          │
├─────────────────────────────────────────────────────────────┤
│  • WhatsApp Platform (Meta) - Message delivery              │
│  • URA Tax API - Official tax data and balances             │
│  • NIRA (Future) - National ID verification                 │
│  • Mobile Money APIs (Future) - Payment integration         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              URA TAX CHATBOT (This System)                   │
│  • Conversational interface                                 │
│  • Tax calculation engine                                   │
│  • User profile management                                  │
│  • Reminder scheduling                                      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    END USERS                                 │
│  • SME business owners via WhatsApp mobile app              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. System Architecture

### 3.1 High-Level Architecture

The system follows a layered architecture pattern with clear separation of concerns:

**Layer 1: Presentation Layer**
- WhatsApp mobile application (user interface)
- Message formatting and response generation

**Layer 2: Integration Layer**
- WhatsApp adapter (Baileys for prototype, Business API for production)
- Protocol translation (WhatsApp messages ↔ internal events)

**Layer 3: Application Layer**
- Chatbot conversation engine
- Business logic services (tax estimation, profile management)
- Command routing and state management

**Layer 4: Data Layer**
- User profile storage (JSON files for prototype, PostgreSQL for production)
- Session state management
- Audit logging

**Layer 5: External Integration Layer**
- URA API client (with fallback mode)
- Future integrations (NIRA, mobile money)

### 3.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION COMPONENTS                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  WhatsApp Adapter Layer                            │    │
│  │  • baileysAdapter.js (Prototype)                   │    │
│  │  • whatsappBusinessAdapter.js (Production)         │    │
│  │  Responsibilities:                                 │    │
│  │  - QR code authentication (Baileys)                │    │
│  │  - Message receiving and sending                   │    │
│  │  - Media handling                                  │    │
│  │  - Connection management                           │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Chatbot Core (chatbot.js)                         │    │
│  │  Responsibilities:                                 │    │
│  │  - Message parsing and normalization               │    │
│  │  - Conversation flow management                    │    │
│  │  - Command routing (menu, register, estimate)      │    │
│  │  - Multi-step interaction handling                 │    │
│  │  - Response generation                             │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Business Services                                 │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │ TaxEstimator (taxEstimator.js)              │ │    │
│  │  │ - Income tax calculation (tiered rates)     │ │    │
│  │  │ - VAT calculation (18%)                     │ │    │
│  │  │ - PAYE estimation (3%)                      │ │    │
│  │  │ - Withholding tax (6%)                      │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │ URAApiClient (uraApiClient.js)              │ │    │
│  │  │ - TIN validation                            │ │    │
│  │  │ - Balance inquiry                           │ │    │
│  │  │ - Deadline retrieval                        │ │    │
│  │  │ - Fallback mode when API unavailable        │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │ UserStore (jsonUserStore.js)                │ │    │
│  │  │ - User profile CRUD operations              │ │    │
│  │  │ - Session state persistence                 │ │    │
│  │  │ - Conversation history tracking             │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Data Storage                                      │    │
│  │  • Prototype: data/users.json                     │    │
│  │  • Production: PostgreSQL database                │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Data Flow

**User Registration Flow:**
```
1. User sends "register" or "1"
   ↓
2. Chatbot prompts for TIN
   ↓
3. User sends TIN (validated: 8-15 digits)
   ↓
4. Chatbot prompts for business type (1-5)
   ↓
5. User selects business type
   ↓
6. Chatbot prompts for monthly turnover
   ↓
7. User sends turnover amount
   ↓
8. Chatbot prompts for tax types
   ↓
9. User sends tax types (comma-separated)
   ↓
10. Profile saved to storage
    ↓
11. Confirmation message with profile summary
```

**Tax Estimation Flow:**
```
1. User sends "estimate" or "2"
   ↓
2. System retrieves user profile
   ↓
3. TaxEstimator calculates:
   - Annual turnover = monthly × 12
   - Income tax (tiered: 0%, 1%, 2%, 3%)
   - VAT (18% if applicable)
   - PAYE (3% if applicable)
   - Withholding tax (6% if applicable)
   ↓
4. Response formatted with monthly and annual estimates
   ↓
5. Message sent to user
```

**URA Balance Check Flow:**
```
1. User sends "balance" or "3"
   ↓
2. System retrieves user TIN
   ↓
3. URAApiClient attempts API call
   ↓
4a. If API available:
    - Fetch live balance
    - Return official data
   ↓
4b. If API unavailable (prototype):
    - Return fallback message
    - Provide estimated obligation instead
   ↓
5. Response sent to user
```

---

## 4. Technical Implementation

### 4.1 Technology Stack

| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| **Runtime** | Node.js | 22.x | Modern JavaScript runtime, excellent async I/O for chat applications |
| **Framework** | Express.js | 4.21.x | Lightweight web framework for API endpoints and webhooks |
| **WhatsApp (Prototype)** | Baileys | 7.0.x | Free WhatsApp Web API, no official API costs during development |
| **WhatsApp (Production)** | WhatsApp Business API | Latest | Official Meta API with SLA guarantees and compliance |
| **Database (Prototype)** | JSON Files | N/A | Zero setup, sufficient for <1000 users, easy debugging |
| **Database (Production)** | PostgreSQL | 15+ | ACID compliance, robust querying, proven scalability |
| **HTTP Client** | Axios | 1.7.x | Promise-based HTTP client for URA API integration |
| **Scheduling** | node-cron | 3.0.x | Cron-based job scheduling for deadline reminders |
| **Logging** | Pino | 9.6.x | High-performance JSON logging for production monitoring |
| **Environment Config** | dotenv | 16.4.x | Secure environment variable management |

### 4.2 Key Algorithms

**Tax Estimation Algorithm (Income Tax):**
```javascript
function estimateIncomeTax(annualTurnover) {
  if (annualTurnover <= 10,000,000) return 0;           // Exempt
  if (annualTurnover <= 30,000,000) return turnover × 1%;
  if (annualTurnover <= 80,000,000) return turnover × 2%;
  return turnover × 3%;                                  // Above 80M
}
```

**Conversation State Management:**
- Each user has a `flow` object: `{ name: 'register', step: 'tin' }`
- State persisted after each message
- Timeout handling: flows expire after 30 minutes of inactivity
- State transitions validated before proceeding to next step

**Message Normalization:**
```javascript
function normalize(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s,]/g, '');  // Remove special chars except commas
}
```

### 4.3 API Endpoints

**Internal API (Express Server):**

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/health` | Health check | None | `{ status: 'ok', timestamp }` |
| POST | `/simulate-message` | Testing endpoint | `{ from, text }` | `{ response }` |
| POST | `/webhook` (future) | WhatsApp Business webhook | WhatsApp payload | `200 OK` |

**APIs Exposed for Government Integration (Future):**

| Endpoint | Method | Purpose | Authentication | Consumers |
|----------|--------|---------|----------------|-----------|
| `/api/v1/tax-estimate` | POST | Tax estimation service | API key | Other government systems |
| `/api/v1/user-profile` | GET | Retrieve user tax profile | OAuth 2.0 | URA systems, authorized govt services |

**External API Integration (URA):**

| Method | Endpoint | Purpose | Headers | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/taxpayer/{tin}` | Get taxpayer info | `X-API-Key` | `{ tin, name, status }` |
| GET | `/api/balance/{tin}` | Get tax balance | `X-API-Key` | `{ balance, nextDeadline }` |
| GET | `/api/deadlines` | Get filing deadlines | `X-API-Key` | `{ deadlines[] }` |

**Integration Standards:**
- **Data Format:** JSON (REST APIs)
- **Authentication:** API keys (current), OAuth 2.0 (production)
- **Rate Limiting:** 100 requests/minute per API key
- **Versioning:** URL-based versioning (`/api/v1/`)
- **Government Integration Layer:** Compatible with Uganda's Government API Gateway (future integration)

### 4.4 Data Models

**User Profile Schema:**
```javascript
{
  phoneNumber: String,      // WhatsApp phone number (unique identifier)
  tin: String,              // Tax Identification Number (8-15 digits)
  businessType: String,     // "Retail / shop", "Services", etc.
  monthlyTurnover: Number,  // Monthly revenue in UGX
  taxTypes: Array<String>,  // ["VAT", "income tax", "PAYE"]
  flow: {                   // Current conversation state
    name: String,           // "register", "estimate", etc.
    step: String,           // Current step in flow
    data: Object            // Temporary data for multi-step flows
  },
  createdAt: Date,
  updatedAt: Date,
  lastInteraction: Date
}
```

**Production Database Schema (PostgreSQL):**
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  tin VARCHAR(15),
  business_type VARCHAR(50),
  monthly_turnover DECIMAL(15,2),
  tax_types JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_interaction TIMESTAMP
);

-- Conversations table (audit log)
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message_from VARCHAR(10), -- 'user' or 'bot'
  message_text TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Tax estimates table
CREATE TABLE tax_estimates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  annual_turnover DECIMAL(15,2),
  estimated_tax DECIMAL(15,2),
  tax_breakdown JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. Security and Compliance

### 5.1 Security Measures

**Transport Security:**
- All HTTP communications use TLS 1.2 or higher
- WhatsApp messages encrypted end-to-end by Meta platform
- Certificate pinning in production to prevent MITM attacks

**Data Security:**
- User data stored with file system permissions (chmod 600 for JSON files)
- Production database encrypted at rest (PostgreSQL encryption)
- No sensitive data (passwords, payment info) stored in system
- TIN numbers treated as sensitive PII, never logged in plain text

**Application Security:**
- Input validation on all user inputs (TIN format, numeric amounts)
- Rate limiting: 100 messages per user per hour
- SQL injection prevention via parameterized queries (production)
- XSS prevention: all user inputs sanitized before storage

**Access Control:**
- Phone number-based authentication (WhatsApp verified)
- Session management with 30-minute timeout
- Multi-factor authentication (MFA): Not implemented in prototype; planned for production (SMS-based OTP for high-value transactions)
- Role-based access control (RBAC): End users (SME owners) and System Admin (production)
- Admin access controls for production dashboard (future)

**Network Security:**
- Firewall protection: Windows Firewall (prototype), AWS Security Groups (production)
- Port restrictions: Only port 3001 exposed locally (prototype), only 80/443 publicly (production)
- DDoS protection: CloudFlare or AWS Shield (production)
- VPC isolation: Database in private subnet (production)
- Intrusion detection: IDS monitoring (production)

### 5.2 Compliance

**Uganda Data Protection Act 2019:**
- User consent obtained during registration
- Data minimization: only essential tax-related data collected
- Right to access: users can view their profile (command "4")
- Right to deletion: users can request data removal (future feature)
- Data retention: 7 years (aligned with URA tax record requirements)

**URA Compliance:**
- Tax calculations use official URA rates (updated annually)
- Disclaimer provided: "This is an estimate for planning only"
- No tax filing or payment processing (redirects to official channels)
- Audit trail maintained for all user interactions

**WhatsApp Business Policy:**
- No spam or unsolicited messages
- Opt-in required before sending reminders
- 24-hour response window for user-initiated conversations
- Clear identification as government service

### 5.3 Audit Logging

All user interactions logged with:
- Timestamp
- User phone number (hashed in logs)
- Message content (sanitized)
- System response
- Action taken (profile update, tax estimate, etc.)

Log retention: 2 years for security analysis and compliance audits.

### 5.4 Data Classification

The system handles different categories of data with appropriate security controls:

| Data Category | Classification | Storage Location | Encryption | Access Control |
|---------------|----------------|------------------|------------|----------------|
| Phone Numbers | PII (Sensitive) | Database | At rest + in transit | User-specific, hashed in logs |
| TIN Numbers | PII (Sensitive) | Database | At rest + in transit | User-specific, hashed in logs |
| Business Revenue | Confidential | Database | At rest + in transit | User-specific only |
| Tax Estimates | Confidential | Database | At rest + in transit | User-specific only |
| Conversation Logs | Confidential | Database | At rest + in transit | User + Admin (audit only) |
| System Logs | Internal | Log files | In transit | Admin only |

**Data Protection Measures:**
- PII data (phone numbers, TINs) never logged in plain text
- All sensitive data encrypted at rest (production) and in transit
- Access restricted to data owner only (users cannot see other users' data)
- Admin access logged and monitored for compliance

---

## 6. Deployment and Operations

### 6.1 Deployment Architecture

**Prototype (Current):**
- **Location:** Local Windows laptop in Uganda
- **Runtime:** Node.js 22.x running on Windows
- **Storage:** Local JSON file storage (E:\...\data\users.json)
- **WhatsApp Connection:** Baileys library with QR code authentication
- **Network Security:** Windows Firewall enabled, port 3001 localhost only
- **Startup:** Manual startup and monitoring
- **Suitable for:** Development, testing, and initial demonstration (up to 100 users)

**Production (Planned):**
- **Cloud Provider:** AWS (primary) or DigitalOcean (alternative)
- **Region:** AWS Cape Town (South Africa) for lowest latency to Uganda, or EU-West (Ireland) with data processing agreement
- **Data Residency:** Compliant with Uganda Data Protection Act 2019
- **Future Hosting:** Uganda National Data Center when operational

```
┌─────────────────────────────────────────────────────────┐
│  Cloud Provider (AWS/DigitalOcean)                      │
│  Region: Cape Town (ZA) / Ireland (EU)                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Network Security Layer                           │ │
│  │  - AWS Security Groups / Firewall Rules           │ │
│  │  - DDoS Protection (AWS Shield / CloudFlare)      │ │
│  │  - VPC with private subnets for database          │ │
│  │  - Intrusion Detection System (IDS)               │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Load Balancer (Nginx)                            │ │
│  │  - SSL termination (Let's Encrypt)                │ │
│  │  - Request routing                                │ │
│  │  - Rate limiting (100 req/min per IP)             │ │
│  └───────────────────────────────────────────────────┘ │
│                        │                                 │
│         ┌──────────────┴──────────────┐                 │
│         ▼                              ▼                 │
│  ┌─────────────┐              ┌─────────────┐          │
│  │ Node.js #1  │              │ Node.js #2  │          │
│  │ (PM2)       │              │ (PM2)       │          │
│  └─────────────┘              └─────────────┘          │
│         │                              │                 │
│         └──────────────┬───────────────┘                │
│                        ▼                                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database (Primary + Replica)          │ │
│  │  - Encryption at rest (AES-256)                   │ │
│  │  - SSL/TLS for all connections                    │ │
│  │  - Automated daily backups (30-day retention)     │ │
│  │  - Private subnet only (not publicly accessible)  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Scalability

**Current Capacity:**
- Concurrent users: 100-500
- Messages per second: 10-50
- Storage: 1GB (10,000+ user profiles)

**Production Scaling Strategy:**
1. **Horizontal scaling:** Multiple Node.js instances behind load balancer
2. **Database scaling:** PostgreSQL with read replicas for queries
3. **Caching:** Redis for session state and frequent queries
4. **Message queue:** RabbitMQ for async processing of reminders
5. **CDN:** CloudFlare for static assets (if web dashboard added)

**Target Production Capacity:**
- Concurrent users: 10,000+
- Messages per second: 1,000+
- Storage: 100GB+ with auto-scaling
- Uptime SLA: 99.9%

### 6.3 Monitoring and Maintenance

**Health Monitoring:**
- `/health` endpoint checked every 60 seconds
- WhatsApp connection status monitoring
- Database connection pool monitoring
- Disk space and memory usage alerts

**Performance Metrics:**
- Average response time (target: <2 seconds)
- Message delivery success rate (target: >99%)
- User satisfaction (future: post-interaction surveys)

**Logging:**
- Application logs: Pino JSON format
- Error tracking: Sentry integration (production)
- Performance monitoring: New Relic or DataDog (production)

**Backup Strategy:**
- Database backups: Daily full backup, hourly incremental
- Backup retention: 30 days
- Disaster recovery: 4-hour RTO, 1-hour RPO

---

## 7. Future Enhancements

### 7.1 Planned Features (6-12 Months)

1. **Multi-language Support:**
   - Luganda language option
   - Language selection in registration flow
   - Localized tax terminology

2. **Payment Integration:**
   - Mobile money integration (MTN, Airtel)
   - Direct tax payment via chatbot
   - Payment confirmation and receipts

3. **Document Management:**
   - Upload tax documents via WhatsApp
   - OCR for invoice scanning
   - Document storage and retrieval

4. **Advanced Reminders:**
   - Personalized deadline reminders
   - Escalating reminder frequency
   - SMS fallback for critical deadlines

5. **Admin Dashboard:**
   - Web-based admin interface
   - User analytics and reporting
   - System health monitoring
   - Bulk messaging capabilities

### 7.2 Integration Roadmap

| Integration | Timeline | Priority | Dependencies |
|-------------|----------|----------|--------------|
| URA Live API | Q3 2026 | High | Official API credentials |
| NIRA ID Verification | Q4 2026 | Medium | NIRA API access |
| Mobile Money | Q1 2027 | High | MTN/Airtel partnerships |
| SMS Gateway | Q2 2027 | Low | SMS provider contract |
| Web Dashboard | Q3 2027 | Medium | React development |

### 7.3 Research and Innovation

- **AI/NLP Enhancement:** Natural language understanding for free-form queries
- **Voice Interface:** WhatsApp voice message support for low-literacy users
- **Predictive Analytics:** Tax obligation forecasting based on historical data
- **Chatbot Personalization:** Learning user preferences and communication style

---

## 8. Conclusion

The URA Tax Chatbot prototype demonstrates a viable approach to improving tax compliance among Ugandan SMEs through accessible, mobile-first technology. By leveraging WhatsApp's ubiquity and a conversational interface, the system reduces barriers to tax registration and compliance monitoring.

**Key Success Factors:**
- **Accessibility:** Works on any smartphone with WhatsApp
- **Simplicity:** Conversational flow requires no technical training
- **Scalability:** Architecture supports growth from prototype to national deployment
- **Cost-effectiveness:** Prototype phase uses free tools, production costs scale with usage

**Next Steps:**
1. User testing with 50-100 SME owners in Kampala
2. Feedback incorporation and UX refinement
3. URA API integration and security audit
4. Pilot deployment with 1,000 registered businesses
5. National rollout pending pilot success

This system positions Uganda as a leader in digital government services for Africa, demonstrating how conversational AI can bridge the digital divide and improve public service delivery.

---

**Document Prepared By:** URA Digital Transformation Team  
**Technical Lead:** [Name]  
**Date:** May 26, 2026  
**Classification:** Public  
**Distribution:** Uganda Government Digital Registry (GDR) Stakeholders

---

## Appendix A: Government Requirements Compliance Checklist

This appendix explicitly addresses the requirements outlined in the Ministry of ICT and National Guidance's "Why We Request Your System Architecture" document for the Government Systems Prototype Showcase.

### ✅ 1. Main Components of the System

**Requirement:** Show the main components — frontend, backend, database, external services.

**Our System:**
- **Frontend:** WhatsApp Mobile App (Android/iOS) - user interface accessible to all smartphone users
- **Backend:** Node.js Express Server (Port 3001) with modular architecture:
  - WhatsApp Adapter Layer (baileysAdapter.js / whatsappBusinessAdapter.js)
  - Chatbot Core (chatbot.js) - conversation management
  - Business Services (taxEstimator.js, uraApiClient.js, jsonUserStore.js)
- **Database:** 
  - Prototype: JSON files (data/users.json)
  - Production: PostgreSQL 15+ with primary and read replica
- **External Services:** 
  - WhatsApp Platform (Meta) for message delivery
  - URA Tax API for official tax data
  - NIRA (planned) for ID verification
  - Mobile Money APIs (planned) for payments

### ✅ 2. Component Communication

**Requirement:** Show how components communicate, data flow, protocols used.

**Our System:**
- **User → WhatsApp Platform:** HTTPS (port 443), TLS 1.3 + WhatsApp E2E encryption
- **WhatsApp Platform → Backend:** WebSocket/HTTPS (port 3001), TLS 1.2+
- **Backend → Database:** TCP (port 5432), SSL encryption
- **Backend → URA API:** HTTPS (port 443), TLS 1.2+, API key authentication
- **Data Flow:** User message → WhatsApp → Backend → Business Logic → Database → Response generation → WhatsApp → User
- **Message Format:** JSON for all API communications

### ✅ 3. Data Storage and Security

**Requirement:** Show where data is stored and how it is secured, encryption applied.

**Our System:**

**Prototype Storage:**
- **Location:** Local Windows laptop in Uganda (E:\...\data\users.json)
- **Security:** File system permissions (chmod 600), Windows Firewall protection
- **Encryption:** TLS in transit, no encryption at rest (acceptable for prototype with test data)

**Production Storage:**
- **Location:** PostgreSQL database in AWS Cape Town (South Africa) or EU-West (Ireland)
- **Security:** 
  - Encryption at rest: AES-256
  - Encryption in transit: SSL/TLS for all database connections
  - VPC isolation: Database in private subnet, not publicly accessible
  - Access control: Role-based access, principle of least privilege
- **Backups:** Daily full backups, hourly incremental, 30-day retention, encrypted

**Data Categories:**
| Data Type | Classification | Encryption | Access |
|-----------|----------------|------------|--------|
| Phone Numbers | PII (Sensitive) | At rest + in transit | User-specific, hashed in logs |
| TIN Numbers | PII (Sensitive) | At rest + in transit | User-specific, hashed in logs |
| Business Revenue | Confidential | At rest + in transit | User-specific only |
| Tax Estimates | Confidential | At rest + in transit | User-specific only |

### ✅ 4. User Access Method

**Requirement:** Show how users access the system — browser, mobile app, USSD, SMS.

**Our System:**
- **Primary Access:** WhatsApp mobile application (Android/iOS)
- **No web browser required** - fully conversational interface
- **No USSD required** - WhatsApp data or WiFi connection
- **Authentication:** WhatsApp phone number verification (handled by Meta platform)
- **Accessibility:** Works on any smartphone with WhatsApp installed (99% of Ugandan smartphone users)
- **User Experience:** Conversational menu-driven interface, no technical training required

### ✅ 5. External System Integrations

**Requirement:** Show any Government systems or third-party services connected.

**Our System:**

**Current Integrations:**
- **WhatsApp Platform (Meta):** Message delivery and user authentication
- **URA Tax API:** Taxpayer verification, balance inquiry, deadline retrieval (with fallback mode for prototype)

**Planned Integrations:**
- **NIRA (National Identification System):** National ID verification (Q4 2026)
- **Mobile Money APIs:** MTN Mobile Money, Airtel Money for tax payments (Q1 2027)
- **SMS Gateway:** Fallback notifications for critical deadlines (Q2 2027)

**Integration Method:**
- REST APIs with JSON data format
- API key authentication (current), OAuth 2.0 (production)
- Compatible with Uganda's Government API Gateway architecture

### ✅ 6. Hosting and Infrastructure

**Requirement:** Show where the system is hosted — cloud, on-premise, hybrid. Country of hosting.

**Our System:**

**Prototype Hosting:**
- **Environment:** Local development
- **Location:** Windows laptop in Uganda
- **Suitable for:** Development, testing, demonstration (up to 100 users)

**Production Hosting:**
- **Provider:** AWS (primary) or DigitalOcean (alternative)
- **Region:** AWS Cape Town (South Africa) for lowest latency to Uganda
- **Alternative:** EU-West (Ireland) with data processing agreement
- **Data Residency:** Compliant with Uganda Data Protection Act 2019
- **Future Plan:** Migrate to Uganda National Data Center when operational
- **Infrastructure:**
  - Load balancer (Nginx) with SSL termination
  - Multiple Node.js instances (PM2 cluster mode)
  - PostgreSQL database with replication
  - DDoS protection (CloudFlare / AWS Shield)
  - VPC network isolation

### ✅ 7. Authentication and Access Control

**Requirement:** Show how users log in, MFA usage, user role management.

**Our System:**

**User Authentication:**
- **Method:** WhatsApp phone number verification (handled by Meta platform)
- **Single Sign-On:** Users authenticated once by WhatsApp, no separate login required
- **Session Management:** 30-minute timeout for conversation flows
- **Multi-Factor Authentication (MFA):** 
  - Prototype: Not implemented (WhatsApp phone verification serves as single factor)
  - Production: SMS-based OTP planned for high-value transactions

**User Roles:**
- **End Users (SME Owners):**
  - Register tax profile
  - View own profile and data only
  - Estimate tax obligations
  - Check URA balance
  - Receive deadline reminders
- **System Administrators (Production):**
  - Access admin dashboard
  - View system analytics and reports
  - Monitor system health
  - Send bulk messages
  - Access audit logs (with logging of admin actions)

**Access Control:**
- Users can only access their own data (phone number-based isolation)
- No user can view or modify another user's information
- Admin access logged and monitored for compliance

### ✅ 8. Security Controls

**Requirement:** Show encryption in transit and at rest, firewall protections, audit logging.

**Our System:**

**Transport Security:**
- TLS 1.2+ for all HTTPS connections
- WhatsApp end-to-end encryption for all messages
- Certificate pinning in production to prevent MITM attacks
- HSTS headers to enforce HTTPS

**Network Security:**
- **Prototype:** Windows Firewall enabled, port 3001 localhost only
- **Production:**
  - AWS Security Groups / Firewall rules
  - DDoS protection (CloudFlare / AWS Shield)
  - VPC isolation with private subnets for database
  - Intrusion Detection System (IDS)
  - Port restrictions: Only 80/443 exposed publicly
  - IP whitelisting for admin access

**Application Security:**
- Input validation on all user inputs (TIN format, numeric amounts)
- Rate limiting: 100 messages per user per hour
- SQL injection prevention via parameterized queries
- XSS prevention: all user inputs sanitized
- Error handling without information leakage

**Data Security:**
- Encryption at rest: AES-256 (production database)
- Encryption in transit: TLS/SSL for all communications
- File system permissions: chmod 600 (prototype)
- No sensitive data in logs (TINs and phone numbers hashed)
- Regular encrypted backups

**Audit Logging:**
- All user interactions logged with timestamp, user (hashed), message, response, action
- Security events logged (failed auth, suspicious activity)
- Log retention: 2 years for compliance audits
- Admin actions logged separately
- Logs stored securely with restricted access

### ✅ 9. Technology Choices

**Requirement:** Show technologies are appropriate, maintainable, transferable to Government team.

**Our System:**

| Technology | Justification | Maintainability |
|------------|---------------|-----------------|
| **Node.js 22.x** | Modern, widely adopted, excellent for real-time chat applications | Large talent pool in Uganda, active LTS support until 2027 |
| **Express.js 4.21.x** | Industry standard web framework, lightweight, well-documented | Minimal learning curve, extensive community support |
| **PostgreSQL 15+** | Open-source, ACID compliant, proven at scale, government-friendly | No vendor lock-in, widely used in government systems |
| **Baileys (prototype)** | Free WhatsApp integration for development | Easy transition to official WhatsApp Business API |
| **WhatsApp Business API** | Official Meta API with SLA guarantees | Enterprise support, compliance with data protection laws |

**Skills Required:**
- JavaScript/Node.js (common in Uganda's tech workforce)
- SQL/PostgreSQL (standard database skills)
- REST API development (widely taught)
- No proprietary or rare technologies

**Vendor Lock-in:**
- Minimal: All core technologies are open-source
- Database portable (PostgreSQL standard SQL)
- Can migrate between cloud providers (AWS, DigitalOcean, Azure)
- WhatsApp Business API has standard interface

**Government Transferability:**
- Source code documented and modular
- Standard coding practices followed
- Can be maintained by Government IT team with JavaScript/Node.js skills
- No dependencies on specific developer knowledge

### ✅ 10. Scalability and Reliability

**Requirement:** Show system designed to scale, avoid single points of failure.

**Our System:**

**Current Capacity (Prototype):**
- Concurrent users: 100-500
- Messages per second: 10-50
- Storage: 1GB (sufficient for 10,000+ user profiles)

**Production Scaling Strategy:**
1. **Horizontal Scaling:** Multiple Node.js instances behind load balancer (can add more servers as needed)
2. **Database Scaling:** PostgreSQL with read replicas for query distribution
3. **Caching:** Redis for session state and frequent queries (reduces database load)
4. **Message Queue:** RabbitMQ for async processing of reminders (prevents bottlenecks)
5. **Auto-scaling:** Cloud infrastructure scales based on demand

**Target Production Capacity:**
- Concurrent users: 10,000+
- Messages per second: 1,000+
- Storage: 100GB+ with auto-scaling
- Uptime SLA: 99.9% (8.76 hours downtime per year maximum)

**Single Point of Failure Mitigation:**
- **Load Balancer:** Nginx with health checks, automatic failover
- **Application Servers:** Multiple Node.js instances, PM2 auto-restart on failure
- **Database:** Primary + read replica, automated failover
- **Monitoring:** Real-time alerts for component failures
- **Backup:** Daily backups enable 4-hour recovery time objective (RTO)

**Disaster Recovery:**
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour (hourly incremental backups)
- Backup location: Different geographic region from primary

---

### Summary: Full Compliance with Government Requirements

This system has been designed with government deployment in mind from the start. All eight required components are documented, security is built into the architecture (not added as an afterthought), and the technology choices prioritize long-term maintainability over short-term convenience.

The prototype demonstrates feasibility with minimal cost, while the production architecture is designed for national-scale deployment with high availability, security, and compliance with Uganda's data protection laws.

**Ready for:**
- Technical evaluation by Ministry of ICT panel
- Security audit by Government cybersecurity team
- Integration with Uganda's digital government infrastructure
- Pilot deployment with real users
- National rollout pending pilot success

---

**Prepared By:** [Your Name/Organization]  
**Contact:** [Email/Phone]  
**Submission Date:** May 26, 2026  
**Document Classification:** Confidential - For Government Evaluation Only
