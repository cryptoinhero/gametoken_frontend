import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [

  {
    pid: 0,
    lpSymbol: 'GME',
    lpAddresses: {
      97: '',
      56: '0xDD87Df4697527e6fBc5586cB0105bD8aB0FA7A61',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },  

  {
    pid: 1,
    lpSymbol: 'GME-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6B234237bc3f4D5c34521f542876b877566b9B14',
    },
    token: tokens.busd,
    quoteToken: tokens.gme,
    
  },


  {
    pid: 2,
    lpSymbol: 'GME-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0a6DD2E402531009B0f13fFEBA9DF48625a86e72',
    },
    token: tokens.gme,
    quoteToken: tokens.wbnb,
    
  },

  {
    pid: 10,
    lpSymbol: 'GME-BANANA LP',
    lpAddresses: {
      97: '',
      56: '0x7E74D582f47355AFAa7F644547d530A738704AE5',
    },
    token: tokens.gme,
    quoteToken: tokens.banana,    
  },

  {
    pid: 8,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x51e6D27FA57373d8d4C256231241053a70Cb1d93',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
    
  },
  {
    pid: 9,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xA0C3Ef24414ED9C9B456740128d8E63D016A9e11',
    },
    token: tokens.eth,
    quoteToken: tokens.wbnb,
    
  },
 
  // caves (should add token address with lptoken address when add pool)
  {
    pid: 5,
    lpSymbol: 'Cake',
     lpAddresses: {
       97: '',
       56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.cake,
    quoteToken: tokens.busd,
    isTokenOnly: true,
   },

   {
    pid: 6,
    lpSymbol: 'Busd',
     lpAddresses: {
       97: '',
       56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    },
    token: tokens.busd,
    quoteToken: tokens.busd,    
    isTokenOnly: true,
   },

   {
    pid: 7,
    lpSymbol: 'wBNB',
     lpAddresses: {
       97: '',
       56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    },
    token: tokens.wbnb,
    quoteToken: tokens.busd,
    isTokenOnly: true,
   },


   
]

export default farms
