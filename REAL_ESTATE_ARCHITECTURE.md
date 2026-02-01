# Real Estate Updates - System Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD PAGE                              │
│                 (app/(protected)/dashboard/page.tsx)                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │    RealEstateUpdates Component       │
        │  (components/dashboard/             │
        │   RealEstateUpdates.tsx)             │
        │                                      │
        │  - Fetch updates on mount           │
        │  - Display update list              │
        │  - Location filtering               │
        │  - Edit/Delete buttons (hover)      │
        └──────────────┬───────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌─────────┐  ┌──────────────┐  ┌──────────────┐
   │  Modal  │  │Detail Sidebar│  │  API Calls  │
   └─────────┘  └──────────────┘  └──────────────┘
```

---

## 📊 Component Interaction Flow

### Data Flow Diagram

```
                    API LAYER
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    GET ALL       GET ONE        POST/PUT/DELETE
   Updates       Update          Operations
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
              MONGODB DATABASE
         (RealEstateUpdate Collection)
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    FETCH       UPDATE/DELETE     POPULATE
  & SORT        Records          References
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
              Response to Frontend
```

---

## 🔄 Complete User Journey

### 1️⃣ CREATE UPDATE

```
User Action              Component              API Layer            Database
─────────────────────────────────────────────────────────────────────────────
Click "+" button
        │
        ▼
RealEstateUpdateModal
opens (empty form)
        │
        ▼
Fill form fields
(Title, Location,
 Category, Details)
        │
        ▼
Click "Post Update"
        │
        ▼                                    POST
                    handleSaveUpdate ───────────────►  /api/real-estate-updates
                                                          │
                                                          ▼
                                                    Validate data
                                                    Create document
                                                          │
                                                          ▼
                                                      DATABASE
                                                    Insert document
                                                          │
                                                          ▼
                    New update received ◄────────────── Return _id
        │
        ▼
Modal closes
List refreshes
New item appears ✓
```

### 2️⃣ READ/FETCH UPDATES

```
Component Mount
        │
        ▼
useEffect Hook
        │
        ▼
Call fetchUpdates()
        │
        ▼                                    GET
                    setLoading(true) ──────────────►  /api/real-estate-updates
                                                          │
                                                          ▼
                                                    Query database
                                                    Sort by pinned & date
                                                    Populate references
                                                          │
                                                          ▼
                    Update state ◄──────────────── Return array
        │
        ▼
setLoading(false)
Render list ✓
```

### 3️⃣ UPDATE (EDIT) UPDATE

```
Hover on update
        │
        ▼
Edit button appears
        │
        ▼
Click edit button
        │
        ▼
Modal opens with
pre-filled data
        │
        ▼
User modifies fields
        │
        ▼
Click "Update"
        │
        ▼                                    PUT
                    handleSaveUpdate ──────────────►  /api/real-estate-updates/{_id}
                                                          │
                                                          ▼
                                                    Find document by ID
                                                    Verify ownership
                                                    Update fields
                                                          │
                                                          ▼
                                                      DATABASE
                                                    Update document
                                                          │
                                                          ▼
                    Updated item received ◄────────────── Return updated
        │
        ▼
Modal closes
List refreshes ✓
```

### 4️⃣ DELETE UPDATE

```
Hover on update
        │
        ▼
Delete button appears
        │
        ▼
Click delete button
        │
        ▼
Confirmation dialog
        │
        ├─► Cancel → Return to list
        │
        └─► Confirm
              │
              ▼                                    DELETE
                      handleDeleteUpdate ──────────────►  /api/real-estate-updates/{_id}
                                                            │
                                                            ▼
                                                      Find document by ID
                                                      Verify ownership
                                                      Delete document
                                                            │
                                                            ▼
                                                        DATABASE
                                                      Remove document
                                                            │
                                                            ▼
                      Success response ◄──────────────── Deleted
              │
              ▼
      Remove from state
      List updates ✓
```

### 5️⃣ VIEW DETAILS

```
Click on update item
        │
        ▼
setSelectedUpdate(update)
        │
        ▼
RealEstateUpdateDetail
renders sidebar
        │
        ▼
Sidebar slides in
from right
        │
        ├─► View full details
        │
        ├─► Click WhatsApp share
        │   └─► Opens WhatsApp with message
        │
        ├─► Click Copy
        │   └─► Copies to clipboard
        │
        └─► Click Close/Backdrop
            └─► Sidebar slides out
                setSelectedUpdate(null)
```

---

## 🔐 Authentication & Authorization Flow

```
Request                Validation              Permission Check        Action
────────────────────────────────────────────────────────────────────────────
Create         validateRequest ─► Projects.create ─► ✓ ALLOWED      POST ✓
Read           validateRequest ─► Leads.read      ─► ✓ ALLOWED      GET ✓
Update         validateRequest ─► Projects.update ─► Check ownership ─► PUT ✓
Delete         validateRequest ─► Projects.delete ─► Check ownership ─► DELETE ✓

