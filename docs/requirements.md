# Requirements Document — Hotel Reservation System

## Functional Requirements

### Group: Guest Registration

| ID | Name | Description |
|----|------|-------------|
| RF0101 | Register guest | The system must allow the registration of guests. |
| RF0102 | Update guest registration | The system must allow updating guest registration data. |
| RF0103 | Deactivate guest registration | The system must allow the deactivation of guests. |
| RF0104 | Query guests | The system must allow querying guests using user-defined filters. |

### Group: Room Registration

| ID | Name | Description |
|----|------|-------------|
| RF0111 | Register room | The system must allow the registration of hotel rooms. |
| RF0112 | Update room registration | The system must allow updating room data. |
| RF0113 | Deactivate room registration | The system must allow the deactivation of rooms. |
| RF0114 | Query rooms | The system must allow querying rooms using user-defined filters. |

### Group: Promotions Management

| ID | Name | Description |
|----|------|-------------|
| RF0121 | Register promotion | The system must allow the registration of promotions. |
| RF0122 | Update promotion | The system must allow updating promotions. |
| RF0123 | Deactivate promotion | The system must allow the deactivation of promotions. |
| RF0124 | Query promotions | The system must allow querying active promotions and history. |

### Group: Cancellation Policies

| ID | Name | Description |
|----|------|-------------|
| RF0131 | Register cancellation policy | The system must allow the registration of cancellation policies. |
| RF0132 | Update cancellation policy | The system must allow updating cancellation policies. |
| RF0133 | Deactivate cancellation policy | The system must allow the deactivation of cancellation policies. |
| RF0134 | Query cancellation policies | The system must allow querying cancellation policies. |

### Group: Reservations (Availability, Creation, Modification, Cancellation)

| ID | Name | Description |
|----|------|-------------|
| RF0201 | Check availability | The system must allow querying room availability based on user-provided parameters. |
| RF0202 | Create reservation (proposal) | The system must allow creating a reservation with an initial status of proposal. |
| RF0203 | Confirm reservation | The system must allow confirming a reservation. |
| RF0204 | Update reservation | The system must allow updating reservations. |
| RF0205 | Cancel reservation | The system must allow cancelling reservations. |
| RF0206 | Query reservations | The system must allow querying reservations by filters (period, status, guest, room, channel). |
| RF0207 | Mark no-show | The system must allow marking reservations as no-show. |
| RF0208 | Register check-in | The system must allow registering check-in for confirmed reservations. |
| RF0209 | Register check-out | The system must allow registering check-out for reservations in stay. |

### Group: Payments

| ID | Name | Description |
|----|------|-------------|
| RF0211 | Initiate payment | The system must allow initiating payments associated with a reservation. |
| RF0212 | Register payment result | The system must allow registering the payment result (approved/denied). |
| RF0213 | Refund payment | The system must allow registering refunds for payments associated with cancelled reservations. |
| RF0214 | Query payments | The system must allow querying payments by filters. |

### Group: Notifications

| ID | Name | Description |
|----|------|-------------|
| RF0221 | Send reservation confirmation | The system must send a reservation confirmation notification to the guest. |
| RF0222 | Send cancellation confirmation | The system must send a reservation cancellation notification to the guest. |
| RF0223 | Send stay reminders | The system must send notifications related to stay reminders. |
| RF0224 | Send post-stay messages | The system must send post-stay notifications. |

### Group: Reports and Analysis

| ID | Name | Description |
|----|------|-------------|
| RF0231 | Occupancy report | The system must provide an occupancy report by period and room type. |
| RF0232 | Financial report | The system must provide a financial report by period and payment method. |
| RF0233 | Reservation source report | The system must provide a report by reservation origin channel. |
| RF0234 | Promotion performance | The system must provide a promotion performance report. |

---

## Non-Functional Requirements

### Group: Performance and Availability

| ID | Name | Description |
|----|------|-------------|
| RNF0101 | Availability query response time | The availability query must respond within 3 seconds. |
| RNF0102 | Reservation creation response time | Reservation creation must respond within 5 seconds. |
| RNF0103 | System availability | The system must maintain a minimum availability of 99.9% per month. |

### Group: Security and Compliance

