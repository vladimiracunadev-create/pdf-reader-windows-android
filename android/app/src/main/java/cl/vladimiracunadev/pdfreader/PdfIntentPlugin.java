package cl.vladimiracunadev.pdfreader;

import android.content.Intent;
import android.database.Cursor;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.util.Base64;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

@CapacitorPlugin(name = "PdfIntent")
public class PdfIntentPlugin extends Plugin {
    public static final String SETUP_EXTRA = "cl.vladimiracunadev.pdfreader.DEFAULT_SETUP";
    private static final int MAX_PDF_BYTES = 128 * 1024 * 1024;

    @PluginMethod
    public void getPendingPdf(PluginCall call) {
        Intent intent = getActivity().getIntent();
        Uri uri = intent == null ? null : intent.getData();
        if (intent == null || !Intent.ACTION_VIEW.equals(intent.getAction()) || uri == null || intent.getBooleanExtra(SETUP_EXTRA, false)) {
            JSObject result = new JSObject();
            result.put("available", false);
            call.resolve(result);
            return;
        }
        try {
            String name = queryName(uri);
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            try (InputStream input = getContext().getContentResolver().openInputStream(uri)) {
                if (input == null) throw new IllegalStateException("Android no entregó el archivo seleccionado.");
                byte[] buffer = new byte[8192];
                int total = 0;
                int read;
                while ((read = input.read(buffer)) != -1) {
                    total += read;
                    if (total > MAX_PDF_BYTES) throw new IllegalStateException("El PDF supera el límite de apertura externa de 128 MB.");
                    output.write(buffer, 0, read);
                }
            }
            byte[] bytes = output.toByteArray();
            JSObject result = new JSObject();
            result.put("available", true);
            result.put("name", name);
            result.put("size", bytes.length);
            result.put("lastModified", 0);
            result.put("data", Base64.encodeToString(bytes, Base64.NO_WRAP));
            intent.setAction(Intent.ACTION_MAIN);
            intent.setData(null);
            intent.setType(null);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("No se pudo abrir el PDF recibido por Android.", error);
        }
    }

    @PluginMethod
    public void requestDefault(PluginCall call) {
        try {
            File directory = new File(getContext().getCacheDir(), "default-reader");
            if (!directory.exists() && !directory.mkdirs()) throw new IllegalStateException("No se pudo preparar el asistente.");
            File sample = new File(directory, "elegir-pdf-reader.pdf");
            createSamplePdf(sample);
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", sample);
            Intent view = new Intent(Intent.ACTION_VIEW);
            view.setDataAndType(uri, "application/pdf");
            view.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            view.putExtra(SETUP_EXTRA, true);
            getActivity().startActivity(view);
            call.resolve();
        } catch (Exception error) {
            call.reject("Android no pudo abrir el selector de lector PDF.", error);
        }
    }

    private String queryName(Uri uri) {
        String name = uri.getLastPathSegment();
        try (Cursor cursor = getContext().getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (index >= 0 && cursor.getString(index) != null) name = cursor.getString(index);
            }
        } catch (Exception ignored) {}
        return name == null || name.trim().isEmpty() ? "documento.pdf" : name;
    }

    private void createSamplePdf(File target) throws Exception {
        PdfDocument document = new PdfDocument();
        PdfDocument.Page page = document.startPage(new PdfDocument.PageInfo.Builder(420, 594, 1).create());
        Canvas canvas = page.getCanvas();
        canvas.drawColor(Color.WHITE);
        Paint title = new Paint();
        title.setColor(Color.rgb(49, 87, 213));
        title.setTextSize(24);
        title.setFakeBoldText(true);
        canvas.drawText("PDF Reader", 42, 82, title);
        Paint body = new Paint();
        body.setColor(Color.rgb(23, 32, 51));
        body.setTextSize(14);
        canvas.drawText("Selecciona PDF Reader y luego Siempre.", 42, 118, body);
        document.finishPage(page);
        try (FileOutputStream output = new FileOutputStream(target)) { document.writeTo(output); }
        document.close();
    }
}
