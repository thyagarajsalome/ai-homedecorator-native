import { SelectionCategory, StudioCategory } from './types';

export interface StudioTab {
  id: StudioCategory;
  name: string;
  icon: string;
  subtitle: string;
}

export const STUDIO_TABS: StudioTab[] = [
  { id: 'interior', name: 'Interiors', icon: '🛋️', subtitle: 'Living, Bedroom, Kitchen & Bath' },
  { id: 'exterior', name: 'Architecture', icon: '🏡', subtitle: 'House Facades, Villas & Roofs' },
  { id: 'landscape', name: 'Landscapes', icon: '🌿', subtitle: 'Backyards, Pools & Patios' },
  { id: 'commercial', name: 'Commercial', icon: '🏢', subtitle: 'Cafes, Boutiques & Virtual Staging' },
];

export interface AtmosphereOption {
  id: 'daylight' | 'golden_hour' | 'evening_2700k' | 'twilight';
  name: string;
  icon: string;
  description: string;
}

export const ATMOSPHERE_OPTIONS: AtmosphereOption[] = [
  { id: 'daylight', name: 'Daylight', icon: '☀️', description: 'Crisp natural morning light' },
  { id: 'golden_hour', name: 'Golden Hour', icon: '🌅', description: 'Warm sunset low-angle glow' },
  { id: 'evening_2700k', name: 'Cozy Evening', icon: '🌙', description: '2700K warm ambient cove lights' },
  { id: 'twilight', name: 'Dusk Twilight', icon: '💡', description: 'Deep blue hour with accent lights' },
];

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
  // ==========================================
  // 🛋️ INTERIORS
  // ==========================================
  {
    id: "full_redesign",
    name: "Full Room Design",
    icon: "🛋️",
    studioGroup: "interior",
    guardrail: "CRITICAL: Completely replace the stylistic visual identity, furniture, decor details, and layout theme of the entire room. Maintain only the core outer door and window frame limits.",
    choices: [
      { name: "Japandi", promptSuffix: "organic fusion layout matching dark rustic japanese minimalism with clean nordic structures, low-profile ash furniture, sliding shoji panel influences, and handmade ceramic decor details", thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=200&q=75" },
      { name: "Scandinavian", promptSuffix: "light airy scandinavian architectural space utilizing pale birch timbers, clean minimalist furniture profiles, soft cream textiles, and functional cozy decorations", thumbnail: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=200&q=75" },
      { name: "Modern Luxury", promptSuffix: "ultra-luxury interior style incorporating gold and brass accents, plush velvet fabrics, polished marble surfaces, and a grand statement chandelier", thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=75" },
      { name: "Minimalist", promptSuffix: "ultra-clean minimalist room layout featuring only the functional essentials, clutter-free surfaces, and a simple monochromatic color scheme", thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=200&q=75" },
      { name: "Industrial Loft", promptSuffix: "urban industrial design layout highlighting raw exposed brick walls, metal conduits, concrete flooring, and weathered leather seating", thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=200&q=75" },
      { name: "Bohemian Chic", promptSuffix: "vibrant bohemian room filled with layered colorful textiles, rattan and wicker accents, hanging macrame, and an abundance of indoor plants", thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=75" },
      { name: "Mediterranean", promptSuffix: "relaxed luxury coastal lifestyle featuring rough hand-plastered white warm stucco arches, natural exposed ceiling beams, wrought iron light fittings, and warm terracotta floor tones", thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=200&q=75" },
      { name: "Modern Farmhouse", promptSuffix: "cozy farmhouse room showing whitewashed shiplap, rustic barn doors, distressed oak finishes, and simple comfortable furnishings", thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=75" },
      { name: "Contemporary", promptSuffix: "cutting-edge contemporary interior showing curvier profiles, bold artistic accents, mixed textured surfaces, and a trendy color palette", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=75" },
      { name: "Traditional", promptSuffix: "classic traditional interior featuring rich dark wood paneling, detailed crown molding, symmetrical layout, and elegant upholstery", thumbnail: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=200&q=75" },
      { name: "Rustic Lodge", promptSuffix: "warm rustic room utilizing natural raw timber, stone fireplace features, cozy hand-woven rugs, and earthy, organic design elements", thumbnail: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=200&q=75" },
      { name: "Japanese Zen", promptSuffix: "peaceful japanese inspired room showcasing low-to-floor wooden furniture, sliding shoji screens, clean lines, and a minimalist zen garden aesthetic", thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=200&q=75" }
    ]
  },
  {
    id: "kitchen",
    name: "Kitchen Remodel",
    icon: "🍳",
    studioGroup: "interior",
    guardrail: "CRITICAL: Isolate the incoming space and dynamically replace the complete interior architecture, millwork layouts, plumbing fixtures, and countertop styling to transform the room functionality.",
    choices: [
      { name: "Euro Minimalist", promptSuffix: "handleless floor-to-ceiling flat panel dark wood kitchen cabinetry, seamless integrated appliances, and a single solid marble slab waterfall island", thumbnail: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=200&q=75" },
      { name: "Farmhouse Kitchen", promptSuffix: "complete kitchen remodel featuring classic white shaker cabinets, white quartz countertops, apron-front farmhouse sink, and black hardware accents", thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=75" },
      { name: "Chef's Kitchen", promptSuffix: "professional kitchen environment layout with professional-grade stainless steel countertops, open metal shelving, commercial-style pull-down faucet, and brick details", thumbnail: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=200&q=75" },
      { name: "Modern Minimalist", promptSuffix: "clean white kitchen with hidden appliances, subtle recessed lighting, and a smooth quartz counter", thumbnail: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=200&q=75" }
    ]
  },
  {
    id: "bathroom",
    name: "Bathroom & Spa",
    icon: "🛁",
    studioGroup: "interior",
    guardrail: "CRITICAL: Isolate the incoming space and dynamically replace the plumbing fixtures, shower screens, wall tiles, and vanity styling.",
    choices: [
      { name: "Luxury Spa", promptSuffix: "high-end wellness master bathroom with a deep freestanding soaking tub, floating light oak vanities, and floor-to-ceiling natural stone wall slabs", thumbnail: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=75" },
      { name: "Matte Black & Slate", promptSuffix: "high-contrast bathroom layout showing matte black plumbing fixtures, clean floating geometric white porcelain basins, and dark gray tiled walk-in rain showers", thumbnail: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=200&q=75" },
      { name: "Bright & Airy", promptSuffix: "light white tiled bathroom with brass hardware accents, natural sunlight, and hanging green plants", thumbnail: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=200&q=75" }
    ]
  },
  {
    id: "flooring",
    name: "Flooring Materials",
    icon: "🪵",
    studioGroup: "interior",
    guardrail: "CRITICAL: Maintain the exact placement, perspective, geometry, and materials of all furniture, walls, ceiling, windows, and decorative items. Change ONLY the floor surface finish and material texture.",
    choices: [
      { name: "White Oak Herringbone", promptSuffix: "premium natural white oak herringbone pattern hardwood parquet flooring with a matte finish", thumbnail: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=200&q=75" },
      { name: "Calacatta Marble", promptSuffix: "ultra-luxury polished white Calacatta marble slab flooring with dramatic gray veining", thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=75" },
      { name: "Dark Walnut Hardwood", promptSuffix: "rich deep chocolate brown walnut hardwood planks with bold luxury woodgrain patterns", thumbnail: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=200&q=75" },
      { name: "Polished Concrete", promptSuffix: "seamless urban industrial high-gloss polished concrete flooring with minor aggregate exposures", thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=75" },
      { name: "Large Format Porcelain", promptSuffix: "large format rectified porcelain flooring tiles with clean minimalist grout joints", thumbnail: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=200&q=75" }
    ]
  },
  {
    id: "wall_paint",
    name: "Wall Finishes",
    icon: "🎨",
    studioGroup: "interior",
    guardrail: "CRITICAL: Retain complete structural perspective, furniture assets, floor styling, lighting fixtures, and window placement. Modify ONLY the surface finish, paint color, or wallpaper materials of the vertical walls.",
    choices: [
      { name: "Warm Limewash", promptSuffix: "soft warm chalky textured natural limewash plaster wall finish with tonal clouding depth", thumbnail: "https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&w=200&q=75" },
      { name: "Venetian Plaster", promptSuffix: "luxurious hand-troweled polished Venetian plaster walls showing rich tonal depth", thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=200&q=75" },
      { name: "Slatted Oak Wood", promptSuffix: "modern vertical mid-century modern slatted oak timber accent wall panels", thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=200&q=75" },
      { name: "Exposed Brick", promptSuffix: "authentic rustic reclaimed red brick masonry wall construction detailing", thumbnail: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=200&q=75" }
    ]
  },

  // ==========================================
  // 🏡 ARCHITECTURE & EXTERIORS
  // ==========================================
  {
    id: "exterior_facade",
    name: "House Facade & Villa",
    icon: "🏡",
    studioGroup: "exterior",
    guardrail: "CRITICAL: Maintain the outer structural volume, roof silhouette, and property orientation of the building. Redesign the exterior facade materials, siding, windows, and architectural accents.",
    choices: [
      { name: "Modern Slats & Stucco", promptSuffix: "luxury contemporary architectural house facade featuring blackened vertical cedar timber slats, smooth warm off-white stucco, slim black metal window frames, and integrated exterior LED lighting", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=75" },
      { name: "Mediterranean Villa", promptSuffix: "whitewashed Mediterranean architectural villa with arched doorways, hand-plastered walls, terracotta clay barrel roof tiles, wrought iron balconies, and natural bougainvillea flowering", thumbnail: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=200&q=75" },
      { name: "Contemporary Glass & Steel", promptSuffix: "striking contemporary architectural home exterior with floor-to-ceiling glass curtain walls, cantilevered structural steel beams, and polished limestone cladding", thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=75" },
      { name: "Nordic Dark Timber", promptSuffix: "dramatic Scandinavian Nordic architectural exterior clad in charred Yakisugi blackened wood siding, large viewing windows, and sharp minimalist gables", thumbnail: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&q=75" },
      { name: "Modern Farmhouse", promptSuffix: "refined modern farmhouse exterior with crisp white vertical board-and-batten siding, standing seam black metal roof, wraparound porch with timber posts, and lantern sconces", thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=200&q=75" },
      { name: "Concrete & Limestone", promptSuffix: "minimalist architectural villa with board-formed architectural concrete panels, honed French limestone blocks, and flush concealed garage entry", thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=200&q=75" }
    ]
  },
  {
    id: "roof_balcony",
    name: "Roofs & Balconies",
    icon: "🪜",
    studioGroup: "exterior",
    guardrail: "CRITICAL: Maintain the building facade. Transform the rooftop or balcony into a luxury architectural living space.",
    choices: [
      { name: "Rooftop Lounge & Bar", promptSuffix: "ultra-luxury rooftop outdoor lounge with timber decking, glass balustrades, outdoor sectional seating, built-in ambient planter lights, and a sleek wet bar", thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=75" },
      { name: "Cantilevered Glass Balcony", promptSuffix: "seamless frameless structural glass balcony railing with minimalist recessed LED floor wash lights", thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=200&q=75" },
      { name: "Timber Pergola Porch", promptSuffix: "architectural stained Douglas fir pergola over front porch with slatted shade canopy and climbing green wisteria", thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=200&q=75" }
    ]
  },

  // ==========================================
  // 🌿 LANDSCAPE & OUTDOORS
  // ==========================================
  {
    id: "landscape_garden",
    name: "Backyard & Gardens",
    icon: "🌿",
    studioGroup: "landscape",
    guardrail: "CRITICAL: Maintain the core house boundaries and exterior walls. Completely redesign the yard, lawn, patio, and landscape grounds.",
    choices: [
      { name: "Tropical Pool Oasis", promptSuffix: "luxury backyard oasis featuring an inground resort-style swimming pool, light travertine pool coping, sunken poolside baja shelf with loungers, lush tropical palms, and ambient water features", thumbnail: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=200&q=75" },
      { name: "Firepit Patio & Deck", promptSuffix: "modern outdoor entertainment patio with large-format flagstone pavers, built-in curved concrete bench seating surrounding a natural gas stone firepit, and warm string festoon lighting", thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=200&q=75" },
      { name: "Japanese Zen Garden", promptSuffix: "tranquil Japanese dry landscape Zen garden with meticulously raked white granite gravel waves, sculpted mossy granite boulders, weeping Japanese maple, and bamboo fountain feature", thumbnail: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=200&q=75" },
      { name: "Outdoor Kitchen & Pergola", promptSuffix: "luxury backyard outdoor culinary kitchen with stainless steel built-in BBQ grill, concrete countertops, barstool counter seating under an automated louvered aluminum pergola", thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=200&q=75" },
      { name: "English Cottage Lawn", promptSuffix: "picturesque English cottage landscape with curved flagstone walking path, overflowing perennial flowering borders (lavender, hydrangeas, roses), manicured emerald lawn, and wooden arbor", thumbnail: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=200&q=75" },
      { name: "Modern Desert Xeriscape", promptSuffix: "architectural drought-tolerant desert landscape with warm decomposed granite groundcover, architectural agave, golden barrel cactus, and sculptural corten steel planter boxes", thumbnail: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=200&q=75" }
    ]
  },

  // ==========================================
  // 🏢 COMMERCIAL & STAGING
  // ==========================================
  {
    id: "commercial_spaces",
    name: "Commercial & Cafes",
    icon: "🏢",
    studioGroup: "commercial",
    guardrail: "CRITICAL: Maintain the commercial room boundary and structural support columns. Transform the space into a commercial hospitality or retail environment.",
    choices: [
      { name: "Boutique Coffee Bar", promptSuffix: "high-end artisan coffee shop interior with custom terrazzo serving counter, commercial espresso bar setup, fluted oak menu backdrop, globe pendant lighting, and warm banquette seating", thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=75" },
      { name: "Luxury Fashion Boutique", promptSuffix: "minimalist luxury designer clothing boutique featuring brushed brass hanging racks, backlit floating shelving, central marble display podiums, and plush velvet fitting lounge", thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=75" },
      { name: "Modern Co-Working Office", promptSuffix: "contemporary open-concept creative office space with oak shared workbench tables, ergonomic chairs, acoustic felt ceiling baffles, living moss wall feature, and glass conference room", thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=75" },
      { name: "Party Lounge", promptSuffix: "stylish upscale party lounge and event space featuring ambient neon and warm LED cove lighting, plush modular sectional seating, dance-floor-ready layout, custom DJ booth console, and modern party bar setup", thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=75" }
    ]
  },
  {
    id: "virtual_staging",
    name: "Real Estate Virtual Staging",
    icon: "🛋️",
    studioGroup: "commercial",
    guardrail: "CRITICAL: Isolate the vacant room. Detect the empty floor space and virtually stage photorealistic designer furniture perfectly suited for a top-tier real estate MLS listing photo.",
    choices: [
      { name: "Stage: Modern Living Room", promptSuffix: "photorealistic virtual staging of an empty room with a tailored modern ivory sectional sofa, sculptural round oak coffee table, textured wool area rug, gallery wall art, and olive tree in ceramic planter", thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=200&q=75" },
      { name: "Stage: Luxury Master Suite", promptSuffix: "photorealistic virtual staging of an empty bedroom with an upholstered linen king bed, crisp layered hotel bedding, matching dark oak nightstands with ceramic lamps, and woven bench at bed foot", thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=200&q=75" },
      { name: "Stage: Executive Office", promptSuffix: "photorealistic virtual staging of an empty room as a luxury home executive office with a solid walnut writing desk, leather executive chair, brass task lamp, and geometric area rug", thumbnail: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=200&q=75" }
    ]
  }
];
