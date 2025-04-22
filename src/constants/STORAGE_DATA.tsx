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

export const STORAGE_EX_DATA = {
  whitelabel: {
    siteTitle: '[PAGE_TITLE] - Universal Staking Platform',
    siteDescription: 'Universal ERC20, BEP20, POL20, EVM-Like whitelabel tokens stake system',
    siteLogo: './assets/logo.png',
    footerSlogan: 'Staking platform for managing your blockchain assets securely and efficiently.',
    footerCopyright: '© [YEAR] Staking Platform. All rights reserved.'
  },
  homepage_topBlock: {
    enabled: 0,
    content: ``
  },
  homepage_middleBlock: {
    enabled: 0,
    content: ``
  },
  homepage_bottomBlock: {
    enabled: 0,
    content: ``
  }
}

export default STORAGE_DATA