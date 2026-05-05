# Vidy.ai UI Map

## Home (`/`)
- **Hero** — headline + CTA buttons
- **Feature Shortcuts** — 3× `FeatureCard` components (Generator, Clip, Dubbing)
- **Recent Videos** — responsive masonry grid pulling public videos, infinity loading, masonry should have 16:9, 9:16, 1:1, 4:3, etc. cards should have full width and height videos on cards.

## AI Video Generator (`/generate`)
- Centered `PromptBox` (Shadcn AI Chat component)
- Under box: Start frame | End frame | Resolution | Orientation | Style picker
- Left toolbar  
  - `+` button → new Session  
  - Session thumbnails list (latest first)  
  - Tooltip on hover for each icon
- Bottom‑left: Model selector (`Select` -> fal.ai models), VEO 3, Kling 2.1, and more..

## Clip Generator (`/clips`)
- Link input identical to PromptBox
- Uses Sieve `autocrop` → 10 clips + virality score
- Toolbar/session UX identical to `/generate`

## Dubbing (`/dubbing`)
- Video upload / link input
- Target‑language `Select`
- Checkbox "Voice clone (×3 credit)"
- Credits debited on submit

## Global components
- `VideoCard` → regenerate | extend | SFX | copy prompt | share | download, directly below the videocard, chip looking iconed buttons.

---

## Design Language
Use the styling of modern, vibrant, ai related, brave design language. not use the ordinary things. 