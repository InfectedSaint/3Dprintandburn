import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image, url }) {
  const defaultTitle = "3D Print & Burn – Custom 3D Printing & Engraving";
  const defaultDescription =
    "3D Print & Burn offers 3D printing, resin prints, laser engraving, and UV color printing in Northwest Florida and Lower Alabama.";
  const siteUrl = "https://3dprintandburn.com"; // ✅ your live site URL
  const defaultImage = `${siteUrl}/logo_print_burn_better2.png`; // ✅ absolute path

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image ? `${siteUrl}${image}` : defaultImage; // ✅ always absolute
  const seoUrl = url || siteUrl;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} /> {/* ✅ explicit absolute */}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} /> {/* ✅ explicit absolute */}
    </Helmet>
  );
}
