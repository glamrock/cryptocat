package cat.crypto.android;

import android.os.Bundle;
import org.apache.cordova.*;
import org.torproject.android.OrbotHelper;

public class CryptoCatBotActivity extends DroidGap
{

	public static String DEFAULT_PROXY_HOST = "localhost";
	public static int DEFAULT_PROXY_PORT = 8118;
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        
        OrbotHelper.setProxy(this, DEFAULT_PROXY_HOST, DEFAULT_PROXY_PORT);
		
    }
}

