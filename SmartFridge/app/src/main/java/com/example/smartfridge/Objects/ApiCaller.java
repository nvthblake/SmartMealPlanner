package com.example.smartfridge.Objects;

import android.os.Build;

import androidx.annotation.RequiresApi;

import com.squareup.okhttp.Call;
import com.squareup.okhttp.HttpUrl;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;

import java.util.Map;

@RequiresApi(api = Build.VERSION_CODES.N)
public class ApiCaller {
    private String url;
    private Map<String, String> params;
    private String responseStr;
    OkHttpClient client = new OkHttpClient();

    public ApiCaller(String url, Map<String, String> params) {
        this.url = url;
        this.params = params;
        this.responseStr = null;

    }

    // Func: Get request to Spoonacular API
    public Call getRequest() {
        HttpUrl.Builder httpBuilder = HttpUrl.parse(this.url).newBuilder();

        // add params
        if (this.params != null) {
            for (Map.Entry<String, String> param : this.params.entrySet()) {
                httpBuilder.addQueryParameter(param.getKey(), param.getValue());
            }
        }
        Request request = new Request.Builder()
                .url(httpBuilder.build())
                .get()
                .addHeader("x-rapidapi-host", "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com")
                .addHeader("x-rapidapi-key", "895ce719e4mshcb836fa18684a5ap1c69f2jsnf7e37492c80d")
                .build();

        Call call = client.newCall(request);
        return call;
    }
}