Ownership Check:
- If user._id === update.createdBy → ALLOWED
- OR user.role === 'admin' → ALLOWED
- ELSE → FORBIDDEN (403)
```

---

## 📋 State Management Flow

### RealEstateUpdates Component State

```
┌─────────────────────────────────────────────────────┐
│              Component State (Hooks)                │
├─────────────────────────────────────────────────────┤
│ updates: RealEstateUpdate[]                         │
│ ├─ Stores fetched list from API                    │
│ └─ Updated on CREATE, UPDATE, DELETE               │
│                                                     │
│ loading: boolean                                    │
│ ├─ true during initial fetch                       │
│ └─ false when ready to display                     │
│                                                     │
│ locationFilter: string                              │
│ ├─ 'All' | 'West' | 'Central' | 'South' | ...    │
│ └─ Filters display list                            │
│                                                     │
│ selectedUpdate: RealEstateUpdate | null             │
│ ├─ null = detail sidebar closed                    │
│ └─ update object = sidebar open/visible            │
│                                                     │
│ isModalOpen: boolean                                │
│ ├─ false = modal hidden                            │
│ └─ true = modal visible                            │
│                                                     │
│ editingUpdate: RealEstateUpdate | null              │
│ ├─ null = creating new update                      │
│ └─ update object = editing existing                │
│                                                     │
│ error: string                                       │
│ ├─ '' = no error                                   │
│ └─ error message = display to user                 │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Key Functions Flow

### fetchUpdates() Function

```
fetchUpdates()
    │
    ├─► setLoading(true)
    │
    ├─► fetch('/api/real-estate-updates')
    │       │
    │       ├─► If OK: Parse JSON
    │       │
    │       └─► If Error: Throw error
    │
    ├─► setUpdates(data) ← Stores result
    │
    ├─► setError('') ← Clear error
    │
    └─► setLoading(false)
        (finally block)
```

### handleSaveUpdate(data) Function

```
handleSaveUpdate(data)
    │
    ├─► Check if editing:
    │   ├─ Yes: method='PUT', url='/api/.../id'
    │   └─ No: method='POST', url='/api/...'
    │
    ├─► fetch(url, {
    │       method,
    │       headers: { 'Content-Type': 'application/json' },
    │       body: JSON.stringify(data)
    │   })
    │
    ├─► If Error: throw error
    │
    ├─► setEditingUpdate(null)
    │
    └─► fetchUpdates() ← Refresh list
        (Re-fetch all updates)
```

### handleDeleteUpdate(id) Function

```
handleDeleteUpdate(id)
    │
    ├─► confirm() ← Ask user
    │   │
    │   ├─► Cancel: return (exit)
    │   │
    │   └─► OK: continue
    │
    ├─► fetch('/api/.../id', {
    │       method: 'DELETE'
    │   })
    │
    ├─► If Error: throw error
    │
    ├─► setUpdates(prev =>
    │       prev.filter(u => u._id !== id)
    │   ) ← Remove from state immediately
    │
    └─► setError('') ← Clear error
```

---

## 🗄️ Database Operations

### MongoDB Collection Structure

```
real_estate_updates
├─ _id: ObjectId
├─ title: String
├─ description: String
├─ location: String (enum)
├─ tag: String (enum)
├─ project: ObjectId → projects collection
├─ imageUrl: String (optional)
├─ linkUrl: String (optional)
├─ isActive: Boolean
├─ isPinned: Boolean
├─ createdBy: ObjectId → users collection
├─ createdByName: String
├─ createdAt: Date (auto)
└─ updatedAt: Date (auto)
```

### Query Examples

```javascript
// GET all active updates sorted by pinned & date
db.real_estate_updates
  .find({ isActive: true })
  .sort({ isPinned: -1, createdAt: -1 })
  .populate("project")
  .populate("createdBy", "name email");

// GET with location filter
db.real_estate_updates.find({
  isActive: true,
  location: "West",
});

// GET single update by ID
db.real_estate_updates.findById(id).populate("project");

// CREATE new update
db.real_estate_updates.create({
  title,
  description,
  location,
  tag,
  createdBy: userId,
  createdByName: userName,
});

// UPDATE existing
db.real_estate_updates.findByIdAndUpdate(id, updateData);

// DELETE
db.real_estate_updates.findByIdAndDelete(id);
```

---

## 🚀 Performance Optimizations

```
Optimization Strategy              Benefit
──────────────────────────────────────────────────────────
Server-side filtering              ✓ Reduces data transfer
Populate references                ✓ Single query for relations
Sort in database                   ✓ Better than client sort
Conditional rendering              ✓ Show loading/empty states
Immediate state update on delete   ✓ Faster UI feedback
useEffect dependency array         ✓ Prevents infinite loops
```
