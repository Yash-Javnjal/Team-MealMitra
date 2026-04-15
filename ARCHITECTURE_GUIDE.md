# Team MealMitra Production Architecture Guide

This guide is written against your current repo, not against an imaginary starter app.

Current repo mapping:

- Backend business logic already exists in [E-to-E_backend/services/impactService.js](/e:/Team-MealMitra/E-to-E_backend/services/impactService.js), [E-to-E_backend/services/geoMatchService.js](/e:/Team-MealMitra/E-to-E_backend/services/geoMatchService.js), [E-to-E_backend/services/notificationService.js](/e:/Team-MealMitra/E-to-E_backend/services/notificationService.js), and [E-to-E_backend/services/emailService.js](/e:/Team-MealMitra/E-to-E_backend/services/emailService.js).
- Backend "libs" are currently split across [E-to-E_backend/config](/e:/Team-MealMitra/E-to-E_backend/config) and [E-to-E_backend/utils](/e:/Team-MealMitra/E-to-E_backend/utils).
- Frontend global state already lives in [e-to-e_frontend/src/context/AuthContext.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/context/AuthContext.jsx) and [e-to-e_frontend/src/context/SocketContext.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/context/SocketContext.jsx).
- Frontend auth UI is currently centered in [e-to-e_frontend/src/components/AuthPanel.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/components/AuthPanel.jsx).
- Frontend NGO dashboard is already modularized in [e-to-e_frontend/src/modules/NGODashboard](/e:/Team-MealMitra/e-to-e_frontend/src/modules/NGODashboard).
- Carbon wallet is working as a reusable component today in [e-to-e_frontend/src/components/CarbonWallet](/e:/Team-MealMitra/e-to-e_frontend/src/components/CarbonWallet), but if it grows into a real product surface it should become its own module.

The big lead-level takeaway:

- Your app already has the right domain model.
- Your next maturity jump is not "add more code".
- It is "move orchestration into services, centralize shared libs, and make each frontend feature a true module".

## 1. Backend: `services/`

### 1. Purpose

The `services` layer is where business rules live.

In a real NGO or fintech app, routes should not decide:

- who is allowed to claim a donation
- how impact points are distributed
- when carbon credits should mint
- which side effects should happen after a delivery

That belongs in services because business rules change often, while HTTP transport should stay boring.

In your repo, the best example is `processCompletedDelivery()` in `impactService.js`. That is actual production-style domain logic: fetch delivery, check status, prevent double-processing, update wallets, mint credits.

### 2. Folder structure

Recommended scalable structure:

```txt
E-to-E_backend/
  src/
    modules/
      auth/
        auth.controller.js
        auth.service.js
        auth.repository.js
        auth.validator.js
      listings/
        listing.controller.js
        listing.service.js
        listing.repository.js
      claims/
        claim.controller.js
        claim.service.js
        claim.repository.js
      deliveries/
        delivery.controller.js
        delivery.service.js
        delivery.repository.js
      impact/
        impact.controller.js
        impact.service.js
        impact.repository.js
    lib/
      supabase.js
      mailer.js
      firebase.js
      logger.js
      errors.js
```

If you do not want a full `modules/` refactor yet, then keep your current shape but make services thinner and more focused:

```txt
services/
  authService.js
  donorService.js
  ngoService.js
  listingService.js
  claimService.js
  deliveryService.js
  impactService.js
  notificationService.js
```

### 3. How data flows

Real flow for MealMitra:

1. React donor form sends `POST /api/listings`.
2. Route/controller validates input and reads `req.user`.
3. `listingService.createListing()` inserts the listing.
4. `listingService` calls `geoMatchService` to find NGOs.
5. `notificationService` and `emailService` fire side effects.
6. API returns normalized response.
7. NGO dashboard fetches `/api/listings` or receives realtime update.

Lead rule:

- Routes handle transport.
- Services handle business rules.
- Repositories or DB helpers handle persistence.
- Side effects happen after the write is committed, not before.

