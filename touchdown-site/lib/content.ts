import { sanityClient, isSanityConfigured } from "./sanityClient";
import { urlForImage } from "./sanityImage";

// ---------------------------------------------------------------------------
// Fallback content — this is the site's original hardcoded copy. Every
// getX() function below tries Sanity first (if NEXT_PUBLIC_SANITY_PROJECT_ID
// is set) and falls back to this data otherwise, so the site keeps working
// exactly as it does today until a real Sanity project is connected.
// ---------------------------------------------------------------------------

export type FaqItem = { question: string; answer: string[] };

export const fallbackFaq: FaqItem[] = [
  {
    question: "Which package is right for me?",
    answer: [
      "We work with students of all levels, from beginners to well-seasoned athletes. You can choose any standard training package, and you can always personalize it based on your needs. Every student is different, but to see the best progress, we suggest at least 8 training sessions. You will benefit from shorter training periods with us, but at least two weeks of diving allows you to develop, adapt to, and absorb the skills we teach. Your training will depend on how much time you can commit to freediving and your availability in Dahab. If you're unsure which package is right for you, reach out, and we can help you decide.",
    ],
  },
  {
    question: "What's included in the price?",
    answer: [
      "Every package includes expert coaching, safety supervision, and access to our training sites, including Dahab's Blue Hole. Depending on the package, this may also include daily theory sessions, water time, dry training, and recovery activities such as yoga and breathwork. Our higher-tier packages also include a media kit, with professional photos from your sessions to capture your progress. Specific inclusions vary by package: check each card above for full details.",
    ],
  },
  {
    question: "What's not included?",
    answer: [
      "Flights, accommodation and meals are not included. We don't offer equipment rental as a paid service: however, if we have gear available, we're happy to lend it to you depending on stock and your needs. It's not guaranteed, so we recommend bringing your own equipment where possible.",
    ],
  },
  {
    question: "What equipment should I bring?",
    answer: [
      "If you already have your own mask, snorkel, wetsuit, fins, or freediving computer, bring them along! Training with your own gear is always the best option. If you don't have some or all of these, don't worry: depending on availability, we may be able to provide what you need. Just let us know in advance so we can check what we have on hand.",
    ],
  },
  {
    question: "Pre-arrival preparation",
    answer: [
      "Before you arrive, take care of a few key things to avoid any last-minute stress.",
      "Make sure you have your flight tickets, transfer arrangements, travel documents in order and double-check what's allowed in your luggage. If you need to rent equipment, confirm availability with us in advance. Bring both cash and a card, since not every place accepts card payments, and organize your accommodation ahead of time.",
      "On the visa side: if you're flying directly into Sharm El Sheikh and staying only within South Sinai (Sharm El Sheikh, Dahab, Nuweiba and Taba), you can enter on a free \"Sinai Only\" stamp, valid for 15 days and issued automatically at passport control. If you're staying longer, you'll need the standard 30-day tourist visa instead, either an e-visa arranged online before departure or a visa on arrival at the airport (around USD 25-30, cash only).",
      "One last thing: try not to arrive exhausted. Long flights and jet lag can slow down your body's recovery and make it more prone to inflammation, so give yourself a buffer before jumping into training.",
    ],
  },
  {
    question: "Payment options",
    answer: [
      "We accept payment via cash or bank transfer. A deposit may be required to secure your spot, with the balance due before or upon arrival. Reach out to our team for full payment details.",
    ],
  },
  {
    question: "Recommendations",
    answer: [
      "Pack light, breathable clothing and modest outfits for exploring the town, along with reef-safe sunscreen and a hat (the sun in Dahab is strong year-round, even in winter).",
      "Bring cash: not all the places accept credit cards, and ATM fees can be steep, so it's worth arriving with Egyptian pounds or exchangeable USD/EUR. A local SIM card (Orange or Vodafone) is affordable and easy to pick up if you want reliable data during your stay.",
      "If you're travelling from outside Europe, remember to bring a type C/F adapter for your electronics, and it's worth checking that your travel insurance covers freediving and water activities, as standard policies often don't.",
      "A reusable water bottle is also handy: you'll want to stay hydrated throughout your stay, and it helps cut down on plastic waste along the reef.",
      "For long stays, we recommend booking an apartment rather than a hotel, so you can cook your own meals at home; it's more budget-friendly and gives you better control over your diet during training.",
    ],
  },
];

export type TeamMember = {
  name: string;
  image: string;
  bio: string;
  fullBio: string[];
  qualifications: string[];
  records: string | null;
  instagram: string | null;
  website: string | null;
};

