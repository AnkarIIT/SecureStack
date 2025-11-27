# Design Guidelines: Security Infrastructure Landing Page

## Design Approach
**Reference-Based Strategy**: Draw inspiration from GitHub, GitLab, and modern developer tool marketing (Vercel, Railway). Emphasize technical credibility through clean typography, structured information hierarchy, and purposeful use of space. Dark theme creates professional security/developer aesthetic.

## Typography Hierarchy
- **Hero Headline**: text-5xl lg:text-7xl font-bold tracking-tight
- **Section Titles**: text-3xl lg:text-4xl font-bold
- **Tool Card Titles**: text-xl font-semibold
- **Body Text**: text-base leading-relaxed
- **Code/Technical**: font-mono text-sm
- **Badges/Labels**: text-xs uppercase tracking-wide

## Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm.
- Section padding: py-20 lg:py-32
- Card padding: p-6 lg:p-8
- Component gaps: gap-6 lg:gap-8
- Container: max-w-7xl mx-auto px-6

## Page Structure

### Hero Section
Full-width section with split layout:
- Left side (60%): Large headline emphasizing "DevSecOps Automation", subheading explaining security tooling integration, dual CTAs (primary: "Get Started", secondary: "View Documentation")
- Right side (40%): Large hero image showing security dashboard/code analysis visualization with subtle blur effect backdrop
- Background: Subtle gradient overlay, security-themed geometric patterns

### Tools Showcase Section
4-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4) featuring:
- Gitleaks card: Icon, tool name, 2-line description, key feature bullets, live status badge
- Semgrep card: Same structure
- Socket.dev card: Same structure  
- Dependabot card: Same structure

Each card includes:
- Tool logo/icon at top
- Tool name as heading
- Short description (2-3 lines)
- 3-4 key features as bullet points
- Status badge (Active/Enabled)
- Bordered with subtle glow effect on hover

### Setup Instructions Section
3-column layout (grid-cols-1 lg:grid-cols-3):
- Column 1: "Installation" - Step-by-step numbered instructions with code snippets
- Column 2: "Configuration" - YAML/JSON examples in code blocks
- Column 3: "Integration" - CI/CD pipeline examples

Each column features:
- Icon header
- Clear step numbering
- Syntax-highlighted code blocks
- Copy button on code snippets

### Status Dashboard Section
2-column layout displaying:
- Left: Real-time status badges grid (security checks, vulnerabilities found, scans completed)
- Right: Recent activity timeline with timestamps and check results

### Footer
Multi-column layout:
- Column 1: Quick links (Docs, GitHub, Security Policy)
- Column 2: Tool-specific documentation links
- Column 3: Community links (Discord, Twitter, Blog)
- Bottom: Copyright, compliance badges

## Component Specifications

**Tool Cards**:
- Border: border border-border with subtle shadow
- Hover state: border-primary/50 with glow effect
- Icon size: 48x48px at top
- Spacing: p-6 with gap-4 internal

**Status Badges**:
- Pill shape with rounded-full
- Size: px-3 py-1
- Icons: small check/alert icons inline
- Variants: success (green), warning (yellow), active (blue)

**Code Blocks**:
- Background: bg-card with border
- Font: font-mono text-sm
- Padding: p-4
- Copy button: absolute top-2 right-2

**CTA Buttons on Hero Image**:
- Backdrop blur: backdrop-blur-md bg-background/80
- Primary: Full background treatment
- Secondary: Outlined variant

## Images

**Hero Image** (Required):
- Large background image (right 40% of hero section)
- Content: Security dashboard screenshot, code analysis interface, or abstract data visualization
- Treatment: Slight blur overlay, security-themed color grading
- Dimensions: Minimum 1200x800px
- Style: Modern, technical, with visible security metrics/graphs

**Tool Icons**:
- Use official logos for Gitleaks, Semgrep, Socket.dev, Dependabot
- Size: 48x48px, consistent across all cards
- Format: SVG preferred for crisp rendering

**Background Elements**:
- Subtle grid pattern or geometric security-themed shapes in hero
- Optional: Faint code snippets or network diagrams as decorative elements

## Accessibility
- All status badges include aria-labels
- Code blocks have copy confirmation feedback
- Focus states clearly visible on dark background
- Minimum contrast ratio 4.5:1 maintained throughout