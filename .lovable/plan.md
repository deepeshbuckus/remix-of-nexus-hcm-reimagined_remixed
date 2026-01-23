
## Plan: Update Profile API Endpoint

### Summary
Update the profile service to use the new API endpoint path.

### Change Required

| File | Change |
|------|--------|
| `src/services/profileService.ts` | Update endpoint from `/api/v1/people/{id}/profile` to `/api/v1/employees/{id}/profile` |

### Technical Details

**Before:**
```typescript
const response = await fetch(`${API_BASE_URL}/api/v1/people/${id}/profile`);
```

**After:**
```typescript
const response = await fetch(`${API_BASE_URL}/api/v1/employees/${id}/profile`);
```

### Notes
- The response structure remains unchanged, so no updates needed to types or transformers
- All existing functionality will continue to work with the new endpoint
