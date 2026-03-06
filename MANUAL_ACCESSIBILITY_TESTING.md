# Manual Accessibility Testing Checklist
## Art Portfolio - Keyboard Navigation & Screen Reader Testing

**Requirements:** 11.6, 14.2, 14.4, 14.5

---

## 🎯 Quick Start

This checklist covers manual accessibility testing that cannot be automated. Complete these tests to ensure full WCAG 2.1 AA compliance.

**Time Required:** ~30-45 minutes
**Tools Needed:** 
- Keyboard only (no mouse)
- Screen reader (NVDA, JAWS, VoiceOver, or TalkBack)

---

## ⌨️ Keyboard Navigation Testing

### Test 1: Navigation Component

**Goal:** Verify all navigation is keyboard accessible

| Step | Action | Expected Result | ✓ |
|------|--------|----------------|---|
| 1 | Press Tab from page top | Focus moves to "Millie Rogers" logo | ☐ |
| 2 | Press Tab | Focus moves to "Home" link | ☐ |
| 3 | Press Tab | Focus moves to "Gallery" link | ☐ |
| 4 | Press Tab | Focus moves to "Contact" link | ☐ |
| 5 | Press Enter on any link | Navigates to that page | ☐ |
| 6 | Verify focus indicator | Blue ring visible on all links | ☐ |
| 7 | Resize to mobile (<1024px) | Mobile menu button appears | ☐ |
| 8 | Tab to menu button | Focus visible on button | ☐ |
| 9 | Press Enter or Space | Menu opens | ☐ |
| 10 | Press Escape | Menu closes | ☐ |
| 11 | Open menu, press Tab | Focus moves through menu items | ☐ |
| 12 | Press Shift+Tab | Focus moves backward | ☐ |

**Pass Criteria:** All steps work as expected, focus always visible

---

### Test 2: Gallery & Filtering

**Goal:** Verify gallery is fully keyboard accessible

| Step | Action | Expected Result | ✓ |
|------|--------|----------------|---|
| 1 | Navigate to Gallery page | Gallery loads with all artworks | ☐ |
| 2 | Press Tab | Focus moves to "All" filter button | ☐ |
| 3 | Press Tab 3 times | Focus moves through all filter buttons | ☐ |
| 4 | Press Enter on "Portraits" | Gallery filters to portraits only | ☐ |
| 5 | Verify focus indicator | Blue ring visible on buttons | ☐ |
| 6 | Press Tab | Focus moves to first artwork card | ☐ |
| 7 | Continue tabbing | Focus moves through all artwork cards | ☐ |
| 8 | Press Enter on artwork | Lightbox opens | ☐ |

**Pass Criteria:** All filtering and navigation works with keyboard only

---

### Test 3: Lightbox Modal

**Goal:** Verify lightbox keyboard navigation and focus management

| Step | Action | Expected Result | ✓ |
|------|--------|----------------|---|
| 1 | Open lightbox (Enter on artwork) | Lightbox opens, focus on close button | ☐ |
| 2 | Press Tab | Focus moves to Previous button | ☐ |
| 3 | Press Tab | Focus moves to Next button | ☐ |
| 4 | Press Tab | Focus wraps to close button (focus trap) | ☐ |
| 5 | Press Shift+Tab | Focus moves backward through buttons | ☐ |
| 6 | Press Right Arrow | Next artwork displays | ☐ |
| 7 | Press Left Arrow | Previous artwork displays | ☐ |
| 8 | Navigate to last artwork | Next button is disabled | ☐ |
| 9 | Navigate to first artwork | Previous button is disabled | ☐ |
| 10 | Press Escape | Lightbox closes | ☐ |
| 11 | Verify focus | Focus returns to artwork card | ☐ |
| 12 | Press Tab | Focus continues from artwork card | ☐ |

**Pass Criteria:** Focus trapped in modal, keyboard shortcuts work, focus returns correctly

---

### Test 4: Contact Form

**Goal:** Verify form is fully keyboard accessible

| Step | Action | Expected Result | ✓ |
|------|--------|----------------|---|
| 1 | Navigate to Contact page | Form displays | ☐ |
| 2 | Press Tab | Focus moves to Name field | ☐ |
| 3 | Type name | Text appears in field | ☐ |
| 4 | Press Tab | Focus moves to Email field | ☐ |
| 5 | Press Tab | Focus moves to Subject field | ☐ |
| 6 | Press Tab | Focus moves to Message field | ☐ |
| 7 | Press Tab | Focus moves to Submit button | ☐ |
| 8 | Verify focus indicators | Blue ring visible on all fields | ☐ |
| 9 | Leave Name empty, press Enter | Validation error appears | ☐ |
| 10 | Tab to error message | Error is reachable | ☐ |
| 11 | Fill all fields correctly | No errors shown | ☐ |
| 12 | Press Enter in any field | Form submits | ☐ |

**Pass Criteria:** All form interactions work with keyboard only

