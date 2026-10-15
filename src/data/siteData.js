export const BRAND = {
  name: "PAW & KIND.",
  subtitle: "PET WELLNESS STUDIO",
  tagline: "Care, with a little more heart.",
  location: "Metro Manila, Philippines",
  attribution:
    "Website Concept Made by: Web Developer Devin Planas",
};

export const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85",

  secondary:
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=850&q=85",

  puppy:
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1100&q=85",

  dog:
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=85",

  cat:
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=85",

  care:
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1100&q=85",

  comfort:
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1100&q=85",
};

export const SERVICES = [
  {
    id: "wellness",
    number: "01",
    icon: "heart",
    title: "Wellness Check",
    category: "Medical Care",
    tagline: "Feel-good care, from nose to tail.",
    description:
      "A thoughtful consultation to discuss your pet's general health, daily routine, and ongoing care needs.",
    duration: "30–45 min",
    includes: [
      "General wellness discussion",
      "Basic physical assessment",
      "Preventive care recommendations",
    ],
    image: IMAGES.dog,
  },
  {
    id: "vaccination",
    number: "02",
    icon: "shield",
    title: "Vaccination Care",
    category: "Preventive Care",
    tagline: "Protection at every life stage.",
    description:
      "Discuss age-appropriate vaccination plans and preventive health with a veterinary professional.",
    duration: "20–30 min",
    includes: [
      "Vaccination history review",
      "Vet-guided recommendations",
      "Aftercare guidance",
    ],
    image: IMAGES.puppy,
  },
  {
    id: "grooming",
    number: "03",
    icon: "scissors",
    title: "Gentle Grooming",
    category: "Everyday Care",
    tagline: "A little refresh, a lot of love.",
    description:
      "A calm grooming experience designed around your pet's comfort, coat, and individual needs.",
    duration: "60–90 min",
    includes: [
      "Coat and skin assessment",
      "Gentle bath and brush",
      "Comfort-focused finishing",
    ],
    image: IMAGES.secondary,
  },
  {
    id: "dental",
    number: "04",
    icon: "smile",
    title: "Dental Wellness",
    category: "Medical Care",
    tagline: "Happy mouths, healthier days.",
    description:
      "A veterinary-led discussion about oral health, hygiene, and whether further dental treatment is appropriate.",
    duration: "30 min",
    includes: [
      "Oral health consultation",
      "Dental hygiene guidance",
      "Care planning if needed",
    ],
    image: IMAGES.cat,
  },
  {
    id: "nutrition",
    number: "05",
    icon: "leaf",
    title: "Nutrition Guidance",
    category: "Lifestyle Care",
    tagline: "Thoughtful choices, healthier habits.",
    description:
      "Explore feeding routines, nutrition goals, and lifestyle considerations tailored to your companion.",
    duration: "30–45 min",
    includes: [
      "Feeding routine review",
      "Body condition discussion",
      "Lifestyle recommendations",
    ],
    image: IMAGES.comfort,
  },
  {
    id: "senior",
    number: "06",
    icon: "sparkle",
    title: "Senior Pet Care",
    category: "Medical Care",
    tagline: "Extra comfort for golden years.",
    description:
      "Supportive wellness consultations focused on aging companions and their changing everyday needs.",
    duration: "45 min",
    includes: [
      "Age-related wellness review",
      "Mobility and comfort discussion",
      "Ongoing care recommendations",
    ],
    image: IMAGES.care,
  },
];

export const SERVICE_FILTERS = [
  "All Care",
  "Medical Care",
  "Preventive Care",
  "Everyday Care",
  "Lifestyle Care",
];

export const TEAM = [
  {
    id: "amara",
    name: "Dr. Amara Cruz",
    initials: "AC",
    role: "VETERINARY WELLNESS",
    focus: "Preventive care & general health",
    bio:
      "A sample veterinarian profile reflecting the practice's calm, education-first approach to pet wellness.",
    number: "01",
  },
  {
    id: "leo",
    name: "Dr. Leo Reyes",
    initials: "LR",
    role: "COMPANION ANIMAL CARE",
    focus: "Adult & senior pet wellness",
    bio:
      "A sample clinical profile representing thoughtful consultations and long-term companion animal care.",
    number: "02",
  },
  {
    id: "mika",
    name: "Mika Navarro",
    initials: "MN",
    role: "PET CARE COORDINATOR",
    focus: "Gentle handling & visit coordination",
    bio:
      "A fictional care-team profile representing the welcoming experience families can expect from this concept.",
    number: "03",
  },
];

export const CARE_VALUES = [
  {
    number: "01",
    title: "Comfort first.",
    description:
      "A welcoming visit starts with patience, gentle handling, and attention to each pet's unique personality.",
  },
  {
    number: "02",
    title: "Care made clear.",
    description:
      "Straightforward conversations and thoughtful explanations help pet parents make informed decisions.",
  },
  {
    number: "03",
    title: "Every stage matters.",
    description:
      "From curious puppies to cherished senior companions, care should adapt as their needs change.",
  },
];

export const FAQs = [
  {
    question: "Can I book a real appointment here?",
    answer:
      "Not yet. This is a portfolio website concept. The appointment form saves demonstration requests inside your browser only.",
  },
  {
    question: "Does a submitted request guarantee a visit?",
    answer:
      "No. The sample request system does not connect to clinic staff or a real appointment calendar.",
  },
  {
    question: "Does the website process payments?",
    answer:
      "No. This prototype does not accept payments or store payment information.",
  },
  {
    question: "Are the veterinary team profiles real?",
    answer:
      "No. All names, positions, and team biographies displayed in this website concept are fictional placeholders.",
  },
];

export const DEMO_TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

export const PET_TYPES = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "other", label: "Other companion animal" },
];

export function localDateISO(date = new Date()) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function friendlyDate(value) {
  if (!value) return "—";

  const date = new Date(
    `${value}T12:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function timeLabel(value) {
  return (
    DEMO_TIME_SLOTS.find(
      (slot) => slot.value === value
    )?.label || value
  );
}