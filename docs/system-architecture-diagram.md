# URA Tax Chatbot - System Architecture Diagram

## Visual Representation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER LAYER                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  👤 SME Business Owners                                           │  │
│  │  📱 WhatsApp Mobile App (Android/iOS)                            │  │
│  │  💬 Send: Tax queries, business info, registration requests      │  │
│  │  📨 Receive: Tax estimates, reminders, compliance guidance       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/TLS Encrypted
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    WHATSAPP PLATFORM (Meta)                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  WhatsApp Business API / Baileys Adapter                         │  │
│  │  • Message routing                                                │  │
│  │  • Phone number verification                                     │  │
│  │  • Media handling                                                │  │
│  │  • Delivery status tracking                                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ WebSocket/HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Backend)                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Node.js Express Server (Port 3001)                              │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │  WhatsApp Adapter Layer                                     │ │  │
│  │  │  • baileysAdapter.js (Prototype)                           │ │  │
│  │  │  • whatsappBusinessAdapter.js (Production)                 │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │  Chatbot Core (chatbot.js)                                 │ │  │
│  │  │  • Natural language processing                             │ │  │
│  │  │  • Conversation state management                           │ │  │
│  │  │  • Command routing                                         │ │  │
│  │  │  • Response generation                                     │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │  Business Logic Services                                   │ │  │
│  │  │  • taxEstimator.js - Tax calculations                     │ │  │
│  │  │  • uraApiClient.js - URA integration                      │ │  │
│  │  │  • jsonUserStore.js - User data management                │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │  API Endpoints                                             │ │  │
│  │  │  • GET /health - Health check                             │ │  │
│  │  │  • POST /simulate-message - Testing endpoint              │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                    │                           │
                    │                           │
        ┌───────────▼──────────┐    ┌──────────▼────────────┐
        │   DATA LAYER         │    │  EXTERNAL SERVICES    │
        │                      │    │                       │
        │  ┌────────────────┐ │    │  ┌─────────────────┐ │
        │  │ JSON Storage   │ │    │  │ URA API         │ │
        │  │ (Prototype)    │ │    │  │ • Tax rates     │ │
        │  │                │ │    │  │ • Deadlines     │ │
        │  │ users.json     │ │    │  │ • TIN verify    │ │
        │  │ • User profiles│ │    │  └─────────────────┘ │
        │  │ • Conversations│ │    │                       │
        │  │ • Tax data     │ │    │  ┌─────────────────┐ │
        │  └────────────────┘ │    │  │ NIRA (Future)   │ │
        │                      │    │  │ • ID verify     │ │
        │  ┌────────────────┐ │    │  └─────────────────┘ │
        │  │ PostgreSQL     │ │    │                       │
        │  │ (Production)   │ │    │  ┌─────────────────┐ │
        │  │                │ │    │  │ Mobile Money    │ │
        │  │ Tables:        │ │    │  │ (Future)        │ │
        │  │ • users        │ │    │  │ • Payments      │ │
        │  │ • messages     │ │    │  └─────────────────┘ │
        │  │ • tax_records  │ │    │                       │
        │  │ • audit_logs   │ │    └───────────────────────┘
        │  └────────────────┘ │
        └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Current: Local Development (Windows)                            │  │
