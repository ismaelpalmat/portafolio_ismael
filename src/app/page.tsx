// Export estático: redirect() no corre en build; la raíz redirige en el navegador.
export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: 'location.replace("/es/")' }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- export estático: <Link> no sirve sin JS */}
        <a href="/es/">ES</a>
      </noscript>
    </>
  );
}