---

## 🔊 Screen Reader Testing

### Setup Instructions

**Windows (NVDA - Free):**
1. Download from https://www.nvaccess.org/
2. Install and launch NVDA
3. Press Insert+Q to quit when done

**macOS (VoiceOver - Built-in):**
1. Press Cmd+F5 to enable VoiceOver
2. Press Cmd+F5 again to disable when done

**iOS (VoiceOver - Built-in):**
1. Settings → Accessibility → VoiceOver → On
2. Triple-click home/side button to toggle

**Android (TalkBack - Built-in):**
1. Settings → Accessibility → TalkBack → On
2. Volume keys to toggle

---

### Test 5: Navigation with Screen Reader

**Goal:** Verify navigation is properly announced

| Step | Action | Expected Announcement | ✓ |
|------|--------|----------------------|---|
| 1 | Navigate to site | "Millie Rogers" or site name | ☐ |
| 2 | Navigate to nav | "Main navigation, navigation landmark" | ☐ |
| 3 | Navigate to Home link | "Home, link, current page" | ☐ |
| 4 | Navigate to Gallery link | "Gallery, link" | ☐ |
| 5 | Navigate to Contact link | "Contact, link" | ☐ |
| 6 | Mobile: Navigate to menu button | "Toggle navigation menu, button, collapsed" | ☐ |
| 7 | Activate menu button | "Toggle navigation menu, button, expanded" | ☐ |
| 8 | Navigate menu items | Each item announced with "link" | ☐ |

**Pass Criteria:** All navigation elements properly announced with roles and states

---

### Test 6: Gallery with Screen Reader

**Goal:** Verify gallery content is properly announced

| Step | Action | Expected Announcement | ✓ |
|------|--------|----------------------|---|
| 1 | Navigate to Gallery page | "Gallery" heading announced | ☐ |
| 2 | Navigate to filter buttons | "All (40), button" or similar | ☐ |
| 3 | Navigate to selected filter | "Still Photos (15), button, pressed" | ☐ |
| 4 | Navigate to artwork card | "Sunset Over Water, Still Photos, button" | ☐ |
| 5 | Navigate through artworks | Each artwork title and category announced | ☐ |
| 6 | Filter to empty category | "No artworks found" announced | ☐ |

**Pass Criteria:** All content announced with appropriate context

---

### Test 7: Lightbox with Screen Reader

**Goal:** Verify lightbox is properly announced

| Step | Action | Expected Announcement | ✓ |
|------|--------|----------------------|---|
| 1 | Open lightbox | "Dialog" or "Modal" announced | ☐ |
| 2 | Navigate to title | "Sunset Over Water, heading level 2" | ☐ |
| 3 | Navigate to image | "Sunset Over Water, image" | ☐ |
| 4 | Navigate to category | "Still Photos" | ☐ |
| 5 | Navigate to close button | "Close lightbox, button" | ☐ |
| 6 | Navigate to prev button | "Previous artwork, button" | ☐ |
| 7 | Navigate to next button | "Next artwork, button" | ☐ |
| 8 | At first artwork | "Previous artwork, button, disabled" | ☐ |
| 9 | At last artwork | "Next artwork, button, disabled" | ☐ |

**Pass Criteria:** All modal content and controls properly announced

---

### Test 8: Contact Form with Screen Reader

**Goal:** Verify form is properly announced

| Step | Action | Expected Announcement | ✓ |
|------|--------|----------------------|---|
| 1 | Navigate to Contact page | "Contact" heading announced | ☐ |
| 2 | Navigate to Name field | "Name, edit text, required" | ☐ |
| 3 | Navigate to Email field | "Email, edit text, required" | ☐ |
| 4 | Navigate to Subject field | "Subject, edit text, required" | ☐ |
| 5 | Navigate to Message field | "Message, edit text, required" | ☐ |
| 6 | Navigate to Submit button | "Send Message, button" | ☐ |
| 7 | Submit with empty Name | "Name is required" announced | ☐ |
| 8 | Navigate to error | Error message announced | ☐ |
| 9 | Enter invalid email | "Invalid email format" announced | ☐ |
| 10 | Submit successfully | "Message sent successfully!" announced | ☐ |
| 11 | Form submission fails | Error message with retry announced | ☐ |

**Pass Criteria:** All form elements, labels, and messages properly announced

---

## 🎨 Visual Focus Indicator Testing

### Test 9: Focus Visibility

**Goal:** Verify focus indicators are always visible

| Component | Element | Focus Indicator | ✓ |
|-----------|---------|----------------|---|
| Navigation | Logo link | Blue ring visible | ☐ |
| Navigation | Nav links | Blue ring visible | ☐ |
| Navigation | Mobile menu button | Blue ring visible | ☐ |
| Gallery | Filter buttons | Blue ring visible | ☐ |
| Gallery | Artwork cards | Blue ring visible | ☐ |
| Lightbox | Close button | Blue ring visible | ☐ |
| Lightbox | Nav buttons | Blue ring visible | ☐ |
| Contact Form | Text inputs | Blue ring visible | ☐ |
| Contact Form | Textarea | Blue ring visible | ☐ |
| Contact Form | Submit button | Blue ring visible | ☐ |

