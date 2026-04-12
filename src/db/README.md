# Automerge Migration Guide

## Overview

This migration moves BardsBallad from Dexie (IndexedDB) + manual sync to Automerge for automatic conflict-free replication.

## What's Been Set Up

### 1. Core Infrastructure
- ✅ Automerge repo with WebSocket sync (`automerge/repo.ts`)
- ✅ Type definitions for all documents (`automerge/types.ts`)
- ✅ Helper functions for document management (`automerge/helpers.ts`)
- ✅ Migration utilities (`automerge/migration.ts`)
- ✅ Example character methods (`automerge/methods/characters.ts`)

### 2. Migration Strategy
- Data is migrated from Dexie to Automerge on first app load
- Migration status is tracked in localStorage
- Both systems can coexist during transition

## How to Use

### Step 1: Add to Your App

In `App.tsx`, add the migration hook:

```typescript
import { useMigration } from '@/hooks/useMigration'

const App = () => {
  const { migrationStatus, error } = useMigration()
  
  // Optionally show migration status
  if (migrationStatus === 'running') {
    return <div>Migrating data...</div>
  }
  
  if (migrationStatus === 'error') {
    return <div>Migration error: {error?.message}</div>
  }
  
  // Rest of your app...
}
```

### Step 2: Replace Dexie Calls

**Old way (Dexie):**
```typescript
import { db } from '@/db'
import createCharacter from '@/db/character/methods/createCharacter'

// Get characters
const characters = await db.characters.toArray()

// Create character
await createCharacter(data)
```

**New way (Automerge):**
```typescript
import { getAllCharacters, createCharacter } from '@/db'

// Get characters
const characters = await getAllCharacters()

// Create character
const handle = await createCharacter('Gandalf', userId, systemId, versionId)
const character = handle.docSync()
```

### Step 3: Real-time Updates with React

Use the `useDocument` hook from `@automerge/automerge-repo-react-hooks`:

```tsx
import { useDocument } from '@automerge/automerge-repo-react-hooks'
import { getCharacterHandle } from '@/db'

function CharacterEditor({ characterId }) {
  const handle = getCharacterHandle(characterId)
  const [doc, changeDoc] = useDocument(handle)
  
  if (!doc) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{doc.name}</h1>
      <button onClick={() => changeDoc(d => { d.name = 'New Name' })}>
        Rename
      </button>
    </div>
  )
}
```

## Migration Checklist

### Phase 1: Setup (✅ Complete)
- [x] Install Automerge packages
- [x] Set up repo with storage and network adapters
- [x] Create type definitions
- [x] Create helper functions
- [x] Create migration utilities
- [x] Create example methods (characters)

### Phase 2: Gradual Migration (In Progress)
- [ ] Add `useMigration()` to App.tsx
- [ ] Test migration with your data
- [ ] Create methods for remaining collections:
  - [ ] Systems (`automerge/methods/systems.ts`)
  - [ ] Datapacks (`automerge/methods/datapacks.ts`)
  - [ ] Subscriptions (`automerge/methods/subscriptions.ts`)
  - [ ] Versions (`automerge/methods/versions.ts`)
- [ ] Update one component at a time to use Automerge
- [ ] Test each component thoroughly

### Phase 3: Server Setup
- [ ] Set up Automerge sync server
- [ ] Update WebSocket URL in `repo.ts`
- [ ] Add authentication to sync server
- [ ] Test cross-device sync

### Phase 4: Cleanup
- [ ] Remove Dexie database code
- [ ] Remove old sync logic (`src/sync/`)
- [ ] Remove conflict resolution modals
- [ ] Remove checkpoint system
- [ ] Update documentation

## Key Differences

### Data Access
| Dexie | Automerge |
|-------|-----------|
| `db.characters.get(id)` | `await getCharacter(id)` |
| `db.characters.toArray()` | `await getAllCharacters()` |
| `db.characters.put(char)` | `handle.change(doc => { ... })` |

### Updates
| Dexie | Automerge |
|-------|-----------|
| Fetch → Modify → Put back | Direct mutation in `change()` |
| Manual `updated_at` | Automatic in helper |
| Manual version hash | Automatic |

### Sync
| Dexie | Automerge |
|-------|-----------|
| Manual push/pull | Automatic |
| Checkpoint system | Vector clocks |
| Conflict resolution UI | Automatic CRDT merge |

## Testing the Migration

1. **Check migration status:**
   ```typescript
   import { getMigrationStats } from '@/db'
   console.log(getMigrationStats())
   ```

2. **Reset and re-run (for testing):**
   ```typescript
   import { resetMigration, runMigration } from '@/db'
   resetMigration()
   await runMigration()
   ```

3. **Access repo in console:**
   ```javascript
   // In browser console:
   window.repo
   ```

## Benefits

✅ **Automatic Sync**: No more manual push/pull logic
✅ **Conflict-Free**: CRDT automatically merges changes
✅ **Real-time**: Changes sync instantly across devices
✅ **Offline-First**: Works offline, syncs when back online
✅ **History**: Built-in version history
✅ **Simpler Code**: Less boilerplate, no conflict UI

## Next Steps

1. Add `useMigration()` to your App component
2. Test the migration with your existing data
3. Start converting one component at a time
4. Create methods for remaining collections
5. Set up sync server when ready

## Questions?

- Automerge Docs: https://automerge.org/docs/
- Automerge Repo: https://github.com/automerge/automerge-repo
- React Hooks: https://github.com/automerge/automerge-repo-react-hooks
