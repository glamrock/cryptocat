package cat.crypto.android;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.Toast;

import org.apache.cordova.*;
import org.torproject.android.OrbotHelper;

public class CryptoCatBotActivity extends DroidGap
{

	public static String DEFAULT_PROXY_HOST = "localhost";
	public static int DEFAULT_PROXY_PORT = 8118;
	
	private Menu mMenu;
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        
        OrbotHelper.setProxy(this, DEFAULT_PROXY_HOST, DEFAULT_PROXY_PORT);
		
    }
    
    public boolean onCreateOptionsMenu(Menu menu) {
		mMenu = menu;
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.main, menu);
		return true;
	}
    
    @Override
	public boolean onOptionsItemSelected(MenuItem arg0) {

		switch (arg0.getItemId()) {

		case R.id.menu_new:
	        super.loadUrl("file:///android_asset/www/index.html");

			return true;
			
		case R.id.menu_finish:
			finish();
			return true;
		
		case R.id.menu_about:
			
			Toast.makeText(this, "Please visit https://crypto.cat for more information", Toast.LENGTH_SHORT).show();
			return true;
		}
		return super.onOptionsItemSelected(arg0);
	}
}

