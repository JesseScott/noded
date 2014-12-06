package jesses.co.tt.noded;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;


public class SplashActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_splash);

        // Timer
        Thread timer = new Thread(){
            @Override
            public void run() {
                try {
                    sleep(2500);
                    Intent i = new Intent(SplashActivity.this, NodeActivity.class);
                    startActivity(i);
                    finish();
                }
                catch(InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };
        timer.start();
    }
}
