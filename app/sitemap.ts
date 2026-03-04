import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Artist from '@/models/Artist';
import Exhibition from '@/models/Exhibition';
import News from '@/models/News';
import { OpenCall } from '@/models/OpenCall';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await dbConnect();
    const baseUrl = 'https://www.nodflo.com';

    // Static pages
    const staticPages = [
        '',
        '/artists',
        '/exhibitions',
        '/news',
        '/team',
        '/sponsors',
        '/contact',
        '/open-calls',
        '/subscribe',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Content
    const [artists, exhibitions, news, openCalls] = await Promise.all([
        Artist.find({}).lean(),
        Exhibition.find({}).lean(),
        News.find({}).lean(),
        OpenCall.find({}).lean(),
    ]);

    const artistPages = (artists as any[]).map(a => ({
        url: `${baseUrl}/artists/${a.slug}`,
        lastModified: a.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    const exhibitionPages = (exhibitions as any[]).map(e => ({
        url: `${baseUrl}/exhibitions/${e.slug}`,
        lastModified: e.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const newsPages = (news as any[]).map(n => ({
        url: `${baseUrl}/news/${n._id}`,
        lastModified: n.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    const openCallPages = (openCalls as any[]).map(c => ({
        url: `${baseUrl}/open-calls/${c.slug}`,
        lastModified: c.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        ...staticPages,
        ...artistPages,
        ...exhibitionPages,
        ...newsPages,
        ...openCallPages,
    ];
}
