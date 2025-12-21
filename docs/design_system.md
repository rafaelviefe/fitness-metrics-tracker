# Design System & UI Guidelines

## 1. Aesthetic Philosophy
**"Swiss International Style meets Apple Health."**
- Clean, minimalist, white-space heavy.
- High contrast.
- No gradients, no shadows (unless strictly semantic), no rounded blobs.

## 2. Color Palette
We use a strict neutral palette with **one** high-visibility accent.

- **Canvas:** `#FFFFFF` (White)
- **Surface:** `#F5F5F7` (Light Gray - Used for cards/inputs)
- **Text Primary:** `#1D1D1F` (Almost Black)
- **Text Secondary:** `#86868B` (Medium Gray)
- **Border/Line:** `#D2D2D7`
- **Accent Color:** **"Safety Orange" (`#FF5722`)**
  - Use ONLY for: Call-to-action buttons, active states, and critical data points.
  - *Do not overuse.* 90% of the app should be B&W.

## 3. Typography
- **Font Family:** Inter or System Sans-Serif.
- **Headings:** Bold, tight tracking (letter-spacing: -0.02em).
- **Body:** Regular, legible size (16px minimum for mobile inputs).

## 4. Component Rules (Shadcn-like)
- **Buttons:**
  - Primary: Solid Black background, White text.
  - Secondary: White background, Thin Gray border.
  - Destructive: White background, Red text.
- **Cards:**
  - Flat, 1px border (`#E5E5E5`), no shadow, small border-radius (8px).
- **Charts:**
  - Minimalist. No grid lines unless necessary. Use the Accent Color for the main trend line.

## 5. Mobile-First
- The Agent must assume the user is on a phone.
- Touch targets must be at least 44x44px.