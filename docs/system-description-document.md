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

**External API Integration (URA):**

| Method | Endpoint | Purpose | Headers | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/taxpayer/{tin}` | Get taxpayer info | `X-API-Key` | `{ tin, name, status }` |
| GET | `/api/balance/{tin}` | Get tax balance | `X-API-Key` | `{ balance, nextDeadline }` |
| GET | `/api/deadlines` | Get filing deadlines | `X-API-Key` | `{ deadlines[] }` |

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
- Admin access controls for production dashboard (future)

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

---

## 6. Deployment and Operations

### 6.1 Deployment Architecture

**Prototype (Current):**
- Single Windows laptop running Node.js
- Local JSON file storage
- Baileys WhatsApp connection via QR code
- Manual startup and monitoring

**Production (Planned):**
```
┌─────────────────────────────────────────────────────────┐
│  Cloud Provider (AWS/DigitalOcean)                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Load Balancer (Nginx)                            │ │
│  │  - SSL termination (Let's Encrypt)                │ │
│  │  - Request routing                                │ │
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
**Date:** May 25, 2026  
**Classification:** Public  
**Distribution:** Uganda Government Digital Registry (GDR) Stakeholders
