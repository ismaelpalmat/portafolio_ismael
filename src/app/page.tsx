// Export estático: redirect() no corre en build; la raíz redirige en el navegador.
export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: 'location.replace("/es/")' }} />
      <noscript>
        <a href="/es/">ES</a>
      </noscript>
    </>
  );
}