export const fallbackTeam: TeamMember[] = [
  {
    name: "Gus",
    image: "/images/team-gus.jpg",
    bio: "Founder of TOUCHDOWN. SSI, AIDA, and Molchanovs instructor, CMAS Instructor Trainer, competitive freediver.",
    fullBio: [
      "I didn't come to freediving from the water: I came to it from a welding job in grey, rainy England, feeling like there had to be more to life than that. A video of Guillaume Nery's \"Freefall\" was what pulled me in, and I never looked back. I left welding behind, moved to Sharm El Sheikh to learn from the best there, and built myself into an instructor, coach, and competitive freediver from scratch. Aside from World Championships, Vertical Blue in the Bahamas, the \"Wimbledon of Freediving\", was one of the proving grounds along the way.",
      "Dahab is where it all settled: after years of practice, I opened Touchdown on the roof of a seaside restaurant, in the middle of the pandemic, with more belief than resources. Everything since has been building that rooftop idea into what Touchdown is now: one of the best holistic freediving schools in the world. Step by step is my motto.",
    ],
    qualifications: [
      "SSI, AIDA, and Molchanovs Freediving Instructor",
      "AIDA Judge",
      "CMAS Instructor Trainer",
      "Master of Underwater Sports",
    ],
    records: "-130m NLT / -107m CWT / -94m FIM / -88m CWTB / -61m CNF",
    instagram: "https://www.instagram.com/gkreivenas?igsh=Ymlzb3l5eG03eTh0",
    website: null,
  },
  {
    name: "Omar",
    image: "/images/team-omar.jpg",
    bio: "Coach, athlete, safety. Specialized in frenzel equalisation. AIDA instructor, YOUTH instructor.",
    fullBio: [
      "Born in Giza, Egypt, I lived in Saudi Arabia, Bahrain, and Malaysia before moving back home to reconnect with my roots. Ultimately, I chose to settle down in Dahab: mostly because of the Blue Hole.",
      "My love for the water started as early as I can remember, with my parents signing me up for swimming classes and spending every summer on the coast. Growing up, I threw myself into every water sport I could find, including surfing, kitesurfing, and scuba diving. Then, in 2023, I heard about freediving and came to Dahab out of pure curiosity to try it out.",
      "One year later, I was a certified instructor, competitive athlete, and safety freediver. My obsession with the sport only grew stronger every day. A few months after that, I joined Touchdown, where the team shares the exact same obsession: pushing the limits to become world-class freedivers. The rest is history!",
      "Something fun about me? I'm a total nerd when it comes to learning new skills. Outside of diving, I like to analyze equity investments and manage properties as an Airbnb Superhost. I'm also a proud Beagle dad: keep an eye out, you'll probably meet Johnny around the school. Currently, I'm also on my path to becoming a certified yoga and meditation teacher!",
    ],
    qualifications: [
      "3 years experience as a freediving athlete, coach, and safety diver",
      "AIDA Master Instructor",
      "AIDA Depth & Pool Competition Safety (certified by Vertical Blue)",
      "AIDA Youth Instructor",
      "AIDA Judge",
      "Personal records: VWT 71m, FIM 62m, CWT 50m, CWTB 50m, CNF 47m, STA 5:10",
    ],
    records: null,
    instagram: "https://www.instagram.com/itsomarsadek?igsh=M2Z2eDY5dHZhYTB0",
    website: null,
  },
  {
    name: "Maksim Kalnibolotskii",
    image: "/images/team-maksim.jpg",
    bio: "TOUCHDOWN Instructor, Competitive freediver. YWS yoga instructor.",
    fullBio: [
      "I spent my entire childhood, up to age 17, at a dolphinarium in Crimea, where we swam with dolphins every single day. That was also where I was first introduced to freediving and yoga.",
      "At first, I didn't realize this was my true calling. I was simply curious about how these practices affected my state of mind and shaped my perception. I could see the process changing me on every level: my perception expanded, and along with it grew my awareness of myself, the world, and my relationship with it.",
      "Between 2015 and 2021, I trained independently and took courses under the Molchanovs and YWS systems. Step by step, my depth increased, and the internal transformation became more and more profound. But one thing stayed the same: whenever teaching came up, I resisted fiercely: I still had unresolved childhood blocks to work through. Yet, at that point, I was already diving deeper than most of the instructors I had learned from.",
      "In 2021, I joined Touchdown. By then, I was already diving to 90 meters, but I started suffering severe injuries (lung squeezes), and my body could no longer handle the extreme stress of deep dives. Gus solved this problem for me: six months later, we reached 102 meters, and along with that, my attitude toward teaching completely shifted.",
      "Gradually, things fell into place, turning my initial interest into my primary life calling. In 2023, we dived to 105 meters. After that, I fully focused on teaching.",
    ],
    qualifications: [
      "2015: Started freediving practice",
      "2017: Started yoga practice",
      "2015 to 2021: Independent practice, training under the Molchanovs and YWS systems",
      "2021: Joined Touchdown",
      "2023: Reached 105 meters",
      "2024: Started teaching",
    ],
    records: "-105m FIM",
    instagram: "https://www.instagram.com/maksim_kalnibolotskii?igsh=MWJlOHl5dHhkMDNubQ==",
    website: null,
  },
  {
    name: "Denis",
    image: "/images/team-denis.jpg",
    bio: "Freediving instructor, competitive athlete, and safety diver with a taste for extreme sports and adventure.",
    fullBio: [
      "If I had to describe my life in two words, it would be: \"Everything happened.\"",
      "I learned to swim before I could walk, hence my love of water. I've traveled to many countries, and lived in some of them, hence my curiosity and thirst for new things. While traveling, I had to earn money, sometimes in extremely dubious ways, hence the mix of a healthy dose of not caring (an easy-going attitude) and cold reason.",
      "Extreme sports have always attracted me: parachutes, motorcycles, rocks, mountains, cars, boats, and (in the future) planes. I got into freediving on a friend's advice, and it hooked me like cigarettes from the first puff. Then I found TD and immediately decided I would stay here. My dream came true: the sea, the sun, the fish, and a bunch of crazy friends just like me. I love all of you: those who are with me all the time, and those who come for a while.",
      "Nordic character, eternally young and cheerful.",
    ],
    qualifications: ["Molchanovs W2I and WJ Instructor (young pool)", "AIDA 3", "AIDA Junior Judge"],
    records: null,
    instagram: "https://www.instagram.com/dizz_ia?igsh=bHo5cmdsaWtud3Bn",
    website: null,
  },
  {
    name: "Ilia",
    image: "/images/team-illia.jpg",
    bio: "Freediving and yoga instructor helping students connect breath, body, and water.",
    fullBio: [
      "I was born in Moscow; my mother is from Sochi, and every summer as a child we would visit my grandmother on the Black Sea. I learned to swim around the same time I learned to walk: my parents say my first words were \"rocks and sea,\" not \"mom and dad.\" My brother and I were constantly playing in the water, diving and trying to pick up large rocks from the bottom. We knew nothing about equalization, but we still managed to dive to 5 meters.",
      "In 2014, I started practicing yoga and was lucky with my instructor: alongside working with the body, he immediately began teaching breathing techniques and meditation. I learned that freedivers use some of these techniques, and I wanted to learn more. Through these practices, I first saw how breathing and attention can change my state and thinking, and later felt this even more strongly in the water.",
      "In the summer of 2016, I took a basic freediving course in a pool, and on the first day, I knew freediving would become my life's work. In the fall of 2016, I went to Dahab for a depth course and fell in love with the place.",
      "On my last day in Dahab, I met Gus by chance at a cafe, and that meeting completely changed my life. Just six months later, I returned to Dahab to dive with Gus. The Touchdown school didn't exist yet, but the same methods, teaching approach, and incredible atmosphere that later became its foundation were already in place.",
      "Today, at the school, I help people enjoy the process, better understand their body and breathing, and transfer these skills into the water. The sea has always been a part of my life, and I'm happy to share this experience, helping others discover their own path in freediving.",
      "Something curious about me? I do beatboxing. This always surprises people, and among freedivers, the question always comes up: does it help with equalization?",
    ],
    qualifications: [
      "Molchanovs Wave 4 (W4)",
      "AIDA 4",
      "AIDA Junior Judge",
      "Yoga instructor, personal practice since 2014, teaching since 2017",
      "Studied various yoga styles under leading Russian teachers",
      "Flexibility and strength coach, studied with circus performers, leading global experts in modern flexibility development, and fitness/strength & conditioning coaches",
    ],
    records: null,
    instagram: "https://www.instagram.com/merkulov_ilia?igsh=MWk5ajl0MnJjazZ1cw==",
    website: null,
  },
  {
    name: "Francesco",
    image: "/images/team-francesco.jpg",
    bio: "Physiotherapist, osteopath, and strength & conditioning coach specialized in freediver performance and recovery.",
    fullBio: [
      "I'm Francesco, an Italian physiotherapist, osteopath, and strength & conditioning coach with a passion for human performance. Ever since I began studying physiotherapy, I've been fascinated by the human body and the way it performs.",
      "My journey to Dahab actually started by chance. I first came here to celebrate my 30th birthday, and what was meant to be just a vacation quickly turned into something much bigger. I met Gus, discovered Touchdown, and immediately fell in love with both the team and the opportunity to combine my profession with my passion for the ocean and performance.",
      "Today, I work closely with freedivers, helping them better understand their bodies, recover from injuries, improve movement efficiency, and optimize their performance through evidence-based training. At Touchdown, I combine physiotherapy, osteopathy, and strength & conditioning to support freedivers throughout every stage of their journey, from overcoming pain and movement limitations to designing training strategies that improve performance, while also contributing to the educational side of the school through lectures and workshops.",
      "I love translating complex science into easily digestible knowledge.",
      "For me, Touchdown is much more than a freediving school: it's a place where performance, education, and community come together. Being part of a team that shares knowledge and constantly pushes each other to improve is what makes working here so rewarding.",
      "Something fun about me? I'm a proud nerd. If you can't find me exploring nature or buried in a sports science book, you'll probably find me playing Magic: The Gathering, a wonderfully nerdy strategy card game. And, just to complete the nerd package, I also own a 3D printer.",
    ],
    qualifications: [
      "Graduated in Physiotherapy from the University of Milan in 2014, before completing an Osteopathy diploma at ICOM in 2020. Currently continuing education in Strength & Conditioning through the European Institute of Athletic Preparation (IEPA), while preparing for the NSCA Certified Strength and Conditioning Specialist (CSCS) certification.",
      "Over the last decade, worked with athletes from a wide range of sports, specializing in injury prevention, rehabilitation, and strength development, bridging sports science and clinical practice.",
    ],
    records: null,
    instagram: "https://www.instagram.com/fisiofrankie?igsh=MXZuMGQxb3k4c2dpeg==",
    website: null,
  },
  {
    name: "Piko",
    image: "/images/team-piko.jpg",
    bio: "Photographer & visual storyteller. Specialized in underwater photography and adventure sports. Freediver.",
    fullBio: [
      "Hello! I'm Eslam Piko, an underwater, event, wedding, and adventure photographer based in Egypt.",
      "How did I end up here? Starting off at a major marketing agency in Cairo, I was always drawn to storytelling through visuals and imagery, so it felt natural to pick up a camera and dive into this creative field. I began my journey in photography with nightlife events before moving on to high-end parties, celebrity events, portraits, and weddings across Egypt. It wasn't long before I was working with major brands like Microsoft, Vodafone, Pepsi, and Mercedes, travelling across the country and delivering unique visual content that spoke to my clients' goals.",
      "Then Covid hit. Hours before the national lockdown, I gambled everything and traveled to Dahab on the Red Sea, hoping to ride out the pandemic by the ocean. Little did I know it would transform my life.",
      "For the next two years, I immersed myself in freediving, exploring the underwater world on a single breath. This experience has shaped my approach to photography and visual content, and pushed my imagery to become even more creative.",
      "I now split my time between Cairo and the stunning coastline of the Red Sea, indulging in extreme sports and capturing photos whenever I can.",
      "Fun fact about me? When I'm not behind the lens, you'll find me cycling with a rucksack full of camera equipment alongside my two honey-coloured dogs, Biscuit and Sugar. Rescued from the streets, they adopted me, and we've been a family ever since.",
    ],
    qualifications: [],
    records: null,
    instagram: "https://www.instagram.com/eslampiko?igsh=b20zdno0bWxmM3Fv",
    website: "https://eslampiko.com",
  },
  {
    name: "Francesca",
    image: "/images/team-francesca.jpg",
    bio: "In-land operations manager handling center organization and social media. Competitive athlete, safety freediver, and judge.",
    fullBio: [
      "My story with Dahab started three years ago, almost by chance. I was in Sharm El Sheikh for a training period at Freediving World, and during a trip I stopped for a day at the Blue Hole. On the way back I made a brief stop in town and that was enough to feel something I couldn't quite explain, but strong enough to make me promise myself I'd come back. So I did, a year later, staying for a full month. The problem is I never really left: I went back to Italy only to wrap up a few things and pack my bags, before moving here for good.",
      "I'd heard about Touchdown long before I actually got to know it, and from the outside it almost seemed like a military school for freedivers: I'll admit it intimidated me a little at first. But the more I got to know their philosophy and training method, the more I fell for it, until at the beginning of this year I joined the team as in-land operations manager: I handle all the \"dry\" side of things, general center organization, and social media.",
      "Something fun about me? I have four cats: and I'm allergic to them. If you ever need an antihistamine, you know where to find me.",
    ],
    qualifications: [
      "Professional background in hospitality, working with social media and reception, which is where a passion for organization comes from.",
      "Freediving came from something more personal: wanting to learn how to breathe, calm down, and manage the nervous system, then getting drawn in by the beauty of a sport that's truly just you against yourself.",
      "Today, a competitive athlete, safety freediver, and judge.",
    ],
    records: null,
    instagram: "https://www.instagram.com/frannyintheblue?igsh=MTE0N2czYTExcmI2Nw==",
    website: null,
  },
];

