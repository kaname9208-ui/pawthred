import type { Review, FaqItem } from "@/lib/types";

// ============ 首页区块内容（全部原创英文文案，US 市场） ============

export const categorySections = [
  {
    slug: "t-shirts",
    title: "T-Shirts",
    blurb: "Simple. Personal. Yours.",
    tint: "#DFE0E8",
    href: "/products?cat=t-shirts",
  },
  {
    slug: "hoodies",
    title: "Hoodies",
    blurb: "Classic comfort, quietly personal.",
    tint: "#E9D9C2",
    href: "/products?cat=hoodies",
  },
];

export const valueProps = [
  {
    title: "Custom Made",
    text: "Made from your pet's photo — no two are ever the same.",
    icon: "paw",
  },
  {
    title: "Premium Embroidery",
    text: "Detailed stitching designed to capture their personality.",
    icon: "thread",
  },
  {
    title: "Made With Love",
    text: "Every piece is created especially for you, by hand.",
    icon: "heart",
  },
  {
    title: "Easy To Order",
    text: "Upload your photo and we'll handle the rest.",
    icon: "sparkle",
  },
];

export const howItWorks = [
  {
    step: "1",
    title: "Upload Your Photo",
    text: "Choose your favorite photo of your pet. Clear, well-lit shots work best — we accept almost all of them.",
    icon: "upload",
  },
  {
    step: "2",
    title: "We Create Your Design",
    text: "Our artists turn your photo into a custom embroidery design, matched to your garment and colors.",
    icon: "brush",
  },
  {
    step: "3",
    title: "You Approve It",
    text: "Review your design before production. Changes are easy — we want it to be just right.",
    icon: "check",
  },
  {
    step: "4",
    title: "Wear Your Story",
    text: "Your custom piece is embroidered and shipped to your door, ready to become part of everyday life.",
    icon: "shirt",
  },
];

export const trustBadges = [
  {
    title: "30-Day Guarantee",
    text: "Not happy with your order? We'll make it right.",
    icon: "shield",
  },
  {
    title: "Secure Checkout",
    text: "Your payment information is protected.",
    icon: "lock",
  },
  {
    title: "Free Shipping",
    text: "On all orders over $100, straight to your door.",
    icon: "truck",
  },
  {
    title: "Quality Embroidery",
    text: "Premium stitching designed to last, wash after wash.",
    icon: "star",
  },
];

export const ugcPosts = [
  { handle: "@maria.k", tint: "#E7D8C9", ratio: "1/1", src: "/ugc/customer-01.png" },
  { handle: "@thecolemanz", tint: "#D9D2C4", ratio: "1/1", src: "/ugc/customer-02.png" },
  { handle: "@luna_and_max", tint: "#DFE0E8", ratio: "1/1", src: "/ugc/customer-03.png" },
  { handle: "@jessbakes", tint: "#E4DABF", ratio: "1/1", src: "/ugc/customer-04.png" },
  { handle: "@old.dog.new.threads", tint: "#E9D9C2", ratio: "1/1", src: "/ugc/customer-05.png" },
  { handle: "@pets.and.co", tint: "#D8E0DC", ratio: "1/1", src: "/ugc/customer-06.png" },
];

// ============ 客户评价（明确标记为 Demo，避免伪造真实消费者） ============
export const reviews: Review[] = [
  {
    id: "r1",
    author: "Sarah M.",
    location: "Austin, TX",
    verified: true,
    rating: 5,
    pet: "Golden Retriever · Bella",
    text: "I cried when I opened it. The embroidery captured Bella's little smirk perfectly. The fabric is thick and cozy — I wear it every weekend.",
    ratio: "1/1",
    tint: "#E7D8C9",
    demo: true,
  },
  {
    id: "r2",
    author: "David R.",
    location: "Portland, OR",
    verified: true,
    rating: 5,
    pet: "Cat · Mochi",
    text: "Got this for my wife with our cat Mochi. She hasn't taken it off since. The stitching is so detailed you can see his grumpy little face.",
    ratio: "1/1",
    tint: "#D9D2C4",
    demo: true,
  },
  {
    id: "r3",
    author: "Elena T.",
    location: "Chicago, IL",
    verified: true,
    rating: 5,
    pet: "Late dog · Cooper",
    text: "I lost Cooper last year. Having him embroidered on a crewneck helped more than I expected. It feels like he's still with me on hard days.",
    ratio: "1/1",
    tint: "#DFE0E8",
    demo: true,
  },
  {
    id: "r4",
    author: "Marcus L.",
    location: "Atlanta, GA",
    verified: true,
    rating: 5,
    pet: "French Bulldog · Biscuit",
    text: "Ordered two pets on one crewneck for me and my brother. Both looked exactly like them. Shipping was faster than expected.",
    ratio: "1/1",
    tint: "#E4DABF",
    demo: true,
  },
  {
    id: "r5",
    author: "Priya S.",
    location: "Seattle, WA",
    verified: true,
    rating: 5,
    pet: "Cat · Pixel",
    text: "This made the perfect gift for my mom's birthday. She thought I'd drawn it myself. Worth every penny.",
    ratio: "1/1",
    tint: "#E9D9C2",
    demo: true,
  },
  {
    id: "r6",
    author: "Tom B.",
    location: "Denver, CO",
    verified: true,
    rating: 4,
    pet: "Lab · Daisy",
    text: "Quality is great and the embroidery is spot on. Took off one star only because I wish there were more thread colors, but I'd order again.",
    ratio: "1/1",
    tint: "#D8E0DC",
    demo: true,
  },
];

// ============ FAQ（对应 brief §15 至少 10 条） ============
export const faqs: FaqItem[] = [
  {
    q: "How does custom pet embroidery work?",
    a: "Upload a photo of your pet, pick your garment, color, size and placement, add their name if you like, and we turn the photo into a custom embroidery design. Once you approve it, we stitch it onto your item and ship it to you.",
  },
  {
    q: "What kind of photo should I upload?",
    a: "A clear, well-lit photo where your pet's face is visible works best — a head-on shot at eye level, taken in natural light. Avoid heavy filters, blur, or photos taken from directly above.",
  },
  {
    q: "Can I include multiple pets?",
    a: "Yes. You can choose 1, 2, or 3 pets on a single piece. Each additional pet is priced at checkout, and our artists compose them together into one design.",
  },
  {
    q: "Can I add my pet's name?",
    a: "Absolutely. There's an optional text field on every product where you can add your pet's name. It's embroidered in a clean, matching style.",
  },
  {
    q: "How long does production take?",
    a: "Most pieces are embroidered and shipped within 5–7 business days after design approval. You'll get an email with tracking once it's on its way.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping within the US typically takes 3–5 business days after production. Free shipping applies to all orders over $100. Orders under $100 have a flat $6 shipping fee.",
  },
  {
    q: "Can I preview my design before production?",
    a: "You'll see an honest sample layout of your garment, photo and name as you customize. Final embroidery is hand-finished by our artists, so the sample shows the composition — not the finished stitch.",  
  },
  {
    q: "Can I change my order after placing it?",
    a: "We can usually make changes within a short window after you order, as long as production hasn't started. Email us as soon as possible and we'll do our best.",
  },
  {
    q: "What happens if my pet photo isn't suitable?",
    a: "We accept almost all photos. If something won't work well for embroidery, our team reaches out to help you choose a better shot before we start — no guesswork, no wasted order.",
  },
  {
    q: "What is your return policy?",
    a: "Because every piece is made to order, we offer a 30-day guarantee: if you're not happy with the result, contact us and we'll make it right — including a replacement or refund where appropriate.",
  },
];
