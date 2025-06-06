import "./instrument";
import http from "http";
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { courseRoutes } from './src/modules/courses/routes';
import { lessonRoutes } from './src/modules/lessons/routes';
import { userRoutes } from './src/modules/users/routes';
import { enrollmentRoutes } from './src/modules/enrollments/routes';
import { searchRoutes } from './src/modules/search/routes';
import * as Sentry from "@sentry/bun";

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:5174', 'http://localhost:3000'], // Frontend URLs
    credentials: true
  }))
  .onRequest(({ request }) => {
    Sentry.logger.info('Request received')
    const logMessage = `🌐 ${request.method} ${request.url}`;
    console.log(logMessage);
    process.stdout.write(logMessage + '\n'); // Force immediate output
  })
  .get('/', () => ({ message: 'Sentry Academy API', version: '1.0.0' }))
  
  // Handle favicon requests gracefully
  .get('/favicon.ico', () => new Response(null, { status: 204 }))
  
  .group('/api', app => {
    Sentry.logger.info('🔧 Setting up API routes...');
    return app
      .use(courseRoutes)
      .use(lessonRoutes)
      .use(userRoutes)
      .use(enrollmentRoutes)
      .use(searchRoutes);
  })
  .onError(({ code, error, request }) => {
    const errorMsg = `💥 Error ${code} for ${request.method} ${request.url}: ${error}`;
    console.error(errorMsg);
    process.stderr.write(errorMsg + '\n');
    
    // Don't log 404s for favicon or common browser requests
    if (code === 'NOT_FOUND' && (
      request.url.includes('favicon.ico') || 
      request.url.includes('.ico') ||
      request.url.includes('.png') ||
      request.url.includes('.svg')
    )) {
      return new Response(null, { status: 404 });
    }
    
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Internal server error',
      code,
      path: new URL(request.url).pathname
    };
  })
  
  // Catch-all route for unmatched paths
  .all('*', ({ request }) => {
    console.log(`Unmatched route: ${request.method} ${request.url}`);
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: `Route not found: ${request.method} ${new URL(request.url).pathname}`,
        code: 'NOT_FOUND'
      }), 
      { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  })
  
  .listen(process.env.PORT || 3001);

console.log(`🦊 Sentry Academy API running at ${app.server?.hostname}:${app.server?.port}`);
console.log('✅ Server setup complete, all routes should be available');