import { describe, expect, it } from 'vitest';
import {
  breadcrumbListSchema,
  decodeHtml,
  extractBreadcrumb,
  extractFaqEntries,
  extractHeroImage,
  faqPageSchema,
  parseEuroAmount,
  serviceSchema,
  webSiteSchema,
} from '@/lib/seo/structuredData';

const faqHtml = [
  '<div><details data-faq-item="true" class="group"><summary class="flex">',
  '<span data-faq-question="true">Faut-il une autorisation d&#x27;urbanisme ?</span><span aria-hidden="true">+</span></summary>',
  '<p data-faq-answer="true" class="pt-3">Oui, une déclaration préalable.<!-- --> Nous la déposons.</p></details>',
  '<details data-faq-item="true"><summary><span data-faq-question="true">Combien de temps dure la pose ?</span></summary>',
  '<p data-faq-answer="true">De 1 à 3 jours &amp; sans sous-traitance.</p></details></div>',
].join('');

const breadcrumbHtml = [
  '<nav aria-label="Fil d&#x27;Ariane"><ol>',
  '<li><a data-breadcrumb-name="true" data-breadcrumb-path="/" class="x" href="/">Accueil</a></li><li aria-hidden="true">›</li>',
  '<li><a data-breadcrumb-name="true" data-breadcrumb-path="/realisations" href="/realisations">Réalisations</a></li><li aria-hidden="true">›</li>',
  '<li><span aria-current="page" data-breadcrumb-name="true" class="text-white">Vence · 16 kWc</span></li>',
  '</ol></nav>',
].join('');

describe('Structured data extraction from prerendered HTML', () => {
  it('decodes the entities React emits', () => {
    expect(decodeHtml('L&#x27;énergie &amp; le &quot;soleil&quot; &#8364; &lt;b&gt;&nbsp;!')).toEqual('L\'énergie & le "soleil" € <b> !');
  });

  it('extracts every FAQ question with its plain-text answer, in order', () => {
    expect(extractFaqEntries(faqHtml)).toEqual([
      { question: "Faut-il une autorisation d'urbanisme ?", answer: 'Oui, une déclaration préalable. Nous la déposons.' },
      { question: 'Combien de temps dure la pose ?', answer: 'De 1 à 3 jours & sans sous-traitance.' },
    ]);
  });

  it('returns no FAQ entry for a page without an accordion', () => {
    expect(extractFaqEntries('<main><h1>Parrainage</h1></main>')).toEqual([]);
  });

  it('extracts the breadcrumb trail and gives the current page its own path', () => {
    expect(extractBreadcrumb(breadcrumbHtml, '/realisations/vence-villa-16-kwc')).toEqual([
      { name: 'Accueil', path: '/' },
      { name: 'Réalisations', path: '/realisations' },
      { name: 'Vence · 16 kWc', path: '/realisations/vence-villa-16-kwc' },
    ]);
  });

  it('finds the high-priority hero image whatever the attribute case', () => {
    const html = '<img src="/images/a.webp" loading="lazy"/><img src="/images/solar/hero.webp" alt="Villa d&#x27;Antibes" fetchPriority="high"/>';

    expect(extractHeroImage(html)).toEqual({ src: '/images/solar/hero.webp', alt: "Villa d'Antibes", width: null, height: null, preloadMedia: null });
    expect(extractHeroImage('<img src="/images/a.webp"/>')).toEqual(null);
  });

  it('reads the hero image dimensions and the media its preload is limited to', () => {
    const html = '<img src="/images/hero.webp" alt="" width="1280" height="720" fetchPriority="high" data-preload-media="(min-width: 1024px)"/>';

    expect(extractHeroImage(html)).toEqual({ src: '/images/hero.webp', alt: null, width: 1280, height: 720, preloadMedia: '(min-width: 1024px)' });
  });

  it('reads a French euro amount', () => {
    expect(parseEuroAmount('19,99 €')).toEqual(19.99);
    expect(parseEuroAmount('Dès 99 € HT')).toEqual(99);
    expect(parseEuroAmount('1 200 €')).toEqual(1200);
    expect(parseEuroAmount('Sur devis')).toEqual(null);
  });
});

