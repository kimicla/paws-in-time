# Paws in Time

A modern pet photography gallery powered by Hugo and Cloudflare, featuring optimized image delivery and beautiful gallery layouts.

## Overview

Paws in Time is a high-performance photo gallery website specifically designed for pet photography. It leverages Cloudflare's powerful image optimization and delivery capabilities along with Hugo's static site generation to create a fast, secure, and beautiful gallery experience.

## Features

- 🖼️ Optimized image galleries using Cloudflare Images
- 🚀 Fast image loading with progressive enhancement
- 📱 Responsive design for all devices
- 🎨 Custom shortcodes for easy gallery creation
- 🔒 Secure image delivery through Cloudflare's global network
- ⚡ High-performance static site generation with Hugo

## Prerequisites

- Hugo Extended v0.143.1+
- Node.js
- Cloudflare account with:
  - Images service enabled
  - R2 storage configured
  - API token with appropriate permissions

## Project Structure

```
paws-in-time/
├── content/                    # Content files
├── themes/
│   └── cloudflare-gallery/    # Custom theme
│       └── layouts/
│           └── shortcodes/    # Custom shortcodes
│               ├── cloudflare-gallery.html
│               └── cloudflare-image.html
├── .env.example               # Environment variables template
├── .env                       # Environment configuration
├── deploy.js                  # Deployment script
├── hugo.toml                  # Hugo configuration
└── README.md                  # This file
```

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd paws-in-time
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_IMAGES_TOKEN=your_images_token
```

4. Install dependencies:
```bash
npm install
```

## Usage

### Development

Start the development server:
```bash
npm run dev
```

This will start Hugo's development server with live reload at `http://localhost:1313`.

### Creating Galleries

1. Create a new gallery in the `content/` directory
2. Use the provided shortcodes to create galleries:

```markdown
{{</* cloudflare-gallery */>}}
  {{</* cloudflare-image src="image-id" alt="Image description" */>}}
  {{</* cloudflare-image src="another-image-id" alt="Another description" */>}}
{{</* /cloudflare-gallery */>}}
```

### Deployment

Deploy to production:
```bash
npm run deploy
```

## Shortcodes

### cloudflare-image

Displays a single optimized image from Cloudflare Images:

```markdown
{{</* cloudflare-image 
  src="image-id" 
  alt="Image description"
  width="800"
  height="600"
*/>}}
```

### cloudflare-gallery

Creates a responsive image gallery:

```markdown
{{</* cloudflare-gallery 
  columns="3"
  gap="20"
*/>}}
  <!-- Images here -->
{{</* /cloudflare-gallery */>}}
```

## Configuration

### Hugo Configuration (hugo.toml)

The site's main configuration is managed through `hugo.toml`. Key settings include:
- Site metadata
- Build parameters
- Theme configuration
- Custom parameters

### Environment Variables

Required environment variables:
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: API token with appropriate permissions
- `CLOUDFLARE_IMAGES_TOKEN`: Token for Cloudflare Images service

## Performance

The site is optimized for:
- Fast image loading
- Minimal layout shifts
- Responsive image delivery
- Efficient caching

## Security

- All images served via HTTPS
- Protected by Cloudflare's security features
- Secure API token handling
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Hugo and Cloudflare
```

This README is specifically tailored to your project's structure and includes:
- Detailed setup instructions
- Usage of your custom shortcodes
- Project-specific configuration
- Actual file structure based on the files list
- Deployment information
- Clear examples of how to use the gallery features

Would you like me to expand on any particular section or make any adjustments?
