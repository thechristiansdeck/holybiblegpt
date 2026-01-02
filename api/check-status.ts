import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;
        if (!userId || typeof userId !== 'string') return res.status(400).json({ error: 'Missing userId' });

        const status = await kv.get<string>(`user:${userId}:status`);
        res.status(200).json({ isPro: status === 'pro' });
    } catch (error) {
        console.error('Status Check Error:', error);
        res.status(500).json({ error: 'Failed to check status' });
    }
}
