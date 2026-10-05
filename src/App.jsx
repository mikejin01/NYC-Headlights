import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { WPEditProvider } from './content/WPEditProvider'
import routeConfig from './routes.json'
import {
  ContactPage, FaqPage, Home, NotFound, OemHeadlightsPage, ServiceAreasPage,
  ServicesPage, WpContentPage,
} from './pages'

// Route list lives in routes.json, shared with build-wordpress-theme.cjs so the
// WordPress pages (xo_required_pages) can never drift from the router.
const PAGES = {
  '/': Home,
  '/services': ServicesPage,
  '/oem-headlights': OemHeadlightsPage,
  '/faq': FaqPage,
  '/service-areas': ServiceAreasPage,
  '/contact': ContactPage,
}

// Assets and the router are based separately: the WordPress build serves assets
// from the theme folder (VITE_BASE) but routes from the site root (VITE_ROUTER_BASE).
const basename = (import.meta.env.VITE_ROUTER_BASE ?? import.meta.env.BASE_URL).replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <WPEditProvider>
        <Routes>
          <Route element={<Layout />}>
            {routeConfig.routes.map((r) => {
              const Page = PAGES[r.path]
              const element = r.wpContent ? <WpContentPage route={r} /> : <Page />
              return r.path === '/'
                ? <Route key="/" index element={element} />
                : <Route key={r.path} path={r.path} element={element} />
            })}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </WPEditProvider>
    </BrowserRouter>
  )
}
