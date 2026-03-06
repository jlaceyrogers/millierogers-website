# Art Portfolio - Project Setup

## Overview
Modern Next.js 14+ art portfolio for Millie Rogers with TypeScript, Tailwind CSS, and optimized image handling.

## Technology Stack
- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5+ (strict mode enabled)
- **Styling**: Tailwind CSS v4 with custom theme
- **Image Optimization**: Next.js Image component configured

## Directory Structure
```
art-portfolio/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
├── lib/                   # Utilities and type definitions
│   └── types.ts          # TypeScript interfaces
├── public/               # Static assets
│   └── assets/          # Artwork images
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Custom Configuration

### Color Scheme
- **Primary Blue**: #4f8fef
- **Light Blue**: #ADD8E6
- **Light Background**: #F8F9FA

### TypeScript
- Strict mode enabled
- Path aliases configured (@/components, @/lib, @/app, @/public)
- Additional strict checks: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch

### Image Optimization
- Formats: AVIF, WebP
- Device sizes: 640, 750, 828, 1080, 1200, 1920, 2048, 3840
- Image sizes: 16, 32, 48, 64, 96, 128, 256, 384
- Cache TTL: 60 seconds

### Animations
Custom animations defined in globals.css:
- fade-in (300ms)
- slide-in (300ms)
- scale-in (200ms)
- Respects prefers-reduced-motion

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Next Steps
Refer to `.kiro/specs/art-portfolio-modernization/tasks.md` for implementation tasks.
