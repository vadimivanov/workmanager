import { Component, Input, HostBinding, HostListener } from '@angular/core';

import { SocialService } from '../../services/social/social.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent {
  @HostBinding('class.share') 1;
  @Input() socialLinks: any;

  isOpen: boolean = false;

  constructor(private socialService: SocialService) {
  }

  onShare(link) {
    this.socialLinks.link = 'http://okornok.herokuapp.com/#/' + this.socialLinks.creatorRole + '-profile/' + this.socialLinks.creatorId;
    this.socialLinks.name = link;
    this.socialService.share(this.socialLinks);
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
