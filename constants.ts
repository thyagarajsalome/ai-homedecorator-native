import { SelectionCategory } from './types';

export const ROOM_TYPES: string[] = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Dining Room",
  "Home Office",
  "Bathroom",
  "Basement",
  "Kids Room",
  "Guest Room",
  "Patio"
];

export const ELEMENT_CATEGORIES: SelectionCategory[] = [
  {
    id: "full_redesign",
    name: "Full Room Design",
    icon: "🌍",
    guardrail: "CRITICAL: Completely replace the stylistic visual identity, furniture, decor details, and layout theme of the entire room. Maintain only the core outer door and window frame limits.",
    choices: [
      { name: "Modern", promptSuffix: "sleek modern design space with clean lines, geometric furniture, a neutral color palette, and statement lighting", thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=150&q=80" },
      { name: "Minimalist", promptSuffix: "ultra-clean minimalist room layout featuring only the functional essentials, clutter-free surfaces, and a simple monochromatic color scheme", thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=150&q=80" },
      { name: "Contemporary", promptSuffix: "cutting-edge contemporary interior showing curvier profiles, bold artistic accents, mixed textured surfaces, and a trendy color palette", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80" },
      { name: "Traditional", promptSuffix: "classic traditional interior featuring rich dark wood paneling, detailed crown molding, symmetrical layout, and elegant upholstery", thumbnail: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=150&q=80" },
      { name: "Scandinavian", promptSuffix: "light airy scandinavian architectural space utilizing pale birch timbers, clean minimalist furniture profiles, soft cream textiles, and functional cozy decorations", thumbnail: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=150&q=80" },
      { name: "Industrial", promptSuffix: "urban industrial design layout highlighting raw exposed brick walls, metal conduits, concrete flooring, and weathered leather seating", thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&q=80" },
      { name: "Luxury", promptSuffix: "ultra-luxury interior style incorporating gold and brass accents, plush velvet fabrics, polished marble surfaces, and a grand statement chandelier", thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=150&q=80" },
      { name: "Bohemian", promptSuffix: "vibrant bohemian room filled with layered colorful textiles, rattan and wicker accents, hanging macrame, and an abundance of indoor plants", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80" },
      { name: "Rustic", promptSuffix: "warm rustic room utilizing natural raw timber, stone fireplace features, cozy hand-woven rugs, and earthy, organic design elements", thumbnail: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=150&q=80" },
      { name: "Japanese", promptSuffix: "peaceful japanese inspired room showcasing low-to-floor wooden furniture, sliding shoji screens, clean lines, and a minimalist zen garden aesthetic", thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=150&q=80" },
      { name: "Korean", promptSuffix: "aesthetic modern korean-style bedroom with warm indirect lighting, low wooden platform bed, soft pastel accents, and sheer window drapes", thumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=150&q=80" },
      { name: "Mediterranean", promptSuffix: "relaxed luxury coastal lifestyle featuring rough hand-plastered white warm stucco arches, natural exposed ceiling beams, wrought iron light fittings, and warm terracotta floor tones", thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=150&q=80" },
      { name: "Vintage", promptSuffix: "charming vintage room containing curated antique furniture, nostalgic patterned wallpapers, gilded frames, and retro color palettes", thumbnail: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=150&q=80" },
      { name: "Farmhouse", promptSuffix: "cozy farmhouse room showing whitewashed shiplap, rustic barn doors, distressed oak finishes, and simple comfortable furnishings", thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=150&q=80" },
      { name: "Japandi", promptSuffix: "organic fusion layout matching dark rustic japanese minimalism with clean nordic structures, low-profile furniture, sliding shoji panel influences, and handmade ceramic decor details", thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=150&q=80" }
    ]
  },
  {
    id: "space_remodel",
    name: "Kitchen & Bath",
    icon: "🍳",
    guardrail: "CRITICAL: Isolate the incoming space and dynamically replace the complete interior architecture, millwork layouts, plumbing fixtures, and countertop styling to transform the room functionality.",
    choices: [
      { name: "Farmhouse Kitchen", promptSuffix: "complete kitchen remodel featuring classic white shaker cabinets, white quartz countertops, apron-front farmhouse sink, and black hardware accents", thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=150&q=80" },
      { name: "Euro Minimalist Kitchen", promptSuffix: "handleless floor-to-ceiling flat panel dark wood kitchen cabinetry, seamless integrated appliances, and a single solid marble slab waterfall island", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80" },
      { name: "Chef's Kitchen", promptSuffix: "professional kitchen environment layout with professional-grade stainless steel countertops, open metal shelving, commercial-style pull-down faucet, and brick details", thumbnail: "https://images.unsplash.com/photo-1556909212-d5b604ad0567?auto=format&fit=crop&w=150&q=80" },
      { name: "Luxury Spa Bathroom", promptSuffix: "high-end wellness master bathroom with a deep freestanding soaking tub, floating light oak vanities, and floor-to-ceiling natural stone wall slabs", thumbnail: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=150&q=80" },
      { name: "Monochromatic Bathroom", promptSuffix: "high-contrast bathroom layout showing matte black plumbing fixtures, clean floating geometric white porcelain basins, and dark gray tiled walk-in rain showers", thumbnail: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=150&q=80" }
    ]
  },
  {
    id: "flooring",
    name: "Flooring",
    icon: "🪵",
    guardrail: "CRITICAL: Maintain the exact placement, perspective, geometry, and materials of all furniture, walls, ceiling, windows, and decorative items. Change ONLY the floor surface finish and material texture.",
    choices: [
      { name: "Hardwood Floor - Oak", promptSuffix: "premium light natural white oak hardwood planks with subtle grain details", thumbnail: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=150&q=80" },
      { name: "Hardwood Floor - Maple", promptSuffix: "smooth uniform light maple hardwood flooring with a refined satin clear coat", thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=150&q=80" },
      { name: "Hardwood Floor - Walnut", promptSuffix: "rich deep chocolate brown walnut hardwood planks with bold luxury woodgrain patterns", thumbnail: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=150&q=80" },
      { name: "Hardwood Floor - Hickory", promptSuffix: "rustic variable-toned hickory timber flooring showing distinct natural highlights and knots", thumbnail: "https://images.unsplash.com/photo-1449244409154-81e0a8b4b9b4?auto=format&fit=crop&w=150&q=80" },
      { name: "Hardwood Floor - Cherry", promptSuffix: "elegant warm cherry wood flooring with subtle rich reddish-brown undertones", thumbnail: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=150&q=80" },
      { name: "Laminate Flooring", promptSuffix: "modern high-durability embossed in-register matte laminate flooring panels", thumbnail: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=150&q=80" },
      { name: "LVP (Luxury Vinyl Plank)", promptSuffix: "100% waterproof light ash luxury vinyl plank flooring", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80" },
      { name: "LVT (Luxury Vinyl Tile)", promptSuffix: "modern rectangular slate-look luxury vinyl tiles with charcoal gray faux grout lines", thumbnail: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=150&q=80" },
      { name: "Sheet Vinyl", promptSuffix: "seamless contemporary patterned designer sheet vinyl floor covering", thumbnail: "https://images.unsplash.com/photo-1562663474-6cbb3fee4c77?auto=format&fit=crop&w=150&q=80" },
      { name: "Ceramic Tile", promptSuffix: "large format rectified ceramic tiles with clean minimalist grout joints", thumbnail: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=150&q=80" },
      { name: "Porcelain Tile", promptSuffix: "polished continuous-pattern glazed porcelain flooring tiles with light marbling effects", thumbnail: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=150&q=80" },
      { name: "Natural Stone Tile", promptSuffix: "honed natural quartzite floor tiles showcasing organic variations", thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&q=80" },
      { name: "Carpet - Soft & Warm", promptSuffix: "thick dense ultra-soft plush luxury wall-to-wall cream carpet", thumbnail: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=150&q=80" },
      { name: "Carpet - Comfortable", promptSuffix: "durable low-profile loop pile textured carpet in a neutral heather gray tone", thumbnail: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=150&q=80" },
      { name: "Carpet - Noise Reduction", promptSuffix: "heavy-duty acoustic dampening premium tight-woven casual wool berber carpet", thumbnail: "https://images.unsplash.com/photo-1576016770956-debb63d900ad?auto=format&fit=crop&w=150&q=80" },
      { name: "Marble Flooring", promptSuffix: "ultra-luxury polished white Calacatta marble slab flooring with dramatic gray veining", thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=150&q=80" },
      { name: "Granite Flooring", promptSuffix: "highly reflective flecked deep black absolute granite polished stone tiles", thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=150&q=80" },
      { name: "Slate Flooring", promptSuffix: "natural cleft surface dark charcoal slate flagstone tiles with rich earthy variations", thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=150&q=80" },
      { name: "Travertine Flooring", promptSuffix: "classic tumbled ivory travertine stone flooring layout with warm variations", thumbnail: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80" },
      { name: "Concrete Flooring", promptSuffix: "seamless urban industrial high-gloss polished concrete flooring with minor aggregate exposures", thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80" }
    ]
  },
  {
    id: "wall_paint",
    name: "Wall Paint",
    icon: "🎨",
    guardrail: "CRITICAL: Retain complete structural perspective, furniture assets, floor styling, lighting fixtures, and window placement. Modify ONLY the surface finish, paint color, or wallpaper materials of the vertical walls.",
    choices: [
      { name: "Alabaster White", promptSuffix: "flat matte architectural alabaster white premium wall interior paint", thumbnail: "https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&w=150&q=80" },
      { name: "Navy Blue Accent", promptSuffix: "deep sophisticated matte dark navy blue premium feature wall paint", thumbnail: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=150&q=80" },
      { name: "Terracotta Clay", promptSuffix: "warm muted terracotta clay interior wall paint with a soft velvet finish", thumbnail: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=150&q=80" },
      { name: "Exposed Brick", promptSuffix: "authentic rustic reclaimed red brick masonry wall construction detailing", thumbnail: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=150&q=80" },
      { name: "Concrete Wash", promptSuffix: "minimalist textured raw gray industrial concrete wash finish plaster walls", thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=150&q=80" },
      { name: "Venetian Plaster", promptSuffix: "luxurious hand-troweled polished Venetian plaster walls showing rich tonal depth", thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=150&q=80" },
      { name: "Slatted Oak Panels", promptSuffix: "modern vertical mid-century modern slatted oak timber accent wall panels", thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=150&q=80" },
      { name: "Geometric Wallpaper", promptSuffix: "clean upscale modern minimalist thin-line geometric wallpaper pattern", thumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=150&q=80" },
      { name: "Botanical Print", promptSuffix: "tasteful muted vintage botanical sage green and olive leaf wallpaper print", thumbnail: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=150&q=80" }
    ]
  },
  {
    id: "lighting_mood",
    name: "Lighting",
    icon: "💡",
    guardrail: "CRITICAL: Maintain all furniture positions, object colors, flooring, and materials completely static. Do not add or subtract physical objects. Modify ONLY the ambient light intensity, shadows, color temperature, and light source glow paths.",
    choices: [
      { name: "Golden Hour", promptSuffix: "warm directional sunlight streaming through windows creating dramatic elongated shadows and golden hour atmosphere", thumbnail: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=150&q=80" },
      { name: "Bright Daylight", promptSuffix: "crisp bright morning light filling the entire space evenly with clean neutral white balance", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80" },
      { name: "Cozy Warm Night", promptSuffix: "intimate low-light evening mood setting driven by soft internal light illumination points", thumbnail: "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?auto=format&fit=crop&w=150&q=80" },
      { name: "Cyberpunk Accent", promptSuffix: "futuristic low-key mood layout highlighted with soft purple and cyan color grading washes", thumbnail: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=150&q=80" },
      { name: "Recessed LED Strips", promptSuffix: "warm indirect 3000K recessed architectural LED strip glow lines built seamlessly into ceiling drops", thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=150&q=80" },
      { name: "Crystal Chandelier", promptSuffix: "high-end modern crystal drop statement chandelier casting intricate refracted light arrays", thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=150&q=80" },
      { name: "Industrial Penders", promptSuffix: "minimalist matte black spun-metal factory pendant light configurations casting downward warm beams", thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=150&q=80" }
    ]
  },
  {
    id: "windows_blinds",
    name: "Window & Blinds",
    icon: "🪟",
    guardrail: "CRITICAL: Keep the core architecture, color palette, flooring, and room furniture configuration entirely unedited. Modify ONLY the windows, glass framing, blind assemblies, and window dressing materials.",
    choices: [
      { name: "Roman Shades", promptSuffix: "tailored textured natural linen Roman shades clean-folded inside the window framework", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80" },
      { name: "Plantation Shutters", promptSuffix: "custom architectural white painted solid wood plantation shutters with adjustable louvers", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80" },
      { name: "Venetian Blinds", promptSuffix: "sleek matte black modern horizontal wooden venetian blinds", thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=150&q=80" },
      { name: "Roller Blinds", promptSuffix: "sleek modern fabric roller blinds covering the windows cleanly", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80" },
      { name: "Vertical Blinds", promptSuffix: "modern vertical window blinds slats in clean neutral white fabric", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80" },
      { name: "Zebra Blinds", promptSuffix: "contemporary dual-layered zebra blinds with alternating sheer and opaque horizontal fabric stripes", thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=150&q=80" },
      { name: "Honeycomb Shades", promptSuffix: "premium cellular honeycomb blinds with a soft beige translucent texture", thumbnail: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=150&q=80" },
      { name: "Wooden Blinds", promptSuffix: "classic horizontal natural wood grain blinds slats", thumbnail: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=150&q=80" },
      { name: "Sheer Drapes", promptSuffix: "elegant soft white floor-to-ceiling semi-translucent sheer fabric drapes pooling gently on the floor", thumbnail: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=150&q=80" },
      { name: "Blackout Curtains", promptSuffix: "heavy tailored dramatic deep charcoal gray velvet blackout drapery tracking panels", thumbnail: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=150&q=80" },
      { name: "Black Metal Frame", promptSuffix: "contemporary grid-pattern thin profile matte black steel architectural window frames", thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=150&q=80" },
      { name: "White Timber Frame", promptSuffix: "traditional thick profiled solid white painted wood window framing assembly", thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&q=80" }
    ]
  },
  {
    id: "outdoor_patio",
    name: "Outdoor & Patio",
    icon: "🏡",
    guardrail: "CRITICAL: Maintain the external building perimeter structure, house siding, and background natural horizons. Transform the immediate floor deck area and outdoor living furniture setup completely.",
    choices: [
      { name: "Teak Timber Decking", promptSuffix: "weather-treated rich natural teak timber wood plank outdoor decking layout", thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=150&q=80" },
      { name: "Charcoal Composite", promptSuffix: "modern ultra-clean zero-maintenance charcoal gray composite decking look", thumbnail: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=150&q=80" },
      { name: "Flagstone Pavers", promptSuffix: "irregularly shaped natural slate flagstone pavers with organic moss detailing in deep stone joints", thumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=150&q=80" },
      { name: "Boho Chic Oasis", promptSuffix: "relaxed bohemian exterior terrace with layered outdoor rugs, woven rattan seating, and hanging macrame string lights", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80" },
      { name: "Modern Minimalist Deck", promptSuffix: "upscale architectural outdoor patio area featuring streamlined low-profile linear metal furniture and built-in concrete fire pits", thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=150&q=80" },
      { name: "Mediterranean Terrace", promptSuffix: "sun-bleached white stucco walls, terracotta floor pavers, olive trees in clay planters, and wrought iron seating arrangements", thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=150&q=80" }
    ]
  }
];
