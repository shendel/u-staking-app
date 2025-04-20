const STORAGE_DATA = {
  exdata: {},
  uStakeChainId: false,
  uStakeContract: false,
  mdRouters: [
    { title: 'Home page', url: '#/', type: 'ROUTER_HOME', readonly: true },
    { title: 'About', url: '#/about', type: 'ROUTER_MD', markdownSource: './about.md' },
  ],
  headerMenu: [
    { title: 'Home', url: '#/' },
    { title: 'About', url: '#/about' }
  ],
  footerMenu: [
    { title: 'Home', url: '#/' },
    { title: 'About', url: '#/about' },
    { title: 'GitHub', url: 'https://github.com/shendel', blank: true }
  ],
  socialLinks: [
    { title: '@eneeseene', url: 'https://t.me/eneeseene', type: 'TELEGRAM' }    
  ]
}


export default STORAGE_DATA