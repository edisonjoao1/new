# AI 4U Labs Website

A modern, AI-powered business website built with Next.js 14, featuring real-time AI chat, contact forms, and a professional blog.

## Features

### ✅ Completed
- **Clean Architecture**: Organized codebase with proper separation of concerns
- **Real AI Chat**: Integrated OpenAI GPT-4o-mini for customer support
- **Contact Forms**: Full backend with email delivery via Resend
- **Blog System**: MDX-ready blog with proper routing
- **Legal Pages**: Privacy Policy and Terms of Service
- **About Page**: Professional company information
- **SEO Optimized**: Sitemap, robots.txt, and proper metadata
- **Security Headers**: HSTS, CSP, and other security best practices
- **TypeScript**: Full type safety throughout
- **Modern UI**: Beautiful components with Tailwind CSS and shadcn/ui

### 🎨 Design
- Responsive mobile-first design
- Dark theme with blue/cyan gradients
- Smooth animations and transitions
- Glass-morphism effects
- Professional typography

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit `.env.local` and add your API keys:

```env
# OpenAI API Key (required for AI chat)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Resend API Key (required for email forms)
RESEND_API_KEY=re_your-resend-api-key-here

# Your contact email
CONTACT_EMAIL=edison@ai4ulabs.com

# Site URL (use localhost for development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Getting API Keys:

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add $10-20 credit for testing (chat costs ~$0.001 per message)

**Resend:**
1. Go to https://resend.com
2. Sign up for free (100 emails/day on free tier)
3. Add your domain (or use onboarding domain for testing)
4. Create an API key

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website.

### 4. Test Features

#### AI Chat
- Click the chat button in the bottom right
- Try the quick action buttons
- Test a conversation

#### Contact Forms
- Scroll to "Share Your Ideas" section
- Fill out and submit the form
- Check your email for the submission

## Project Structure

```
new/
├── app/
│   ├── about/              # About page
│   ├── api/                # API routes
│   │   ├── chat/           # OpenAI chat endpoint
│   │   ├── contact/        # Contact form handler
│   │   └── idea/           # Idea submission handler
│   ├── blog/               # Blog pages
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── robots.ts           # SEO robots.txt
│   └── sitemap.ts          # SEO sitemap
├── components/
│   ├── animations/         # Animation components
│   ├── chat/               # AI chat widget
│   ├── forms/              # Form components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── constants.ts        # App constants and data
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
├── .env.local              # Environment variables (git-ignored)
└── .env.local.example      # Example env file
```

## Key Improvements Made

### 🗑️ Removed
- ❌ Unused dependencies (Remix, Svelte, Vue) - saved ~50MB
- ❌ Disabled TypeScript/ESLint checks - NOW ENABLED
- ❌ Disabled image optimization - NOW ENABLED
- ❌ Fake/simulated chat responses
- ❌ Mailto links for forms

### ✅ Added
- ✅ Real OpenAI integration with streaming responses
- ✅ Full backend API routes for all forms
- ✅ Email delivery with Resend
- ✅ Proper error handling and loading states
- ✅ Form validation with Zod
- ✅ SEO improvements (sitemap, robots.txt)
- ✅ Security headers
- ✅ Legal pages (Privacy, Terms)
- ✅ About page with founder info
- ✅ Blog structure with MDX support
- ✅ Organized component architecture
- ✅ TypeScript types throughout
- ✅ Environment variable management

## Next Steps

### Content
1. **Replace placeholder text** with your actual content
2. **Add real images** to `/public` directory
3. **Update company info** in `lib/constants.ts`
4. **Write blog posts** in `app/blog` or integrate a CMS

### Features to Add
- [ ] Dark mode toggle UI (backend already configured)
- [ ] Newsletter signup integration
- [ ] Case studies page
- [ ] Testimonials with real data
- [ ] Project portfolio with detailed pages
- [ ] Contact calendar integration (Calendly)
- [ ] Analytics events for user actions

### Deployment

#### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

## API Endpoints

### POST /api/chat
Real-time AI chat powered by OpenAI GPT-4o-mini.

**Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

### POST /api/contact
Contact form submission with email delivery.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "message": "I need help with..."
}
```

### POST /api/idea
Project idea submission.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "idea": "I want to build...",
  "budget": "10k-25k"
}
```

## Troubleshooting

### AI Chat Not Working
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Verify you have credit in your OpenAI account
- Check browser console for errors

### Forms Not Sending Emails
- Check that `RESEND_API_KEY` is set correctly
- Verify your domain is added in Resend dashboard
- Check Resend logs for delivery status

### Build Errors
- Run `npm run type-check` to see TypeScript errors
- Make sure all dependencies are installed
- Clear `.next` folder and rebuild

## Support

For questions or issues, contact: edison@ai4ulabs.com

## License

Proprietary - AI 4U Labs