### 4. Example implementation

```js
// src/modules/listings/listing.service.js
const listingRepository = require('./listing.repository');
const geoMatchService = require('../../services/geoMatchService');

async function createListing({ donorId, input }) {
  const listing = await listingRepository.create({
    donor_id: donorId,
    food_type: input.food_type,
    quantity_kg: input.quantity_kg,
    meal_equivalent: input.meal_equivalent,
    expiry_time: input.expiry_time,
    pickup_address: input.pickup_address,
    latitude: input.latitude,
    longitude: input.longitude,
    assigned_ngo_id: input.assigned_ngo_id || null,
    status: 'open',
    is_locked: false,
  });

  if (listing.assigned_ngo_id) {
    await geoMatchService.notifySpecificNGO(listing.listing_id, listing.assigned_ngo_id);
  } else {
    await geoMatchService.notifyNearbyNGOs(listing.listing_id);
  }

  return listing;
}

module.exports = { createListing };
```

```js
// src/modules/listings/listing.controller.js
const listingService = require('./listing.service');

async function createListing(req, res, next) {
  try {
    const listing = await listingService.createListing({
      donorId: req.donor.donor_id,
      input: req.body,
    });

    res.status(201).json({
      message: 'Listing created successfully',
      listing,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createListing };
```

### 5. Common mistakes

- Writing 200-line route handlers that validate, query DB, send email, calculate impact, and shape response in one file.
- Returning transport-specific objects from service layer, like `res.status(...).json(...)`.
- Not making side effects idempotent. Your wallet minting flow correctly checks existing credits before minting again.
- Keeping business constants only in frontend. Carbon thresholds must live in backend first.
- Repeating the same lookup logic in many routes, like fetching donor or NGO by `profile_id` every time.

### 6. How to scale it

At 100k+ users:

- Move from route-centric code to domain modules.
- Add repository layer to isolate Supabase queries.
- Make long-running side effects async using a queue.
- Make delivery completion impact processing event-driven and idempotent.
- Add audit tables for wallet transactions instead of only storing balances.
- Add caching for read-heavy endpoints like dashboard summary and leaderboards.

What I would refactor first in your current backend:

- Move claim creation orchestration out of [E-to-E_backend/routes/claims.js](/e:/Team-MealMitra/E-to-E_backend/routes/claims.js) into `claimService`.
- Move delivery completion orchestration out of [E-to-E_backend/routes/deliveries.js](/e:/Team-MealMitra/E-to-E_backend/routes/deliveries.js) into `deliveryService`.
- Keep `impactService.js` as the core domain engine for wallet logic.

## 2. Backend: `libs/` (`config/`, helpers, integrations)

### 1. Purpose

Backend libs are the plumbing layer.

They are not business logic. They are the reusable building blocks the business layer depends on:

- database client
- mail client
- Firebase admin client
- logger
- error classes
- environment parsing

In your repo, this role is currently split between:

- [E-to-E_backend/config/supabaseClient.js](/e:/Team-MealMitra/E-to-E_backend/config/supabaseClient.js)
- [E-to-E_backend/config/firebaseAdmin.js](/e:/Team-MealMitra/E-to-E_backend/config/firebaseAdmin.js)
- [E-to-E_backend/utils/mailer.js](/e:/Team-MealMitra/E-to-E_backend/utils/mailer.js)

That is fine for now. At scale, I would rename and centralize them as `lib/`.

### 2. Folder structure

```txt
lib/
  env.js
  supabase.js
  firebase.js
  mailer.js
  socket.js
  logger.js
  errors.js
  constants.js
```

### 3. How data flows

Example:

1. `authService` needs DB and email.
2. It imports `supabaseAdmin` from `lib/supabase.js`.
3. It imports `mailer` from `lib/mailer.js`.
4. `authService` performs registration.
5. `emailService` uses `mailer` to send welcome templates.

Lead rule:

