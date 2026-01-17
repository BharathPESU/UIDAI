import { NextResponse } from 'next/server';

// In-memory cache to avoid excessive fetches
let cache = {
  data: null,
  timestamp: null,
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export async function GET() {
  try {
    // Check if cache is still valid
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        ...cache.data,
        cached: true,
        cacheTimestamp: new Date(cache.timestamp).toISOString(),
      });
    }

    // Fetch fresh data from the hosted JSON file
    // In production, this would be an external URL like:
    // const response = await fetch('https://your-domain.com/data/aadhaar-stats.json');
    // For now, we'll use the local public URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/data/aadhaar-stats.json`, {
      cache: 'no-store', // Ensure we always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!data.lastUpdated || !data.enrolments || !data.stateUpdates) {
      throw new Error('Invalid data structure');
    }

    // Update cache
    cache = {
      data: data,
      timestamp: now,
    };

    return NextResponse.json({
      ...data,
      cached: false,
      fetchTimestamp: new Date(now).toISOString(),
    });
  } catch (error) {
    console.error('Error fetching Aadhaar data:', error);
    
    // Return cached data if available, even if expired
    if (cache.data) {
      return NextResponse.json({
        ...cache.data,
        cached: true,
        cacheTimestamp: new Date(cache.timestamp).toISOString(),
        warning: 'Using cached data due to fetch error',
      }, { status: 200 });
    }

    // Return error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch Aadhaar statistics',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
