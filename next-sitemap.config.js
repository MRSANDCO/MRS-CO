/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mrsandco.in', // Replace with your actual domain
  generateRobotsTxt: true, // Automatically generates robots.txt
  generateIndexSitemap: false, // Set to true if you have 1000+ URLs
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  
  // Exclude these paths from sitemap
  exclude: ['/api/*', '/admin/*'],
  
  // Additional paths to include
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/#about'),
    await config.transform(config, '/#services'),
    await config.transform(config, '/#testimonials'),
    await config.transform(config, '/#consult'),
    await config.transform(config, '/#careers'),
    await config.transform(config, '/#startup-advisory'),
    await config.transform(config, '/#contact'),
  ],

  // robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      // Add more sitemaps here if needed
    ],
  },

  // Transform function to modify each URL
  transform: async (config, path) => {
    // Custom priority and changefreq for specific paths
    let priority = config.priority;
    let changefreq = config.changefreq;

    // Homepage gets highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    }
    // Services and consultation are high priority
    else if (path.includes('#services') || path.includes('#consult')) {
      priority = 0.9;
      changefreq = 'monthly';
    }
    // Careers changes more frequently
    else if (path.includes('#careers')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    // Other sections
    else {
      priority = 0.7;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};