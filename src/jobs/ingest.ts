import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: 'health-craft' });

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'app/hello' },
  async () => {
    console.log('Hello from Inngest');
  }
);
