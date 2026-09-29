/* Structured data for search engines. A server component: the JSON is in the
   HTML Google fetches, not added later by the browser. `<` is escaped so a
   value can never close the script tag early. */
export default function JsonLd({ data }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
