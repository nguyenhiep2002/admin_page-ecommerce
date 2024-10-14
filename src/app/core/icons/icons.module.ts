import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule()
export class IconsModule
{
    /**
     * Constructor
     */
    constructor(
        private _domSanitizer: DomSanitizer,
        private _matIconRegistry: MatIconRegistry
    )
    {
        // Register icon sets
        this._matIconRegistry.addSvgIconSet(this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('mat_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('mat_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-solid.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('feather', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('heroicons_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('heroicons_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg'));
        this._matIconRegistry.addSvgIcon('light', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/light.svg'));
        this._matIconRegistry.addSvgIcon('test-tube', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/test-tube.svg'));
        this._matIconRegistry.addSvgIcon('erlenmeyer-flask', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/erlenmeyer-flask.svg'));
        this._matIconRegistry.addSvgIcon('3-user', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/3-user.svg'));
        this._matIconRegistry.addSvgIcon('u_file-alt', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/u_file-alt.svg'));
        this._matIconRegistry.addSvgIcon('toggle_on_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/toggleOnSolid.svg'));
        this._matIconRegistry.addSvgIcon('toggle_off_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/toggleOffSolid.svg'));
        this._matIconRegistry.addSvgIcon('settingsvg', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/setting.svg'));
        this._matIconRegistry.addSvgIcon('checked_svg', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/Checkbox-ed.svg'));
        this._matIconRegistry.addSvgIcon('none_check_svg', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/Checkbox-none.svg'));
        this._matIconRegistry.addSvgIcon('sign-check', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/check-icon/sign-check.svg'));
        this._matIconRegistry.addSvgIcon('sign-error-check', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/check-icon/sign-error-check.svg'));
        this._matIconRegistry.addSvgIcon('sign-waring-check', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/check-icon/sign-waring-check.svg'));
    }
}