**Pass Criteria:** Focus indicator visible on all interactive elements, minimum 2px width, sufficient contrast

---

## 📱 Touch Target Testing

### Test 10: Mobile Touch Targets

**Goal:** Verify all touch targets are at least 44x44 pixels

**Test on mobile device or resize browser to mobile width (<768px)**

| Component | Element | Size Check | ✓ |
|-----------|---------|-----------|---|
| Navigation | Mobile menu button | ≥44x44px | ☐ |
| Navigation | Mobile menu items | ≥44px height | ☐ |
| Gallery | Filter buttons | ≥44px height | ☐ |
| Gallery | Artwork cards | Large enough for touch | ☐ |
| Lightbox | Close button | ≥44x44px | ☐ |
| Lightbox | Nav buttons | ≥44x44px | ☐ |
| Contact Form | All inputs | ≥44px height | ☐ |
| Contact Form | Submit button | ≥44px height | ☐ |

**Pass Criteria:** All interactive elements meet minimum size, adequate spacing between targets

---

## 🎭 Color Contrast Testing

### Test 11: Visual Contrast Check

**Goal:** Verify text is readable against backgrounds

**Use browser DevTools or online contrast checker**

| Element | Foreground | Background | Ratio | ✓ |
|---------|-----------|-----------|-------|---|
| Body text | gray-900 | white | ≥4.5:1 | ☐ |
| Nav links | gray-700 | white | ≥4.5:1 | ☐ |
| Active link | primary-blue | white | ≥4.5:1 | ☐ |
| Button text | white | primary-blue | ≥4.5:1 | ☐ |
| Error text | red-600 | white | ≥4.5:1 | ☐ |
| Success text | green-900 | green-50 | ≥4.5:1 | ☐ |

**Pass Criteria:** All text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)

---

## 🎬 Animation Testing

### Test 12: Reduced Motion

**Goal:** Verify animations respect user preferences

**Enable reduced motion in OS settings:**
- **Windows:** Settings → Ease of Access → Display → Show animations
- **macOS:** System Preferences → Accessibility → Display → Reduce motion
- **iOS:** Settings → Accessibility → Motion → Reduce Motion
- **Android:** Settings → Accessibility → Remove animations

| Test | Action | Expected Result | ✓ |
|------|--------|----------------|---|
| 1 | Enable reduced motion | Setting enabled | ☐ |
| 2 | Navigate between pages | No page transitions | ☐ |
| 3 | Filter gallery | No filter animations | ☐ |
| 4 | Open lightbox | No fade-in animation | ☐ |
| 5 | Hover over elements | No hover animations | ☐ |
| 6 | Verify functionality | All features still work | ☐ |

**Pass Criteria:** Animations disabled but functionality preserved

---

## 📋 Final Checklist

### Overall Accessibility Compliance

- [ ] All keyboard navigation tests passed
- [ ] All screen reader tests passed
- [ ] All focus indicators visible
- [ ] All touch targets meet minimum size
- [ ] All color contrast ratios meet WCAG AA
- [ ] Reduced motion preferences respected
- [ ] No accessibility violations found
- [ ] All functionality accessible without mouse
- [ ] All content accessible to screen readers

---

## 🐛 Issue Tracking

**If you find any issues, document them here:**

| Issue # | Component | Description | Severity | Status |
|---------|-----------|-------------|----------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Severity Levels:**
- **Critical:** Blocks access to core functionality
- **High:** Significantly impacts user experience
- **Medium:** Minor accessibility issue
- **Low:** Enhancement or nice-to-have

---

## ✅ Sign-Off

**Tester Name:** _______________________
**Date:** _______________________
**Screen Reader Used:** _______________________
**Browser/Device:** _______________________

**Overall Result:** ☐ Pass ☐ Fail ☐ Pass with minor issues

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## 📚 Resources

**Screen Readers:**
- NVDA (Windows, Free): https://www.nvaccess.org/
- JAWS (Windows, Paid): https://www.freedomscientific.com/products/software/jaws/
- VoiceOver (macOS/iOS, Built-in): Cmd+F5 or Settings → Accessibility
- TalkBack (Android, Built-in): Settings → Accessibility

**Testing Tools:**
- WAVE Browser Extension: https://wave.webaim.org/extension/
- axe DevTools: https://www.deque.com/axe/devtools/
- Lighthouse (Chrome DevTools): Built-in
- Color Contrast Analyzer: https://www.tpgi.com/color-contrast-checker/

**WCAG Guidelines:**
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM: https://webaim.org/

---

**Last Updated:** 2025
**Version:** 1.0
