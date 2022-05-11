# Border Internals

## About Border Internals

Border Desktop is migrating away from data URLs. Instead of redirecting border:// URLs to data URLs, Border Desktop will start storing all files for Border URLs here.

## How This Works

All files are stored here. Inside of `main.js`, the links are stored as a JSON file, eg:
```json
{
  "newtab" "newtab.html"
}
```

Stored as format `host`:`path relative to internals`
