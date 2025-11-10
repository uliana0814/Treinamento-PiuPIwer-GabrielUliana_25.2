# Social Media API - Twitter-like CRUD

This document describes all the endpoints for the social media features including Users, Posts, Comments, Likes, and Follow functionality.

## Table of Contents
- [Users](#users)
- [Posts](#posts)
- [Comments](#comments)
- [Likes](#likes)
- [Follow/Unfollow](#follow-unfollow)

---

## Users

### User Model
```typescript
{
  id: string
  name: string
  email: string
  image?: string
  dateOfBirth?: DateTime
  location?: string (city)
  createdAt: DateTime
  updatedAt: DateTime
  
  // Counts
  _count: {
    followers: number
    following: number
    posts: number
    comments: number
    likes: number
  }
}
```

### Get All Users
```
GET /api/users
```
Returns all users with their follower/following counts.

**Authentication:** Required (ADMIN/SUPER_ADMIN)

### Get User by ID
```
GET /api/users/:id
```
Returns user details including counts for followers, following, posts, comments, and likes.

### Get User's Posts
```
GET /api/users/:id/posts?page=1&limit=20
```
Returns paginated list of posts by a specific user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Posts

### Post Model
```typescript
{
  id: string
  text: string (max 280 characters)
  imageUrl?: string
  createdAt: DateTime
  updatedAt: DateTime
  
  author: User
  authorId: string
  
  _count: {
    likes: number
    comments: number
  }
}
```

### Get All Posts
```
GET /api/posts?page=1&limit=20
```
Returns paginated list of all posts, ordered by creation date (newest first).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "posts": [
    {
      "id": "...",
      "text": "Post content",
      "imageUrl": "https://...",
      "createdAt": "2025-11-04T...",
      "author": {
        "id": "...",
        "name": "User Name",
        "email": "user@example.com",
        "image": "https://..."
      },
      "_count": {
        "likes": 10,
        "comments": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Get Post by ID
```
GET /api/posts/:id
```
Returns a single post with full details including comments and likes.

**Response:**
```json
{
  "id": "...",
  "text": "Post content",
  "imageUrl": "https://...",
  "author": { ... },
  "comments": [
    {
      "id": "...",
      "text": "Comment text",
      "author": { ... },
      "createdAt": "..."
    }
  ],
  "likes": [
    {
      "id": "...",
      "user": { ... },
      "createdAt": "..."
    }
  ],
  "_count": {
    "likes": 10,
    "comments": 5
  }
}
```

### Create Post
```
POST /api/posts
```

**Authentication:** Required (USER/ADMIN/SUPER_ADMIN)

**Body:**
```json
{
  "text": "Post content (1-280 characters)",
  "imageUrl": "https://example.com/image.jpg" // optional
}
```

**Upload Image Flow:**
1. First, upload image using `POST /api/uploads` to get the image URL
2. Then create post with the returned `fileUrl` as `imageUrl`

### Update Post
```
PATCH /api/posts/:id
```

**Authentication:** Required (must be post author)

**Body:**
```json
{
  "text": "Updated content", // optional
  "imageUrl": "https://..." // optional, can be null to remove
}
```

### Delete Post
```
DELETE /api/posts/:id
```

**Authentication:** Required (must be post author)

---

## Comments

### Comment Model
```typescript
{
  id: string
  text: string (max 280 characters)
  createdAt: DateTime
  updatedAt: DateTime
  
  author: User
  authorId: string
  
  post: Post
  postId: string
}
```

### Get Comments for Post
```
GET /api/posts/:id/comments?page=1&limit=50
```
Returns paginated list of comments for a specific post.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

### Create Comment
```
POST /api/posts/:id/comments
```

**Authentication:** Required

**Body:**
```json
{
  "text": "Comment content (1-280 characters)"
}
```

### Update Comment
```
PATCH /api/posts/:postId/comments/:commentId
```

**Authentication:** Required (must be comment author)

**Body:**
```json
{
  "text": "Updated comment content"
}
```

### Delete Comment
```
DELETE /api/posts/:postId/comments/:commentId
```

**Authentication:** Required (must be comment author)

---

## Likes

### Like Post
```
POST /api/posts/:id/likes
```

**Authentication:** Required

Adds a like to the post. Returns error if already liked.

### Unlike Post
```
DELETE /api/posts/:id/likes
```

**Authentication:** Required

Removes a like from the post. Returns error if not previously liked.

---

## Follow/Unfollow

### Follow User
```
POST /api/users/:id/follow
```

**Authentication:** Required

Follows the specified user. Returns error if:
- Trying to follow yourself
- Already following the user
- User doesn't exist

**Response:**
```json
{
  "message": "Usuário seguido com sucesso",
  "follow": {
    "id": "...",
    "followerId": "...",
    "followingId": "...",
    "following": {
      "id": "...",
      "name": "...",
      "email": "...",
      "image": "...",
      "location": "..."
    },
    "createdAt": "..."
  }
}
```

### Unfollow User
```
DELETE /api/users/:id/follow
```

**Authentication:** Required

Unfollows the specified user. Returns error if not following.

### Get User's Followers
```
GET /api/users/:id/follow?type=followers&page=1&limit=50
```

Returns paginated list of users following the specified user.

**Query Parameters:**
- `type`: Must be "followers"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "followers": [
    {
      "id": "...",
      "name": "...",
      "email": "...",
      "image": "...",
      "location": "...",
      "_count": {
        "followers": 10,
        "following": 20,
        "posts": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### Get User's Following
```
GET /api/users/:id/follow?type=following&page=1&limit=50
```

Returns paginated list of users that the specified user is following.

**Query Parameters:**
- `type`: Must be "following"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

Response format same as Get Followers.

---

## Image Upload

To upload images for posts, use the existing uploads endpoint:

```
POST /api/uploads
```

**Authentication:** Required (ADMIN/SUPER_ADMIN by default, adjust as needed)

**Body:**
```json
{
  "fileName": "image.jpg",
  "fileType": "image/jpeg",
  "folder": "posts"
}
```

**Response:**
```json
{
  "uploadUrl": "https://...", // Use this to upload the file
  "fileUrl": "https://..." // Use this in your post's imageUrl
}
```

**Upload Flow:**
1. Call POST `/api/uploads` to get presigned URL
2. Upload file to `uploadUrl` using PUT request
3. Use `fileUrl` when creating/updating post

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation error, already exists, etc.)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not authorized to perform action)
- `404`: Not Found
- `409`: Conflict (e.g., user already exists)
- `500`: Internal Server Error

---

## Authentication

Most endpoints require authentication. The user session is passed via the `x-user-session` header by the middleware.

The session contains:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    ...
  }
}
```

---

## Database Schema

### Key Relations
- User has many Posts (author)
- User has many Comments (author)
- User has many Likes
- User has many Followers (Follow relation)
- User has many Following (Follow relation)
- Post has many Comments
- Post has many Likes
- Post belongs to User (author)
- Comment belongs to User (author)
- Comment belongs to Post
- Like belongs to User and Post
- Follow connects two Users (follower and following)

### Unique Constraints
- User: email
- Like: userId + postId (can't like same post twice)
- Follow: followerId + followingId (can't follow same user twice)

### Cascade Deletes
- Deleting a User cascades to:
  - Their Posts
  - Their Comments
  - Their Likes
  - Their Follow relations (both as follower and following)
- Deleting a Post cascades to:
  - All Comments on that post
  - All Likes on that post