- `lib/` knows how to talk to external systems.
- `services/` knows when and why to use them.

### 4. Example implementation

```js
// lib/env.js
function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: required('SUPABASE_URL'),
  SUPABASE_ANON_KEY: required('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: required('SUPABASE_SERVICE_ROLE_KEY'),
  EMAIL_HOST: required('EMAIL_HOST'),
  EMAIL_PORT: Number(process.env.EMAIL_PORT || 587),
  EMAIL_USER: required('EMAIL_USER'),
  EMAIL_PASS: required('EMAIL_PASS'),
};
```

```js
// lib/mailer.js
const nodemailer = require('nodemailer');
const env = require('./env');

const mailer = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

module.exports = { mailer };
```

### 5. Common mistakes

- Mixing env parsing into many files.
- Creating DB clients in multiple places.
- Putting business logic in helper files.
- Treating `utils` as a junk drawer.
- Making integrations hard to mock in tests.

### 6. How to scale it

- Add a single config bootstrap so the app fails fast on bad env.
- Add structured logging.
- Add tracing and request IDs.
- Add retry and timeout wrappers for email and push integrations.
- Add queue workers for external side effects.

## 3. Frontend: `context/`

### 1. Purpose

Context is for cross-cutting state, not for every state.

Good candidates in production:

- authenticated user
- access state
- socket connection
- theme
- locale

In your app, `AuthContext` and `SocketContext` are correctly global. That is the right use of Context API.

### 2. Folder structure

```txt
src/
  context/
    AuthContext.jsx
    SocketContext.jsx
    AppShellContext.jsx
  hooks/
    useAuth.js
    useSocket.js
```

Feature-specific state should stay inside the module:

```txt
src/modules/NGODashboard/context/NGOContext.jsx
```

### 3. How data flows

1. User logs in from `AuthPage`.
2. `AuthContext.login()` stores session and user.
3. Protected routes read `user.role`.
4. `SocketProvider` uses authenticated user ID to connect and join rooms.
5. Feature modules read auth state and call APIs with token.

### 4. Example implementation

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../lib/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    authApi.me()
      .then((data) => mounted && setUser(data.user))
      .catch(() => mounted && setUser(null))
      .finally(() => mounted && setBootstrapping(false));

    return () => {
      mounted = false;
    };
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    bootstrapping,
    login: (payload) => setUser(payload.user),
    logout: () => setUser(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
```

### 5. Common mistakes

- Putting API cache in Context. Context is not a query cache.
- One mega context for everything, which causes rerenders across the app.
- Storing unstable local page state in global context.
- Calling `localStorage` from many components instead of centralizing session logic.

### 6. How to scale it

- Keep auth and socket in Context.
- Move server-state fetching to a dedicated data layer.
- Split large feature contexts into selectors or smaller providers.
- Add refresh logic in one place only.

Current repo note:

- [e-to-e_frontend/src/context/AuthContext.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/context/AuthContext.jsx) is the correct place for token refresh and session restore.
- [e-to-e_frontend/src/modules/NGODashboard/context/NGOContext.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/modules/NGODashboard/context/NGOContext.jsx) is doing a lot. That is fine short-term, but at scale I would split listings, volunteers, deliveries, and notifications into smaller hooks.

## 4. Frontend: `components/`

### 1. Purpose

Components are reusable UI units, not feature brains.

Good component responsibilities:

- card
- table
- modal
- form field
- chart shell
- protected route
- preloader

Your Carbon Wallet UI is a good component today because it is reused as a visual widget.

### 2. Folder structure

```txt
src/components/
  ui/
    Button.jsx
    Input.jsx
    Modal.jsx
    StatCard.jsx
  layout/
    Navbar.jsx
    Footer.jsx
  auth/
    StepIndicator.jsx
    RoleSelector.jsx
    LocationPicker.jsx
  feedback/
    Loader.jsx
    EmptyState.jsx
    ErrorState.jsx
```

### 3. How data flows

The component should receive:

- data
- loading state
- event handlers

The component should not know:

- how token refresh works
- which endpoint to call
- how role rules are enforced in backend

### 4. Example implementation

```jsx
export function StatCard({ label, value, hint, tone = 'default' }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      {hint ? <p className="stat-card__hint">{hint}</p> : null}
    </article>
  );
}
```

### 5. Common mistakes

- Embedding fetch calls inside reusable presentational components.
- Making components depend on route structure.
- Passing 20 props because the component is doing too much.
- Duplicating the same card, table, and loader patterns across dashboards.

### 6. How to scale it

- Standardize component APIs.
- Build a small internal design system.
- Add stories or visual test coverage for critical UI pieces.
- Create a `ui/` layer for generic parts and keep domain widgets inside modules.

## 5. Frontend module: `auth`

### 1. Purpose

Auth is the trust boundary of the app.

In a production donation platform, auth is not just login. It includes:

- registration
- role assignment
- onboarding by role
- session restoration
- protected routes
- redirect rules
- token refresh

In your app, the auth flow spans:

- [e-to-e_frontend/src/context/AuthContext.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/context/AuthContext.jsx)
- [e-to-e_frontend/src/components/AuthPanel.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/components/AuthPanel.jsx)
- [e-to-e_frontend/src/components/ProtectedRoute.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/components/ProtectedRoute.jsx)
- [E-to-E_backend/routes/auth.js](/e:/Team-MealMitra/E-to-E_backend/routes/auth.js)

### 2. Folder structure

Recommended:

```txt
src/modules/auth/
  api/
    authApi.js
  components/
    LoginForm.jsx
    RegisterWizard.jsx
    RoleOnboarding.jsx
  hooks/
    useAuthRedirect.js
  pages/
    AuthPage.jsx
  validators/
    registerSchema.js
