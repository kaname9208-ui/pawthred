// 集中配置品牌变量 —— 换品牌只需修改此文件（满足"集中 config 便于换品牌"要求）
// 注意：以下品牌名、文案、配色均为本项目自建，未复制任何参考站素材。
export const siteConfig = {
  // 站点正式域名（上线后改成你的真实域名；也支持 NEXT_PUBLIC_SITE_URL 覆盖）
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pawandthread.com",
  // 临时品牌占位，可经环境变量覆盖
  brandName: process.env.NEXT_PUBLIC_SITE_NAME || "PawThread",
  tagline: "Turn your pet into something you can wear.",
  description:
    "PawThread turns your favorite pet photo into a custom embroidered tee, crewneck or hoodie. Premium stitching, made to order, shipped from the USA.",
  announcement: "Buy 2+ apparel, save $5 each · Free shipping on orders $100+",
  freeShippingThreshold: 100,
  shippingFee: 6,
  currency: "USD",
  currencySymbol: "$",
  // Header 导航（右侧另含 Search / Account / Cart）
  nav: [
    { label: "Shop", href: "/products" },
    { label: "T-Shirts", href: "/products?cat=t-shirts" },
    { label: "Hoodies", href: "/products?cat=hoodies" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Our Story", href: "/about" },
    { label: "FAQ", href: "/faq" },
  ],
  social: {
    instagram: "#",
    tiktok: "#",
    pinterest: "#",
  },
  emailOffer: "Subscribe for 10% Off",
  contactEmail: "hello@pawandthread.com",
} as const;

export type SiteConfig = typeof siteConfig;
