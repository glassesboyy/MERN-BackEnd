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

## Movie Endpoints

### 1. Create Movie
- **Endpoint:** `POST /v1/movie/post`
- **Description:** Create a new movie
- **Headers:**
  ```
  Content-Type: multipart/form-data
  ```
- **Request Body (form-data):**
  ```
  title: "Movie Title"
  description: "Movie Description"
  genres: ["genre-id-1", "genre-id-2"] // atau JSON string
  year: 2024
  image: [file] // Image file
  ```
- **Success Response (201):**
  ```json
  {
    "message": "Movie Created!",
    "data": {
      "_id": "movie-id",
      "title": "Movie Title",
      "description": "Movie Description",
      "genres": [
        {
          "_id": "genre-id-1",
          "name": "Action",
          "description": "Action movies"
        }
      ],
      "year": 2024,
      "image": "http://localhost:4000/uploads/movieimages/image.jpg",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

### 2. Get All Movies
- **Endpoint:** `GET /v1/movie/posts`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 8)
  - `genre`: Filter by genre ID
  - `search`: Search by movie title
  - `year`: Filter by year
- **Example Requests:**
  ```
  GET /v1/movie/posts?page=1&limit=10
  GET /v1/movie/posts?genre=genre-id&search=avatar
  GET /v1/movie/posts?year=2024
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Get All Movie Success!",
    "data": [
      {
        "_id": "movie-id",
        "title": "Movie Title",
        "description": "Description",
        "genres": [...],
        "year": 2024,
        "image": "http://localhost:4000/uploads/movieimages/image.jpg"
      }
    ],
    "pagination": {
      "total_items": 100,
      "total_pages": 10,
      "current_page": 1,
      "limit": 10,
      "has_next": true,
      "has_prev": false
    }
  }
  ```

### 3. Get Movie by ID
- **Endpoint:** `GET /v1/movie/post/:id`
- **URL Parameters:**
  - `id`: Movie ID
- **Success Response (200):**
  ```json
  {
    "message": "Get Movie By Id Success!",
    "data": {
      "_id": "movie-id",
      "title": "Movie Title",
      "description": "Description",
      "genres": [...],
      "year": 2024,
      "image": "http://localhost:4000/uploads/movieimages/image.jpg"
    }
  }
  ```

### 4. Update Movie
- **Endpoint:** `PUT /v1/movie/post/:id`
- **Headers:**
  ```
  Content-Type: multipart/form-data
  ```
- **URL Parameters:**
  - `id`: Movie ID
- **Request Body (form-data):**
  ```
  title: "Updated Title"
  description: "Updated Description"
  genres: ["genre-id-1", "genre-id-2"]
  year: 2024
  image: [file] // Optional
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Movie Updated!",
    "data": {
      "_id": "movie-id",
      "title": "Updated Title",
      "description": "Updated Description",
      "genres": [...],
      "year": 2024,
      "image": "http://localhost:4000/uploads/movieimages/updated-image.jpg"
    }
  }
  ```

### 5. Delete Movie
- **Endpoint:** `DELETE /v1/movie/post/:id`
- **URL Parameters:**
  - `id`: Movie ID
- **Success Response (200):**
  ```json
  {
    "message": "Movie Deleted!"
  }
  ```

### 6. Get Movies by Genre
- **Endpoint:** `GET /v1/movie/genre/:genreId`
- **URL Parameters:**
  - `genreId`: Genre ID
- **Query Parameters:**
  Same as "Get All Movies"
- **Success Response (200):**
  ```json
  {
    "message": "Get All Movie Success!",
    "data": [...],
    "pagination": {...}
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
