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

## Deployment Architecture

### Prototype (Current)
```
┌─────────────────────────┐
│  Windows Laptop         │
│  ┌───────────────────┐  │
│  │ Node.js Process   │  │
│  │ Port: 3001        │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ JSON File Storage │  │
│  │ data/users.json   │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Production (Planned)
```
┌─────────────────────────────────────────┐
│  Cloud Server (AWS/DigitalOcean)        │
│  ┌───────────────────────────────────┐  │
│  │ Nginx (Reverse Proxy)             │  │
│  │ Port: 80/443                      │  │
│  └───────────────────────────────────┘  │
│              │                           │
│              ▼                           │
│  ┌───────────────────────────────────┐  │
│  │ PM2 Process Manager               │  │
│  │ ┌─────────────┐ ┌─────────────┐  │  │
│  │ │ Node.js #1  │ │ Node.js #2  │  │  │
│  │ │ Port: 3001  │ │ Port: 3002  │  │  │
│  │ └─────────────┘ └─────────────┘  │  │
│  └───────────────────────────────────┘  │
│              │                           │
│              ▼                           │
│  ┌───────────────────────────────────┐  │
│  │ PostgreSQL Database               │  │
│  │ Port: 5432                        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
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
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Application Security                              │
│  • Input validation and sanitization                        │
│  • Rate limiting (100 requests/minute per user)             │
│  • Session management                                       │
│  • Error handling without information leakage               │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Data Security                                     │
│  • Data encryption at rest (production)                     │
│  • File system permissions (chmod 600)                      │
│  • No sensitive data in logs                                │
│  • Regular backups with encryption                          │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Access Control                                    │
│  • WhatsApp phone number authentication                     │
│  • User session tracking                                    │
│  • Admin access controls (future)                           │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Monitoring & Audit                                │
│  • Audit logging of all interactions                        │
│  • Error tracking and alerting                              │
│  • Performance monitoring                                   │
│  • Security event logging                                   │
└─────────────────────────────────────────────────────────────┘
```

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
**Last Updated**: May 24, 2026  
**Prepared for**: Uganda Government Digital Registry (GDR) Showcase Application
