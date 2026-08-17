import 'dotenv/config'
import { defineConfig } from 'prisma/config'


export default defineConfig({
  // Define de onde o Prisma CLI e o Migrate devem ler a URL do banco
  datasource:{
    url: process.env.DATABASE_URL,
  }
})
