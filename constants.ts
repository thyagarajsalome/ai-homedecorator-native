import { StyleCategory } from './types';

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

export const STYLE_CATEGORIES: StyleCategory[] = [
  {
    name: "European Styles",
    styles: [
      { name: 'Scandinavian', prompt: 'a Scandinavian style, featuring natural light, wood tones, and cozy textiles' },
      { name: 'Minimalist', prompt: 'a minimalist style with a neutral color palette and simple furniture' },
      { name: 'Industrial', prompt: 'an industrial style with exposed brick, metal accents, and raw materials' },
      { name: 'Traditional', prompt: 'a traditional European style with ornate furniture, rich colors, and classic patterns' },
      { name: 'Art Deco', prompt: 'an Art Deco style with bold geometric patterns, luxurious materials, and glamorous details' },
    ]
  },
  {
    name: "American Styles",
    styles: [
      { name: 'Mid-Century Modern', prompt: 'a mid-century modern style, with organic shapes and iconic furniture' },
      { name: 'Modern Farmhouse', prompt: 'a cozy modern farmhouse style with rustic wood, comfortable furniture, and a warm color palette' },
      { name: 'Coastal', prompt: 'a coastal style with light, airy colors, natural textures, and beach-themed decor' },
      { name: 'Boho', prompt: 'a bohemian style with eclectic patterns, vibrant colors, and natural elements' },
    ]
  },
  {
    name: "Asian Styles",
    styles: [
      { name: 'Japandi', prompt: 'a Japandi style, a hybrid of Japanese and Scandinavian design, focusing on simplicity, natural elements, and comfort' },
      { name: 'Wabi-Sabi', prompt: 'a Wabi-Sabi style, embracing imperfection, natural materials, and a serene, rustic aesthetic' },
      { name: 'Zen', prompt: 'a tranquil Zen style inspired by Japanese minimalism, with natural materials and a peaceful ambiance' },
      { name: 'Chinese Zen', prompt: 'a Chinese Zen (Chan) style, blending simplicity with subtle traditional Chinese elements and a focus on harmony with nature' },
    ]
  },
  {
    name: "Themed & Eclectic",
    styles: [
      { name: 'Barbiecore', prompt: 'a vibrant, playful Barbiecore style with bold pinks, glamorous furniture, and retro touches' },
      { name: 'Steampunk', prompt: 'a Steampunk style, featuring industrial-era machinery, gears, copper and brass metals, and Victorian-inspired elements' },
      { name: 'Art Nouveau', prompt: 'an Art Nouveau style with flowing, organic lines, nature-inspired motifs, and decorative details' },
      { name: 'Gothic Revival', prompt: 'a dramatic Gothic Revival style with dark colors, pointed arches, ornate details, and a sense of mystery' },
    ]
  }
];
