import { DefaultUrlSerializer, UrlTree } from '@angular/router';
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    parse(url: string): UrlTree {
        let urls = url.split('?');
        let queryParam = urls.length>1? `?${urls[1]}` :'';
        // return super.parse(url.toLowerCase());
        return super.parse(urls[0].toLowerCase() + queryParam);
    }
} 