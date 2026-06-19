# UX / UI Rules — DoodlePaws

Design system for the playful, hand-drawn adoption experience.

## Brand voice

- Playful, warm, slightly irreverent copy ("Wag-tastic!", "Fetching the pack...")
- Headlines: **uppercase**, **italic**, **font-black**, tight tracking
- Labels: tiny uppercase with wide letter-spacing (`tracking-[0.2em]`)

## Color tokens

Defined in [`src/frontend/src/index.css`](../../src/frontend/src/index.css):

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#FFB347` | CTAs, accents, badges |
| `secondary` | `#B4E1FF` | Highlights, decorative blocks |
| `surface` | `#FFFDF5` | Page background |
| `on-surface` | `#2D2D2D` | Body text |
| `slate-border` | `#0f172a` | Borders, hard shadows |

## Typography

| Role | Font | Class pattern |
|------|------|---------------|
| Body | Plus Jakarta Sans | `font-sans` (default) |
| Headlines | Bricolage Grotesque | `font-headline` on h1–h6 |
| Mono accents | Space Mono | `font-mono` |

## Layout

- Max content width: `max-w-7xl mx-auto px-8`
- Section vertical rhythm: `py-12` to `py-24`
- Sticky header with `border-b-4 border-slate-border`

## Signature components

### Hard shadow (`shadow-hard`)

Offset box shadow simulating a doodle sticker:

```css
box-shadow: 6px 6px 0px 0px #0f172a;
```

Interactive elements **translate** on hover (`hover:translate-x-0.5 hover:translate-y-0.5`) and **remove** shadow (`hover:shadow-none`).

### Geometric radius (`rounded-geo`, `rounded-geo-lg`)

Asymmetric corner radii for hand-cut paper feel.

### Pill badge (`pill-badge`)

Small rounded tags for breed, age, filters. Use `bg-blue-100`, `bg-yellow-100`, or `bg-secondary` for variation.

### DoodleBox

Wrapper with optional rotation (`rotate-1`, `-rotate-1`). **Never use `Math.random()` for rotation** — derive from stable id hash to avoid flicker.

### PetCard

- Grayscale pet photos with `contrast-125 opacity-80`
- Hover scale on image
- Primary CTA: bordered button with hard shadow

## Page patterns

| Pattern | Rule |
|---------|------|
| Loading | Large uppercase italic pulse text, centered |
| Error | Red text + primary **Try Again** button |
| Empty | Short uppercase message |
| CTA buttons | `bg-primary`, `border-4`, rounded-full or `rounded-2xl` |

## Navigation

| Link | Target |
|------|--------|
| Logo | `/` |
| Adopt a Dog | `/pets` |
| Success Stories / Foster / Learn More | `/#why-doodlepaws` (anchor, no orphan routes) |

## Accessibility

- Form inputs must have associated `<label htmlFor="...">`
- Images require meaningful `alt` (pet name)
- Status badges should reflect real `pet.status`, not hardcoded text
- Prefer buttons for interactive pills/filters (not inert `<span>`)

## Do / Don't

| Do | Don't |
|----|-------|
| Use design tokens from `@theme` | Hardcode one-off hex colors |
| Show pet-specific copy (`{pet.name}`, `{pet.quote}`) | Hardcode "Barnaby" or fake counts |
| Handle API errors with retry UI | Leave loading spinner forever |
| Hide adopt CTA when pet is not `available` | Always show "Available!" |
| Block adopt form when pet not `available` | Show form for pending/adopted pets |
| Keep filter pills aligned with seed `tags` | Use labels that match no seeded pet (e.g. orphan pill text) |

## Filter tags (v1)

Pills on `/pets`: **`Very Wiggly`**, **`Expert Napper`**, **`Gentle`**.

- **OR** among selected pills (pet matches any selected tag)
- **AND** with search text
- Must match [ERD seed tags](../architecture/erd.md)

## Related flows

- [Browse pets](browse-pets.md)
- [Adoption application](adopt-application.md)
- [State machines](../architecture/state-machines.md)