export type PricingTier = {
  name: string;
  duration: string;
  price: string;
  features: string[];
  bonus: string | null;
  quote: string;
  popular: boolean;
};

export const fallbackPricing: PricingTier[] = [
  {
    name: "Discovery day",
    duration: "1 Day",
    price: "€190",
    features: ["1 Intro lecture", "1 dry session", "1 water session", "Up to 2 students per 1 buoy"],
    bonus: null,
    quote: "A thrilling introduction to freediving in just one day – perfect for curious minds and adrenaline seekers",
    popular: false,
  },
  {
    name: "Freedom Flow",
    duration: "1 Week",
    price: "€740",
    features: ["4 lectures", "5 dry sessions", "5 water sessions", "Up to 2 students per 1 buoy"],
    bonus: null,
    quote: "Experience the fundamentals of freediving and build real confidence over a full week of focused training",
    popular: false,
  },
  {
    name: "Deep Mastery",
    duration: "2 Weeks",
    price: "€1,450",
    features: ["6 lectures", "12 dry sessions", "8 water sessions", "Up to 2 students per 1 buoy"],
    bonus: "Personalized underwater video analysis",
    quote: "Transform your freediving with our most effective program, combining breath control, equalization, and deep exploration",
    popular: true,
  },
  {
    name: "Ultimate Freediver",
    duration: "4 Weeks",
    price: "€2,750",
    features: ["12 lectures", "24 dry sessions", "16 water sessions", "Up to 2 students per 1 buoy"],
    bonus: "High-performance training insights & mindset coaching",
    quote: "This is the most complete freediving experience, designed for those who want to turn freediving into a lifestyle and push their limits beyond expectations",
    popular: false,
  },
];

export type Review = { name: string; role: string | null; image: string; rating: string; quote: string };

