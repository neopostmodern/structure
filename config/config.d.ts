declare module '@structure/config' {
  const config: {
    PORT: number
    GRAPHIQL: boolean
    MONGO_URL: string
    MONGOOSE_DEBUG: boolean
    MIGRATIONS_DIRECTORY: string
    CHANNEL: 'dev' | 'master' | string
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    BACKEND_URL: string
    WEB_FRONTEND_HOST: string
    ADDITIONAL_FRONTEND_HOSTS: Array<string>
    SESSION_SECRET: string
    USER: string
    SERVER: string
    SERVER_FOLDER_BACKEND: string
    SERVER_FOLDER_FRONTEND: string
    PROCESS_NAME: string
    NODE_ARGS: string
    RUN_PREFLIGHT: string
    BACKUP_DIR: string
  }
  export default config
}
