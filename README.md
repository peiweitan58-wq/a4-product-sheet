# A4 Product Sheet Generator

React + Vite web app for creating automotive product sheets with a live A4 preview, PDF export, and print-ready layout.

## Features

- Large product title input
- Multiple image upload with drag-and-drop support
- JPG, PNG, and WEBP support
- Automatic image layout rules for 1-6 images
- Live A4 portrait preview
- PDF export using `html2canvas` and `jsPDF`
- Browser print support with controls hidden in print view
- Clear-all reset flow
- Responsive editor layout

## Tech Stack

- React
- Vite
- Tailwind CSS
- jsPDF
- html2canvas

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Deploy to Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Vercel, create a new project and import the repository.
3. Use the default settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

## Deploy to Netlify

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Netlify, add a new site from your repository.
3. Use these build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Deploy.
