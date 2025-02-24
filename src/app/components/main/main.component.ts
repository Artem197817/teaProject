import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {Subscription, timer} from 'rxjs';


declare var $: any;

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgClass
  ],
  styleUrl: './main.component.less'
})
export class MainComponent implements OnInit, OnDestroy {

 protected isPopup: boolean = false;
 private subscription: Subscription = new Subscription();
 private subscriptionActive: Subscription = new Subscription();
  protected isActive: boolean = false;
  ngOnInit() {
    this.initializeAccordion();
    this.subscription = timer(10000).subscribe(() => {
      this.isPopup = true;
    })
    this.subscriptionActive = timer(5000).subscribe(() => {
      this.isActive = true;
    })
  }

  private initializeAccordion() {
    $("#accordion").accordion({
      header: "> h3",
      heightStyle: "content",
      activate: function (event: any, ui: any) {
        $('.select-icon img').attr('src', 'assets/images/nextUp.png');
        if (ui.newHeader.length) {
          ui.newHeader.find('.select-icon img').attr('src', 'assets/images/down.png');
        }
      }
    });

    $('.select-icon').css({
      marginLeft: '15px'
    });

    $('.ui-accordion-header-icon').css({
      display: 'none'
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptionActive.unsubscribe();
  }
  closePopup(): void {
    this.isPopup = false;
  }

}
