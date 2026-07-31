# Protected System Users — Implementation Guide

## Overview

This document describes the **Protected System Users** feature for the Equipment QR Management App. The feature ensures three permanent demonstration accounts (Admin, Technician, Viewer) cannot be accidentally deleted or modified, while allowing normal users to be managed freely.

---

## Feature Behavior

### Protected System Accounts

Three accounts are designated as **protected system users**:

1. **Primary Administrator** — must retain `admin` role
2. **Primary Technician** — must retain `technician` role
3. **Primary Viewer** — must retain `viewer` role

These accounts:
- ✗ Cannot be deleted
- ✗ Cannot have their email address changed
- ✗ Cannot have their role reassigned
- ✓ Are visibly marked as "Protected" in User Management UI
- ✓ Have edit and delete buttons disabled

### Normal Users

All other users (default `isProtected: false`):
- ✓ Can be created, edited, and deleted freely
- ✓ Can have their role reassigned
- ✓ Have full CRUD functionality

### Global Administrator Safeguard

Regardless of `isProtected` status:
- ✗ Cannot delete the last remaining administrator
- ✗ Cannot demote the last remaining administrator to a non-admin role

---

## Database Changes

### User Model

Added field to `server/src/models/User.ts`:

```typescript
isProtected: {
  type: Boolean,
  default: false,
}
```

**Safe Default:** New users always default to `false`. Clients cannot set `isProtected` through normal API requests.

### TypeScript Interfaces

Updated `client/src/types/index.ts`:

```typescript
export interface AppUser {
  // ... existing fields
  isProtected?: boolean;  // Optional for backward compatibility
  // ... timestamps
}
```

---

## Backend Enforcement

### User Controller (`server/src/controllers/userController.ts`)

#### GET /api/users
- Returns all users with `isProtected` field included
- Treats missing `isProtected` as `false` (backward compatibility)

#### POST /api/users (Create)
- Always sets new users to `isProtected: false`
- Clients cannot override this

#### PUT /api/users/:id/role (Update Role)
- **Returns 403 Forbidden** if user is protected
- **Returns 409 Conflict** if attempting to demote last admin (even if not protected)
- Prevents role reassignment of protected accounts

#### DELETE /api/users/:id (Delete)
- **Returns 403 Forbidden** if user is protected
- **Returns 409 Conflict** if attempting to delete last admin (even if not protected)
- Prevents deletion of protected accounts

### Error Responses

| Scenario | HTTP Status | Message |
|----------|-------------|---------|
| Delete protected user | 403 | `"This system account is protected and cannot be deleted."` |
| Change protected role | 403 | `"This system account is protected and cannot be reassigned."` |
| Delete last admin | 409 | `"Cannot delete the last remaining administrator."` |
| Demote last admin | 409 | `"Cannot demote the last remaining administrator."` |

---

## Frontend Behavior

### User Management Page

#### Protected Account Display

Protected users show:
- **"Protected" badge** (amber) next to their name
- **Explanation text** below email: `"System account—read-only"`
- **Disabled role dropdown** with tooltip
- **Disabled delete button** with tooltip

#### Normal User Display

Normal users show:
- No badge
- Fully functional role selector
- Fully functional delete button

#### Error Handling

When the backend rejects an operation (e.g., 403 or 409):
- Error message is displayed in red box
- User is not updated
- Modal closes automatically (if delete attempted)

---

## Migration & Initialization

### Environment Variables (One-Time Migration Only)

Add to `server/.env` **before running the migration**:

```env
# One-time migration values — only needed when running npm run mark-protected-users
PROTECTED_ADMIN_EMAIL=admin@example.com
PROTECTED_TECHNICIAN_EMAIL=technician@example.com
PROTECTED_VIEWER_EMAIL=viewer@example.com
```

Replace the example emails with the actual email addresses of your three demo accounts.

**After migration completes:** These environment variables are no longer needed. The application will function normally without them. They are not required for production runtime or deployment to Render.

### One-Time Migration

Run this command after setting environment variables:

```bash
cd server
npm run mark-protected-users
```

