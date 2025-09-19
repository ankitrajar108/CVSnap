# CVSnap - AI Headshot Generator

🚀 **Professional AI headshots in minutes, not hours**

CVSnap is a Next.js application that generates professional headshots using AI technology. Upload your photos and get 40-200 high-quality professional headshots delivered in under 30 minutes.

## 🌟 Features

- **AI-Powered Generation**: Uses Astria AI with Flux models for high-quality headshots
- **Multiple Plans**: Basic (40), Professional (100), Executive (200) headshots
- **Fast Processing**: Results delivered in under 30 minutes
- **Secure Payments**: Integrated with Dodo Payments
- **User Dashboard**: Track progress and download all generated images
- **30-Day Access**: All images available for download for 30 days

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Astria AI API with Flux models
- **Payments**: Dodo Payments
- **Deployment**: Vercel

## 🚀 Live Demo

Visit [cvsnap.app](https://cvsnap.app) to try it out!


6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── llm/          # AI-related endpoints
│   │   │   └── dodo/         # Payment webhooks
│   │   ├── auth/             # Authentication pages
│   │   ├── checkout/         # Payment pages
│   │   └── (protected pages)/ # Protected routes
│   ├── components/           # Reusable components
│   ├── lib/                 # Utilities and configurations
│   └── utils/               # Helper functions
├── public/                  # Static assets
├── database/               # SQL schema files
└── docs/                  # Documentation
```


## 🔐 Security

- Row-level security enabled on all Supabase tables
- Webhook signature verification for all external APIs
- Secure file upload with type validation
- Environment variable protection


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Astria AI](https://astria.ai) for AI headshot generation
- [Supabase](https://supabase.com) for backend infrastructure
- [Dodo Payments](https://dodopayments.com) for payment processing
- [Next.js](https://nextjs.org) for the amazing framework

---

Made with ❤️ by [Ankit Raj](https://github.com/ankitrajar108)
