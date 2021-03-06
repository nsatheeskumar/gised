import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import Swal from "sweetalert2";

import { ValidationService } from "../../../services/validation.service";
import { ServerCallService } from "../../../services/server-call.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  
  serverRequest: any;
  serverResponse: any;
  errorMsg: string;
  loader: string;

  forgotPasswordForm = new FormGroup({
    emailId: new FormControl("", [
      Validators.required,
      Validators.pattern(this.validation.emailIdPattern),
    ]),
  });

  constructor(
    private server: ServerCallService,
    private router: Router,
    private validation: ValidationService
  ) {
    this.loader = "";
  }

  ngOnInit() {

  }

  forgotPasswordFormSubmit() {
    this.serverRequest = {
      module: "login",
      action: "forgotpassword",
      requestData: this.forgotPasswordForm.value,
    };

    this.loader = "Mail id checking and password reset link sending to your mail";
    this.blockUI.start(this.loader);

    this.server.sendToServer(this.serverRequest).subscribe(
      (response) => {
        this.serverResponse = JSON.parse(
          this.server.decryption(response["response"])
        );
        console.log("RESPONSE : ", this.serverResponse);
        this.blockUI.stop();
        this.loader = "";
        if (this.serverResponse.responseData == "EMPTY") {
          this.errorMsg = "Sorry! Mail id not exist";
          Swal.fire(this.errorMsg);
        } else if (this.serverResponse.responseData == "ERROR") {
          this.errorMsg = "Sorry! Something went wrong";
          Swal.fire(this.errorMsg);
        } else {
          this.errorMsg = "Reset password link sent to your mail";
          Swal.fire(this.errorMsg);
        }
        this.router.navigate(["/"]);
      },
      (error) => {
        this.blockUI.stop();
        this.loader = "";
        this.errorMsg = "Sorry! Something went wrong";
        Swal.fire(this.errorMsg);
        this.router.navigate(["/"]);
      },
      () => {
        console.log("Completed");
      }
    );
  }
}
