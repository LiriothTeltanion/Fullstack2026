# React account client

See the [project instructions](../README.md). `npm run dev` starts Vite with the `/api` proxy, `npm test` runs the DOM-level form/navigation regression and `npm run build` prepares the one-origin production client.

## Reproducible client checks

Use Node 22.13+ or 24+ as required by the repository toolchain, then run these
commands from this client directory:

```bash
npm ci
npm test
npm run build
npm audit
```

The lockfile pins Vite 7.3.8, the React plugin 4.7.0, esbuild 0.28.2 and React
Router DOM 7.18.7. React and React DOM remain on the existing React 18 range.
The [official v6-to-v7 guide](https://reactrouter.com/v7/upgrading/v6) documents
Node 20 and React 18 as minimums. This exercise uses declarative routing with
absolute account links; it has no data-router loaders, SSR hydration or
multi-segment splat routes. Its route components and application behavior are
unchanged by the dependency update.

The router upgrade covers the published
[navigation advisory](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6)
and [hydration advisory](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg).
The latter concerns SSR/data modes, which this exercise does not use; the locked
package is updated nevertheless. Audits describe the dependency snapshot when
run and should be repeated after later dependency changes.

The automated DOM test uses an in-memory account fixture. It exercises
registration, sign-in, the protected dashboard, sign-out and account errors
without contacting a real backend or storing personal credentials.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
