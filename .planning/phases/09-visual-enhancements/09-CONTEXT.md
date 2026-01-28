# Phase 9: Visual Enhancements - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Extensible custom style system that goes beyond qr-code-styling library's native capabilities (6 dot + 14 corner styles). Add 5-7 custom style modules with robust rendering. Standard logo library with 10-15 icons (brands + generic) integrated with existing upload.

Custom styles are the primary focus - this establishes architecture for unlimited style expansion beyond Phase 9.

</domain>

<decisions>
## Implementation Decisions

### Custom Style Architecture

- **Module structure**: Each custom style is a module with:
  - Renderer function (with fallback to library default)
  - Config object (name, default size, metadata)
  - SVG template for interpolation
- **Registration**: Explicit registration array in central config (e.g., CUSTOM_STYLES = [hexagonDot, starCorner, ...])
- **Fallback behavior**: If custom renderer fails or isn't provided, fallback to qr-code-styling library default (likely 'square' style)
- **Module separation**: Separate modules for dots, corner squares, and corner dots (partial SVG reuse possible but fundamentally distinct)

### SVG Template System

- **Critical constraint**: Must be robust and reliable - "otherwise it's going to ruin the whole app"
- **Approach**: Needs extensive research to determine best practice
- **Requirements**: Dynamic SVG generation in QR context, reliable across preview and export
- **Claude's Discretion**: Research and choose most robust approach (parameterized paths, function-generated, transform pipeline, or hybrid)

### Custom Style Scope

- **Quantity**: 5-7 custom style modules total (not per type)
- **Distribution**: Mixed across dot styles, corner square styles, and corner dot styles
- **Style categories**: Focus on three aesthetic directions:
  1. **Geometric shapes**: Hexagons, triangles, diamonds, stars, octagons
  2. **Organic/rounded forms**: Blob shapes, smooth curves, petal-like forms
  3. **Minimal/modern**: Thin lines, gaps, negative space effects
- **Decorative/ornamental**: Explicitly excluded from initial scope (no Art Deco, flourishes, vintage patterns in Phase 9)

### Logo Library

- **Scope**: Standard logo library with 10-15 icons (brands + generic)
- **Integration**: Coexists with existing custom upload
- **Size enforcement**: 33% of QR dimension limit
- **Claude's Discretion**: All implementation details (picker UX, icon selection, brand colors, component design)

</decisions>

<specifics>
## Specific Ideas

- "Module with both the renderer function (fallback to generic), a config (name, default size, etc.) and an svg template for interpolation" - hybrid approach combining multiple strategies for maximum flexibility
- Robustness is non-negotiable for SVG rendering - this is a quality gate, not a nice-to-have

</specifics>

<deferred>
## Deferred Ideas

- Decorative/ornamental styles (Art Deco, flourishes, vintage patterns) - future phase if demand exists
- Auto-discovery of custom styles via directory scanning - explicit registration chosen for Phase 9, could revisit for v2.0

</deferred>

---

*Phase: 09-visual-enhancements*
*Context gathered: 2026-01-28*
