# Decolgen

A powerful desktop application for image manipulation, built with modern web technologies. Decolgen combines image resizing capabilities with advanced drawing and editing features.

## Features

- **Image Resizing**

  - Resize by file size
  - Resize by dimensions

- **Drawing Tools** (powered by tldraw)
  - Freehand drawing
  - Shapes (rectangle, circle, arrow, etc.)
  - Text annotation
  - Image annotations
  - Multiple pages support
  - Undo/redo functionality

## Tech Stack

- [Wails](https://wails.io/) - Desktop application framework
- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [tldraw](https://www.tldraw.com/) - Drawing functionality

## Prerequisites

Before you begin, ensure you have the following installed:

- [Go](https://golang.org/) (1.18 or later)
- [Node.js](https://nodejs.org/) (18 or later)
- [pnpm](https://pnpm.io/) (8 or later)
- [Wails CLI](https://wails.io/docs/gettingstarted/installation)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/decolgen.git
   cd decolgen
   ```

2. Install frontend dependencies:

   ```bash
   cd frontend
   pnpm install
   ```

3. Install Go dependencies:
   ```bash
   cd ..
   go install github.com/wailsapp/wails/v2/cmd/wails@latest
   go mod tidy
   ```

## Development

1. Start the development server:

   ```bash
   wails dev
   ```

2. The application will open automatically. Any changes to the frontend code will trigger hot reload.

## Building

To build the application for production:

```bash
wails build
```

The built application will be available in the `build/bin` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
