# FleetSure - API Specification

> RESTful API design for FleetSure backend. All endpoints return JSON. All money values are integers (cents).

---

## 🔑 Authentication

### Base URL
```
Production: https://api.fleetsure.co
Development: http://localhost:3001
```

### Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
X-Request-ID: <uuid>  # Optional, for tracing
```

### Token Refresh
Access tokens expire in 15 minutes. Use refresh token to get new access token.

---

## 📋 API Endpoints Overview

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | 6 | Login, register, tokens, password |
| Fleet | 8 | Fleet management, dispatchers |
| Vehicle | 5 | Vehicle CRUD |
| Job | 12 | Job lifecycle |
| Mechanic | 8 | Mechanic management |
| Runner | 6 | Runner and tasks |
| Parts | 5 | Parts requests and fulfillment |
| Billing | 6 | Invoices and payments |
| Admin | 8 | Admin dashboard |

---

## 🔐 AUTH ENDPOINTS

### POST /auth/login
Login with email/password

**Request:**
```json
{
  "email": "dispatcher@fleet.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
  "expiresIn": 900,
  "user": {
    "id": "clx123abc",
    "email": "dispatcher@fleet.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FLEET_DISPATCHER",
    "fleetId": "clx456def"
  }
}
```

### POST /auth/register
Register new user (fleet signup)

**Request:**
```json
{
  "email": "owner@newfleet.com",
  "password": "securepassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+12065551234",
  "fleetName": "Northwest Trucking LLC",
  "role": "FLEET_OWNER"
}
```

### POST /auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

### POST /auth/logout
Revoke refresh token

### POST /auth/forgot-password
Request password reset

### POST /auth/reset-password
Reset password with token

---

## 🏢 FLEET ENDPOINTS

### GET /fleets/me
Get current fleet details (for logged-in fleet user)

**Response (200):**
```json
{
  "id": "clx456def",
  "name": "Northwest Trucking LLC",
  "billingEmail": "billing@nwtrucking.com",
  "phone": "+12065551234",
  "address": "123 Industrial Way",
  "city": "Seattle",
  "state": "WA",
  "zipCode": "98101",
  "contractType": "per_truck",
  "perTruckRateCents": 75000,
  "vehicleCount": 45,
  "dispatcherCount": 3,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### PATCH /fleets/me
Update fleet profile

### GET /fleets/me/dispatchers
List dispatchers for fleet

### POST /fleets/me/dispatchers
Add dispatcher to fleet

**Request:**
```json
{
  "email": "newdispatcher@nwtrucking.com",
  "firstName": "Mike",
  "lastName": "Johnson",
  "phone": "+12065559876"
}
```

### DELETE /fleets/me/dispatchers/:id
Remove dispatcher

### GET /fleets/me/stats
Get fleet statistics

**Response (200):**
```json
{
  "period": "2024-01",
  "totalJobs": 127,
  "completedJobs": 119,
  "cancelledJobs": 8,
  "averageResponseMinutes": 42,
  "slaCompliancePercent": 94.5,
  "totalSpentCents": 15750000,
  "jobsByStatus": {
    "REQUESTED": 2,
    "ASSIGNED": 1,
    "EN_ROUTE": 3,
    "ON_SITE": 2,
    "COMPLETED": 119
  }
}
```

---

## 🚛 VEHICLE ENDPOINTS

### GET /vehicles
List vehicles for fleet

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (unit number, VIN, plate)
- `isActive` (true/false)

**Response (200):**
```json
{
  "data": [
    {
      "id": "clx789ghi",
      "unitNumber": "T-101",
      "vin": "1HGBH41JXMN109186",
      "make": "Freightliner",
      "model": "Cascadia",
      "year": 2022,
      "licensePlate": "ABC1234",
      "state": "WA",
      "vehicleType": "truck",
      "engineType": "diesel",
      "isActive": true,
      "jobCount": 12
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### POST /vehicles
Add vehicle

**Request:**
```json
{
  "unitNumber": "T-102",
  "vin": "1HGBH41JXMN109187",
  "make": "Kenworth",
  "model": "T680",
  "year": 2023,
  "licensePlate": "XYZ5678",
  "state": "WA",
  "vehicleType": "truck",
  "engineType": "diesel"
}
```

### GET /vehicles/:id
Get vehicle details

### PATCH /vehicles/:id
Update vehicle

### DELETE /vehicles/:id
Deactivate vehicle (soft delete)

---

## 📋 JOB ENDPOINTS

### GET /jobs
List jobs (filtered by role)

**Query params:**
- `page`, `limit`
- `status` (comma-separated: `REQUESTED,ASSIGNED`)
- `urgency` (`STANDARD`, `PRIORITY`, `EMERGENCY`)
- `dateFrom`, `dateTo`
- `vehicleId`
- `mechanicId` (admin only)

**Response (200):**
```json
{
  "data": [
    {
      "id": "clxjob001",
      "jobNumber": "FS-2024-00127",
      "status": "EN_ROUTE",
      "urgency": "EMERGENCY",
      "jobType": "ROADSIDE",
      "issueType": "electrical",
      "issueDescription": "Truck won't start, no power",
      "vehicle": {
        "id": "clx789ghi",
        "unitNumber": "T-101",
        "make": "Freightliner",
        "model": "Cascadia"
      },
      "location": {
        "latitude": 47.6062,
        "longitude": -122.3321,
        "address": "I-5 Northbound, Mile Marker 165",
        "city": "Seattle",
        "state": "WA"
      },
      "mechanic": {
        "id": "clxmech01",
        "firstName": "Bob",
        "lastName": "Smith",
        "phone": "+12065551111",
        "currentLatitude": 47.5980,
        "currentLongitude": -122.3310,
        "etaMinutes": 12
      },
      "sla": {
        "requestedAt": "2024-01-20T14:30:00Z",
        "targetArrivalAt": "2024-01-20T15:30:00Z",
        "elapsedMinutes": 15,
        "remainingMinutes": 45,
        "isAtRisk": false
      },
      "pricing": {
        "estimatedLaborCents": 35000,
        "partsTotalCents": 0
      },
      "createdAt": "2024-01-20T14:30:00Z"
    }
  ],
  "meta": { ... }
}
```

### POST /jobs
Create job request

**Request:**
```json
{
  "vehicleId": "clx789ghi",
  "location": {
    "latitude": 47.6062,
    "longitude": -122.3321,
    "address": "I-5 Northbound, Mile Marker 165",
    "notes": "Shoulder near exit ramp"
  },
  "issueType": "electrical",
  "issueDescription": "Truck won't start, clicking sound when turning key",
  "urgency": "EMERGENCY",
  "jobType": "ROADSIDE"
}
```

**Response (201):**
```json
{
  "id": "clxjob001",
  "jobNumber": "FS-2024-00128",
  "status": "REQUESTED",
  "estimatedArrivalMinutes": 45,
  "estimatedLaborCents": 35000,
  "message": "Job created. Assigning mechanic..."
}
```

### GET /jobs/:id
Get job details

### PATCH /jobs/:id/status
Update job status (mechanic/admin)

**Request:**
```json
{
  "status": "ON_SITE",
  "notes": "Arrived at location, assessing issue"
}
```

### POST /jobs/:id/cancel
Cancel job

**Request:**
```json
{
  "reason": "Driver was able to start truck"
}
```

### POST /jobs/:id/assign
Assign mechanic (admin)

**Request:**
```json
{
  "mechanicId": "clxmech01"
}
```

### POST /jobs/:id/accept
Accept job (mechanic)

### POST /jobs/:id/decline
Decline job (mechanic)

**Request:**
```json
{
  "reason": "Too far from current location"
}
```

### POST /jobs/:id/photos
Upload job photo

**Request (multipart/form-data):**
- `photo`: File
- `photoType`: `before` | `during` | `after` | `damage`
- `caption`: Optional string

### GET /jobs/:id/history
Get job status history

**Response (200):**
```json
{
  "data": [
    {
      "id": "clxhist01",
      "fromStatus": "ASSIGNED",
      "toStatus": "ACCEPTED",
      "changedBy": "Bob Smith",
      "changedByType": "MECHANIC",
      "reason": null,
      "createdAt": "2024-01-20T14:35:00Z"
    },
    {
      "id": "clxhist02",
      "fromStatus": null,
      "toStatus": "REQUESTED",
      "changedBy": "System",
      "changedByType": "SYSTEM",
      "createdAt": "2024-01-20T14:30:00Z"
    }
  ]
}
```

### GET /jobs/active
Get active jobs for current user (mechanic dashboard)

---

## 🔧 MECHANIC ENDPOINTS

### POST /mechanics/auth/login
Mechanic login (separate auth flow)

### POST /mechanics/auth/register
Mechanic registration/onboarding

**Request:**
```json
{
  "email": "bob@mechanicpro.com",
  "password": "securepassword",
  "firstName": "Bob",
  "lastName": "Smith",
  "phone": "+12065551111",
  "businessName": "Bob's Diesel Repair",
  "serviceRegions": ["SEA", "TAC"],
  "certifications": [
    {
      "certType": "ASE",
      "certNumber": "ASE-12345",
      "expiresAt": "2025-06-01"
    }
  ]
}
```

### GET /mechanics/me
Get mechanic profile

### PATCH /mechanics/me
Update mechanic profile

### PATCH /mechanics/me/location
Update current location

**Request:**
```json
{
  "latitude": 47.5980,
  "longitude": -122.3310
}
```

### PATCH /mechanics/me/availability
Set availability status

**Request:**
```json
{
  "isAvailable": true,
  "isOnline": true
}
```

### GET /mechanics/me/earnings
Get earnings summary

**Response (200):**
```json
{
  "period": "2024-01",
  "totalEarningsCents": 875000,
  "completedJobs": 23,
  "averageJobCents": 38043,
  "pendingPayoutCents": 125000,
  "nextPayoutDate": "2024-02-01"
}
```

### GET /mechanics/me/jobs
Get mechanic's job history

---

## 🏃 RUNNER ENDPOINTS

### POST /runners/auth/login
Runner login

### GET /runners/me
Get runner profile

### PATCH /runners/me/location
Update location

### PATCH /runners/me/availability
Set availability

### GET /runners/tasks
Get assigned tasks

**Response (200):**
```json
{
  "data": [
    {
      "id": "clxtask01",
      "taskNumber": "RT-2024-00045",
      "status": "ACCEPTED",
      "pickup": {
        "latitude": 47.4502,
        "longitude": -122.3088,
        "address": "NAPA Auto Parts, 1234 Main St, Kent WA",
        "notes": "Ask for order #12345"
      },
      "delivery": {
        "latitude": 47.6062,
        "longitude": -122.3321,
        "address": "I-5 MM 165 - Mechanic Bob Smith",
        "notes": "Meet at truck on shoulder"
      },
      "parts": [
        {
          "name": "Alternator - Delco 24SI",
          "partNumber": "DR-2401",
          "quantity": 1
        }
      ],
      "estimatedDistanceMiles": 12.5,
      "estimatedDurationMinutes": 25,
      "paymentCents": 3500
    }
  ]
}
```

### PATCH /runners/tasks/:id/status
Update task status

**Request:**
```json
{
  "status": "PICKED_UP",
  "notes": "Got the part, heading to delivery"
}
```

### POST /runners/tasks/:id/proof
Upload proof photo

---

## 🔩 PARTS ENDPOINTS

### POST /jobs/:jobId/parts
Request part for job (mechanic)

**Request:**
```json
{
  "name": "Alternator",
  "partNumber": "DR-2401",
  "description": "Delco 24SI replacement",
  "quantity": 1,
  "preferredVendor": "NAPA",
  "fulfillmentType": "RUNNER_DELIVERY"
}
```

### GET /jobs/:jobId/parts
List parts for job

### PATCH /parts/:id
Update part details

### PATCH /parts/:id/status
Update part status

### GET /parts/vendors
List available vendors

**Query params:**
- `latitude`, `longitude` (for nearest)
- `limit`

**Response (200):**
```json
{
  "data": [
    {
      "id": "clxvend01",
      "name": "NAPA Auto Parts - Kent",
      "code": "NAPA",
      "address": "1234 Main St, Kent, WA 98032",
      "phone": "+12538591234",
      "distanceMiles": 2.3,
      "isOpen": true,
      "closesAt": "18:00"
    }
  ]
}
```

---

## 💳 BILLING ENDPOINTS

### GET /invoices
List invoices for fleet

**Query params:**
- `page`, `limit`
- `status` (`DRAFT`, `SENT`, `PAID`, `OVERDUE`)
- `dateFrom`, `dateTo`

### GET /invoices/:id
Get invoice details

**Response (200):**
```json
{
  "id": "clxinv001",
  "invoiceNumber": "INV-2024-00012",
  "status": "SENT",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31",
  "subtotalCents": 1575000,
  "taxCents": 0,
  "totalCents": 1575000,
  "lineItems": [
    {
      "description": "Emergency roadside - Job FS-2024-00100",
      "quantity": 1,
      "unitPriceCents": 85000,
      "totalCents": 85000,
      "jobId": "clxjob100"
    },
    {
      "description": "Parts - Alternator",
      "quantity": 1,
      "unitPriceCents": 45000,
      "totalCents": 45000
    }
  ],
  "issuedAt": "2024-02-01T00:00:00Z",
  "dueAt": "2024-03-01T00:00:00Z",
  "paidAt": null
}
```

### GET /invoices/:id/pdf
Download invoice PDF

### POST /invoices/:id/pay
Initiate payment

**Response (200):**
```json
{
  "clientSecret": "pi_1234_secret_5678",
  "paymentIntentId": "pi_1234"
}
```

### GET /billing/payment-methods
List saved payment methods

### POST /billing/payment-methods
Add payment method

---

## 👨‍💼 ADMIN ENDPOINTS

### GET /admin/dashboard
Get admin dashboard stats

**Response (200):**
```json
{
  "activeJobs": 12,
  "availableMechanics": 18,
  "availableRunners": 3,
  "slaAtRisk": 2,
  "today": {
    "jobsCreated": 34,
    "jobsCompleted": 31,
    "averageResponseMinutes": 38,
    "slaCompliancePercent": 97.1
  },
  "alerts": [
    {
      "type": "SLA_AT_RISK",
      "jobId": "clxjob201",
      "jobNumber": "FS-2024-00201",
      "remainingMinutes": 8,
      "message": "Job FS-2024-00201 may breach SLA"
    }
  ]
}
```

### GET /admin/jobs
List all jobs (with advanced filters)

### POST /admin/jobs/:id/reassign
Reassign job to different mechanic

### GET /admin/mechanics
List all mechanics

### PATCH /admin/mechanics/:id/approve
Approve mechanic

### GET /admin/runners
List all runners

### GET /admin/fleets
List all fleets

### GET /admin/sla/report
Get SLA performance report

---

## 🔄 WEBSOCKET EVENTS

### Connection
```javascript
const socket = io('wss://api.fleetsure.co', {
  auth: { token: accessToken }
});
```

### Events (Server → Client)

| Event | Payload | Description |
|-------|---------|-------------|
| `job:created` | Job object | New job created |
| `job:updated` | Job object | Job status changed |
| `job:assigned` | Job + Mechanic | Job assigned to mechanic |
| `mechanic:location` | {id, lat, lng} | Mechanic location update |
| `runner:location` | {id, lat, lng} | Runner location update |
| `part:status` | Part object | Part status changed |
| `sla:warning` | {jobId, remaining} | SLA at risk |
| `sla:breach` | {jobId} | SLA breached |

### Events (Client → Server)

| Event | Payload | Description |
|-------|---------|-------------|
| `subscribe:job` | {jobId} | Subscribe to job updates |
| `subscribe:fleet` | {fleetId} | Subscribe to fleet updates |
| `location:update` | {lat, lng} | Update own location |

---

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "requestId": "req_abc123"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Rate Limited |
| 500 | Server Error |

---

## 🚦 Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| Auth endpoints | 10/min |
| Read endpoints | 100/min |
| Write endpoints | 30/min |
| File uploads | 10/min |
| WebSocket messages | 60/min |

---

*Continue to USER_FLOWS.md for UX journeys →*
