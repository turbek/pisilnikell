import { PisilnikellPage } from './app.po';

describe('pisilnikell App', () => {
  let page: PisilnikellPage;

  beforeEach(() => {
    page = new PisilnikellPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