describe('Structured data schemas', () => {
  it('builds a FAQPage from the entries', () => {
    expect(faqPageSchema([{ question: 'Q1 ?', answer: 'R1.' }])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: 'Q1 ?', acceptedAnswer: { '@type': 'Answer', text: 'R1.' } }],
    });
  });

  it('builds a BreadcrumbList with absolute URLs and positions', () => {
    expect(
      breadcrumbListSchema(
        [
          { name: 'Accueil', path: '/' },
          { name: 'Ressources', path: '/ressources' },
        ],
        'https://soliance-enr.fr',
      ),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://soliance-enr.fr/' },
        { '@type': 'ListItem', position: 2, name: 'Ressources', item: 'https://soliance-enr.fr/ressources' },
      ],
    });
  });

  it('builds a Service provided by the business, served in the given areas', () => {
    expect(
      serviceSchema(
        { name: 'Pompe à chaleur', description: 'Air/eau et air/air.', serviceType: 'Installation de pompes à chaleur', path: '/pompe-a-chaleur' },
        'https://soliance-enr.fr',
        ['Alpes-Maritimes', 'Var'],
      ),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Pompe à chaleur',
      serviceType: 'Installation de pompes à chaleur',
      description: 'Air/eau et air/air.',
      url: 'https://soliance-enr.fr/pompe-a-chaleur',
      provider: { '@type': 'Electrician', '@id': 'https://soliance-enr.fr/#business', name: 'Soliance', url: 'https://soliance-enr.fr' },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Alpes-Maritimes' },
        { '@type': 'AdministrativeArea', name: 'Var' },
      ],
    });
  });

  it('lists the monthly subscriptions of a Service as offers, VAT included', () => {
    expect(
      serviceSchema(
        { name: 'Soliance Care', description: 'Supervision.', serviceType: 'Maintenance photovoltaïque', path: '/soliance-care', offers: [{ name: 'Care Connect', price: 4.99 }] },
        'https://soliance-enr.fr',
        ['Var'],
      ),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Soliance Care',
      serviceType: 'Maintenance photovoltaïque',
      description: 'Supervision.',
      url: 'https://soliance-enr.fr/soliance-care',
      provider: { '@type': 'Electrician', '@id': 'https://soliance-enr.fr/#business', name: 'Soliance', url: 'https://soliance-enr.fr' },
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Var' }],
      offers: [
        {
          '@type': 'Offer',
          name: 'Care Connect',
          price: 4.99,
          priceCurrency: 'EUR',
          url: 'https://soliance-enr.fr/soliance-care',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: 4.99, priceCurrency: 'EUR', unitCode: 'MON', valueAddedTaxIncluded: true },
        },
      ],
    });
  });

  it('serves a local Service in a city', () => {
    expect(
      serviceSchema(
        { name: 'Installation de panneaux solaires à Nice', description: 'Pose à Nice.', serviceType: 'Installation photovoltaïque', path: '/panneaux-solaires/nice' },
        'https://soliance-enr.fr',
        ['Nice'],
        'City',
      ),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Installation de panneaux solaires à Nice',
      serviceType: 'Installation photovoltaïque',
      description: 'Pose à Nice.',
      url: 'https://soliance-enr.fr/panneaux-solaires/nice',
      provider: { '@type': 'Electrician', '@id': 'https://soliance-enr.fr/#business', name: 'Soliance', url: 'https://soliance-enr.fr' },
      areaServed: [{ '@type': 'City', name: 'Nice' }],
    });
  });

  it('builds the WebSite that names the site in search results', () => {
    expect(webSiteSchema('https://soliance-enr.fr', 'Soliance', 'Soliance ENR')).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://soliance-enr.fr/#website',
      name: 'Soliance',
      alternateName: 'Soliance ENR',
      url: 'https://soliance-enr.fr/',
      inLanguage: 'fr-FR',
      publisher: { '@id': 'https://soliance-enr.fr/#business' },
    });
  });
});
