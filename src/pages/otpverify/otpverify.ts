import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UpdatepinPage } from '../updatepin/updatepin';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the OtpverifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-otpverify',
  templateUrl: 'otpverify.html',
})
export class OtpverifyPage {
  otpForm: FormGroup;
  shouldHide: any;
  otpsubmitbtn: any;
  otpresendbtn: any;
  loading: any;
  otpvalidatedata: any;
  res: any;
  resendOTPdata: any;
  // submitted: boolean = false;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, private network: Network, private toastCtrl: ToastController, public loadingCtrl: LoadingController, private elementRef: ElementRef, public navParams: NavParams, public authservice: AuthServiceProvider, public formBuilder: FormBuilder) {

    // this.otpForm = new FormGroup({ otpinput: new FormControl() });
    this.otpForm = this.formBuilder.group({
      otpinput: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')]]
    });

    this.navCtrl.swipeBackEnabled = false;
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'Please check your internet connection. And try again',
        duration: 3000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();

    });


    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'Internet connected!',
        duration: 3000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();

    });
  }



  showToast(message: string) {

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }
  hideLoading() {
    this.loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpverifyPage');
  }
  ionViewDidPause() {

  }

  otpSubmit() {
    // this.submitted = true;
    if (this.otpForm.valid) {
      this.showLoading() 
      this.otpvalidatedata = {

        RegistrationId: window.localStorage.getItem('Token'),
        OTP: this.otpForm.value.otpinput
      }
      // console.log(window.localStorage.getItem('Token'));
      // console.log(this.otpForm.value.otpinput);

      if (this.network.type == 'none') {
        this.hideLoading();
        this.showToast('Please check your internet connection. And try again');
      }
      else {
        this.authservice.otpVerification(this.otpvalidatedata)
          .then(data => {
            this.res = data;
            console.log(JSON.stringify(this.res.d));
            if (this.res.d.ErrFlag == 0) {
              this.hideLoading();
              this.navCtrl.push(UpdatepinPage);
              window.localStorage.setItem('isotpverifyed', '1');
            }
            else {
              this.hideLoading();
              this.showToast(this.res.d.ErrMessage);
            }

          });
      }
    }else{
      this.showToast('Enter the valid OTP');
    }
  }

  resendSubmit() {

    window.localStorage.setItem('isOTPexpired', '0');
    this.ngOnInit();
    this.otpForm.get('otpinput').setValue('');

    this.resendOTPdata = {
      RegistrationId: window.localStorage.getItem('Token')
    }
    if (this.network.type == 'none') {
      this.hideLoading();
      this.showToast('Please check your internet connection. And try again');
    }
    else {
      this.authservice.resendOTP(this.resendOTPdata)
        .then(data => {
          this.res = data;
          //alert(this.res);

        });
    }
  }
  //Alert
  showAlert(title: string, subtitle: string, alertcode: any) {

    if (alertcode == 1) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: subtitle,
        buttons: [
          {
            text: 'Retry',
            handler: () => {
              if (this.authservice.checkNetwork()) {
                this.navCtrl.push(this.navCtrl.getActive().component);
              }
              else {
                this.showAlert("Internet not available", "Cross check your internet connectivity and try again.", 1);
              }

              // this.navCtrl.swipeBackEnabled = false;
              // this.MobileAppLoad();
            }
          }],
        enableBackdropDismiss: false // <- Here! :)
      });

      alert.present();
    }
  }

  ngOnInit() {


    var callDuration = this.elementRef.nativeElement.querySelector('#time');
    if (window.localStorage.getItem('isOTPexpired') === '1') {
      this.shouldHide = true;
      this.otpsubmitbtn = false;
      this.otpresendbtn = true;
    }
    else {
      this.otpsubmitbtn = true;
      this.otpresendbtn = false;
      this.shouldHide = false;
      this.startTimer(callDuration);

    }

  }
  startTimer(display) {

    var timer = 60;
    var minutes;
    var seconds;

    let subscribetion = Observable.interval(1000).subscribe(x => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;


      display.textContent = minutes + ":" + seconds;

      if (display.textContent == "00:00") {
        window.localStorage.setItem('isOTPexpired', '1');
        this.shouldHide = true;
        this.otpsubmitbtn = false;
        this.otpresendbtn = true;
        subscribetion.unsubscribe();
      }

      --timer;

    })
  }

  inputValidate(value) {
    console.log('inputValidate', value)
  }


}
