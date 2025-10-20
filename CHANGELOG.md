# Changelog

All notable changes to ClickStay will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-10-13

### Added
- Initial release of ClickStay booking system
- Complete TypeScript-only codebase with strict mode
- Next.js 15 App Router implementation
- Prisma ORM with PostgreSQL database
- Auth.js email authentication (OTP/magic link)
- Nodemailer email service with React Email templates
- PayMongo GCash payment integration
- Real-time availability checking
- Dynamic pricing calculation
- Booking lifecycle management
- Admin dashboard with metrics
- Facility management (CRUD)
- Rate plan management
- Availability block management
- Reservation management
- Revenue and occupancy reports
- CSV export functionality
- Audit logging system
- Role-based access control (Guest, Staff, Admin)
- Responsive UI with Tailwind CSS
- shadcn/ui component library
- Dark mode by default
- Email confirmations with calendar invites (.ics)
- Webhook handling for payment events
- Docker Compose for PostgreSQL
- Comprehensive documentation
- Installation guides
- Seed data with sample facilities

### Features
- Browse facilities (rooms, cottages, function halls)
- View facility details with photos and amenities
- Check availability for date ranges
- Create bookings with guest information
- Secure payment processing via GCash
- Booking status tracking
- Cancel bookings
- View booking history
- Admin dashboard with statistics
- Manage all reservations
- Generate reports
- Export data to CSV

### Technical
- TypeScript 5.6.2 with strict mode
- Next.js 15.0.0 with App Router
- React 18.2.0 with Server Components
- Prisma 5.19.0 ORM
- PostgreSQL 16 database
- Auth.js 5.0.0-beta.20
- Tailwind CSS 3.4.13
- Zod validation for all inputs
- ESLint + Prettier configuration
- Node.js 20.18.0 runtime
- npm 10.9.0 package manager

### Documentation
- README.md - Main documentation
- INSTALLATION.md - Detailed setup guide
- QUICKSTART.md - 5-minute setup
- PROJECT_SUMMARY.md - Technical overview
- CONTRIBUTING.md - Contribution guidelines
- CHANGELOG.md - Version history

### Security
- Webhook signature verification
- CSRF protection
- SQL injection prevention
- Secure session management
- Password hashing
- Environment variable isolation
- Role-based access control

## [Unreleased]

### Planned Features
- Walk-in booking management
- SMS notifications
- Advanced calendar view
- Discount codes and promotions
- Customer reviews and ratings
- Photo gallery management
- Catering package integration
- Event management features
- Mobile application
- Enhanced analytics
- Automated reporting
- Inventory management
- Staff scheduling

---

For more details, see the [GitHub repository](https://github.com/yourusername/clickstay).
