---
name: Kinetic Industrial
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#bb0014'
  on-secondary: '#ffffff'
  secondary-container: '#e41f25'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000d'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style
The design system is built on a foundation of industrial strength and architectural precision. It targets a professional B2B audience that values reliability, durability, and high-impact visual communication. The aesthetic is a fusion of **Corporate Minimalism** and **High-Contrast Brutalism**, utilizing the raw power of heavy black forms against stark white spaces, punctuated by a singular, high-energy red.

The emotional response should be one of absolute confidence and technical mastery. By leveraging massive typography and "physical" layout structures, the UI mirrors the tangible, large-scale nature of physical signage. The design prioritizes clarity over decoration, using sharp edges and deliberate negative space to create a premium, authoritative presence.

## Colors
The palette is derived directly from the physical manufacturing process. **Absolute Black** is the primary driver, used for all structural elements and primary typography to signify stability. **Signal Red** serves as the critical accent, reserved strictly for calls-to-action, status indicators, and focal points to mirror the "dot" in the brand mark.

Neutrals are kept to a minimum: **Clean White** provides the expansive background needed for high-contrast legibility, while **Industrial Gray** (#E5E5E5) and **Graphite** (#333333) are used for secondary borders and supporting text. This high-contrast approach ensures that the products—the signs themselves—remain the most colorful and vibrant elements on the page.

## Typography
Typography is treated as a structural material. **Montserrat** is the headline face, chosen for its geometric, architectural qualities that mirror the brand's logo. Headlines should be set with tight tracking and heavy weights to command immediate attention.

**Inter** provides a neutral, highly legible contrast for body copy, ensuring technical specifications and service descriptions are easily digestible. **JetBrains Mono** is introduced as a utility font for technical data, dimensions, and labels, reinforcing the industrial and precision-engineered nature of the sign-making craft.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** grid. Content is contained within a 12-column grid for desktop environments with generous 64px outer margins to create a "gallery" feel. The spacing system is strictly linear, based on an 8px base unit, ensuring every element feels aligned to a master blueprint.

For mobile, the system collapses to a single column with 20px margins, emphasizing vertical stacking and large, thumb-friendly touch targets. Whitespace is not just "empty space" here—it is used aggressively to separate product categories and create a sense of scale. Horizontal rules (1px or 2px) should be used to separate sections, mimicking technical drawings.

## Elevation & Depth
In keeping with the flat, industrial aesthetic, this design system avoids traditional shadows. Depth is instead communicated through **Tonal Layering** and **High-Contrast Outlines**.

1.  **Level 0 (Base):** Clean White (#FFFFFF).
2.  **Level 1 (Inlay):** Industrial Gray (#F2F2F2) used for backgrounds of input fields or secondary content blocks.
3.  **Level 2 (Overlay):** Absolute Black (#000000) for primary buttons or navigation bars, "floating" via contrast rather than shadow.
4.  **Borders:** A 1px solid border (#000000 or #E5E5E5) is the primary method for defining card boundaries and interactive zones, providing a crisp, drafted look.

## Shapes
The shape language is **unapologetically sharp**. A `roundedness` of 0 is applied to all primary UI elements—buttons, cards, and input fields—to reflect the precision-cut edges of metal, glass, and acrylic signage. 

The only exception to this rule is the "Signal Dot" motif, which may be used as a decorative element or a status indicator (perfect circles), directly referencing the red dot in the brand mark. This creates a powerful visual contrast between the rigid, rectangular structure of the layout and the singular circular accent.

## Components
-   **Buttons:** Primary buttons are solid Black with White text, using a sharp 0px radius. The hover state should invert to a 2px Black border or shift to the Signal Red for high-urgency actions.
-   **Cards:** Cards use a 1px solid #E5E5E5 border with no shadow. Title text within cards should be Montserrat Bold.
-   **Input Fields:** Use a 1px solid black bottom border (minimalist style) or a full 1px border. Focus states use a 2px Signal Red border.
-   **Chips/Tags:** Small, rectangular boxes with JetBrains Mono text. Use black backgrounds for category tags and white with black borders for secondary attributes.
-   **Lists:** Technical specifications should be presented in "Spec Sheets" style, with subtle horizontal dividers and monospaced labels for dimensions (e.g., 1200mm x 400mm).
-   **Product Display:** Images should be framed in thin black borders to separate them from the white background, ensuring they look like mounted signs.