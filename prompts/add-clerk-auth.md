# Implementation Prompt: Add Clerk Authentication

## Goal
Set up Clerk authentication for Vertex Next.js App Router application using `@clerk/nextjs` SDK, link project to Clerk application `app_3JLqMTRluX2HBPRZ5OCfb4CFFrP`, configure root `ClerkProvider`, Next.js proxy middleware, catch-all sign-in and sign-up routes, and header authentication controls.

## Skills & Documentation Read
- `AGENTS.md` rules
- `clerk` skill & `clerk-setup` skill
- `clerk-nextjs-patterns` skill (`middleware-strategies.md`, `server-vs-client.md`)
- `package.json` & `.env.local`

## Code Inspected
- `package.json`: `@clerk/nextjs` installed.
- `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` populated via `clerk env pull`.
- `app/layout.tsx`: Root Layout where `ClerkProvider` wraps body content.
- `app/page.tsx`: Header navigation bar where `SignInButton`, `SignUpButton`, `Show`, and `UserButton` will be rendered.

## Decisions & Assumptions
1. **Clerk Provider**: Wrap `<body />` content in `<ClerkProvider>` inside `app/layout.tsx`.
2. **Environment Configuration**: Include `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` in `.env.local`.
3. **Proxy Middleware**: Create `proxy.ts` using `clerkMiddleware()` with `config.matcher` including `/(api|trpc)(.*)` and `/__clerk/:path*`.
4. **Auth Routes**:
   - `app/sign-in/[[...sign-in]]/page.tsx` rendering `<SignIn />`.
   - `app/sign-up/[[...sign-up]]/page.tsx` rendering `<SignUp />`.
5. **Header Auth Controls**: Replace placeholder static avatar in `app/page.tsx` header with dynamic `@clerk/nextjs` auth state (`Show when="signed-out"` with `SignInButton` and `SignUpButton`, `Show when="signed-in"` with `UserButton`).

## Files to Touch
- `.env.local`
- `proxy.ts`
- `app/layout.tsx`
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`
- `app/page.tsx`
- `prompts/add-clerk-auth.md`

## Requirements
- `ClerkProvider` placed inside `<body>` tag.
- `CLERK_SECRET_KEY` kept strictly server-side.
- Next.js proxy middleware matcher includes `'/__clerk/:path*'`.
- Zero TypeScript or ESLint errors.

## Security Considerations
- `CLERK_SECRET_KEY` is kept only in `.env.local` and never imported or exposed to client components.
- Navigation header uses `SignInButton` and `SignUpButton` modal triggers or dedicated auth routes.

## Acceptance Criteria
1. `npx tsc --noEmit` completes cleanly with 0 errors.
2. `npm run lint` completes cleanly.
3. `clerk doctor` runs cleanly.
4. `http://localhost:3000` shows Sign In and Sign Up buttons when signed out, and UserButton when signed in.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `clerk doctor`

## Manual Test Steps
1. Navigate to `http://localhost:3000`.
2. Confirm Sign In / Sign Up buttons appear in the top header bar when signed out.
3. Click `Sign in` or `Sign up`, complete the auth flow, and verify the `UserButton` avatar replaces the sign-in buttons when signed in.
