# API Setup Guide - Step by Step

## ১. HUGGINGFACE_API_TOKEN (সবচেয়ে জরুরি - AI যুক্ত সব কাজের জন্য)

### Step 1: Account তৈরি করুন
1. যান: https://huggingface.co/join
2. Email দিয়ে signup করুন (বা GitHub দিয়ে)
3. Email verify করুন

### Step 2: API Token পান
1. Log in করুন: https://huggingface.co/login
2. Right corner এ আপনার profile icon ক্লিক করুন
3. "Settings" → "Access Tokens" এ যান
4. "New token" ক্লিক করুন
5. Token name লিখুন (যেমন: akash-ai)
6. "Type" = "Fine-grained"
7. "Permissions" তে সব গুলো check করুন
8. "Create token" ক্লিক করুন
9. Token copy করুন (শুধু একবার দেখা যাবে!)

### Step 3: .env.local এ যোগ করুন
```
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
```

---

## ২. REMOVEBG_API_KEY (ছবির background remove এর জন্য)

### Step 1: Account তৈরি করুন
1. যান: https://remove.bg/users/sign_up
2. Email দিয়ে signup করুন
3. Email verify করুন

### Step 2: API Key পান
1. Log in করুন: https://remove.bg/api
2. Left sidebar এ "API" এ যান
3. "API Key" সেকশনে আপনার key দেখবেন
4. Copy করুন

### Step 3: .env.local এ যোগ করুন
```
REMOVEBG_API_KEY=your-api-key-here
```

### দ্রষ্টব্য:
- **Free Plan**: মাসে 50 API calls
- প্রতিটি call = 1 image
- Production এর জন্য paid plan নিতে হবে

---

## ৩. ELEVENLABS_API_KEY (Text-to-Speech এর জন্য)

### Step 1: Account তৈরি করুন
1. যান: https://elevenlabs.io/sign-up
2. Email দিয়ে signup করুন
3. Email verify করুন

### Step 2: API Key পান
1. Log in করুন: https://elevenlabs.io/app/home
2. Left sidebar এ "Settings" যান (gear icon)
3. "API Key" সেকশনে দেখবেন
4. "Copy" ক্লিক করুন

### Step 3: .env.local এ যোগ করুন
```
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxx
```

### দ্রষ্টব্য:
- **Free Plan**: মাসে 10,000 টেক্সট characters
- বাংলা voice এর জন্য paid plan দরকার হতে পারে

---

## ৪. SSLCOMMERZ_STORE_ID & SSLCOMMERZ_STORE_PASS (বাংলাদেশ Payment Gateway)

### Step 1: Account তৈরি করুন (Sandbox/Testing)
1. যান: https://www.sslcommerz.com/signup
2. Form fill করুন (বিস্তারিত তথ্য দিন)
3. "Create Account" করুন

### Step 2: Sandbox Credentials পান
1. Log in করুন: https://dashboard.sslcommerz.com/
2. Left sidebar এ "Settings" যান
3. "Credentials" এ যান
4. **Store ID** এবং **Store Password** দেখবেন (Sandbox/Testing এর জন্য)
5. দুটো copy করুন

### Step 3: .env.local এ যোগ করুন
```
SSLCOMMERZ_STORE_ID=your-store-id
SSLCOMMERZ_STORE_PASS=your-store-pass
```

### Production এর জন্য:
1. একই dashboard এ "Live" tab থাকবে
2. Production credentials সেখান থেকে পাবেন
3. যখন নিজের app production এ দিবেন, তখন সেগুলো ব্যবহার করবেন

---

## ৫. DEEPAI_API_KEY (Advanced Image Generation - Optional)

### Step 1: Account তৈরি করুন
1. যান: https://deepai.org/sign_up
2. Email দিয়ে signup করুন
3. Email verify করুন

### Step 2: API Key পান
1. Log in করুন: https://deepai.org
2. Top right এ "API Key" ক্লিক করুন
3. আপনার key দেখবেন
4. Copy করুন

### Step 3: .env.local এ যোগ করুন
```
DEEPAI_API_KEY=your-api-key-here
```

### দ্রষ্টব্য:
- **Free Plan**: প্রতি মিনিটে 5 requests
- এখন ব্যবহার না করলেও ভবিষ্যতে লাগবে

---

## .env.local Final Format

আপনার `.d:\AI\akash-ai\.env.local` ফাইল এভাবে দেখাবে:

```bash
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# === Clerk Auth ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# === Hugging Face (IMPORTANT!) ===
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx

# === Remove.bg ===
REMOVEBG_API_KEY=your-removebg-key

# === DeepAI ===
DEEPAI_API_KEY=your-deepai-key

# === ElevenLabs ===
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxx

# === SSLCommerz Payment ===
SSLCOMMERZ_STORE_ID=your-store-id
SSLCOMMERZ_STORE_PASS=your-store-pass

# === App URLs ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

---

## ⚡ Quick Checklist

- [ ] Hugging Face: https://huggingface.co/join
- [ ] Remove.bg: https://remove.bg/users/sign_up
- [ ] ElevenLabs: https://elevenlabs.io/sign-up
- [ ] SSLCommerz: https://www.sslcommerz.com/signup
- [ ] DeepAI: https://deepai.org/sign_up
- [ ] সব keys `.env.local` এ পেস্ট করেছেন?
- [ ] `.env.local` ফাইল সেভ করেছেন?
- [ ] `npm run dev` দিয়ে চেষ্টা করেছেন?

---

## সমস্যা হলে:

1. **Keys কাজ করছে না?**
   - .env.local সেভ করেছেন? (Ctrl+S)
   - Server restart করেছেন? (npm run dev বন্ধ করে আবার চালু করুন)

2. **API Key expired?**
   - Key regenerate করুন (সাইটে গিয়ে নতুন key তৈরি করুন)

3. **Rate limit error?**
   - Free plan এর limit শেষ হয়ে গেছে, paid plan নিন

4. **CORS error?**
   - কিছু API backend থেকে call করতে হবে (frontend থেকে নয়)
   - আমরা ইতোমধ্যে সেভাবে সেটআপ করেছি, চিন্তা করবেন না
