import nextAuth from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

const handler = nextAuth(authOptions);
export { handler as GET, handler as POST };