```

### 3. How data flows

1. User submits login or register form.
2. Frontend calls `/api/auth/login` or `/api/auth/register`.
3. Backend creates user in Supabase Auth and `profiles` table.
4. Frontend stores session centrally.
5. Frontend redirects based on `role`.
6. Protected routes and module APIs use the token.

### 4. Example implementation

```js
// src/modules/auth/api/authApi.js
import { http } from '../../../lib/http';

export const authApi = {
  login: (payload) => http.post('/auth/login', payload),
  register: (payload) => http.post('/auth/register', payload),
  me: () => http.get('/auth/me'),
  refresh: (payload) => http.post('/auth/refresh', payload),
  logout: () => http.post('/auth/logout'),
};
```

```jsx
// src/modules/auth/components/LoginForm.jsx
import { useState } from 'react';
import { authApi } from '../api/authApi';
import { useAuth } from '../../../context/AuthContext';

export function LoginForm() {
  const auth = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = await authApi.login(form);
      auth.login(data.user, data.session);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button disabled={submitting}>Login</button>
      {error ? <p>{error}</p> : null}
    </form>
  );
}
```

### 5. Common mistakes

- Keeping auth logic in the page component instead of a dedicated auth layer.
- Mixing registration UI, onboarding logic, admin verification calls, and navigation into one huge file.
- Trusting role from frontend only. Backend must enforce role access.
- Spreading token logic across many API files.

### 6. How to scale it

- Separate login, registration, and onboarding flows.
- Use one centralized HTTP client with token injection and refresh retry.
- Add rate limits, audit logs, and auth monitoring.
- Move to httpOnly cookie sessions if security requirements increase.

What I would improve first in your current auth module:

- Split [e-to-e_frontend/src/components/AuthPanel.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/components/AuthPanel.jsx) into `LoginForm`, `RegisterWizard`, and role-specific onboarding forms.
- Stop calling admin verification APIs directly from auth UI unless that is an explicit product decision.

## 6. Frontend module: `carbon wallet`

### 1. Purpose

This module turns platform impact into a tangible user incentive.

For a real platform, this is not just decoration. It supports:

- donor retention
- NGO motivation
- sponsor reporting
- admin governance
- future rewards and marketplace features

In MealMitra, the real backend engine is already there:

- delivery completes
- impact points are calculated
- wallets are updated
- carbon credits are minted after threshold
- frontend reads `/api/impact/summary`

### 2. Folder structure

Recommended next stage:

```txt
src/modules/carbon-wallet/
  api/
    walletApi.js
  components/
    CarbonWalletCard.jsx
    CreditMintedAnimation.jsx
    WalletLedgerTable.jsx
  hooks/
    useCarbonWallet.js
  pages/
    CarbonWalletPage.jsx
  utils/
    formatImpact.js
