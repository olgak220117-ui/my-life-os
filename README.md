# My Life OS

Personal productivity PWA for habits, Thai learning, AI learning, fitness, and progress.

## Local preview

Serve the dist directory with a static HTTP server:

```sh
python3 -m http.server 4173 --directory dist
```

## Hosting

Import this repository into a static hosting provider. No build command is required. Set the publish/output directory to `dist`.

Records are saved in browser localStorage. Application authentication and cross-device synchronization are not implemented. The ChatGPT sign-in on the original Sites deployment is provided by that hosting platform and does not transfer to other hosts.
