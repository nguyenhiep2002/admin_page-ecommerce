import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { Configs } from '@aratech/utils/configs';

if ( environment.production )
{
    enableProdMode();
}

fetch(environment.ConfigFileUrl)
    .then(response => response.json())
    .then(config => {
        Configs.setAllConfigs(config);

        platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .catch(bootstrapFailed);
    })
    .catch(bootstrapFailed);

function bootstrapFailed(val) {
    document.getElementById('bootstrap-fail').style.display = 'block';
    console.error('bootstrap-fail', val);
}
