import { TestBed } from '@angular/core/testing';

import { GithubJsonService } from './github-json.service';

describe('GithubJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GithubJsonService = TestBed.get(GithubJsonService);
    expect(service).toBeTruthy();
  });
});
