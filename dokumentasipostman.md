# Dokumentasi API Mahasiswa

## Base URL

```
http://localhost:4000/api/mahasiswa
```

## Endpoints

### 1. Create Mahasiswa (POST)

- **URL:** `/`
- **Method:** POST
- **Headers:**
  - Content-Type: application/json
- **Body:**

```json
{
  "nim": "20190001",
  "nama": "John Doe",
  "jurusan": "Teknik Informatika",
  "semester": 5,
  "email": "john@example.com"
}
```

- **Success Response (201):**

```json
{
  "message": "Mahasiswa berhasil ditambahkan",
  "data": {
    "nim": "20190001",
    "nama": "John Doe",
    "jurusan": "Teknik Informatika",
    "semester": 5,
    "email": "john@example.com",
    "_id": "...",
    "createdAt": "2023-XX-XX",
    "updatedAt": "2023-XX-XX"
  }
}
```

- **Error Response (400):**

```json
{
  "message": "Validation failed",
  "data": [
    {
      "msg": "NIM harus diisi!",
      "param": "nim",
      "location": "body"
    }
  ]
}
```

### 2. Get All Mahasiswa (GET)

- **URL:** `/`
- **Method:** GET
- **Success Response (200):**

```json
{
  "message": "Berhasil mengambil data mahasiswa",
  "data": [
    {
      "_id": "...",
      "nim": "20190001",
      "nama": "John Doe",
      "jurusan": "Teknik Informatika",
      "semester": 5,
      "email": "john@example.com"
    }
  ]
}
```

### 3. Search Mahasiswa by NIM (GET)

- **URL:** `/search?nim=20190001`
- **Method:** GET
- **Query Params:** nim
- **Success Response (200):**

```json
{
  "message": "Mahasiswa ditemukan",
  "data": {
    "_id": "...",
    "nim": "20190001",
    "nama": "John Doe",
    "jurusan": "Teknik Informatika",
    "semester": 5,
    "email": "john@example.com"
  }
}
```

- **Error Response (404):**

```json
{
  "message": "Mahasiswa tidak ditemukan"
}
```

### 4. Get Mahasiswa by ID (GET)

- **URL:** `/:id`
- **Method:** GET
- **Success Response (200):**

```json
{
  "message": "Mahasiswa ditemukan",
  "data": {
    "_id": "...",
    "nim": "20190001",
    "nama": "John Doe",
    "jurusan": "Teknik Informatika",
    "semester": 5,
    "email": "john@example.com"
  }
}
```

### 5. Update Mahasiswa (PUT)

- **URL:** `/:id`
- **Method:** PUT
- **Headers:**
  - Content-Type: application/json
- **Body:**

```json
{
  "nim": "20190001",
  "nama": "John Doe Updated",
  "jurusan": "Teknik Informatika",
  "semester": 6,
  "email": "john.updated@example.com"
}
```

- **Success Response (200):**

```json
{
  "message": "Mahasiswa berhasil diupdate",
  "data": {
    "_id": "...",
    "nim": "20190001",
    "nama": "John Doe Updated",
    "jurusan": "Teknik Informatika",
    "semester": 6,
    "email": "john.updated@example.com"
  }
}
```

### 6. Delete Mahasiswa (DELETE)

- **URL:** `/:id`
- **Method:** DELETE
- **Success Response (200):**

```json
{
  "message": "Mahasiswa berhasil dihapus"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (Validation Error)
- 404: Not Found
- 409: Conflict (Duplicate NIM/Email)
- 500: Server Error

## Testing Steps

1. **Create Mahasiswa**

   - Send POST request with valid data
   - Try sending invalid data to test validation
   - Try creating duplicate NIM/email to test conflict handling

2. **Get All Mahasiswa**

   - Send GET request to base URL
   - Verify the list format and sorting

3. **Search by NIM**

   - Test with existing NIM
   - Test with non-existing NIM
   - Test without providing NIM parameter

4. **Get by ID**

   - Test with valid ID
   - Test with invalid ID format
   - Test with non-existing ID

5. **Update Mahasiswa**

   - Test with valid data
   - Test with invalid data
   - Test updating to existing NIM/email
   - Test with non-existing ID

6. **Delete Mahasiswa**
   - Test deleting existing record
   - Test deleting already deleted record
   - Test with invalid ID
