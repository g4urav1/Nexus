Structure:

```
src/
 ├── components/
 │    ├── Navbar
 │    ├── Sidebar
 │    ├── BottomNav
 │    ├── StoryCarousel
 │    ├── PostCard
 │    ├── CommentSection
 │    ├── UserAvatar
 │    ├── FollowButton
 │    ├── NotificationItem
 │    ├── ChatList
 │    ├── ChatWindow
 │    ├── SearchBar
 │    ├── ImageGrid
 │    └── ...
 │
 ├── pages/
 │    ├── Login
 │    ├── Signup
 │    ├── Feed
 │    ├── Explore
 │    ├── Profile
 │    ├── Inbox
 │    ├── Chat
 │    ├── Post
 │    ├── Settings
 │    └── EditProfile
 │
 ├── layouts/
 │    ├── AuthLayout
 │    └── MainLayout
 │
 └── hooks/
```

## Recommended stack



* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Framer Motion
* React Router
* TanStack Query (optional)

That combination produces modern-looking UIs very quickly.

---

## Screens

### 1. Feed

Contains

* Story carousel
* Infinite posts
* Like
* Comment
* Share
* Save
* Double tap animation
* Skeleton loading

---

### 2. Explore

Pinterest/Instagram style

```
□ □ □
□ ■ ■
■ ■ □
```

* Search bar
* Trending hashtags
* Categories
* Masonry grid

---

### 3. Profile

* Avatar
* Bio
* Followers
* Following
* Posts count
* Tabs

```
Posts
Reels
Tagged
```

Grid gallery

---

### 4. Inbox

Left

```
Search

Alice
Bob
Charlie
```

Right

```
Conversation

Message bubbles

Input

😊 📷 ❤️
```

---

### 5. Login

Modern glassmorphism card

```
Logo

Email

Password

Sign In

Continue with Google

Create Account
```

---

### 6. Signup

* Username
* Email
* Password
* Confirm Password
* Avatar upload

---

### 7. Single Post

Large image

Comments

Suggested posts

---

## Components

Generate reusable components like

```
<PostCard />

<StoryCarousel />

<UserCard />

<ProfileHeader />

<FollowersModal />

<CommentInput />

<ImageUploader />

<PostComposer />

<NotificationDropdown />

<MessageBubble />

<Sidebar />

<BottomNavigation />

<SearchModal />

<LikeButton />

<FollowButton />

<Avatar />
```

---

## Prompt I'd use

This prompt consistently produces high-quality React components:

```text
You are a senior React UI engineer.

Create a modern Instagram-inspired social media UI.

Requirements:
- React 
- TailwindCSS
- shadcn/ui
- Lucide React icons
- Responsive
- Accessible
- Dark mode support
- Mobile-first
- Production-quality code
- No placeholder comments
- Split into reusable components
- Use realistic dummy data
- Use Framer Motion for subtle animations
- Clean folder structure
- Export all components
- Avoid unnecessary dependencies
```

Then ask for one page at a time, for example:

> Create the Feed page with reusable PostCard, StoryCarousel and Sidebar components.

---

## AI workflow

A workflow that works well is:

1. Generate the page.
2. Ask it to refactor into smaller reusable components.
3. Improve responsiveness.
4. Add animations.
5. Add loading skeletons.
6. Add dark mode.
7. Connect to your backend.

---

## Since you're building an MVP

You don't need every Instagram feature. I'd prioritize:

* ✅ Login
* ✅ Signup
* ✅ Feed
* ✅ Create Post
* ✅ Like
* ✅ Comment
* ✅ User Profile
* ✅ Follow/Unfollow
* ✅ Explore
* ✅ Inbox (basic one-to-one messaging)

You can leave out Stories, Reels, live video, notifications, and advanced messaging features until later.

This approach gives you a polished, maintainable frontend while letting you focus on the backend logic and core functionality.