export const fallbackReviews: Review[] = [
  {
    name: "Alenka Artnik",
    role: "17x Freediving World Records",
    image: "/images/review-alenka-artnik.jpg",
    rating: "5 / 5",
    quote:
      "I first met Gus in 2015, when I started my freediving journey in Dahab. At that time I was a 50m diver, so in order to go safely deeper I had to learn advanced equalization technique. His pedagogy was very efficient, going from theory to practice was natural, which is rare when it comes to the mouthfill. Sharing his knowledge opened the door of my deep freediving career.",
  },
  {
    name: "Vassilis Garoutsos",
    role: "The owner of Freedive Greece",
    image: "/images/review-vassilis-garoutsos.jpg",
    rating: "5 / 5",
    quote:
      "A heartfelt thank you to the team at Touchdown! They are true experts in their field and highly experienced professionals who not only understand the technical aspects of training but also genuinely care about the individual. As a professional with over 25 years of experience in freediving, I was impressed by the fresh perspective they brought to my training.",
  },
  {
    name: "Quentin Isy-Schwart",
    role: "Professional freediver on the French National Team",
    image: "/images/review-quentin-isy-schwart.jpg",
    rating: "5 / 5",
    quote:
      "Before coming to Touchdown, I was diving at 70 meters, and not consistently. Today, I'm at 85 — I haven't early turned in months, and I know I still haven't reached my true limits. Touchdown completely changed the way I see freediving, unlocked me mentally, and helped me build my own protocols both in and out of the water.",
  },
  {
    name: "Ksenia Comaritcaia",
    role: "Beginner Depth Freediver",
    image: "/images/review-ksenia-comaritcaia.jpg",
    rating: "5 / 5",
    quote:
      "When I came to Touchdown, my personal best was 20 meters — I had never gone deeper before. Touchdown exceeded all my expectations. I started to feel the water in a completely new way and learned how to deeply relax, not just physically, but mentally too. My static breath-hold time improved significantly.",
  },
  {
    name: "Airat",
    role: "Underwater photographer",
    image: "/images/review-airat.jpg",
    rating: "5 / 5",
    quote:
      "I found myself in the world of freediving completely by chance — and straight away at the best school in the world, Touchdown. After training there, a completely new chapter began for me: I felt reborn. They taught me freediving literally from scratch, and thanks to this I became an underwater cameraman and began travelling the world.",
  },
  {
    name: "Simona Auteri",
    role: "Multiple World Record Holder and Italian Champion in Freediving",
    image: "/images/review-simona-auteri.jpg",
    rating: "5 / 5",
    quote:
      "When I first started diving with Gus and Touchdown, I had just reached the 55-metre mark without any proper coaching. Gus made everything simple, brought clarity to my mind, and broke down each phase of deep diving. After a year of training under Gus's and the team's watchful eyes, I reached 86 metres.",
  },
  {
    name: "Gina Stüssi",
    role: "Silver Medalist at the Swiss Championship",
    image: "/images/review-gina-stussi.jpg",
    rating: "5 / 5",
    quote:
      "Before I came to Touchdown, I was close to giving up freediving — the strict course requirements had taken the joy out of it. Touchdown helped me rediscover why I love freediving. Their approach took the pressure off, gave me the tools to train in a way that works for me, and helped me reach several new personal bests.",
  },
  {
    name: "Anna Bulycheva",
    role: "Freediving instructor",
    image: "/images/review-anna-bulycheva.jpg",
    rating: "5 / 5",
    quote:
      "In the last three years, not only have I mastered deep diving but also become a mentor for others. Thanks to Touchdown, I achieved a personal best of 63 meters. My coach, Gus, opened up a world of depth for me — and the knowledge I've gained helps me teach my own students with the same inspiration and commitment.",
  },
  {
    name: "Alexander",
    role: "6x national Georgian record holder",
    image: "/images/review-alexander.jpg",
    rating: "5 / 5",
    quote:
      "I ended up at Touchdown by accident right after my very first freediving course, and it was love from the very first day. In just two and a half years of learning freediving, with their support I've dived to 70 meters and set six national records. There is something magical about this place, the coaches, and the community.",
  },
  {
    name: "Mark Kisurin",
    role: "Freediving instructor, yoga coach",
    image: "/images/review-mark-kisurin.jpg",
    rating: "5 / 5",
    quote:
      "Touchdown is probably the best school in the world, and certainly in Dahab! The school has a professional team and a unique methodological approach for each student, as well as the highest safety standards. Whenever I come to Egypt for my own training, I always entrust the process to the specialists at Gus's school.",
  },
  {
    name: "Vika Palamarchuk",
    role: "Freediver",
    image: "/images/review-vika-palamarchuk.jpg",
    rating: "5 / 5",
    quote:
      "Touchdown Space isn't just a freediving school; it's a whole world where we create the conditions for confident growth in everyone. The most valuable asset is the attention to detail, evident in daily in-water practices, dryland exercises, yoga, breathing and bodywork, and analysis of the smallest technical nuances.",
  },
  {
    name: "Pierre Appelmans",
    role: "Freediver from Belgium",
    image: "/images/review-pierre-appelmans.jpg",
    rating: "5 / 5",
    quote:
      "I chose this freediving school because of their very extensive program, which included not only water lessons but also out-of-water training. I was really impressed with the friendly and very good instructors, and the feeling of being part of a big family. I would definitely recommend it.",
  },
  {
    name: "Giacomo Sergi",
    role: "Freediver",
    image: "/images/review-giacomo-sergi.jpg",
    rating: "5 / 5",
    quote:
      "Touchdown is more than a freediving school, it's a family. With Gus and Touchdown's support, I prepared for my last competition — in less than three months I improved my monofin technique, perfected my equalization, and achieved an easy 97 meter dive, up from a not-so-easy 89 meters.",
  },
  {
    name: "Jindriška Zajcacova",
    role: "Freediving instructor, swim coach",
    image: "/images/review-jindriska-zajcacova.jpg",
    rating: "5 / 5",
    quote:
      "I came to Touchdown expecting to find professional instructors and setup to do my training, but I found something much more — my very own freediving family! I've been a freediver for over 18 years and every time I come to TD I learn something new.",
  },
  {
    name: "Sahika Ercumen",
    role: "Turkish freediving World Record holder",
    image: "/images/review-sahika-ercumen.jpg",
    rating: "5 / 5",
    quote:
      "Touchdown is more than a school, it's a community and a second home for anyone serious about exploring the depths. What makes them so special is their vibe and approach — the instructors aren't just super knowledgeable and professional, they also really adapt to how you learn.",
  },
  {
    name: "Romas Vijeikis",
    role: "Freediver",
    image: "/images/review-romas-vijeikis.jpg",
    rating: "5 / 5",
    quote:
      "I had the privilege of training with Gus Kreivenas at Touchdown in Dahab, and I can't recommend them enough. He is not only an incredibly skilled freediver, but also a patient and thoughtful instructor who knows exactly how to adapt training to each diver's needs.",
  },
  {
    name: "Sasha Kiseleva",
    role: "Freediver",
    image: "/images/review-sasha-kiseleva.jpg",
    rating: "5 / 5",
    quote:
      "Touchdown isn't just about freediving — it's more like a place that quietly shifts something inside you. I never imagined myself reaching 50m, but with them I made it to 73m. Gus doesn't just teach freediving — he teaches how to train the brain itself.",
  },
  {
    name: "Tim Nelson",
    role: "Freediver",
    image: "/images/review-tim-nelson.jpg",
    rating: "5 / 5",
    quote:
      "I want to express my gratitude to everyone at Touchdown for the fantastic two weeks I spent with the school. We built all the fundamentals progressively and in depth. I noticed steady improvements every single day and went from 40m to 65m with every dive feeling amazing.",
  },
];

export type Author = { name: string; photo: string | null };

export type BlogPost = {
  title: string;
  slug: string;
  category: string | null;
  excerpt: string;
  coverImage: string;
  author: Author | null;
  publishedAt: string;
  // Sanity portable-text blocks when sourced from the CMS; a plain string
  // (rendered as a single paragraph) for the local fallback posts below.
  body: unknown;
};

function p(text: string) {
  return { _type: "block", style: "normal", children: [{ _type: "span", text }] };
}
function h2(text: string) {
  return { _type: "block", style: "h2", children: [{ _type: "span", text }] };
}

