describe('My Sample App', function() {
console.log("one")
  it('should let Angular do its work', function() {
    console.log("two")
    browser().navigateTo('/login');
    console.log("three:",element('.hero-unit').count());
    expect(element('.ng-binding h1').text()).toEqual('Hello A Pirate!!');
  });

  xit('should skip this e2e test', function() {
    sleep(15);
    browser().navigateTo('/index.html');
  });
});