```

If it remains a widget only, your current component-based placement is acceptable.

### 3. How data flows

Production flow:

1. NGO marks delivery as delivered.
2. Backend delivery service calls impact service.
3. Impact service updates `impact_wallets`.
4. If threshold is crossed, it inserts into `carbon_credits`.
5. Frontend fetches `/api/impact/summary`.
6. Wallet widget displays balance, lifetime points, and minted credits.
7. Realtime or polling refresh updates the widget.

### 4. Example implementation

```js
// backend/modules/impact/impact.service.js
const CREDIT_THRESHOLD = 100;

async function getImpactSummary({ profileId, role, impactRepo }) {
  const wallet = await impactRepo.getWallet(profileId, role);
  const credits = await impactRepo.countCredits(profileId);

  return {
    impact_points_balance: wallet?.impact_points_balance || 0,
    lifetime_impact_points: wallet?.lifetime_impact_points || 0,
    carbon_credits: credits,
    next_credit_progress: `${wallet?.impact_points_balance || 0} / ${CREDIT_THRESHOLD}`,
  };
}

module.exports = { getImpactSummary, CREDIT_THRESHOLD };
```

```jsx
// src/modules/carbon-wallet/hooks/useCarbonWallet.js
import { useEffect, useState } from 'react';
import { walletApi } from '../api/walletApi';

export function useCarbonWallet() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    walletApi.summary()
      .then((result) => mounted && setData(result))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
}
```

### 5. Common mistakes

- Calculating reward rules in frontend instead of backend.
- Updating wallet balance without a ledger or idempotency key.
- Minting credits twice on retry.
- Hardcoding threshold logic in animation only.
- Treating wallet as a visual card instead of a domain module.

### 6. How to scale it

- Add `wallet_transactions` table.
- Emit `delivery.completed` event and process walleting asynchronously.
- Add idempotency keys per delivery.
- Cache summary endpoint.
- Add sponsor exports and admin controls around credit issuance.

Current repo note:

- `processCompletedDelivery()` is the correct core for this feature.
- The frontend wallet widget is strong visually, but the business threshold should be exposed from backend constants or API, not duplicated in multiple UI places.

## 7. Frontend module: `NGO dashboard`

### 1. Purpose

This is the NGO operations console.

In a production NGO platform, this dashboard is where the organization:

- sees nearby donations
- claims inventory
- assigns volunteers
- tracks active pickups
- monitors impact
- responds in realtime

This is one of the highest-value surfaces in your product because it turns supply into execution.

### 2. Folder structure

Your current structure is already close to industry standard:

```txt
src/modules/NGODashboard/
  api/
    ngoApi.js
  animations/
    ngoAnimations.js
  components/
    OverviewCards.jsx
    IncomingDonations.jsx
    AcceptedPickups.jsx
    VolunteerManager.jsx
    MapPanel.jsx
    ActivityLog.jsx
    NotificationToast.jsx
  context/
    NGOContext.jsx
  pages/
    NGODashboard.jsx
```

At scale I would tighten it further:

```txt
src/modules/ngo-dashboard/
  api/
  hooks/
    useNgoListings.js
    useNgoClaims.js
    useNgoDeliveries.js
    useNgoVolunteers.js
  components/
  pages/
  state/
