# Molly's Touch

A luxury web application built with SvelteKit, featuring authentication, theme switching, and a premium user experience.

## Features

- ✨ **Luxury Design**: Gold and white/black color scheme with smooth animations
- 🌓 **Theme Toggle**: Switch between light and dark modes
- 🔐 **Authentication**: Complete login/signup system with Supabase
- 👤 **User Profiles**: Manage user information and preferences
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚡ **Fast**: Built with SvelteKit for optimal performance

## Tech Stack

- **Frontend**: SvelteKit 5
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Language**: TypeScript

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mollys-touch
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   Follow the detailed setup guide in [SETUP.md](./SETUP.md)

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
mollys-touch/
├── src/
│   ├── lib/
│   │   ├── components/      # UI components
│   │   ├── services/        # Business logic
│   │   ├── stores/          # State management
│   │   └── supabase.ts      # Database client
│   ├── routes/              # Page components
│   └── app.css             # Global styles
├── static/                  # Static assets
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Check**: `npm run check`
- **Lint**: `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.
