# Plan: Selection Previews & Full Room Design Styles Expansion

This plan details the design updates to replace emoji thumbnails with visual PNG previews for all sub-category choices, integrate your provided category PNG files, and expand the "Full Room Redesign" category to include 15 distinct style choices.

---

## 1. User Snipped Category Previews

Below is a carousel of the reference images you provided, which have been copied to the project directory under `assets/images/previews/` and will be used as the visual images for the Category Tabs:

````carousel
![1.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/1.png)
<!-- slide -->
![2-flooring.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/2-flooring.png)
<!-- slide -->
![3-wall paint & colors.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/3-wall%20paint%20&%20colors.png)
<!-- slide -->
![4-widows  &Blinds.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/4-widows%20%20&Blinds.png)
<!-- slide -->
![5-Lighting  mood.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/5-Lighting%20%20mood.png)
<!-- slide -->
![6-outdoor patio.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/6-outdoor%20patio.png)
<!-- slide -->
![7-kitchen and Bath.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/7-kitchen%20and%20Bath.png)
<!-- slide -->
![8-full room design.png](file:///C:/Users/Thyagaraja/.gemini/antigravity-cli/brain/7dd151e1-2ca0-4578-85db-69d6c3ad5f43/8-full%20room%20design.png)
````

---

## 2. Proposed Changes

### Category & Selection Configuration

#### [MODIFY] [constants.ts](file:///D:/My%20projects/aihomedecorator-native/constants.ts)
- Update `ELEMENT_CATEGORIES` to support both local category image assets and sub-choice thumbnails:
  - Add a local asset reference to each category (using static `require` mapping in the React Native component).
  - Add a high-resolution, lightweight, fast-loading Unsplash CDN image URL to the `thumbnail` property for every choice in all categories.
- Expand the `full_redesign` category to support 15 distinct styles:
  1. **Modern**: Premium clean-lined layout
  2. **Minimalist**: Decluttered functional space
  3. **Contemporary**: Bold textures and curves
  4. **Traditional**: Rich woodwork and classic symmetries
  5. **Scandinavian**: Light wood, cozy clean textiles
  6. **Industrial**: Exposed brick, structural metal
  7. **Luxury**: High-end brass, marble, velvet finishes
  8. **Bohemian**: Eclectic textures, jute, rattan
  9. **Rustic**: Log cabin beams, heavy stone
  10. **Japanese**: Low-profile tatami, tranquil wood
  11. **Korean**: Cozy aesthetic, warm neutral tones
  12. **Mediterranean**: Plaster arches, terracotta tiles
  13. **Vintage**: Nostalgic classic furnishings
  14. **Farmhouse**: Shiplap walls, black metal accents
  15. **Japandi**: Fusion of Japanese and Nordic minimalism

### UI Component Layer

#### [MODIFY] [DesignWorkspace.tsx](file:///D:/My%20projects/aihomedecorator-native/components/workspace/DesignWorkspace.tsx)
- **Category Tabs:**
  - Replace the text-based category emoji with a small, circular/rounded `<Image>` component displaying the category-specific PNG file you provided.
- **Choice Carousel Cards:**
  - Replace the emoji thumbnail circle with a wide-format rectangular `<Image>` component displaying the choice-specific preview image (`width: 94`, `height: 60`, `borderRadius: 8`).
  - Position the checkmark badge absolutely inside the top-right corner of the thumbnail container (`top: 4`, `right: 4`).
  - Add a gradient overlay or subtle border to highlight selection status beautifully.

---

## 3. Verification Plan

### Automated Tests
- Run type checking:
  ```bash
  npx tsc --noEmit
  ```
  Verify that the compiler reports 0 type errors.

### Manual Verification
- Launch the Expo web preview locally.
- Confirm that the Category tabs show the local PNG assets instead of emojis.
- Confirm that the Flooring category displays 20 choices, all showing small visual preview images.
- Confirm that the Full Room Redesign category displays all 15 styles (Modern to Japandi) with their specific visual room layout previews.
- Verify that selecting a style card displays the checkmark badge at the top-right of the rectangular preview image and highlights the border.
