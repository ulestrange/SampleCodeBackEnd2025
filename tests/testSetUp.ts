beforeAll(async () => {
  //console.log('Running bofore all')
  jest.spyOn(console, 'log').mockImplementation(() => {});
  //await initDb(); // wait for DB to connect

});