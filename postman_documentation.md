# API Documentation

Base URL: `http://localhost:4000`

## Genre Endpoints

### 1. Create Genre
- **Endpoint:** `POST /v1/genre`
- **Description:** Create a new genre
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Action",
    "description": "Action-packed movies with intense sequences"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Genre created successfully",
    "data": {
      "_id": "generated-id",
      "name": "Action",
      "description": "Action-packed movies with intense sequences",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```
- **Error Response (400):**
  ```json
  {
    "message": "Validation failed",
    "data": [
      {
        "msg": "Nama genre harus diisi!",
        "param": "name",
        "location": "body"
      }
    ]
  }
  ```

### 2. Get All Genres
- **Endpoint:** `GET /v1/genre`
- **Description:** Retrieve all genres
- **Success Response (200):**
  ```json
  {
    "message": "Fetched genres successfully",
    "data": [
      {
        "_id": "genre-id-1",
        "name": "Action",
        "description": "Action-packed movies",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      },
      {
        "_id": "genre-id-2",
        "name": "Comedy",
        "description": "Funny movies",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ]
  }
  ```

### 3. Get Genre by ID
- **Endpoint:** `GET /v1/genre/:id`
- **Description:** Retrieve a specific genre by ID
- **URL Parameters:**
  - `id`: Genre ID
- **Success Response (200):**
  ```json
  {
    "message": "Genre fetched",
    "data": {
      "_id": "genre-id",
      "name": "Action",
      "description": "Action-packed movies",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "message": "Genre not found",
    "data": null
  }
  ```

### 4. Update Genre
- **Endpoint:** `PUT /v1/genre/:id`
- **Description:** Update an existing genre
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **URL Parameters:**
  - `id`: Genre ID
- **Request Body:**
  ```json
  {
    "name": "Updated Action",
    "description": "Updated description for action movies"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Genre updated",
    "data": {
      "_id": "genre-id",
      "name": "Updated Action",
      "description": "Updated description for action movies",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```
- **Error Responses:**
  - **400 (Validation Error):**
    ```json
    {
      "message": "Validation failed",
      "data": [
        {
          "msg": "Nama genre harus diisi!",
          "param": "name",
          "location": "body"
        }
      ]
    }
    ```
  - **404 (Not Found):**
    ```json
    {
      "message": "Genre not found",
      "data": null
    }
    ```

### 5. Delete Genre
- **Endpoint:** `DELETE /v1/genre/:id`
- **Description:** Delete a genre
- **URL Parameters:**
  - `id`: Genre ID
- **Success Response (200):**
  ```json
  {
    "message": "Genre deleted"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "message": "Genre not found",
    "data": null
  }
  ```

## Error Handling
All endpoints may return the following error response in case of server errors:
- **500 (Internal Server Error):**
  ```json
  {
    "message": "Internal Server Error",
    "data": null
  }
  ```