// Cover images below reuse photos already live elsewhere on the site (same
// temporary Figma-hosted URLs as Hero/Gallery/HowItWorks etc. - see the
// NOTE in those files re: exporting properly before shipping) or one of the
// two generic local photos already committed to /public/images. Once real
// posts exist in Sanity with their own uploaded cover images, none of this
// matters - these are just here so the placeholder posts don't look bare.
export const fallbackBlogPosts: BlogPost[] = [
  {
    title: "How to Equalise Like a Pro: A Beginner's Guide to Frenzel",
    slug: "how-to-equalise-frenzel-guide",
    category: "Training",
    excerpt:
      "Equalisation is the single biggest technical hurdle for new freedivers. Here's how the Frenzel technique actually works, and how to start building the muscle memory on dry land before you ever get in the water.",
    coverImage: "/images/dry-day-refinement.jpg",
    author: { name: "Gus Kreivenas", photo: "/images/team-gus.jpg" },
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    body: [
      p(
        "Almost every freediver hits the same wall in their first week of training: equalisation. Get it wrong and a dive ends at 5 metres with a sharp reminder in your ears. Get it right, and depth becomes a formality rather than a fight."
      ),
      h2("Why the Valsalva manoeuvre stops working"),
      p(
        "Most people learn to equalise on a plane by pinching their nose and blowing — the Valsalva manoeuvre. It works fine at shallow depth, but past 15-20 metres your lungs are compressed enough that you no longer have the air volume to force through your Eustachian tubes. You need a technique that doesn't rely on lung pressure at all."
      ),
      h2("The Frenzel technique"),
      p(
        "Frenzel uses the tongue and throat as a piston instead of the lungs. You close the glottis, trap a small pocket of air in the mouth and throat, and use the tongue to push it up into the Eustachian tubes. Because it doesn't draw from your lung volume, it keeps working all the way to depth."
      ),
      h2("Practising on dry land"),
      p(
        "Before ever testing this underwater, we get every student practising Frenzel dry, sitting upright, well before a session. A simple checkpoint: can you equalise sitting down, completely relaxed, without moving your jaw forward? If yes, you're ready to try it horizontal, then in the water in shallow depth with an instructor watching your technique."
      ),
    ],
  },
  {
    title: "5 Safety Rules Every Freediver Must Know",
    slug: "five-safety-rules-every-freediver",
    category: "Safety",
    excerpt:
      "Freediving is safe when the fundamentals are respected. These are the five non-negotiable rules we teach every student on day one, no exceptions.",
    coverImage: "/images/water-day-recovery.jpg",
    author: { name: "Touchdown Freediving", photo: null },
    publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    body: [
      p(
        "Freediving has a reputation for danger that mostly comes from people breaking rules that are very simple to follow. Respect these five, and the sport is remarkably safe."
      ),
      h2("Never dive alone"),
      p(
        "Every single dive needs a buddy watching from the surface, full attention, ready to respond. A blackout underwater without someone there to help is the scenario every other rule exists to prevent."
      ),
      h2("Never hyperventilate before a dive"),
      p(
        "Forcefully over-breathing before diving feels like it should help — it doesn't. It suppresses your urge to breathe without adding meaningful oxygen, which delays the warning signs your body gives you right up until it's too late."
      ),
      h2("Know your recovery breathing"),
      p(
        "The first breaths after surfacing matter as much as the dive itself. Proper recovery breathing after every dive, every time, is what keeps a diver safe even on a dive that pushed their limits."
      ),
    ],
  },
  {
    title: "Choosing Your First Wetsuit for Dahab's Waters",
    slug: "choosing-your-first-freediving-wetsuit",
    category: "Equipment",
    excerpt:
      "The Red Sea is warmer than most people expect, but the right wetsuit thickness still makes or breaks a training week. Here's what we recommend students bring.",
    coverImage: "/images/water-day-watertime.jpg",
    author: { name: "Ilia", photo: "/images/team-illia.jpg" },
    publishedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    body: "Water temperature in Dahab typically sits between 24-28°C depending on season, which means most students are comfortable in a 3mm open-cell wetsuit for the majority of the year, dropping to 1.5mm in peak summer. Open-cell suits fit tighter and insulate better than the lined suits you may have used for surfing or scuba, but they need a little lubricant to pull on and should never be worn dry on rocks or boats. If you're only doing one course and don't want to buy gear yet, rental suits in good condition are available through the school — just let us know your height and weight in advance so the right size is ready when you arrive.",
  },
  {
    title: "Why Dahab's Blue Hole Is the World's Freediving Mecca",
    slug: "why-dahabs-blue-hole-is-freediving-mecca",
    category: "Travel",
    excerpt:
      "A near-vertical drop to over 100 metres, a few steps from shore, in water you can see clearly through from the surface. Here's what makes this specific stretch of the Red Sea so special.",
    coverImage: "/images/howitworks-practice.jpg",
    author: { name: "Touchdown Freediving", photo: null },
    publishedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    body: [
      p(
        "There are only a handful of places on earth where a freediver can walk off the beach and be at 30 metres within a couple of minutes of surface swimming. The Blue Hole is one of them, and it's the reason Dahab has become the sport's most concentrated training hub."
      ),
      h2("Calm water, most of the year"),
      p(
        "Unlike open-ocean training sites, the Blue Hole itself is a sheltered lagoon-like formation, which means flat, current-free water for the vast majority of the year — ideal for the repetition depth training actually requires."
      ),
      h2("A built-in community"),
      p(
        "Because so many schools and athletes train here, the Blue Hole has become a genuine freediving community rather than just a dive site — you'll regularly find world-record holders training on the same line as first-week beginners."
      ),
    ],
  },
  {
    title: "Welcome to the Touchdown blog",
    slug: "welcome-to-the-touchdown-blog",
    category: "News",
    excerpt:
      "This is a placeholder post. Once Sanity is connected, Gus and the team can publish real articles here — training tips, Dahab guides, student stories — without touching any code.",
    coverImage: "/images/whoweare-team.jpg",
    author: { name: "Touchdown Freediving", photo: null },
    publishedAt: new Date().toISOString(),
    body: "This is placeholder text. Replace or delete this post once real content is being published from the Sanity Studio.",
  },
];

export type FooterLink = { id: string; label: string };

export type SiteContent = {
  heroHeadline: string;
  heroSubcopy: string;
  whoWeAreHeading: string;
  whoWeAreCopy: string;
  whoWeAreImage: string;
  howItWorksHeading: string;
  howItWorksSubtitle: string;
  pricingKicker: string;
  teamKicker: string;
  reviewsSubtitle: string;
  trainingRhythmHeading: string;
  waterDayHeading: string;
  waterDaySubcopy: string;
  dryDayHeading: string;
  dryDaySubcopy: string;
  whatYouGetHeading: string;
  notFoundHeadline: string;
  notFoundSubtext: string;
  notFoundImage: string;
  footerEmail: string;
  footerPhone: string;
  footerLocation: string;
  footerTagline: string;
  footerAboutTitle: string;
  footerAboutLinks: FooterLink[];
  footerExperienceTitle: string;
  footerExperienceLinks: FooterLink[];
  footerLegalTitle: string;
  footerLegalLinks: FooterLink[];
  footerContactTitle: string;
  headerNavLinks: FooterLink[];
  socialInstagram: string;
  socialTelegram: string;
  socialFacebook: string;
  socialWhatsapp: string;
};

