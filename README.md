# UiPath Orchestrator Process Monitor

A professional enterprise dashboard application that provides a comprehensive view of all automation processes within UiPath Orchestrator. Monitor and manage your UiPath automation processes with real-time status updates and execution controls.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-oauth-3)

## Features

- **Process Management**: View all processes in a clean, information-dense table format with real-time status indicators
- **Advanced Filtering**: Filter processes by status (Available, Running, Failed), search by name/description, and select specific folders
- **Real-time Monitoring**: Automatic refresh capabilities with color-coded status indicators (green for success, red for error, yellow for warning)
- **Process Control**: Start processes directly from the interface with proper confirmation and feedback
- **Professional UI**: Enterprise-grade dashboard with responsive design and intuitive navigation
- **UiPath Integration**: Direct integration with UiPath Orchestrator using the official TypeScript SDK

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: Zustand for client state
- **Data Fetching**: TanStack React Query with UiPath SDK
- **Authentication**: OAuth 2.0 with UiPath Orchestrator
- **Build Tool**: Vite
- **Deployment**: Cloudflare Pages
- **Package Manager**: Bun

## Prerequisites

- [Bun](https://bun.sh/) runtime
- UiPath Orchestrator instance with API access
- OAuth External App configured in UiPath Orchestrator

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uipath-process-monitor
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables by creating a `.env` file:
```env
VITE_UIPATH_BASE_URL=https://your-orchestrator-url.com
VITE_UIPATH_ORG_NAME=your-organization-name
VITE_UIPATH_TENANT_NAME=your-tenant-name
VITE_UIPATH_CLIENT_ID=your-oauth-client-id
VITE_UIPATH_REDIRECT_URI=http://localhost:3000
VITE_UIPATH_SCOPE=OR.Execution
```

## UiPath OAuth Setup

1. In UiPath Orchestrator, navigate to **Admin** > **External Applications**
2. Create a new External Application with:
   - **Application Type**: Confidential Application
   - **Redirect URIs**: Your application URL (e.g., `http://localhost:3000` for development)
   - **Scopes**: `OR.Execution` (minimum required)
3. Copy the **Client ID** and use it in your `.env` file

## Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

## Usage

### Process Dashboard

The main dashboard displays all available processes from your UiPath Orchestrator:

1. **View Processes**: All processes are displayed in a table with name, description, status, and last run information
2. **Filter Processes**: Use the status filter buttons (Available, Running, Failed) to filter the view
3. **Search**: Use the search input to find specific processes by name or description
4. **Folder Selection**: Select specific folders to filter processes by organizational structure
5. **Start Processes**: Click the "Start" button to execute a process with confirmation dialog

### Real-time Updates

The dashboard automatically refreshes every 30 seconds to provide real-time status updates. Status indicators use standard colors:
- **Green**: Available/Success states
- **Red**: Failed/Error states  
- **Yellow**: Running/Warning states
- **Blue**: Information states

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── uipath/         # UiPath-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks for UiPath SDK
├── lib/                # Utility libraries and UiPath SDK setup
├── pages/              # Application pages
└── main.tsx           # Application entry point
```

## Key Components

- **ProcessCard**: Display and manage individual processes
- **JobStatusBadge**: Color-coded status indicators
- **QueueMonitor**: Monitor queue statistics
- **TaskCard**: Manage Action Center tasks

## Deployment

### Cloudflare Pages

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-oauth-3)

This application is optimized for deployment on Cloudflare Pages:

1. Build the application:
```bash
bun run build
```

2. Deploy to Cloudflare Pages:
   - Connect your repository to Cloudflare Pages
   - Set build command: `bun run build`
   - Set build output directory: `dist`
   - Configure environment variables in Cloudflare Pages dashboard

3. Update your UiPath External Application redirect URI to match your production URL

### Environment Variables for Production

Ensure these environment variables are configured in your Cloudflare Pages settings:

- `VITE_UIPATH_BASE_URL`
- `VITE_UIPATH_ORG_NAME`
- `VITE_UIPATH_TENANT_NAME`
- `VITE_UIPATH_CLIENT_ID`
- `VITE_UIPATH_REDIRECT_URI`
- `VITE_UIPATH_SCOPE`

## Security Considerations

- OAuth credentials are handled securely through environment variables
- All API calls use the official UiPath SDK with proper authentication
- No sensitive data is stored in the client application
- HTTPS is required for production deployments

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- **UiPath SDK**: Check the [official UiPath documentation](https://docs.uipath.com/)
- **Application bugs**: Create an issue in this repository
- **Deployment**: Refer to [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)