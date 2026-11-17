export interface Vehicle {
  id: number;
  name: string;
  desc: string;
  price: string;
  location: string;
  extra: number;
  image: string;
  alt: string;
  isPrimaryMedia?: boolean;
}

export const HERO_MEDIA = {
  poster: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/d95584a7-788a-44d7-9599-b02bd19aa092.jpg',
  video: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/58a84706-cc4c-494c-a1e6-13c8469f128d.mp4',
};

export const VEHICLES: Vehicle[] = [
  {
    id: 0,
    name: 'G-Class Sport 2025',
    desc: "Puissance du V8 biturbo. À l'aise en ville comme sur route.",
    price: '$450',
    location: 'Marrakech',
    extra: 3,
    image: '/assets/gclass-sport-2025.png',
    alt: 'G-Class Sport 2025',
    isPrimaryMedia: true,
  },
  {
    id: 1,
    name: 'Porsche 911 Carrera',
    desc: "L'icône à moteur arrière. Toujours analogique là où ça compte.",
    price: '$420',
    location: 'Marrakech',
    extra: 2,
    image: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/f999be6e-5e04-4f8e-80c4-9f36260a00de.png',
    alt: 'Porsche 911 Carrera',
  },
  {
    id: 2,
    name: 'Range Rover Autobiography',
    desc: "Sérénité sur coussin d'air. La circulation reste loin dessous.",
    price: '$360',
    location: 'Palmeraie',
    extra: 4,
    image: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/48d9cc8e-60cb-430a-9e36-ccd22949fa04.png',
    alt: 'Range Rover Autobiography',
  },
  {
    id: 3,
    name: 'Bentley Continental GT',
    desc: 'Douze cylindres, cuir cousu main. Le grand tourisme sans hâte.',
    price: '$690',
    location: 'Hivernage',
    extra: 1,
    image: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/9ce67fcf-e0d4-437e-ab0e-e07216fc9ffe.png',
    alt: 'Bentley Continental GT',
  },
  {
    id: 4,
    name: 'BMW 7 Series',
    desc: "Un habitacle silencieux, un salon à l'arrière. Tailleur long courrier.",
    price: '$280',
    location: 'Marrakech',
    extra: 3,
    image: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/06b0cd99-f8fb-4a66-a254-eb8daee3e4ed.png',
    alt: 'BMW 7 Series',
  },
  {
    id: 5,
    name: 'Yamaha TMAX 2026',
    desc: 'Agilité urbaine en noir intégral. Le maxi-scooter de référence.',
    price: '$140',
    location: 'Marrakech',
    extra: 5,
    image: '/assets/tmax-2026.png',
    alt: 'Yamaha TMAX 2026 Noir',
  },
];

export const PARTNER_BRANDS = [
  'Mercedes-Benz',
  'Porsche',
  'Range Rover',
  'BMW',
  'Bentley',
  'Aston Martin',
  'Maserati',
  'Lexus',
  'Yamaha',
];