export const fallbackSiteContent: SiteContent = {
  heroHeadline: "Freediving school\nConsistently delivering quality",
  heroSubcopy:
    "Join TOUCHDOWN team and experience real results in an environment built to support you daily on every step of your path.",
  whoWeAreHeading: "Who we are",
  whoWeAreCopy:
    'Touchdown Freediving was founded by Lithuanian record-holder Gus Kreivenas and has grown into a world-renowned centre in Dahab — the true "Mecca of freediving." Here, expert instruction meets a holistic approach, blending science, mindset, and practice to deliver lasting results. Train at Egypt\'s iconic Blue Hole while developing your full potential with personalized guidance and dedicated facilities.',
  whoWeAreImage: "/images/whoweare-team.jpg",
  howItWorksHeading: "How it works",
  howItWorksSubtitle: "Patience is key",
  pricingKicker: "Group Training Experience",
  teamKicker: "Your Dreams Are Our Goals!",
  reviewsSubtitle: "We Love our students so much and they love us too :)",
  trainingRhythmHeading: "Training Rhythm",
  waterDayHeading: "Water Day Schedule",
  waterDaySubcopy:
    "Our water days are designed to help you live and breathe the freediving lifestyle.\nWith expert guidance at Dahab's legendary Blue Hole, each session blends training, recovery, and refinement to take your diving further.",
  dryDayHeading: "Dry Day Schedule",
  dryDaySubcopy:
    "Dry days are about recovery and mental training — the other side of freediving mastery. They give you space to reset, while still building the skills and resilience you'll bring back into the water.",
  whatYouGetHeading: "What you get",
  notFoundHeadline: "Looks like you've gone off the line",
  notFoundSubtext:
    "We couldn't find the page you were looking for. It may have moved, or the link might be out of date.",
  notFoundImage: "/images/404-diver.jpg",
  footerEmail: "info@touchdown-space.com",
  footerPhone: "+20XXXXXXXXX",
  footerLocation: "Dahab, Egypt",
  footerTagline: "Ready to Dive In?",
  footerAboutTitle: "About",
  footerAboutLinks: [
    { id: "about-us", label: "About Us" },
    { id: "team", label: "Team" },
    { id: "reviews", label: "Reviews" },
    { id: "faq", label: "FAQ" },
  ],
  footerExperienceTitle: "Experience",
  footerExperienceLinks: [
    { id: "how-it-works", label: "How it works" },
    { id: "schedule", label: "Schedule" },
    { id: "prices", label: "Prices" },
    { id: "blog", label: "Blog" },
  ],
  footerLegalTitle: "Legal",
  footerLegalLinks: [
    { id: "privacy-policy", label: "Privacy Policy" },
    { id: "terms-and-conditions", label: "Terms & Conditions" },
  ],
  footerContactTitle: "Contact",
  headerNavLinks: [
    { id: "about-us", label: "About us" },
    { id: "how-it-works", label: "How it works" },
    { id: "schedule", label: "Schedule" },
    { id: "prices", label: "Prices" },
    { id: "team", label: "Team" },
    { id: "reviews", label: "Reviews" },
    { id: "faq", label: "FAQ" },
    { id: "blog", label: "Blog" },
  ],
  socialInstagram: "https://www.instagram.com/touchdown_space/",
  socialTelegram: "https://t.me/Boobakamazafaka",
  socialFacebook: "https://www.facebook.com/touchdown.host",
  socialWhatsapp: "https://wa.me/17676160225",
};

export type ScheduleDay = {
  day: string;
  label: "Water day" | "Dry Day" | "Day off";
  time?: string;
};

export const fallbackScheduleDays: ScheduleDay[] = [
  { day: "Saturday", label: "Water day", time: "07:00 - 18:00" },
  { day: "Sunday", label: "Water day", time: "07:00 - 18:00" },
  { day: "Monday", label: "Dry Day", time: "09:00 - 12:00" },
  { day: "Tuesday", label: "Water day", time: "07:00 - 18:00" },
  { day: "Wednesday", label: "Water day", time: "07:00 - 18:00" },
  { day: "Thursday", label: "Dry Day", time: "09:00 - 12:00" },
  { day: "Friday", label: "Day off" },
];

export type ScheduleCard = {
  title: string;
  image: string;
  copy: string;
  time?: string;
};

export const fallbackWaterDayCards: ScheduleCard[] = [
  {
    title: "Preparation",
    image: "/images/water-day-preparation.jpg",
    copy: "The day starts with a 07:00 taxi pickup for the scenic drive out to the Blue Hole, giving everyone time to settle in, get geared up, and mentally prepare before the first line goes in.",
    time: "07:00",
  },
  {
    title: "Water time",
    image: "/images/water-day-watertime.jpg",
    copy: "Spend the morning in the water with world-class coaches and safety teams. Sessions focus on technique and progression, with each dive tailored to your goals. You'll learn to relax at depth, refine your form, and build confidence with every session.",
    time: "07:00 - 12:00",
  },
  {
    title: "Recovery",
    image: "/images/water-day-recovery.jpg",
    copy: "After diving, enjoy a relaxed lunch with fellow freedivers and take time to recharge before the evening session. Optional activities like stretching or light training are available in the afternoon.",
    time: "Afternoon",
  },
  {
    title: "Refinement",
    image: "/images/water-day-refinement.jpg",
    copy: "The 18:00 dry session covers workshops and guided breathwork focused on equalization, breathing, and mental strategies. On Wednesdays, it's followed by an ice bath and sauna to round out the day.",
    time: "18:00",
  },
];

export const fallbackDryDayCards: ScheduleCard[] = [
  {
    title: "Yoga",
    image: "/images/dry-day-yoga.jpg",
    copy: "Begin the day with yoga designed for freedivers. Sessions target recovery, flexibility, and lung capacity, helping you strengthen your foundation and prepare for deeper dives.",
    time: "09:00",
  },
  {
    title: "Refinement",
    image: "/images/dry-day-refinement.jpg",
    copy: "At midday, join masterclasses and small-group workshops in the classroom or rooftop space. Training covers equalization, mindset, and guided breathwork to round out your practice.",
    time: "12:00",
  },
];

export type WhatYouGetItem = { title: string; copy: string };

export const fallbackWhatYouGet: WhatYouGetItem[] = [
  {
    title: "Relaxation",
    copy: "Training your nervous system to calm down on command, using simple & effective mental and physical tools you can independently practice anytime.",
  },
  {
    title: "Pressure Equalization",
    copy: "Mastering the muscles behind confident EQ, with the help of up to date tools, expert guidance, and an environment built for it.",
  },
  {
    title: "Functional Optimisation",
    copy: "Training your body to adapt smoothly to new environments, through a proven, practice-based method.",
  },
  {
    title: "Safety",
    copy: "A supportive team and a healthy mindset, guiding you toward turning your dreams into reality.",
  },
];

export type HowItWorksStep = {
  title: string;
  image: string;
  paragraphs: string[];
};

