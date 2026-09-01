package cl.vladimiracunadev.pdfreader;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PdfIntentPlugin.class);
        super.onCreate(savedInstanceState);
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
