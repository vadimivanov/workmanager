import { TestBed, inject } from '@angular/core/testing';

import { ProviderServicesService } from './provider-services.service';

describe('ProviderServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderServicesService]
    });
  });

  it('should ...', inject([ProviderServicesService], (service: ProviderServicesService) => {
    expect(service).toBeTruthy();
  }));
});
