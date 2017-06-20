# Structure

## Build / deploy

### Client

```bash
npm run package-linux
```
AppImage and DEB-Package are placed in `./release`

### Server

Deployment script variables are stored in `server/deploy/server.sh`, environment variables for server are stored in `server/deploy/config.json`.
```bash
cd server
npm run deploy
```