export const fallbackHowItWorksSteps: HowItWorksStep[] = [
  {
    title: "Theory",
    image: "/images/howitworks-theory.jpg",
    paragraphs: [
      "Learn the foundations of freediving through daily lectures and classes. We combine science, physiology, and mindfulness to prepare you mentally and physically for every dive. With the right knowledge, you'll feel confident and focused before entering the water.",
      "We cover relaxation, focus and sensitivity as the mental foundation, paired with breathing and equalisation as the physical core of every dive. From there, we build mobility and technique, along with the equipment knowledge that supports safe, efficient diving. You'll also learn how recovery, periodisation and strategy fit into long-term progress, all grounded in a strong safety-first approach.",
    ],
  },
  {
    title: "Practice",
    image: "/images/howitworks-practice.jpg",
    paragraphs: [
      "Apply your learning in real-time with expert instructors and safety teams by your side. Training takes place in world-renowned dive sites such as Egypt's Blue Hole, giving you the chance to experience depth while building trust and skill in open water.",
      "Our practice combines yoga for flexibility and breath control with line training and dry practice to refine technique out of the water. Recovery is built into the rhythm too, with bike rides, sauna sessions and ice baths supporting your body between training days, so you arrive at every session ready to perform and progress.",
    ],
  },
  {
    title: "Repetition",
    image: "/images/howitworks-repetition.jpg",
    paragraphs: [
      "Consistency is the key to progress. Through tailored dry and in-water training, you'll train your body and nervous system to adapt. Each session improves technique, efficiency, and relaxation, making every dive feel easier and more natural.",
      "Our rhythm is built around 6 days a week of training, split between 4 open water days and 2 dry days, giving your body the structure it needs to adapt. Through a steady mix of open water and dry drills, you'll build volume gradually and safely, turning consistent repetition into lasting progress you can feel in every session.",
    ],
  },
  {
    title: "Results",
    image: "/images/howitworks-results.jpg",
    paragraphs: [
      "Your dedication brings results. With structure, guidance, and proven methods, you'll discover how much deeper you can safely go. The true transformation comes from your commitment - and together, we'll help turn your diving goals into reality.",
      "Along the way, you'll build genuine mastery and depth, developing the nervous system regulation, awareness, control and sensitivity that define an accomplished freediver. These are the skills that carry far beyond the water, shaping how you move, breathe and respond under pressure in every part of life.",
    ],
  },
];

export const fallbackGalleryImages: string[] = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-8.jpg",
];

export type LegalSection = { heading: string; body: string[] };
export type LegalPage = { lastUpdated: string; sections: LegalSection[] };

export const fallbackHeroSlides: string[] = [
  "/images/hero.jpg",
  "/images/hero-2.jpg",
];

export const fallbackPrivacyPolicy: LegalPage = {
  lastUpdated: "",
  sections: [
    {
      heading: "1. Who we are",
      body: [
        'This Privacy Policy explains how Touchdown Freediving School ("Touchdown", "we", "us"), based in Dahab, Egypt, collects, uses, and protects your personal information when you visit our website or book a course with us.',
      ],
    },
    {
      heading: "2. Information we collect",
      body: [
        "When you make a booking, we collect the information you provide directly, such as your name, preferred start date, course/plan selection, Telegram username, and email address.",
        "We do not currently use cookies for advertising or tracking, and we do not run analytics that identifies you personally. If this changes, this policy will be updated.",
      ],
    },
    {
      heading: "3. How we use your information",
      body: [
        "We use the information you provide to process your booking, communicate with you about your course, and respond to enquiries. Booking details are currently sent to us by email as a submission, and may also be collected through a linked Google Form as part of finalising your registration.",
        "We do not sell or rent your personal information to third parties.",
      ],
    },
    {
      heading: "4. Third-party services",
      body: [
        "We use Google Forms to collect final booking registration details, which is subject to Google's own privacy policy. We may also communicate with you via Telegram or WhatsApp if you choose to contact us that way, which are subject to those platforms' respective privacy policies.",
      ],
    },
    {
      heading: "5. Data retention",
      body: [
        "We retain booking information for as long as necessary to provide our services and to meet any legal or accounting obligations, after which it is deleted or anonymised.",
      ],
    },
    {
      heading: "6. Your rights",
      body: [
        "You may ask us at any time to tell you what personal information we hold about you, to correct any inaccuracies, or to delete your information, subject to any legal obligations we may have to retain it. To make a request, contact us using the details below.",
      ],
    },
    {
      heading: "7. Changes to this policy",
      body: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices. The version in effect at the time you use our website or book a course will apply.",
      ],
    },
    {
      heading: "8. Contact",
      body: [
        "If you have any questions about this Privacy Policy or how we handle your information, please contact us at info@touchdown-space.com.",
      ],
    },
  ],
};

export const fallbackTermsAndConditions: LegalPage = {
  lastUpdated: "",
  sections: [
    {
      heading: "1. About these terms",
      body: [
        'These Terms & Conditions ("Terms") govern your booking and participation in any course, training session, or service offered by Touchdown Freediving School ("Touchdown", "we", "us"), based in Dahab, Egypt. By booking a course or attending training with us, you agree to these Terms in full.',
      ],
    },
    {
      heading: "2. Bookings and payment",
      body: [
        "A booking is confirmed once we receive the required deposit or full payment, as specified at the time of booking. Prices are as listed on our website or as quoted directly to you and are subject to change until a booking is confirmed.",
        "Full payment is due before the start of your course unless otherwise agreed with us in writing.",
      ],
    },
    {
      heading: "3. Cancellations and refunds",
      body: [
        "Cancellations made more than [X] days before your course start date are eligible for a full refund of any deposit or payment made, less any non-recoverable third-party costs already incurred on your behalf.",
        "Cancellations made within [X] days of your course start date may not be eligible for a refund, though we will always try to reschedule where possible.",
        "If Touchdown cancels a course or session (for example, due to weather, sea conditions, or instructor availability), you will be offered a full refund or the option to reschedule at no additional cost.",
      ],
    },
    {
      heading: "4. Health, fitness, and eligibility",
      body: [
        "Freediving is a physically demanding activity. You confirm that you are in good general health and have no medical condition that could affect your safety or the safety of others while freediving, including but not limited to cardiovascular conditions, epilepsy, uncontrolled asthma, or recent surgery.",
        "You must disclose any relevant medical conditions to us before your course begins. We reserve the right to require a medical certificate of fitness to dive, or to decline participation, where we reasonably believe there is a health or safety concern.",
        "Minors may only participate with the written consent of a parent or legal guardian, and subject to any minimum age requirements for the specific course.",
      ],
    },
    {
      heading: "5. Assumption of risk and liability",
      body: [
        "Freediving carries inherent risks, including but not limited to shallow water blackout, decompression illness, drowning, and injury. You acknowledge these risks and voluntarily assume them by participating in any Touchdown course or activity.",
        "You will be asked to sign a separate liability waiver and medical statement before participating, which forms part of these Terms. Nothing in these Terms is intended to exclude or limit liability that cannot be excluded or limited under applicable law.",
        "You agree to follow all safety instructions given by Touchdown instructors and staff at all times, and understand that failure to do so may result in removal from a course without refund.",
      ],
    },
    {
      heading: "6. Course completion and certification",
      body: [
        "Certification at the end of a course is awarded at the discretion of the instructor, based on your demonstrated skill, safety practice, and completion of all required course elements. Payment for a course does not guarantee certification.",
      ],
    },
    {
      heading: "7. Photography and media",
      body: [
        "Touchdown may take photographs or video during courses and events for use on our website, social media, and marketing materials. If you do not wish to be included, please let us know in writing before your course begins.",
      ],
    },
    {
      heading: "8. Changes to these terms",
      body: [
        "We may update these Terms from time to time. The version in effect at the time of your booking will apply to that booking.",
      ],
    },
    {
      heading: "9. Contact",
      body: [
        "If you have any questions about these Terms, please contact us at info@touchdown-space.com.",
      ],
    },
  ],
};



