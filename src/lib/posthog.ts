import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_placeholder';
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
    
    posthogClient = new PostHog(apiKey, {
      host: host,
      flushAt: 1,
      flushInterval: 0
    });
  }
  return posthogClient;
}

export async function captureEvent(distinctId: string, eventName: string, properties: any) {
  try {
    const client = getPostHogClient();
    client.capture({
      distinctId: distinctId,
      event: eventName,
      properties: properties
    });
    // Ensure the event is sent immediately in serverless environments
    await client.shutdownAsync();
    posthogClient = null; // Reset for next invocation
  } catch (error) {
    console.error('PostHog Capture Error:', error);
  }
}