```

### 3. How data flows

1. User enters NGO dashboard.
2. `NGOProvider` loads profile, listings, claims, volunteers, deliveries, impact.
3. Page renders feature panels from context state.
4. Realtime updates arrive from Supabase or Socket.IO.
5. Actions like claim, assign, update status call APIs.
6. Provider refreshes affected slices only.

### 4. Example implementation

```jsx
// src/modules/ngo-dashboard/hooks/useNgoListings.js
import { useEffect, useState } from 'react';
import { ngoApi } from '../api/ngoApi';

export function useNgoListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const data = await ngoApi.getAvailableListings();
    setListings(data.listings || []);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  return { listings, loading, refresh };
}
```

```jsx
// src/modules/ngo-dashboard/components/IncomingDonations.jsx
export function IncomingDonations({ listings, onClaim, loading }) {
  if (loading) return <div>Loading donations...</div>;

  return (
    <section>
      {listings.map((listing) => (
        <article key={listing.listing_id}>
          <h4>{listing.food_type}</h4>
          <p>{listing.quantity_kg} kg</p>
          <p>{listing.distance_km} km away</p>
          <button onClick={() => onClaim(listing.listing_id)}>Claim</button>
        </article>
      ))}
    </section>
  );
}
```

### 5. Common mistakes

- One provider owning too many unrelated states.
- Refreshing everything after every action.
- No pagination for listings and activity logs.
- No deduplication between polling and realtime events.
- Letting UI depend directly on raw DB shape.

### 6. How to scale it

- Split the provider into focused hooks or query slices.
- Paginate and virtualize large tables.
- Cache only read-heavy endpoints.
- Use websocket rooms by NGO ID.
- Add optimistic updates only for safe actions.
- Add monitoring for failed actions and stale realtime channels.

What I would improve first in your current NGO dashboard:

- Keep the page shell, but split [e-to-e_frontend/src/modules/NGODashboard/context/NGOContext.jsx](/e:/Team-MealMitra/e-to-e_frontend/src/modules/NGODashboard/context/NGOContext.jsx) into smaller hooks.
- Convert repeated API refresh patterns into one data layer with invalidation rules.

## 8. Frontend: `lib/`

### 1. Purpose

Frontend `lib/` is where shared client infrastructure lives:

- HTTP client
- auth token handling
- env config
- formatting helpers
- API adapters
- socket client factory

It should not contain page-specific business logic.

### 2. Folder structure

```txt
src/lib/
  http.js
  env.js
  storage.js
  supabaseClient.js
  formatters.js
  constants.js
