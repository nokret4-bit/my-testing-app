# Contributing to ClickStay

Thank you for your interest in contributing to ClickStay!

## Development Setup

1. Follow the installation guide in `INSTALLATION.md`
2. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Code Standards

### TypeScript

- **Strict mode enabled** - No `any` types
- Use proper type definitions
- Leverage Prisma-generated types
- Add JSDoc comments for complex functions

### Code Style

- Use Prettier for formatting: `npx prettier --write .`
- Follow ESLint rules: `npm run lint`
- Use meaningful variable names
- Keep functions small and focused

### File Organization

```
src/
├── app/              # Pages and API routes
├── components/       # Reusable React components
├── lib/              # Core business logic
├── schemas/          # Zod validation schemas
└── types/            # TypeScript type definitions
```

### Naming Conventions

- **Components**: PascalCase (e.g., `FacilityCard.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **API routes**: kebab-case folders (e.g., `api/bookings/route.ts`)
- **Types**: PascalCase (e.g., `BookingDetails`)

## Database Changes

When modifying the database schema:

1. Edit `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name your_change_name`
3. Update seed file if needed: `prisma/seed.ts`
4. Test migration: `npm run db:reset`

## Testing

### Manual Testing Checklist

- [ ] Browse facilities
- [ ] Create booking
- [ ] Complete payment flow
- [ ] Receive email confirmation
- [ ] View booking details
- [ ] Cancel booking
- [ ] Admin dashboard access
- [ ] Admin CRUD operations

### API Testing

Use tools like:
- **Postman** or **Insomnia** for API testing
- **Prisma Studio** for database inspection: `npx prisma studio`

## Pull Request Process

1. **Update documentation** if you change functionality
2. **Test your changes** thoroughly
3. **Follow commit conventions**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Test additions/changes
   - `chore:` Build/config changes

4. **Write clear PR descriptions**:
   - What does this PR do?
   - Why is this change needed?
   - How was it tested?
   - Screenshots (if UI changes)

## Feature Requests

Have an idea? Open an issue with:
- Clear description of the feature
- Use case / problem it solves
- Proposed implementation (optional)

## Bug Reports

Found a bug? Open an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/error messages
- Environment (OS, Node version, browser)

## Code Review Guidelines

When reviewing PRs:
- Check for type safety
- Verify error handling
- Look for security issues
- Test the changes locally
- Provide constructive feedback

## Security

**Do not commit:**
- API keys or secrets
- `.env` files
- Personal data
- Passwords

**Report security issues privately** to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions about contributing!
