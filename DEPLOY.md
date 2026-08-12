# 部署指南（Paw & Thread · Next.js → Vercel）

本站点用 Next.js 14（App Router）构建，最省事的上线方式是 **Vercel**（Next.js 官方托管，自动构建、自动 HTTPS、全球边缘加速，美国用户访问很快）。下面是从「本地能跑」到「公网可下单」的完整步骤。

---

## 一、准备

1. **代码推到 GitHub**
   - 在 GitHub 新建一个仓库（如 `paw-and-thread`）。
   - 本地初始化并提交（`.env.local` 已被 git 忽略，不会上传密钥，安全）：
     ```bash
     cd pet-embroidery
     git init
     git add .
     git commit -m "Paw & Thread storefront"
     git remote add origin https://github.com/你的用户名/paw-and-thread.git
     git push -u origin main
     ```

2. **Stripe 密钥**（已有则跳过）
   - 登录 Stripe 后台 → **Developers → API keys**。
   - Test 模式：复制 `sk_test_...`（Secret）和 `pk_test_...`（Publishable）。
   - 正式营业再换 `sk_live_` / `pk_live_`。

3. **域名**（可选，但建议）
   - 在 Namecheap / Cloudflare / Google Domains 等买一个 `.com`（如 `pawandthread.com`）。

---

## 二、部署到 Vercel（约 3 分钟）

1. 打开 https://vercel.com → 用 GitHub 登录 → **Add New → Project**。
2. 导入刚才的仓库，Vercel 会自动识别 Next.js，**直接点 Deploy**（无需改构建命令）。
3. 部署完成后会得到一个 `xxx.vercel.app` 临时域名，先点开验证页面正常。

### 配置环境变量（关键）
在 Vercel 项目 **Settings → Environment Variables** 里逐条添加（上线前建议填 live key）：

| 变量名 | 值示例 | 说明 |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_xxx` / `sk_live_xxx` | 服务端私钥，**绝不**暴露给前端 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_xxx` / `pk_live_xxx` | 前端可公开 key |
| `NEXT_PUBLIC_USE_MOCK` | `true` | 当前用内置示例数据；接真实后端时改 `false` |
| `NEXT_PUBLIC_SITE_NAME` | `Paw & Thread` | 品牌名（可空，留默认） |
| `NEXT_PUBLIC_SITE_URL` | `https://你的域名.com` | 用于 Stripe 支付成功/取消跳转 |

添加后 **Redeploy**（项目页点 Deployments → 最新记录 → Redeploy）让变量生效。

---

## 三、域名指向（让网站用你自己的域名）

两种方式任选其一：

### 方式 A：把域名交给 Vercel 管理（推荐，最省心）
1. Vercel 项目 **Settings → Domains** → 输入 `你的域名.com` → Add。
2. 按提示去你的域名注册商，把 **Nameserver** 改成 Vercel 给的两条（如 `ns1.vercel-dns.com` / `ns2.vercel-dns.com`）。
3. 等待 DNS 生效（几分钟到几十分钟），状态变 **Valid** 即完成，HTTPS 自动签发。

### 方式 B：保留现有 DNS，只加记录
1. Vercel Domains 添加域名后，会提示添加一条 **A 记录** 指向 `76.76.21.21`，或一条 **CNAME** 指向 `cname.vercel-dns.com`。
2. 在你的 DNS 面板添加对应记录，等生效即可。
3. 同时把 `NEXT_PUBLIC_SITE_URL` 改成 `https://你的域名.com` 并 Redeploy。

成功后访问 `https://你的域名.com` 即正式营业。

---

## 四、切到正式收款（Live）
1. 在 Stripe 后台确认已切换到 **Live 模式** 并拿到 `sk_live_` / `pk_live_`。
2. 回到 Vercel **Environment Variables**，把 `STRIPE_SECRET_KEY` 和 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 的值换成 live key → Redeploy。
3. 用一张真实测试小额订单验证到账；之后即可对全量美国用户开放。

> 安全提示：live key 只放在 Vercel 环境变量里，**不要**写进代码或贴到聊天/群聊。

---

## 五、SEO 收尾（上线后建议做）

站点已内置这些 SEO 基础：**`sitemap.xml`**（自动包含全部产品页）、**`robots.txt`**、`canonical` 规范链接、`openGraph`、JSON-LD 结构化数据（`Organization` / `Product` / `AggregateRating` / `BreadcrumbList`）、Twitter Card、社交分享图 `public/og.png`。

上线后建议补这几步：

1. **设真实域名**：在 Vercel **Environment Variables** 把 `NEXT_PUBLIC_SITE_URL` 设为你的真实域名（如 `https://pawandthread.com`）→ Redeploy。否则 canonical / OG / 结构化数据里的链接都会是占位域名 `pawandthread.com`。
2. **接 Google Search Console**：验证域名 → 提交 `https://你的域名.com/sitemap.xml` → 把「国际定位（International Targeting）」设为 **United States**（针对美国市场）。
3. **填社媒链接**：在 `lib/config/site.config.ts` 的 `social` 里填真实 Instagram / TikTok / Pinterest 地址（当前是 `#` 占位），结构化数据的 `sameAs` 会自动带上，利于品牌信号。
4. **做内容拿更多自然流量**：后续可加一个博客 / 选购指南板块（现有 FAQ 页已利于收录）。

> 注意：右下角「✏ Edit Site」的改动只存在浏览器本地（localStorage），**不会**同步给线上访客。要真正改全站给所有访客看，需改源码并重新部署（直接告诉我改什么即可，我来改、你 push 一下 Vercel 自动生效）。

---

## 六、本地预览 / 调试
```bash
cd pet-embroidery
export NODE_OPTIONS=""          # 本沙箱需清空安全删除 shim，否则 next 启动失败
npm run dev                     # 默认 http://localhost:3000
```
环境变量放本地 `.env.local`（已 git 忽略）。改完 `.env.local` 需**重启 dev** 才生效。