```

Then feature APIs import the shared HTTP client:

```txt
src/modules/auth/api/authApi.js
src/modules/ngo-dashboard/api/ngoApi.js
src/modules/carbon-wallet/api/walletApi.js
```

### 3. How data flows

1. Page or hook calls feature API.
2. Feature API uses shared `http` client.
3. `http` client injects auth token and handles refresh retry.
4. Response is normalized once.
5. UI receives clean data.

### 4. Example implementation

```js
// src/lib/http.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload.message || payload.error || 'Request failed');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
```

### 5. Common mistakes

- Copy-pasting `apiFetch` into multiple files.
- Putting auth storage logic in every API wrapper.
- Mixing feature APIs and low-level HTTP utilities.
- Creating multiple sources of truth for API base URL.

### 6. How to scale it

- Centralize HTTP, auth refresh, and error normalization.
- Add request tracing headers.
- Add analytics hooks for slow endpoints.
- Add typed API contracts if you move to TypeScript.

Current repo note:

- You currently duplicate `apiFetch` in `src/lib/api.js`, `src/lib/donorApi.js`, `src/lib/adminApi.js`, and `src/modules/NGODashboard/api/ngoApi.js`.
- That should become one shared HTTP client plus thin feature APIs.

## Step-by-step build order from scratch

This is the order I would use if I were leading this project from zero.

### Phase 1: backend foundation

1. Set up env parsing, Supabase client, Firebase client, mailer, logger.
2. Define core schema: `profiles`, `donors`, `ngos`, `food_listings`, `ngo_claims`, `deliveries`, `impact_wallets`, `carbon_credits`.
3. Add auth middleware and role guards.

Why first:

- everything else depends on identity, data, and infrastructure.

### Phase 2: auth

1. Build backend register, login, refresh, me, logout endpoints.
2. Create frontend auth API and `AuthContext`.
3. Add protected routes and role-based redirects.
4. Build role-based onboarding forms.

Goal:

- users can sign in and land in the correct dashboard reliably.

### Phase 3: donor and NGO onboarding

1. Create donor profile endpoint and screen.
2. Create NGO profile endpoint and screen.
3. Add admin verification if required by product policy.
4. Store geo coordinates during onboarding.

Goal:

- every authenticated user becomes an actionable actor in the system.

### Phase 4: food listing module

1. Build donor listing creation backend.
2. Validate expiry, quantity, and geolocation.
3. Build donor listing form on frontend.
4. Add donor listing management: list, update, delete.

Goal:

- supply enters the marketplace cleanly.

### Phase 5: claim module

1. Build NGO listing discovery endpoint.
2. Add matching logic by city, radius, freshness, and availability.
3. Build claim endpoint with locking or transactional RPC.
4. Surface incoming donations on NGO dashboard.

Goal:

- NGOs can safely claim food without race conditions.

### Phase 6: delivery module

1. Build volunteer management.
2. Build delivery assignment endpoint.
3. Build delivery status workflow: `assigned -> in_transit -> delivered/failed`.
4. Add donor and NGO notifications.

Goal:

- claims turn into actual field execution.

### Phase 7: impact and carbon wallet backend

1. Add impact calculation rules.
2. Add wallet balance and lifetime balance.
3. Add credit minting threshold and idempotency protection.
4. Add `/api/impact/summary` and dashboard metrics endpoints.

Goal:

- platform value becomes measurable and durable.

### Phase 8: carbon wallet frontend

1. Build wallet summary API client.
2. Build wallet widget.
3. Add threshold progress visualization.
4. Add mint animation only after backend truth exists.

Goal:

- users see verified impact, not guessed impact.

### Phase 9: NGO dashboard

1. Build dashboard shell and navigation.
2. Add overview cards.
3. Add incoming donations panel.
4. Add claimed pickups panel.
5. Add volunteer manager.
6. Add map and activity log.

Goal:

- NGO operators can do their full workflow from one place.

### Phase 10: realtime, notifications, hardening

1. Add socket rooms or Supabase realtime subscriptions.
2. Add email and push events.
3. Add retry-safe side-effect processing.
4. Add audit logs, rate limits, observability, and tests.

Goal:

- the app behaves like production software under load and failure.

## What I would change first in this repo

These are the highest-value engineering moves right now:

1. Create a shared frontend `http.js` and remove duplicated `apiFetch` wrappers.
2. Split `AuthPanel.jsx` into smaller auth module files.
3. Move route orchestration from `claims.js`, `deliveries.js`, and `listings.js` into dedicated services.
4. Turn carbon wallet from a pure UI component into a real module if rewards or reporting will grow.
5. Split `NGOContext` into smaller hooks before the dashboard gets bigger.

## Bugs and architecture gaps I noticed while reading the repo

These are worth fixing soon because they will create confusing behavior:

1. Socket room mismatch:
   frontend emits `join`, while backend listens for `join_room`.
2. Claim cancel flow likely unlocks nothing:
   the code deletes the claim and then tries to fetch its `listing_id`.
3. API wrapper duplication:
   the same auth, header, and error logic exists in multiple frontend files.
4. Routes are doing too much orchestration:
   especially in claims and deliveries.

Those are not signs of a bad codebase. They are normal "version 1 moving toward version 2" issues.