│  │  Production: Cloud Hosting (AWS/DigitalOcean)                    │  │
│  │  • Ubuntu Linux Server                                           │  │
│  │  • PM2 Process Manager                                           │  │
│  │  • Nginx Reverse Proxy                                           │  │
│  │  • SSL/TLS Certificates (Let's Encrypt)                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYER (Cross-cutting)                        │
│  • TLS/HTTPS encryption for all communications                          │
│  • WhatsApp end-to-end encryption                                       │
│  • File system permissions for data storage                             │
│  • Audit logging of all user interactions                               │
│  • Input validation and sanitization                                    │
│  • Rate limiting to prevent abuse                                       │
│  • Compliance with Uganda Data Protection Act 2019                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER INTERACTION FLOW:
═══════════════════════

1. User sends message
   │
   ├─→ "Hello" / "Help"
   │   └─→ Welcome message + menu
   │
   ├─→ "Estimate tax"
   │   └─→ Collect: revenue, expenses, business type
   │       └─→ Calculate tax
   │           └─→ Return estimate + filing info
   │
   ├─→ "Register business"
   │   └─→ Collect: business details
   │       └─→ Guide through URA registration
   │
   └─→ "Deadline"
       └─→ Return next tax deadline


TECHNICAL DATA FLOW:
═══════════════════

┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│ User    │ Message │ WhatsApp │ Webhook │ Backend │ Process │ Database │
│ Phone   ├────────→│ Platform ├────────→│ Server  ├────────→│ Storage  │
└─────────┘         └──────────┘         └─────────┘         └──────────┘
     ▲                                         │                    │
     │                                         │                    │
     │              ┌──────────────────────────┘                    │
     │              │                                               │
     │              ▼                                               │
     │         ┌─────────┐                                         │
     │         │ Chatbot │                                         │
     │         │ Logic   │◄────────────────────────────────────────┘
     │         └─────────┘
     │              │
     │              ▼
     │         ┌─────────┐
     │         │ Generate│
     │         │ Response│
     │         └─────────┘
     │              │
     └──────────────┘
        Response sent back
```

## Component Communication Protocols

| Source | Destination | Protocol | Port | Encryption |
|--------|-------------|----------|------|------------|
| User WhatsApp | WhatsApp Platform | HTTPS | 443 | TLS 1.3 + E2E |
| WhatsApp Platform | Backend Server | WebSocket/HTTPS | 3001 | TLS 1.2+ |
| Backend | Database | TCP | 5432 | SSL |
| Backend | URA API | HTTPS | 443 | TLS 1.2+ |
| Backend | File Storage | File I/O | N/A | OS Permissions |

## Authentication and Access Control

### Current Implementation (Prototype)
- **Primary Authentication:** WhatsApp phone number verification (handled by Meta platform)
- **Session Management:** Phone number-based user identification with 30-minute session timeout
- **Multi-Factor Authentication:** Not implemented in prototype (WhatsApp phone verification serves as single factor)
- **User Roles:** 
  - **End Users (SME Owners):** Can register, view own profile, estimate tax, check balance
  - **System Admin (Future):** Will have access to user analytics, system monitoring, bulk messaging

### Production Enhancement (Planned)
- **MFA:** Optional SMS-based OTP for high-value transactions
- **Role-Based Access Control (RBAC):** Admin dashboard with granular permissions
- **Audit Trail:** All user actions logged with timestamp and phone number (hashed)

## API Exposure and Integration Capabilities

### APIs Exposed by This System

| Endpoint | Method | Purpose | Authentication | Consumers |
|----------|--------|---------|----------------|-----------|
| `/health` | GET | System health check | None (public) | Monitoring tools, load balancers |
| `/simulate-message` | POST | Testing endpoint (prototype only) | None | Development/testing |
| `/webhook` | POST | WhatsApp Business webhook (production) | WhatsApp signature verification | Meta WhatsApp Platform |
| `/api/v1/tax-estimate` | POST | Tax estimation service (future) | API key | Other government systems |
| `/api/v1/user-profile` | GET | Retrieve user tax profile (future) | OAuth 2.0 | URA systems, authorized govt services |

### APIs Consumed by This System

| External System | Endpoint | Purpose | Authentication |
|-----------------|----------|---------|----------------|
| URA Tax API | `/api/taxpayer/{tin}` | Taxpayer verification | API Key (X-API-Key header) |
| URA Tax API | `/api/balance/{tin}` | Tax balance inquiry | API Key |
| WhatsApp Business API | Meta Graph API | Send/receive messages | Access token |
| NIRA (Planned) | `/api/verify-nin` | National ID verification | Government API key |

### Integration Standards
- **Data Format:** JSON (REST APIs)
- **Authentication:** API keys (current), OAuth 2.0 (production)
- **Rate Limiting:** 100 requests/minute per API key
- **Versioning:** URL-based versioning (`/api/v1/`)
- **Government Integration Layer:** Compatible with Uganda's Government API Gateway (future integration)

## Deployment Architecture

### Prototype (Current)
```
┌─────────────────────────────────────────┐
│  Local Development Environment          │
│  Location: Windows Laptop (Uganda)      │
│  ┌───────────────────────────────────┐  │
│  │ Node.js Process                   │  │
│  │ Port: 3001                        │  │
│  │ Runtime: Node.js 22.x             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ JSON File Storage                 │  │
│  │ Location: E:\...\data\users.json  │  │
│  │ Permissions: User-only (chmod 600)│  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Network Security                  │  │
│  │ • Windows Firewall enabled        │  │
│  │ • Port 3001 localhost only        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Production (Planned)
```
┌──────────────────────────────────────────────────────────┐
│  Cloud Infrastructure                                    │
│  Provider: AWS (Primary) / DigitalOcean (Alternative)    │
│  Region: EU-West (Ireland) or Africa (Cape Town)         │
│  Data Residency: Compliant with Uganda Data Protection   │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Network Security Layer                             │  │
│  │ • AWS Security Groups / Firewall Rules             │  │
│  │ • DDoS Protection (AWS Shield / CloudFlare)        │  │
│  │ • VPC with private subnets for database            │  │
│  │ • Intrusion Detection System (IDS)                 │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Nginx (Reverse Proxy & Load Balancer)             │  │
│  │ Port: 80/443                                       │  │
│  │ SSL: Let's Encrypt (Auto-renewal)                 │  │
│  │ Rate Limiting: 100 req/min per IP                 │  │
│  └────────────────────────────────────────────────────┘  │
│              │                                            │
│              ▼                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ PM2 Process Manager (Cluster Mode)                │  │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │  │
│  │ │ Node.js #1  │ │ Node.js #2  │ │ Node.js #3  │  │  │
│  │ │ Port: 3001  │ │ Port: 3002  │ │ Port: 3003  │  │  │
│  │ └─────────────┘ └─────────────┘ └─────────────┘  │  │
│  │ Auto-restart on failure | Zero-downtime deploys  │  │
│  └────────────────────────────────────────────────────┘  │
│              │                                            │
│              ▼                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database (RDS / Managed)                │  │
│  │ Port: 5432 (Private subnet only)                  │  │
│  │ • Primary + Read Replica                          │  │
│  │ • Automated daily backups (30-day retention)      │  │
│  │ • Encryption at rest (AES-256)                    │  │
│  │ • SSL/TLS for all connections                     │  │
│  │ • Point-in-time recovery enabled                  │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Monitoring & Logging                               │  │
│  │ • CloudWatch / Prometheus for metrics              │  │
│  │ • Centralized logging (ELK Stack / CloudWatch)     │  │
│  │ • Uptime monitoring (Pingdom / UptimeRobot)        │  │
│  │ • Security audit logs (2-year retention)           │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘

**Hosting Considerations:**
- **Data Sovereignty:** Preference for Uganda-based hosting when available
- **Current Options:** AWS Cape Town (South Africa) for lowest latency to Uganda
- **Fallback:** EU-West (Ireland) with data processing agreement
- **Future:** Uganda National Data Center when operational
```

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 22.x | JavaScript execution |
| Framework | Express.js | 4.21.x | Web server |
| WhatsApp | Baileys | 7.0.x | WhatsApp integration (prototype) |
| WhatsApp | WhatsApp Business API | Latest | Production integration |
| Database | JSON | N/A | Prototype storage |
| Database | PostgreSQL | 15+ | Production storage |
| Process Manager | PM2 | Latest | Production process management |
| Reverse Proxy | Nginx | Latest | Load balancing, SSL termination |
| Version Control | Git/GitHub | Latest | Source code management |

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Transport Security                                │
│  • TLS 1.2+ for all HTTPS connections                       │
│  • WhatsApp E2E encryption                                  │
│  • Certificate pinning (production)                         │
│  • HSTS headers to enforce HTTPS                            │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Network Security                                  │
│  • Firewall rules (Windows Firewall / AWS Security Groups)  │
│  • Port restrictions (only 80/443 exposed publicly)         │
│  • DDoS protection (CloudFlare / AWS Shield)                │
│  • VPC isolation for database (production)                  │
│  • IP whitelisting for admin access (production)            │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Application Security                              │
│  • Input validation and sanitization                        │
│  • Rate limiting (100 requests/minute per user)             │
│  • Session management with timeout (30 minutes)             │
│  • Error handling without information leakage               │
│  • SQL injection prevention (parameterized queries)         │
│  • XSS protection (input sanitization)                      │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Data Security                                     │
│  • Data encryption at rest (AES-256 in production)          │
│  • File system permissions (chmod 600 for prototype)        │
│  • Database encryption (PostgreSQL TDE in production)       │
│  • No sensitive data in logs (TINs hashed)                  │
│  • Regular encrypted backups (daily, 30-day retention)      │
│  • PII data classification and handling                     │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Access Control                                    │
│  • WhatsApp phone number authentication                     │
│  • User session tracking                                    │
│  • Role-based access control (RBAC) for admin (production)  │
│  • Principle of least privilege                             │
│  • MFA for admin access (production)                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 6: Monitoring & Audit                                │
│  • Audit logging of all interactions                        │
│  • Security event logging (failed auth, suspicious activity)│
│  • Error tracking and alerting                              │
│  • Performance monitoring                                   │
│  • Log retention: 2 years for compliance                    │
│  • Real-time security alerts                                │
└─────────────────────────────────────────────────────────────┘
```

### Data Classification and Protection

| Data Category | Classification | Storage | Encryption | Access Control |
|---------------|----------------|---------|------------|----------------|
| Phone Numbers | PII (Sensitive) | Database | At rest + in transit | User-specific, hashed in logs |
| TIN Numbers | PII (Sensitive) | Database | At rest + in transit | User-specific, hashed in logs |
| Business Revenue | Confidential | Database | At rest + in transit | User-specific only |
| Tax Estimates | Confidential | Database | At rest + in transit | User-specific only |
| Conversation Logs | Confidential | Database | At rest + in transit | User + Admin (audit only) |
| System Logs | Internal | Log files | In transit | Admin only |

### Compliance Framework
- **Uganda Data Protection Act 2019:** Full compliance
- **WhatsApp Business Policy:** Opt-in messaging, 24-hour window
- **URA Data Handling:** 7-year retention for tax records
- **ISO 27001 Alignment:** Security controls mapped to ISO standards (production)

## Scalability Considerations

### Current Capacity
- **Concurrent Users**: 100-500
- **Messages/Second**: 10-50
- **Storage**: 1GB (sufficient for 10,000+ users)

### Production Scaling Strategy
1. **Horizontal Scaling**: Multiple Node.js instances behind load balancer
2. **Database Scaling**: PostgreSQL with read replicas
3. **Caching**: Redis for session management and frequent queries
4. **CDN**: Static assets delivery (if web dashboard added)
5. **Message Queue**: RabbitMQ/Redis for async processing

### Target Production Capacity
- **Concurrent Users**: 10,000+
- **Messages/Second**: 1,000+
- **Storage**: 100GB+ with auto-scaling
- **Uptime**: 99.9% SLA

---

**Document Version**: 1.0  
**Last Updated**: May 26, 2026  
**Prepared for**: Uganda Government Digital Registry (GDR) Showcase Application

---

## Government Requirements Compliance Checklist

This section explicitly addresses the requirements outlined in the Ministry of ICT and National Guidance's "Why We Request Your System Architecture" document:

### ✅ Main Components of the System
- **Frontend:** WhatsApp Mobile App (Android/iOS) - user interface
- **Backend:** Node.js Express Server with Baileys/WhatsApp Business API adapter
- **Database:** JSON files (prototype) / PostgreSQL (production)
- **External Services:** URA API, WhatsApp Platform, NIRA (planned), Mobile Money (planned)

### ✅ Component Communication
- **Protocols:** HTTPS, WebSocket, TLS 1.2+, WhatsApp E2E encryption
- **Data Flow:** User → WhatsApp Platform → Backend Server → Database/URA API
- **Message Exchange:** Tax queries, registration data, estimates, reminders

### ✅ Data Storage and Security
- **Prototype:** JSON files on local Windows laptop with file system permissions (chmod 600)
- **Production:** PostgreSQL with encryption at rest (AES-256) and in transit (SSL/TLS)
- **Data Categories:** Phone numbers (PII), TIN numbers (PII), business revenue (confidential), tax estimates (confidential)
- **Security Controls:** Input validation, rate limiting, audit logging, encrypted backups

### ✅ User Access Method
- **Primary Channel:** WhatsApp mobile application (Android/iOS)
- **Authentication:** WhatsApp phone number verification (handled by Meta)
- **Session Management:** 30-minute timeout with phone-based identification
- **No web browser or USSD required** - fully WhatsApp-based

### ✅ External System Integrations
- **Current:** WhatsApp Platform (Meta), URA Tax API (with fallback mode)
- **Planned:** NIRA (National ID verification), Mobile Money APIs (MTN, Airtel)
- **Integration Method:** REST APIs with JSON data format, API key authentication

### ✅ Hosting and Infrastructure
- **Prototype:** Local Windows laptop in Uganda
- **Production:** AWS Cape Town (South Africa) or EU-West (Ireland) with data processing agreement
- **Future:** Uganda National Data Center when operational
- **Data Residency:** Compliant with Uganda Data Protection Act 2019

### ✅ Authentication and Access Control
- **User Authentication:** WhatsApp phone number (single factor in prototype)
- **MFA:** Planned for production (SMS-based OTP for high-value transactions)
- **User Roles:** End users (SME owners) and System Admin (production)
- **Access Control:** Role-based access control (RBAC) in production

### ✅ APIs Exposed and Consumed
- **APIs Exposed:** `/health`, `/webhook`, `/api/v1/tax-estimate` (future), `/api/v1/user-profile` (future)
- **APIs Consumed:** URA Tax API, WhatsApp Business API, NIRA API (planned)
- **Standards:** REST, JSON, OAuth 2.0 (production), API versioning
- **Government Integration:** Compatible with Uganda's Government API Gateway

### ✅ Security Controls
- **Transport:** TLS 1.2+, WhatsApp E2E encryption, HSTS headers
- **Network:** Firewall rules, DDoS protection, VPC isolation (production)
- **Application:** Input validation, rate limiting, SQL injection prevention, XSS protection
- **Data:** Encryption at rest and in transit, PII hashing in logs
- **Audit:** All interactions logged with 2-year retention

### ✅ Technology Choices
- **Runtime:** Node.js 22.x (open-source, widely supported, active maintenance)
- **Framework:** Express.js 4.21.x (industry standard, large community)
- **Database:** PostgreSQL 15+ (open-source, ACID compliant, government-friendly)
- **Skills Required:** JavaScript/Node.js (common in Uganda's tech workforce)
- **Vendor Lock-in:** Minimal - all core technologies are open-source and portable

### ✅ Scalability and Reliability
- **Current Capacity:** 100-500 concurrent users, 10-50 messages/second
- **Production Target:** 10,000+ concurrent users, 1,000+ messages/second
- **Scaling Strategy:** Horizontal scaling with load balancer, database read replicas, Redis caching
- **High Availability:** Multiple Node.js instances, automated failover, 99.9% uptime SLA
- **Single Point of Failure Mitigation:** Load balancer, database replication, PM2 auto-restart

---

**Prepared By:** [Your Name/Organization]  
**Contact:** [Email/Phone]  
**Submission Date:** May 26, 2026  
**Classification:** Confidential - For Government Evaluation Only
