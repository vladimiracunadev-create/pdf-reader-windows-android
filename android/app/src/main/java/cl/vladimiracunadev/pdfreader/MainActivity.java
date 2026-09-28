package cl.vladimiracunadev.pdfreader;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;

import com.getcapacitor.BridgeActivity;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

/** Registra el puente PDF y notifica al WebView cuando llega un intent a la instancia activa. */
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PdfIntentPlugin.class);
        super.onCreate(savedInstanceState);
        applySafeAreaToWebView();
    }

    /**
     * Android 16 fuerza edge-to-edge. El WebView debe quedar dentro de las barras
     * del sistema incluso cuando su versión aún no propaga esos insets a CSS.
     */
    private void applySafeAreaToWebView() {
        final View webView = bridge.getWebView();
        final View decorView = getWindow().getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (view, windowInsets) -> {
            final Insets safe = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            final ViewGroup.MarginLayoutParams layout = (ViewGroup.MarginLayoutParams) webView.getLayoutParams();
            layout.setMargins(safe.left, safe.top, safe.right, safe.bottom);
            webView.setLayoutParams(layout);
            return windowInsets;
        });
        ViewCompat.requestApplyInsets(decorView);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (!intent.getBooleanExtra(PdfIntentPlugin.SETUP_EXTRA, false) && bridge != null) {
            bridge.getWebView().post(() -> bridge.getWebView().evaluateJavascript("window.dispatchEvent(new Event('pdf-intent'))", null));
        }
    }
}
