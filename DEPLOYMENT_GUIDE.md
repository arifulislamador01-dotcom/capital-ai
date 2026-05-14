# Capital AI - Deployment & SEO Guide

## 📋 Prerequisites

Before deploying, make sure you have:
- GitHub account (for version control)
- Vercel or Netlify account (for free hosting)
- Custom domain (optional but recommended)
- Google Search Console access
- Analytics tracking setup

---

## 🚀 Step 1: Prepare Your Project

### 1. Update Environment Variables
Create a `.env.production` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=https://yourdomainname.com
```

### 2. Update Domain References
In `app/layout.tsx`, replace:
- `https://capitalai.com` → Your actual domain
- Google verification code in metadata

### 3. Add OG Image
Place an optimized image at:
- `public/og-image.png` (1200x630px)
- Make sure it shows your brand clearly

---

## 🌐 Step 2: Deploy to Vercel (Recommended)

### A. Connect GitHub Repository

1. **Push your code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: Capital AI website"
git branch -M main
git remote add origin https://github.com/yourusername/capital-ai.git
git push -u origin main
```

2. **Create Vercel Account:**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize GitHub access

3. **Import Project:**
   - Click "New Project"
   - Select your `capital-ai` repository
   - Configure:
     - Framework: Next.js ✓
     - Root Directory: ./ ✓
     - Environment Variables: Add your `.env.production` values
   - Click "Deploy"

### B. Connect Custom Domain

1. **Purchase Domain:**
   - GoDaddy, Namecheap, or Hostinger
   - Example: `capitalai.com.bd` or `capital-ai.com`

2. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Add your domain
   - Follow DNS configuration steps
   - Usually takes 24-48 hours to propagate

### C. Enable SSL (Automatic)
Vercel automatically provides SSL certificates. Check in Settings → Security.

---

## 🔍 Step 3: SEO Optimization

### A. Google Search Console
1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Choose "URL prefix" and enter your domain
4. Verify ownership:
   - Download verification file from Vercel's Settings
   - OR Use DNS TXT record
5. Submit sitemap:
   - https://yourdomain.com/sitemap.xml

### B. Update Metadata
In `app/layout.tsx`, update:
```typescript
export const metadata: Metadata = {
  title: 'Capital AI - আপনার নিজস্ব ব্র্যান্ড নাম',
  description: 'আপনার ইউনিক বর্ণনা...',
  openGraph: {
    url: 'https://yourdomain.com',
    // ... other fields
  },
};
```

### C. Add Google Analytics
In `app/layout.tsx`, add to `<head>`:
```typescript
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script dangerouslySetInnerHTML={{__html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
`}} />
```

### D. Setup Google Analytics
1. Go to https://analytics.google.com
2. Create new property for your domain
3. Get your Google Analytics ID (GA_ID)
4. Add to code above

### E. Verify with Bing Webmaster Tools
1. Go to https://www.bing.com/webmaster
2. Add site
3. Verify ownership
4. Submit sitemap

---

## 📊 Step 4: Performance Optimization

### A. Check Page Speed
- Use https://pagespeed.web.dev
- Target: 90+ score on desktop

### B. Image Optimization
✓ Already done - using Next.js Image component with WebP/AVIF

### C. Code Splitting
✓ Already done - Next.js automatic code splitting

### D. Caching Strategy
✓ Already configured in `next.config.js`

---

## 🔐 Step 5: Security Headers (Included)

Your site includes:
- ✓ X-Frame-Options: DENY
- ✓ X-Content-Type-Options: nosniff
- ✓ X-XSS-Protection: 1; mode=block
- ✓ Referrer-Policy: strict-origin-when-cross-origin
- ✓ Cache-Control headers

---

## 📱 Step 6: Mobile Optimization

✓ Already done:
- Responsive design
- Mobile-first approach
- Touch-friendly buttons
- Fast load times on mobile

Test at: https://search.google.com/test/mobile-friendly

---

## 🎯 Step 7: Keywords Strategy

### Primary Keywords:
- AI tools Bengali
- ইমেজ জেনারেটর
- ভিডিও এডিটর
- AI writing assistant
- টেক্সট টু স্পিচ

### Long-tail Keywords:
- "বিনামূল্যে AI টুলস বাংলায়"
- "সেরা ইমেজ জেনারেটর"
- "অনলাইন ভিডিও এডিটর বাংলা"

---

## 📈 Step 8: Backlink Strategy

1. **Directory Submissions:**
   - Google My Business
   - Bangladesh tech directories
   - AI tools listing sites

2. **Social Media Links:**
   - Create social profiles
   - Link back to website
   - Share valuable content

3. **Guest Blogging:**
   - Write articles on tech blogs
   - Include backlinks

---

## ✅ Final Checklist

- [ ] Domain purchased and connected
- [ ] SSL certificate active (green lock)
- [ ] Sitemap submitted to Google
- [ ] Robots.txt properly configured
- [ ] Google Search Console verified
- [ ] Google Analytics installed
- [ ] Bing Webmaster Tools verified
- [ ] Mobile-friendly test passed
- [ ] Page speed 90+ on Desktop
- [ ] All metadata updated with your info
- [ ] OG image uploaded
- [ ] Social media profiles linked
- [ ] Contact information added

---

## 🚨 Common Issues & Solutions

### Issue: Website takes time to appear in search
**Solution:** Takes 2-4 weeks typically. Keep submitting content and backlinks.

### Issue: Low search ranking despite optimization
**Solution:**
- Create high-quality content
- Build more backlinks
- Improve user experience (CTR)
- Fix Core Web Vitals issues

### Issue: Duplicate content warnings
**Solution:**
- Set canonical tags (already in next.config.js)
- Use hreflang for language versions

### Issue: Robots.txt not found
**Solution:**
- Ensure `public/robots.txt` exists
- Check Vercel build logs
- Rebuild if necessary

---

## 📞 Next Steps

1. **Get Custom Domain:** Buy from your preferred registrar
2. **Setup Vercel:** Deploy your GitHub repo
3. **Verify Sites:** Add to Google Search Console & Bing Webmaster
4. **Monitor:** Check analytics weekly
5. **Create Content:** Blog posts, tutorials about AI tools
6. **Promote:** Social media, communities, forums

---

## 🎓 Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Guide:** https://nextjs.org/docs
- **Google Search Central:** https://developers.google.com/search
- **SEO Guide:** https://moz.com/beginners-guide-to-seo

---

**Good luck with your launch! 🎉**
