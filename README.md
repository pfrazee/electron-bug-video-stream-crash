# video-stream-crash

```
npm install
npm start
```

It should crash immediately.

In `index.html`, you'll see

```html
<webview src="custom://video"></webview>
```

The custom protocol re-routes to localhost:8080. If you change it to that http url, the crash goes away:

```html
<webview src="http://localhost:8080"></webview>
```