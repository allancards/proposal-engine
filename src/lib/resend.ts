import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY não foi configurada nas variáveis de ambiente.');
}

console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'set' : 'missing');
export const resend = new Resend(process.env.RESEND_API_KEY);
