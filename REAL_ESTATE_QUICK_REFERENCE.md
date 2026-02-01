# Real Estate Updates - Quick Reference

## ⚡ Quick Start

### For Users:

1. **Create**: Click `+` button → Fill form → Submit
2. **Edit**: Hover on item → Click edit icon → Modify → Update
3. **Delete**: Hover on item → Click trash icon → Confirm
4. **View**: Click on update item → Detail sidebar opens
5. **Share**: In detail sidebar → WhatsApp or Copy buttons

### For Developers:

#### Import Components:

```tsx
import RealEstateUpdateModal from "./components/dashboard/RealEstateUpdateModal";
import RealEstateUpdateDetail from "./components/dashboard/RealEstateUpdateDetail";
import RealEstateUpdates from "./components/dashboard/RealEstateUpdates";
```

#### Modal Usage:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [editingItem, setEditingItem] = useState(null);

const handleSave = async (data) => {
  await fetch(
    editingItem
      ? `/api/real-estate-updates/${data._id}`
      : "/api/real-estate-updates",
    {
      method: editingItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
};

<RealEstateUpdateModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSave={handleSave}
  editingUpdate={editingItem}
/>;
```

#### Detail Sidebar Usage:

```tsx
const [selected, setSelected] = useState(null);

<RealEstateUpdateDetail update={selected} onClose={() => setSelected(null)} />;
```

---

## 🔑 Key APIs

### Create Update

```bash
POST /api/real-estate-updates
Content-Type: application/json

{
  "title": "New Project Launch",
  "description": "Premium residential project...",
  "location": "South",
  "tag": "Launch"
}
```

### Update Update

```bash
PUT /api/real-estate-updates/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "New description...",
  "location": "West",
  "tag": "Price Update"
}
```

### Delete Update

```bash
DELETE /api/real-estate-updates/{id}
```

### Fetch All Updates

```bash
GET /api/real-estate-updates?location=West&tag=Launch
```

### Fetch Single Update

```bash
GET /api/real-estate-updates/{id}
```

---

## 📊 Valid Values

**Locations:**

- West
- Central
- South
- East
- North

**Tags/Categories:**

- Launch
- Price Update
- Possession
- Offer
- News
- Other

---

## 🎯 File Locations

| Component      | Path                                              |
| -------------- | ------------------------------------------------- |
| Modal          | `components/dashboard/RealEstateUpdateModal.tsx`  |
| Detail Sidebar | `components/dashboard/RealEstateUpdateDetail.tsx` |
| Main Component | `components/dashboard/RealEstateUpdates.tsx`      |
| API Route      | `app/api/real-estate-updates/route.ts`            |
| ID Route       | `app/api/real-estate-updates/[id]/route.ts`       |
| Database Model | `models/RealEstateUpdate.ts`                      |

---

## 🐛 Troubleshooting

### Modal not opening?

- Check if `isOpen` state is properly managed
- Verify onClick handler calls `setIsOpen(true)`

### Updates not loading?

- Check browser console for API errors
- Verify authentication token is sent
- Check database connection

### Edit not working?

- Ensure `_id` field is passed in data object
- Verify PUT endpoint is hit (check network tab)
- Check user has `Projects.update` permission

### Delete not working?

- Verify delete endpoint path includes ID
- Check confirmation dialog is not cancelled
- Verify user has `Projects.delete` permission

---

## 🔐 Permissions Required

| Action        | Permission        |
| ------------- | ----------------- |
| View Updates  | `Leads.read`      |
| Create Update | `Projects.create` |
| Edit Update   | `Projects.update` |
| Delete Update | `Projects.delete` |

---

## 📱 Responsive Behavior

- **Mobile**: Full-width modal, stacked layout
- **Tablet**: Grid layout with sidebar
- **Desktop**: Full detail sidebar from right edge
- Scrollbar styled with Tailwind classes
- Touch-friendly button sizes

---

## ✨ Highlights

✓ Zero mock data - fully integrated with backend
✓ Real-time CRUD operations
✓ Beautiful modal from refer.jsx pattern
✓ Professional detail sidebar with share
✓ Ownership-based permissions
✓ Error handling and user feedback
✓ Responsive design
✓ Loading states
✓ Smooth animations