| ID | Name | Description |
|----|------|-------------|
| RNF0111 | Secure communication | All communication must occur via HTTPS. |
| RNF0112 | Credential storage | Passwords must be stored with hash and salt. |
| RNF0113 | Privacy and LGPD | The system must comply with LGPD principles, including consent and purpose. |

### Group: Usability and Access

| ID | Name | Description |
|----|------|-------------|
| RNF0121 | Responsive interface | The application must be responsive for desktop and mobile devices. |
| RNF0122 | Browser support | The system must support Chrome, Firefox, and Edge in their supported versions. |
| RNF0123 | Internationalization | The system must provide an interface in Portuguese and English. |

### Group: Observability and Audit

| ID | Name | Description |
|----|------|-------------|
| RNF0131 | Operations audit | Date, time, user, and operation must be recorded for creation, modification, and status events of reservations and payments. |
| RNF0132 | Metrics and alerts | The system must expose application metrics and configure alerts for failures and performance degradation. |

### Group: Integrations

| ID | Name | Description |
|----|------|-------------|
| RNF0141 | Integration resilience | Calls to external payment and notification services must implement retry and circuit breaker patterns. |
| RNF0142 | Integration availability | Failures in external services must not prevent internal operations that do not depend on immediate confirmation. |

---

## Business Rules

### Group: Data Composition and Required Fields

| ID | Name | Description |
|----|------|-------------|
| RN0201 | Required guest data | Every guest must have: full name, CPF (Brazilian tax ID), date of birth, phone, email, and address (street, number, ZIP code, neighborhood, complement, city, and state). |
| RN0202 | CPF uniqueness | The guest's CPF must be unique in the system. |
| RN0203 | Required room data | Every room must have: number, type (single, double, suite), adult capacity, children capacity, status, and base daily rate. |
| RN0204 | Required reservation data | Every reservation must have: guest, room, check-in date, check-out date, number of adults, number of children, status, and total value. |
| RN0205 | Required payment data | Every payment must have: reservation, payment method, amount, and operation date. |

### Group: Content Validations

| ID | Name | Description |
|----|------|-------------|
| RN0211 | Valid guest email | The email provided in guest registration must be in a valid format. |
| RN0212 | Valid date window | The check-out date must be after the check-in date. |
| RN0213 | Room capacity | The sum of adults and children in a reservation cannot exceed the room's registered capacity. |
| RN0214 | Minimum nights on holidays | On extended holidays, the reservation must have a minimum of 2 nights. |
| RN0215 | Standard room limit | Standard rooms have a maximum of 2 adults and 2 children. |

### Group: Operational Reservation Rules

| ID | Name | Description |
|----|------|-------------|
| RN0221 | Daily schedule | The daily rate starts at 14:00 and ends at 12:00 the following day. |
| RN0222 | Confirmation conditioned on payment | Reservations can only be confirmed when payment is approved. |
| RN0223 | No-show | Reservations not fulfilled on the check-in date must be marked as no-show. |
| RN0224 | Occupancy accounting | Only confirmed reservations must appear in occupancy and revenue reports. |

### Group: Cancellation and Policy

| ID | Name | Description |
|----|------|-------------|
| RN0231 | Cancellation without penalty | Cancellations made more than 48 hours before the check-in date incur no penalty. |
| RN0232 | Cancellation with penalty | Cancellations made less than 48 hours before the check-in date incur a 50% penalty on the reservation value. |
| RN0233 | Proportional refund | For cancellations with refund, the refunded amount must follow the cancellation policy linked to the reservation. |

### Group: Benefits and Exceptions

| ID | Name | Description |
|----|------|-------------|
| RN0241 | Children up to 5 years old | Children up to 5 years old do not pay a daily rate when staying in the same room as their guardians. |
| RN0242 | Applicable promotions | Promotions must follow the rules defined in the registered promotion and are not cumulative by default. |
| RN0243 | Document at check-in | At check-in, a photo identification document must be presented. |

### Group: Notifications (Minimum Content)

| ID | Name | Description |
|----|------|-------------|
| RN0251 | Reservation confirmation content | The reservation confirmation must contain: reservation code, guest data, check-in and check-out dates, room identification, total value, applicable cancellation policy, and check-in instructions. |
| RN0252 | Cancellation content | The cancellation confirmation must contain: reservation code, charged/refunded amounts, and reference to the applied policy. |
| RN0253 | Reminder content | The stay reminder must contain: check-in date and time, hotel address, and contacts. |
