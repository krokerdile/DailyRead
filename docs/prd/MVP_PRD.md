# PRD - daillyRead (MVP)

## 1. Overview
- Product: `daillyRead`
- One-liner: Aggregate developer blog posts, deliver daily morning email, and help discovery via likes/comments/recommendations.

## 2. Problem Statement
- Blogs are scattered across many sites.
- Legacy RSS/email services are gone or hard to maintain.
- Sharing and social discovery are weak.
- Collection alone is not enough; users need "what to read now."

Core need:
Users want to read preferred developer blogs in one place, not miss updates via email, and quickly find quality posts through community reaction.

## 3. Goals
- Provide sustainable reading workflow for individuals and small groups.
- Build daily revisit habit via morning digest email.
- Expand feed into community curation with likes/comments/recommendations.

MVP success:
- New posts are collected reliably from registered blogs.
- Daily morning email is consistently useful.
- Popular/recommended posts improve feed exploration.

## 4. Target Users
- Primary: regular dev blog readers, former RSS/email users, individual developers who do not want to miss good posts.
- Secondary: small groups sharing articles, curation-focused users.

## 5. Scope
This MVP includes V1.

### In Scope
- Blog registration and RSS collection
- Web feed (list and popular posts)
- Daily morning email notifications
- Like and comment
- Activity ranking (users/posts)
- URL-based recommendation
- Group subscription and group digest email

### Out of Scope
- Clean-reader rendering
- Non-RSS HTML scraping
- Personalized recommendation algorithm
- Auto-tagging
- Large-scale public community management

## 6. Functional Requirements

### A. Blog registration and collection
- Accept blog URL or RSS URL.
- Auto-discover RSS.
- Block duplicate blog/RSS registration.
- Collect on schedule via RSS.
- Store title, URL, publish date, blog metadata.
- Deduplicate posts.
- Persist collection failure logs.

### B. Feed and exploration
- Main feed default sort by latest.
- Filters: by blog, by period (today/7d/30d).
- Support infinite scroll or pagination.
- Popular posts by likes + views, weekly period.

### C. Email notifications
- Send every morning (fixed time, e.g. 09:00).
- Send only when at least one post exists in last 24h.
- Include new posts grouped by blog and optional popular TOP N.
- Support individual/group subscription and unsubscribe.

### D. Community reactions
- Increment views on post detail.
- Prevent duplicate views per user within 24h.
- Like: one per user, cancelable.
- Comment: create/edit/delete own comments, admin can delete any.

### E. Activity and ranking
- Activity events: like, comment, recommendation, group participation.
- Weekly ranking: active users TOP N, high-reaction posts TOP N.

### F. Recommendation
- User submits post URL.
- Collect OG metadata.
- If post exists, append recommendation only.
- Expose in main feed or dedicated recommendation section, show recommender.

### G. Group
- Group create/invite/leave.
- Group-scoped blog subscriptions.
- Daily group digest to members.

## 7. Non-Functional Requirements
- Feed latency: average < 500ms
- Email failure rate: < 1%
- RSS failure logging and retry for email send
- Admin moderation: disable comment/post/blog
- Baseline logging and monitoring

## 8. User Flow
1. Login and register blogs
2. System collects posts
3. User checks web feed
4. User receives morning digest
5. User reacts with likes/comments
6. User recommends URLs
7. User explores popular posts and active users

## 9. Release Criteria
- RSS collection works reliably
- Email dispatch is stable at scheduled time
- Popular/recommended sections provide practical reading value
- Group digest is usable
- Community features operate without major abuse risk

## 10. Future (Out of MVP)
- Clean reader
- Personalized recommendation
- Tag/topic curation
- Public curation channels

Summary:
daillyRead MVP focuses on building a daily reading habit, not only collecting links.

