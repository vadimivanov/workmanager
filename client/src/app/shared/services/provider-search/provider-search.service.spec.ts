import { TestBed, inject } from '@angular/core/testing';

import { ProviderSearchService } from './provider-search.service';

describe('ProviderSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderSearchService]
    });
  });

  it('should ...', inject([ProviderSearchService], (service: ProviderSearchService) => {
    expect(service).toBeTruthy();
  }));
});
