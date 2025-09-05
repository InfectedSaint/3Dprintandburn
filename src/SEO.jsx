import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image, url }) {
  const defaultTitle = "3D Print & Burn – Custom 3D Printing & Engraving";
  const defaultDescription =
    "3D Print & Burn offers 3D printing, resin prints, laser engraving, and UV color printing in Northwest Florida and Lower Alabama.";
  const siteUrl = "https://3dprintandburn.com";
  const defaultImage = `${siteUrl}/logo_print_burn_better2.png`;

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || siteUrl} />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
