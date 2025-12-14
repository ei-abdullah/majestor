# Lost & Found API Documentation

Complete reference for all Lost & Found frontend-backend API integration.

## 📋 Table of Contents
- [Overview](#overview)
- [Service Files](#service-files)
- [Lost Item APIs](#lost-item-apis)
- [Founder APIs](#founder-apis)
- [Data Models](#data-models)
- [Usage Examples](#usage-examples)
- [Testing Guide](#testing-guide)

---

## 🎯 Overview

The Lost & Found system consists of two main controllers:

| Controller | Base Path | Purpose |
|------------|-----------|---------|
| **LostItemController** | `/api/v1/lostItem` | Manage lost items |
| **FounderController** | `/api/v1/founder` | Report found items |

**Frontend Service**: `src/services/lostfound.service.ts`

---

## 📁 Service Files

### Current Structure
```
src/services/
├── apiClient.ts              # Base axios instance with auth
├── auth.service.ts           # Authentication APIs ✅
├── university.service.ts     # University/Faculty APIs ✅
├── lostfound.service.ts      # Lost & Found APIs ✅ (NEW)
└── lostitem.service.ts       # Old service (DEPRECATED - remove this)
```

### Recommended: Use `lostfound.service.ts`
The new `lostfound.service.ts` is complete and matches backend exactly.

---

## 🔴 Lost Item APIs

### 1. Create Lost Item

**Backend**: `POST /api/v1/lostItem/createRequest/{userId}`

**Purpose**: User reports a lost item with photos

**Request**: `multipart/form-data`
```typescript
{
  title: string                      // Required, 2-100 chars
  description: string                // Required, max 255 chars
  phone: string                      // Required, format: 03XXXXXXXXX
  lastLocationDescription: string    // Required, max 255 chars
  lastLocation?: {
    lat: number
    lng: number
  }
  lostItemImages: File[]            // Required, array of images
}
```

**Frontend Usage**:
```typescript
import { lostItemService } from '@/services/lostfound.service';

await lostItemService.createLostItem(userId, {
  title: 'Black Backpack',
  description: 'Contains laptop and textbooks',
  phone: '03001234567',
  lastLocationDescription: 'Main Library, 2nd Floor',
  lastLocation: {
    lat: 24.8607,
    lng: 67.0011
  },
  lostItemImages: [imageFile1, imageFile2]
});
```

**Response**: `201 Created` (no body)

---

### 2. Get User's Lost Items

**Backend**: `GET /api/v1/lostItem/findLostItemsByUserId/{userId}?status=LOST`

**Purpose**: Get all lost items created by a specific user, filtered by status

**Parameters**:
- `userId`: Path parameter (number)
- `status`: Query parameter (`LOST` | `FOUND` | `RECLAIMED`)

**Frontend Usage**:
```typescript
const userItems = await lostItemService.getLostItemsByUserId(userId, 'LOST');
```

**Response**:
```typescript
LostItemBasic[] = [
  {
    id: 1,
    title: "Black Backpack",
    status: "LOST",
    ownerId: 5,
    imageUri: "https://s3.../image.jpg",
    createdAt: "2025-12-06T10:30:00"
  }
]
```

---

### 3. Get All Lost Items (Paginated)

**Backend**: `GET /api/v1/lostItem/findAllLostItems?page=0&size=20`

**Purpose**: Get all items with status = LOST (public feed)

**Parameters**:
- `page`: Page number (default: 0)
- `size`: Items per page (default: 10)

**Frontend Usage**:
```typescript
const page = await lostItemService.getAllLostItems(0, 20);

console.log(page.content);        // Array of items
console.log(page.totalElements);  // Total count
console.log(page.totalPages);     // Total pages
```

**Response**:
```typescript
{
  content: LostItemBasic[],
  totalElements: 45,
  totalPages: 3,
  size: 20,
  number: 0  // Current page
}
```

---

### 4. Get Lost Item Details with Founders

**Backend**: `GET /api/v1/lostItem/findLostItemWithFounders/{lostItemId}`

**Purpose**: Get full details of a lost item including all people who reported finding it

**Frontend Usage**:
```typescript
const item = await lostItemService.getLostItemWithFounders(itemId);

console.log(item.title);
console.log(item.lostItemImageUris);   // Array of image URLs
console.log(item.itemFounders);        // People who found it
```

**Response**:
```typescript
{
  id: 1,
  ownerId: 5,
  ownerEmail: "user@example.com",
  title: "Black Backpack",
  description: "Contains laptop...",
  phone: "03001234567",
  lastLocationDescription: "Main Library, 2nd Floor",
  lastLocation: { lat: 24.8607, lng: 67.0011 },
  lostItemImageUris: [
    "https://s3.../image1.jpg",
    "https://s3.../image2.jpg"
  ],
  itemFounders: [
    {
      id: 10,
      username: "john_doe",
      phone: "03009876543",
      founderEmail: "john@example.com",
      foundLocationDescription: "CS Department hallway",
      lastLocation: { lat: 24.8608, lng: 67.0012 },
      foundItemImageUris: ["https://s3.../found1.jpg"],
      createdAt: "2025-12-06T14:20:00"
    }
  ],
  createdAt: "2025-12-06T10:30:00"
}
```

---

### 5. Mark Item as Found

**Backend**: `PATCH /api/v1/lostItem/markLostItemFound/{lostItemId}`

**Purpose**: Owner marks their lost item as found/recovered

**Frontend Usage**:
```typescript
await lostItemService.markItemAsFound(itemId);
```

**Response**: `200 OK` (no body)

---

## 🟢 Founder APIs

### 6. Report Found Item

**Backend**: `POST /api/v1/founder/foundLostItem/{founderId}/{lostItemId}`

**Purpose**: User reports that they found someone's lost item

**Request**: `multipart/form-data`
```typescript
{
  foundLocationDescription: string   // Required, max 255 chars
  foundLocation?: {
    lat: number
    lng: number
  }
  foundItemImages: File[]           // Required, array of images
}
```

**Frontend Usage**:
```typescript
import { founderService } from '@/services/lostfound.service';

await founderService.reportFoundItem(
  founderId,    // ID of user who found it
  lostItemId,   // ID of the lost item
  {
    foundLocationDescription: 'Found in CS Department hallway near Room 204',
    foundLocation: {
      lat: 24.8608,
      lng: 67.0012
    },
    foundItemImages: [photo1, photo2, photo3]
  }
);
```

**Response**: `201 Created` (no body)

---

## 📊 Data Models

### Location
```typescript
interface Location {
  lat: number;
  lng: number;
}
```

### LostItemStatus
```typescript
type LostItemStatus = 'LOST' | 'FOUND' | 'RECLAIMED';
```

### LostItemBasic (List View)
```typescript
interface LostItemBasic {
  id: number;
  title: string;
  status: LostItemStatus;
  ownerId: number;
  imageUri: string;        // First image only
  createdAt: string;       // ISO 8601 format
}
```

### LostItemDetailed (Full Details)
```typescript
interface LostItemDetailed {
  id: number;
  ownerId: number;
  ownerEmail: string;
  title: string;
  description: string;
  phone: string;
  lastLocationDescription: string;
  lastLocation: Location;
  lostItemImageUris: string[];      // All images
  itemFounders: Founder[];          // People who found it
  createdAt: string;
}
```

### Founder
```typescript
interface Founder {
  id: number;
  username: string;
  phone: string;
  founderEmail: string;
  foundLocationDescription: string;
  lastLocation: Location;
  foundItemImageUris: string[];
  createdAt: string;
}
```

### LostItemsPage (Paginated Response)
```typescript
interface LostItemsPage {
  content: LostItemBasic[];
  totalElements: number;    // Total items in DB
  totalPages: number;       // Total pages
  size: number;             // Page size
  number: number;           // Current page (0-indexed)
}
```

---

## 💡 Usage Examples

### Example 1: Display Lost Items Feed

```typescript
import { lostItemService } from '@/services/lostfound.service';
import { useState, useEffect } from 'react';

function LostItemsFeed() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadItems();
  }, [page]);

  const loadItems = async () => {
    try {
      const response = await lostItemService.getAllLostItems(page, 20);
      setItems(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
}
```

### Example 2: Create Lost Item Report

```typescript
import { lostItemService } from '@/services/lostfound.service';
import { useAuthContext } from '@/contexts/AuthContext';

function ReportLostItemForm() {
  const { user } = useAuthContext();
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (formData) => {
    try {
      await lostItemService.createLostItem(user.id, {
        title: formData.title,
        description: formData.description,
        phone: formData.phone,
        lastLocationDescription: formData.location,
        lastLocation: formData.coordinates,
        lostItemImages: images
      });
      
      alert('Lost item reported successfully!');
    } catch (error) {
      alert('Failed to create report: ' + error.message);
    }
  };

  // Form UI...
}
```

### Example 3: Report Finding an Item

```typescript
import { founderService } from '@/services/lostfound.service';

function ReportFoundButton({ lostItemId }) {
  const { user } = useAuthContext();
  const [photos, setPhotos] = useState<File[]>([]);

  const handleReport = async () => {
    try {
      await founderService.reportFoundItem(
        user.id,
        lostItemId,
        {
          foundLocationDescription: 'Found in Main Library',
          foundLocation: { lat: 24.8607, lng: 67.0011 },
          foundItemImages: photos
        }
      );
      
      alert('Thank you for reporting!');
    } catch (error) {
      alert('Failed to submit report: ' + error.message);
    }
  };

  return <button onClick={handleReport}>I Found This!</button>;
}
```

### Example 4: View Item Details

```typescript
import { lostItemService } from '@/services/lostfound.service';

function ItemDetailsScreen({ itemId }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    loadDetails();
  }, [itemId]);

  const loadDetails = async () => {
    const data = await lostItemService.getLostItemWithFounders(itemId);
    setItem(data);
  };

  if (!item) return <Loading />;

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <p>Contact: {item.phone}</p>
      <p>Last seen: {item.lastLocationDescription}</p>
      
      <h2>Images</h2>
      {item.lostItemImageUris.map(uri => (
        <img key={uri} src={uri} />
      ))}
      
      <h2>People who found this ({item.itemFounders.length})</h2>
      {item.itemFounders.map(founder => (
        <FounderCard key={founder.id} founder={founder} />
      ))}
    </div>
  );
}
```

---

## 🧪 Testing Guide

### Prerequisites
1. Backend running: `http://192.168.1.14:8080`
2. Database: PostgreSQL via Docker
3. Logged in user with valid token

### Test Sequence

#### Test 1: Get All Lost Items
```bash
curl -X GET "http://192.168.1.14:8080/api/v1/lostItem/findAllLostItems?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Paginated list of lost items

#### Test 2: Get Item Details
```bash
curl -X GET "http://192.168.1.14:8080/api/v1/lostItem/findLostItemWithFounders/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Full item details with founders array

#### Test 3: Create Lost Item
```bash
curl -X POST "http://192.168.1.14:8080/api/v1/lostItem/createRequest/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Test Item" \
  -F "description=Test Description" \
  -F "phone=03001234567" \
  -F "lastLocationDescription=Test Location" \
  -F "lastLocation.lat=24.8607" \
  -F "lastLocation.lng=67.0011" \
  -F "lostItemImages=@image1.jpg" \
  -F "lostItemImages=@image2.jpg"
```

Expected: 201 Created

#### Test 4: Report Found Item
```bash
curl -X POST "http://192.168.1.14:8080/api/v1/founder/foundLostItem/2/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "foundLocationDescription=Found Location" \
  -F "foundLocation.lat=24.8608" \
  -F "foundLocation.lng=67.0012" \
  -F "foundItemImages=@found1.jpg"
```

Expected: 201 Created

#### Test 5: Mark as Found
```bash
curl -X PATCH "http://192.168.1.14:8080/api/v1/lostItem/markLostItemFound/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: 200 OK

### Frontend Testing

```typescript
// In your React component or test file
import { lostItemService, founderService } from '@/services/lostfound.service';

// Test 1: Load items
const testLoadItems = async () => {
  const page = await lostItemService.getAllLostItems(0, 10);
  console.log('✅ Loaded items:', page.content.length);
};

// Test 2: Get details
const testGetDetails = async () => {
  const item = await lostItemService.getLostItemWithFounders(1);
  console.log('✅ Item details:', item.title);
  console.log('✅ Founders count:', item.itemFounders.length);
};

// Test 3: Create item (with mock files)
const testCreateItem = async () => {
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  await lostItemService.createLostItem(1, {
    title: 'Test Item',
    description: 'Test Description',
    phone: '03001234567',
    lastLocationDescription: 'Test Location',
    lostItemImages: [mockFile]
  });
  console.log('✅ Item created');
};
```

---

## 📝 Validation Rules

### Phone Number
- Format: `03XXXXXXXXX` (11 digits)
- Must start with `03`
- Example: `03001234567`

### Title
- Min length: 2 characters
- Max length: 100 characters

### Description
- Max length: 255 characters

### Location Description
- Max length: 255 characters

### Images
- Required for both lost item creation and found item reporting
- Must be actual file uploads
- Backend handles S3 upload

---

## 🚀 Quick Reference

**Import Statement**:
```typescript
import { lostItemService, founderService } from '@/services/lostfound.service';
```

**Main Methods**:
```typescript
// Lost Item Operations
lostItemService.createLostItem(userId, data)
lostItemService.getAllLostItems(page, size)
lostItemService.getLostItemsByUserId(userId, status)
lostItemService.getLostItemWithFounders(itemId)
lostItemService.markItemAsFound(itemId)

// Founder Operations
founderService.reportFoundItem(founderId, itemId, data)
```

**File Locations**:
- Service: `src/services/lostfound.service.ts`
- Types: Exported from service file
- Old service (remove): `src/services/lostitem.service.ts`
