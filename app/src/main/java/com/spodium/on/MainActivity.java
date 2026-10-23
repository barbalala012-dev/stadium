package com.spodium.on;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.graphics.Color;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.view.View;
import android.widget.FrameLayout;
import java.io.ByteArrayInputStream;
import java.io.IOException;

/** Offline app: a single trusted HTTPS origin backed exclusively by packaged assets. */
public final class MainActivity extends Activity {
    private WebView webView;
    private static final String HOST = "app.spodium.local";

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(245, 246, 241));
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        root.requestApplyInsets();
        webView.setBackgroundColor(Color.rgb(245, 246, 241));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !HOST.equals(request.getUrl().getHost()) || !"https".equals(request.getUrl().getScheme());
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String path = request.getUrl().getPath();
                if (!HOST.equals(request.getUrl().getHost()) || !"https".equals(request.getUrl().getScheme())
                        || path == null || path.contains("..")) return missing();
                if (path.equals("/")) path = "/index.html";
                String mime = path.endsWith(".css") ? "text/css" : path.endsWith(".js")
                        ? "application/javascript" : "text/html";
                try { return new WebResourceResponse(mime, "UTF-8", getAssets().open(path.substring(1))); }
                catch (IOException error) { return missing(); }
            }
        });
        webView.loadUrl("https://" + HOST + "/index.html");
    }

    private WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null,
                new ByteArrayInputStream(new byte[0]));
    }

    @Override public void onBackPressed() {
        webView.evaluateJavascript("window.spodiumBack ? window.spodiumBack() : false", handled -> {
            if (!"true".equals(handled)) new AlertDialog.Builder(this)
                    .setMessage("스포디움 온을 종료할까요?")
                    .setNegativeButton("계속 이용", null)
                    .setPositiveButton("종료", (dialog, which) -> finish()).show();
        });
    }
    @Override protected void onPause() { webView.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (webView != null) webView.onResume(); }
    @Override protected void onDestroy() {
        if (webView != null) { webView.stopLoading(); webView.destroy(); }
        super.onDestroy();
    }
}
