import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Injectable()
export class AuthServiceProvider {
   header:any;
   intervel:any
   apiUrl = 'https://fhrv14.formulahr.com/Services/MobileRegistration.asmx/';
  
   
  constructor(public http: HttpClient,public network:Network, public https: HTTP) {
    console.log('Hello AuthServiceProvider Provider');
    https.setDataSerializer('json');
    // https.setServerTrustMode('nocheck');
    https.setHeader('*','Content-Type','application/json');
  }

  getResult(mUrl: string, mData: any) {
    console.log(mUrl);
    return new Promise(resolve => {
        this.https.post(mUrl,mData,{})
        .then(data => {
          console.log(data);
          var xml2js = require('xml2js');
          var parser = new xml2js.Parser({explicitArray : false});
          parser.parseString(data.data, function (err, result) {
            var keys = Object.keys(result);
            var mResult: any;
            if(keys.length > 0) {
              mResult = {
                d: result[keys[0]]
              }
            }
            console.log(mResult);
            resolve(mResult);
          });
        })
        .catch(error => {
          console.log(error);
          var mResult: any;
          mResult = {
            d: {
              ErrFlag: 1,
              ErrMessage: error.error
            }
          }
          resolve(mResult);
        });
    });
  }

  addUser(userdata:any) {
    var url = this.apiUrl+'UserRegistration';
    return(this.getResult(url,userdata));
  }

  otpVerification(otpvalidatedata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/OTPNumberValidate';
    return(this.getResult(url,otpvalidatedata));
  }

  resendOTP(resendOTPdata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/ResendOTP';
    return(this.getResult(url,resendOTPdata));
  }

  updatePIN(updatepindata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/MobileRegistrationPinUpdateIOS';
    return(this.getResult(url,updatepindata));
  }

  mobileAppLoad(mobileapploaddata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/MobileAppLoad';
    return(this.getResult(url,mobileapploaddata));
  }

  remindmelater(remindmelaterdata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/MobileRemindMeLater';
    return(this.getResult(url,remindmelaterdata));
  }

  MobilePinNumberValidate(pinnumbervalidate:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/MobilePinNumberValidate';
    return(this.getResult(url,pinnumbervalidate));
  }

  HomeClick(homeclickdate:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/HomeClickIOS';
    return(this.getResult(url,homeclickdate));
  }


  MobilePInChangeIOS(Changepindata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/MobilePInChangeIOS';
    return(this.getResult(url,Changepindata));
  }

  UnregisterIOS(unregisterdata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/UnRegisterUserIOS';
    return(this.getResult(url,unregisterdata));
  }

  GetLattitudeAndLongtitueIOS(getlattitudeandlongtitueiosdata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/GetLattitudeAndLongtitueIOS';
    return(this.getResult(url,getlattitudeandlongtitueiosdata));
  }

  CheckInAndCheckoutIOS(checkinandcheckoutdata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/CheckInAndCheckoutIOS';
    return(this.getResult(url,checkinandcheckoutdata));
  }

  CheckInAndCheckoutImageProcessing(checkinandcheckoutimagedata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/CheckInAndCheckoutImageProcessingIOS';
    return(this.getResult(url,checkinandcheckoutimagedata));
  }

  checkNetwork() {
    if (this.network.type != "none") {
        return true;
    } else {
        return false;
    }
  }

  startInterver() {
    this.intervel = setInterval(() => { 
      if(this.checkNetwork())
      {
        console.log(window.sessionStorage.getItem('networkstate'));
      } else { 
        clearInterval(this.intervel);
        
      }
    }, 1000);
  }

  forgotpin(forgotpindata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/ForgetPin';
    return(this.getResult(url,forgotpindata));
  }

  notificationClick(notificationclickiosdata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/NotificationClickIOS';
    return(this.getResult(url,notificationclickiosdata));
  }

  CheckRegularize(checkreulrizeddata:any) {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/CheckRegularize';
    return(this.getResult(url,checkreulrizeddata));
  }

  OfficeCheckInOut() {
    var url = window.localStorage.getItem('clientURL')+'services/AppUserRegistrationAuthentication.asmx/OfficeInOutList';
    return(this.getResult(url,{}));
  }
}