**What it does:**
1. Reads the three email addresses from environment variables
2. Finds users in MongoDB with those emails
3. Sets `isProtected: true` for each
4. Prints confirmation with user details

**Idempotent:** Safe to run multiple times. If users are already protected, no changes occur.

### Script Location

Migration script: `server/src/migrations/markProtectedUsers.ts`

### Output Example

```
Successfully marked 3 user(s) as protected.

Protected users:
  - Admin User (admin@example.com) - Role: admin, Protected: true
  - Tech User (technician@example.com) - Role: technician, Protected: true
  - Viewer User (viewer@example.com) - Role: viewer, Protected: true
```

---

## Implementation Files

### Backend

| File | Changes |
|------|---------|
| `server/src/models/User.ts` | Added `isProtected: boolean` field |
| `server/src/controllers/userController.ts` | Added protection enforcement in getUsers, createUser, updateUserRole, deleteUser |
| `server/src/migrations/markProtectedUsers.ts` | **NEW** — Migration script to mark demo accounts as protected |
| `server/package.json` | Added `npm run mark-protected-users` script |
| `server/.env.example` | Added PROTECTED_*_EMAIL environment variables |

### Frontend

| File | Changes |
|------|---------|
| `client/src/types/index.ts` | Added `isProtected?: boolean` to AppUser interface |
| `client/src/pages/UserManagement.tsx` | Added UI state, disabled/disabled buttons, "Protected" badge for protected users |

---

## Testing Checklist

Before deploying, verify:

- [ ] **Protected admin cannot be deleted** — Click delete on admin account, expect 403 error
- [ ] **Protected admin cannot be demoted** — Change admin role to technician, expect 403 error
- [ ] **Protected technician cannot be deleted** — Click delete, expect 403 error
- [ ] **Protected technician cannot be reassigned** — Change role, expect 403 error
- [ ] **Protected viewer cannot be deleted** — Click delete, expect 403 error
- [ ] **Protected viewer cannot be reassigned** — Change role, expect 403 error
- [ ] **Protected badge displays** — Open User Management, verify amber "Protected" badge on system accounts
- [ ] **Disabled controls** — Role dropdown and delete button are disabled for protected accounts
- [ ] **Normal user can still be deleted** — Create a test user, delete it successfully
- [ ] **Normal user can still be reassigned** — Create a test user, change their role successfully
- [ ] **Last admin cannot be deleted** — Create two admins, delete one successfully, try to delete the last one, expect 409 error
- [ ] **Last admin cannot be demoted** — Verify last remaining admin cannot be demoted to technician/viewer
- [ ] **New users default to unprotected** — Create a new user, verify `isProtected: false` in API response
- [ ] **Client cannot set isProtected** — Attempt POST /api/users with `isProtected: true`, verify it's forced to `false`

---

## Deployment Steps

1. **Database Migration:**
   ```bash
   cd server
   npm run mark-protected-users
   ```

2. **Verify Protection:**
   - Login as admin
   - Go to User Management
   - Verify protected accounts show badge and have disabled controls

3. **Test Restrictions:**
   - Try to delete each protected account → should fail with 403
   - Try to reassign each protected account → should fail with 403
   - Create and delete a normal user → should succeed

4. **Monitor Logs:**
   - Check backend logs for any unexpected errors
   - Verify activity logs record all user management actions

---

## Notes & Assumptions

- Protected accounts are identified by email address during migration (environment-variable based)
- Once marked as protected, accounts are protected indefinitely (no UI to unprotect)
- The three protected roles (admin, technician, viewer) are fixed and cannot be changed
- If all administrators are somehow deleted (outside normal app flow), the system will prevent new admin deletions but won't prevent demotion. This is acceptable because a fresh admin can be re-created.
- The feature does not prevent password changes or email viewing; only deletion/role reassignment is blocked

---

## Backward Compatibility

- Existing users without `isProtected` field are treated as `isProtected: false`
- The API returns `isProtected: false` for old records
- No breaking changes to authentication or JWT
- Old API clients that don't expect `isProtected` will ignore it safely
