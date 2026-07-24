<?php

namespace App\Http\Controllers;

use App\Models\Anket;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $xml = Cache::remember('sitemap', 3600, function () {
            $pages = [
                ['loc' => 'https://immortal-code.ru/', 'priority' => '1.0', 'changefreq' => 'weekly'],
                ['loc' => 'https://immortal-code.ru/tariffs', 'priority' => '0.8', 'changefreq' => 'monthly'],
                ['loc' => 'https://immortal-code.ru/faq', 'priority' => '0.7', 'changefreq' => 'monthly'],
                ['loc' => 'https://immortal-code.ru/order-steps', 'priority' => '0.7', 'changefreq' => 'monthly'],
                ['loc' => 'https://immortal-code.ru/qr-install', 'priority' => '0.7', 'changefreq' => 'monthly'],
                ['loc' => 'https://immortal-code.ru/news', 'priority' => '0.6', 'changefreq' => 'weekly'],
                ['loc' => 'https://immortal-code.ru/privacy', 'priority' => '0.4', 'changefreq' => 'yearly'],
                ['loc' => 'https://immortal-code.ru/offer', 'priority' => '0.4', 'changefreq' => 'yearly'],
            ];

            $ankets = Anket::whereIn('status', ['published', 'private'])
                ->orderBy('updated_at', 'desc')
                ->get(['slug', 'updated_at']);

            $today = now()->toDateString();

            $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

            foreach ($pages as $page) {
                $xml .= "  <url>\n";
                $xml .= '    <loc>' . $page['loc'] . "</loc>\n";
                $xml .= '    <lastmod>' . $today . "</lastmod>\n";
                $xml .= '    <changefreq>' . $page['changefreq'] . "</changefreq>\n";
                $xml .= '    <priority>' . $page['priority'] . "</priority>\n";
                $xml .= "  </url>\n";
            }

            foreach ($ankets as $anket) {
                $xml .= "  <url>\n";
                $xml .= '    <loc>https://immortal-code.ru/m/' . e($anket->slug) . "</loc>\n";
                $xml .= '    <lastmod>' . $anket->updated_at->toDateString() . "</lastmod>\n";
                $xml .= '    <changefreq>weekly</changefreq>' . "\n";
                $xml .= '    <priority>0.5</priority>' . "\n";
                $xml .= "  </url>\n";
            }

            $xml .= '</urlset>';

            return $xml;
        });

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