export async function getFaqItems(): Promise<FaqItem[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackFaq;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "faqItem"] | order(order asc){ question, answer }`
    );
    return items?.length ? items : fallbackFaq;
  } catch {
    return fallbackFaq;
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackTeam;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "teamMember"] | order(order asc){ name, "image": photo, bio, fullBio, qualifications, records, instagram, website }`
    );
    if (!items?.length) return fallbackTeam;
    return items.map((item: { name: string; image: unknown; bio: string; fullBio: string[] | null; qualifications: string[] | null; records: string | null; instagram: string | null; website: string | null }) => ({
      ...item,
      image: urlForImage(item.image as never) || "",
      fullBio: item.fullBio ?? [],
      qualifications: item.qualifications ?? [],
    }));
  } catch {
    return fallbackTeam;
  }
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackPricing;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "pricingTier"] | order(order asc){ name, duration, price, features, bonus, quote, popular }`
    );
    return items?.length ? items : fallbackPricing;
  } catch {
    return fallbackPricing;
  }
}

export async function getReviews(): Promise<Review[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackReviews;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "review"] | order(order asc){ name, role, "image": photo, rating, quote }`
    );
    if (!items?.length) return fallbackReviews;
    return items.map((item: { name: string; role: string | null; image: unknown; rating: string; quote: string }) => ({
      ...item,
      image: urlForImage(item.image as never) || "",
    }));
  } catch {
    return fallbackReviews;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSanityConfigured || !sanityClient) return fallbackSiteContent;
  try {
    const doc = await sanityClient.fetch(`*[_id == "siteContent"][0]`);
    if (!doc) return fallbackSiteContent;
    return {
      ...fallbackSiteContent,
      ...doc,
      whoWeAreImage: doc.whoWeAreImage
        ? urlForImage(doc.whoWeAreImage as never) || fallbackSiteContent.whoWeAreImage
        : fallbackSiteContent.whoWeAreImage,
      notFoundImage: doc.notFoundImage
        ? urlForImage(doc.notFoundImage as never) || fallbackSiteContent.notFoundImage
        : fallbackSiteContent.notFoundImage,
    };
  } catch {
    return fallbackSiteContent;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackBlogPosts;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "blogPost"] | order(publishedAt desc){ title, "slug": slug.current, category, excerpt, "coverImage": coverImage, "author": author->{name, "photo": photo}, publishedAt, body }`
    );
    if (!items?.length) return fallbackBlogPosts;
    return items.map((item: { title: string; slug: string; category: string | null; excerpt: string | null; coverImage: unknown; author: { name: string; photo: unknown } | null; publishedAt: string; body: unknown }) => ({
      ...item,
      excerpt: item.excerpt ?? "",
      coverImage: urlForImage(item.coverImage as never) || "",
      author: item.author ? { name: item.author.name, photo: urlForImage(item.author.photo as never) } : null,
    }));
  } catch {
    return fallbackBlogPosts;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured || !sanityClient) {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }
  try {
    const item = await sanityClient.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{ title, "slug": slug.current, category, excerpt, "coverImage": coverImage, "author": author->{name, "photo": photo}, publishedAt, body }`,
      { slug }
    );
    if (!item) return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
    return {
      ...item,
      excerpt: item.excerpt ?? "",
      coverImage: urlForImage(item.coverImage as never) || "",
      author: item.author ? { name: item.author.name, photo: urlForImage(item.author.photo as never) } : null,
    };
  } catch {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function getScheduleDays(): Promise<ScheduleDay[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackScheduleDays;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "scheduleDay"] | order(order asc){ day, label, time }`
    );
    return items?.length ? items : fallbackScheduleDays;
  } catch {
    return fallbackScheduleDays;
  }
}

async function getScheduleCards(section: "Water day" | "Dry day", fallback: ScheduleCard[]): Promise<ScheduleCard[]> {
  if (!isSanityConfigured || !sanityClient) return fallback;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "scheduleCard" && section == $section] | order(order asc){ title, "image": image, copy, time }`,
      { section }
    );
    if (!items?.length) return fallback;
    return items.map((item: { title: string; image: unknown; copy: string; time: string | null }) => ({
      ...item,
      image: urlForImage(item.image as never) || "",
    }));
  } catch {
    return fallback;
  }
}

export async function getWaterDayCards(): Promise<ScheduleCard[]> {
  return getScheduleCards("Water day", fallbackWaterDayCards);
}

export async function getDryDayCards(): Promise<ScheduleCard[]> {
  return getScheduleCards("Dry day", fallbackDryDayCards);
}

export async function getWhatYouGetItems(): Promise<WhatYouGetItem[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackWhatYouGet;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "whatYouGetItem"] | order(order asc){ title, copy }`
    );
    return items?.length ? items : fallbackWhatYouGet;
  } catch {
    return fallbackWhatYouGet;
  }
}

export async function getHowItWorksSteps(): Promise<HowItWorksStep[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackHowItWorksSteps;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "howItWorksStep"] | order(order asc){ title, "image": image, paragraphs }`
    );
    if (!items?.length) return fallbackHowItWorksSteps;
    return items.map((item: { title: string; image: unknown; paragraphs: string[] }) => ({
      ...item,
      image: urlForImage(item.image as never) || "",
    }));
  } catch {
    return fallbackHowItWorksSteps;
  }
}

export async function getGalleryImages(): Promise<string[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackGalleryImages;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "galleryImage"] | order(order asc){ "image": image }`
    );
    if (!items?.length) return fallbackGalleryImages;
    return items
      .map((item: { image: unknown }) => urlForImage(item.image as never) || "")
      .filter(Boolean);
  } catch {
    return fallbackGalleryImages;
  }
}

export async function getHeroSlides(): Promise<string[]> {
  if (!isSanityConfigured || !sanityClient) return fallbackHeroSlides;
  try {
    const items = await sanityClient.fetch(
      `*[_type == "heroSlide"] | order(order asc){ "image": image }`
    );
    if (!items?.length) return fallbackHeroSlides;
    return items
      .map((item: { image: unknown }) => urlForImage(item.image as never) || "")
      .filter(Boolean);
  } catch {
    return fallbackHeroSlides;
  }
}

async function getLegalPage(type: "privacyPolicy" | "termsAndConditions", fallback: LegalPage): Promise<LegalPage> {
  if (!isSanityConfigured || !sanityClient) return fallback;
  try {
    const doc = await sanityClient.fetch(`*[_type == $type][0]{ lastUpdated, sections }`, { type });
    if (!doc || !doc.sections?.length) return fallback;
    return {
      lastUpdated: doc.lastUpdated || fallback.lastUpdated,
      sections: doc.sections,
    };
  } catch {
    return fallback;
  }
}

export async function getPrivacyPolicy(): Promise<LegalPage> {
  return getLegalPage("privacyPolicy", fallbackPrivacyPolicy);
}

export async function getTermsAndConditions(): Promise<LegalPage> {
  return getLegalPage("termsAndConditions", fallbackTermsAndConditions);
}
