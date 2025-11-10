# Quick Start Guide - Social Media API

## 🚀 Getting Started

### 1. Push Database Schema Changes

Since we've updated the Prisma schema, you need to push the changes to your MongoDB database:

```bash
cd web
npx prisma db push
```

Or if you prefer to create a migration (recommended for production):

```bash
cd web
npx prisma migrate dev --name add_social_media_models
```

### 2. Verify Prisma Client

The Prisma client has already been generated. If you need to regenerate it:

```bash
cd web
npx prisma generate
```

### 3. (Optional) Allow Users to Upload Images

If you want regular users to upload images for their posts, update the upload route permissions:

**File:** `web/src/app/(backend)/api/uploads/route.ts`

```typescript
const allowedRoles: AllowedRoutes = {
  POST: ["USER", "ADMIN", "SUPER_ADMIN"], // Add "USER" here
  DELETE: ["USER", "ADMIN", "SUPER_ADMIN"] // Add "USER" here
}
```

## 🧪 Testing the API

### Using Bruno

1. Open Bruno and navigate to the project collection
2. Start with authentication:
   - Use `auth/login.bru` to login
   - The session will be automatically saved for subsequent requests

3. Test the endpoints in this order:

#### A. Create a Post
- Use `posts/create.bru`
- Body example:
```json
{
  "text": "Hello World! This is my first post.",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### B. Like the Post
- Use `posts/[id]/like.bru`
- Replace `:id` with the post ID from step A

#### C. Comment on the Post
- Use `posts/[id]/createComment.bru`
- Body example:
```json
{
  "text": "Great post!"
}
```

#### D. Follow Another User
- Use `users/[id]/followUser.bru`
- Replace `:id` with another user's ID

#### E. View User's Feed
- Use `posts/getAll.bru` to see all posts
- Use `users/[id]/getUserPosts.bru` to see a specific user's posts

### Manual Testing with cURL

#### 1. Login First
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### 2. Create a Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{"text":"My first post!","imageUrl":"https://example.com/image.jpg"}'
```

#### 3. Get All Posts
```bash
curl http://localhost:3000/api/posts?page=1&limit=20
```

## 📊 Available Endpoints

### Posts
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post (auth required)
- `GET /api/posts/:id` - Get post details
- `PATCH /api/posts/:id` - Update post (author only)
- `DELETE /api/posts/:id` - Delete post (author only)

### Likes
- `POST /api/posts/:id/likes` - Like post (auth required)
- `DELETE /api/posts/:id/likes` - Unlike post (auth required)

### Comments
- `GET /api/posts/:id/comments` - List comments
- `POST /api/posts/:id/comments` - Create comment (auth required)
- `PATCH /api/posts/:id/comments/:commentId` - Update comment (author only)
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment (author only)

### Follow/Unfollow
- `POST /api/users/:id/follow` - Follow user (auth required)
- `DELETE /api/users/:id/follow` - Unfollow user (auth required)
- `GET /api/users/:id/follow?type=followers` - Get followers
- `GET /api/users/:id/follow?type=following` - Get following

### User Posts
- `GET /api/users/:id/posts` - Get user's posts

## 💡 Common Workflows

### Workflow 1: Create a Post with Image

1. **Upload Image**
```bash
POST /api/uploads
{
  "fileName": "my-image.jpg",
  "fileType": "image/jpeg",
  "folder": "posts"
}
# Returns: { uploadUrl, fileUrl }
```

2. **Upload File to S3**
```bash
PUT <uploadUrl>
# Upload your image file
```

3. **Create Post with Image**
```bash
POST /api/posts
{
  "text": "Check out this image!",
  "imageUrl": "<fileUrl from step 1>"
}
```

### Workflow 2: Social Interaction

1. **Follow a user**
```bash
POST /api/users/:userId/follow
```

2. **View their posts**
```bash
GET /api/users/:userId/posts
```

3. **Like a post**
```bash
POST /api/posts/:postId/likes
```

4. **Comment on the post**
```bash
POST /api/posts/:postId/comments
{
  "text": "Awesome post!"
}
```

### Workflow 3: View User Profile

1. **Get user details**
```bash
GET /api/users/:userId
# Returns user with counts: followers, following, posts, etc.
```

2. **Get user's posts**
```bash
GET /api/users/:userId/posts?page=1&limit=20
```

3. **Get user's followers**
```bash
GET /api/users/:userId/follow?type=followers
```

4. **Get user's following**
```bash
GET /api/users/:userId/follow?type=following
```

## 🔒 Authentication Notes

- Most POST/PATCH/DELETE endpoints require authentication
- Authentication is handled via session cookies by better-auth
- The middleware automatically adds user info to request headers
- GET endpoints for viewing posts/comments are public by default

## ⚠️ Important Notes

1. **Character Limits**: Posts and comments are limited to 280 characters (like Twitter)

2. **Unique Constraints**:
   - Can't like the same post twice
   - Can't follow the same user twice
   - Can't follow yourself

3. **Ownership**: Only the author can edit or delete their own posts/comments

4. **Cascade Deletes**: 
   - Deleting a user removes all their posts, comments, likes, and follows
   - Deleting a post removes all its comments and likes

5. **Pagination**: All list endpoints support pagination with `page` and `limit` query parameters

## 📚 Full Documentation

For complete API documentation, see:
- `SOCIAL-MEDIA-API.md` - Detailed endpoint documentation
- `SOCIAL-MEDIA-IMPLEMENTATION.md` - Implementation overview

## 🐛 Troubleshooting

### Issue: "Property 'post' does not exist on Prisma Client"
**Solution**: Run `npx prisma generate` to regenerate the Prisma client

### Issue: Getting 401 Unauthorized
**Solution**: Make sure you're logged in and the session cookie is being sent with requests

### Issue: Can't upload images
**Solution**: Check that AWS credentials are configured in `.env`:
```
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
```

### Issue: Database errors
**Solution**: Make sure you ran `npx prisma db push` to update the database schema

## 🎉 You're Ready!

Your social media API is now ready to use. Start testing with Bruno or build a frontend to consume these endpoints!
