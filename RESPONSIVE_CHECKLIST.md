Responsive testing checklist

Purpose: Steps to manually verify responsive behavior across breakpoints and devices.

1) Breakpoints to test
- Mobile: 360x640 (small phones)
- Mobile large: 412x915 (larger phones)
- Tablet portrait: 768x1024
- Desktop small: 1024x768
- Desktop large: 1440x900

2) Pages to verify (priority order)
- Index (hero, CTAs, flow grid, testimonials)
- About (hero, team image, awards grid, leadership cards)
- Insights (article images, grid layout, testimonials)
- Clients (infographic grid)
- Contact (form layout, map)
- Header/Footer across widths (menu, subscribe, social icons)

3) Visual checks
- Layout: content should not overflow; grids should collapse gracefully.
- Typography: headings and paragraphs should wrap without overflow; use fluid text to test scaling.
- Images: use "img-responsive" class; images should keep aspect ratio and not distort.
- Buttons/CTAs: check tap targets on mobile (min 44x44px) and full-width behavior.
- Spacing: check paddings/margins at each breakpoint.

4) Interaction checks
- Mobile menu: open/close works; links clickable and close menu on navigation.
- Forms: inputs are usable, submit button visible and not clipped on mobile.
- Map: map loads and is scrollable only when focused (leaflet script).

5) Accessibility quick checks
- Ensure focus outlines visible on keyboard navigation.
- ARIA attributes for mobile menu (aria-controls, aria-expanded) are present.

6) Regression notes
- If any visual artifacts appear, refresh to clear HMR cache.
- For image loading issues, check console network and placeholder fallback.

7) Automated suggestions
- Consider running visual diff tests (Percy/Playwright) on key breakpoints.
- Add Lighthouse checks for mobile responsiveness periodically.

End of checklist
